import {
  HStack,
  Input,
  Button,
  Box,
  Text,
  Center,
  Skeleton,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { primaryColor } from "../../../theme";
import Pagination from "../../../components/pagination";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { IGetProjects } from "../../../types/project";
import { getProjects } from "../../../api/projects";

export default function ProjectStatisticsList() {
  const [page, setPage] = useState<number>(0);
  // 첫번째 페이지 Function
  const goToFirstPage = () => setPage(0);
  // 이전 페이지 Function
  const goToPrevPage = () => setPage((page) => page - 1);
  // 다음 페이지 Function
  const goToNextPage = () => setPage((page) => page + 1);
  // 마지막 페이지 Function
  const goToLastPage = (lastPage: number) => setPage(lastPage);
  // 특정 페이지 지정 Function
  const goToSpecificPage = (page: number) => setPage(page);

  const [searchTeamName, setSearchTeamName] = useState<string>("");

  const handleKeyUp = (
    e: React.KeyboardEvent<HTMLInputElement | HTMLButtonElement>
  ) => {
    if (e.key === "Enter") searchByCond();
  };

  const searchByCond = async () => await refetch();

  const { isLoading, data, refetch } = useQuery<IGetProjects, Error>({
    queryKey: ["projects"],
    queryFn: () => getProjects(page, 10, undefined, searchTeamName),
  });

  return (
    <>
      <Helmet>
        <title>프로젝트별 사원 투입현황</title>
      </Helmet>
      <Box marginBottom={5}>
        <Text fontWeight={"semibold"} fontSize={"2xl"}>
          프로젝트별 사원 투입현황 - 프로젝트 리스트
        </Text>
      </Box>
      <HStack marginBottom={5} spacing={8}>
        <Box width={"min-content"} alignItems={"center"} display={"flex"}>
          <Text marginRight={2} fontWeight={"hairline"} width={"max-content"}>
            팀명
          </Text>
          <Input
            onChange={(event) => setSearchTeamName(event.target.value)}
            placeholder="SK텔레콤 1팀"
            size="sm"
            type="text"
            value={searchTeamName}
            width={200}
            focusBorderColor={primaryColor}
            onKeyUp={handleKeyUp}
          />
        </Box>
        <Button
          colorScheme="teal"
          size={"sm"}
          onClick={searchByCond}
          onKeyUp={handleKeyUp}
        >
          검색
        </Button>
      </HStack>
      <Skeleton
        isLoaded={!isLoading}
        height={"50%"}
        fadeDuration={1.6}
        speed={5}
      >
        {data && !data.ok && data.errorMessage && (
          <Center>
            <Text fontSize={"xx-large"} fontWeight={600}>
              Oops!
            </Text>
            <Text mt={2} fontSize={"large"}>
              {data.errorMessage}
            </Text>
          </Center>
        )}
        {data && data.ok && (
          <TableContainer>
            <Table size={"sm"}>
              <TableCaption>
                <Pagination
                  totalPages={data.data.totalPages}
                  page={page}
                  goToFirstPage={goToFirstPage}
                  goToLastPage={goToLastPage}
                  goToPrevPage={goToPrevPage}
                  goToNextPage={goToNextPage}
                  goToSpecificPage={goToSpecificPage}
                />
              </TableCaption>
              <Thead>
                <Tr>
                  <Th w={"90%"}>팀명</Th>
                  <Th w={"20%"}>작업</Th>
                </Tr>
              </Thead>
              <Tbody>
                {data?.data.content.map((p, index) => (
                  <Tr key={index}>
                    <Td>{p.teamName}</Td>
                    <Td>
                      <HStack spacing={2}>
                        <Button size={"xs"} colorScheme="teal">
                          <Link to={`${p.contractNumber}`}>투입 현황</Link>
                        </Button>
                        <Button size={"xs"} colorScheme="teal">
                          <Link to={`${p.contractNumber}/employee`}>
                            인력 투입
                          </Link>
                        </Button>
                      </HStack>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        )}
      </Skeleton>
    </>
  );
}
