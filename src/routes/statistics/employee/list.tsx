import {
  Box,
  Button,
  Center,
  HStack,
  Input,
  Skeleton,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { primaryColor } from "../../../theme";
import { useQuery } from "@tanstack/react-query";
import { IGetEmployees } from "../../../types/employee";
import { IErrorResponse } from "../../../types/common";
import { getEmployees } from "../../../api/employees";
import Pagination from "../../../components/pagination";
import { Link } from "react-router-dom";

export default function EmployeeStatisticsList() {
  const [employeeName, setEmployeeName] = useState<string>("");
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

  const { isLoading, data, refetch } = useQuery<IGetEmployees, IErrorResponse>({
    queryKey: ["employees", page],
    queryFn: () => getEmployees(page, 10, employeeName),
    refetchOnWindowFocus: true,
  });

  const handleKeyUp = (
    e: React.KeyboardEvent<HTMLButtonElement | HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      searchByCond();
    }
  };

  const searchByCond = async () => await refetch();

  return (
    <>
      <Helmet>
        <title>사원별 프로젝트 수행현황</title>
      </Helmet>

      {/* 상단 타이틀 */}
      <Box marginBottom={5}>
        <Text fontWeight={"semibold"} fontSize={"2xl"}>
          사원별 프로젝트 수행현황 - 사원 리스트
        </Text>
      </Box>
      {/* 상단 타이틀 끝 */}

      {/* 검색 섹션 */}
      <HStack marginBottom={5} spacing={8}>
        <Box width={"min-content"} alignItems={"center"} display={"flex"}>
          <Text marginRight={2} fontWeight={"hairline"} width={"max-content"}>
            사원명
          </Text>
          <Input
            onChange={(event) => setEmployeeName(event.target.value)}
            placeholder="최치원"
            size="sm"
            type="text"
            value={employeeName}
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
      {/* 검색 섹션 끝 */}

      <Skeleton
        isLoaded={!isLoading}
        height={"50%"}
        fadeDuration={1.6}
        speed={5}
      >
        {data && data.errorMessage && (
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
                  <Th w={"20%"}>사번</Th>
                  <Th w={"20%"}>이름</Th>
                  <Th w={"25%"}>입사일</Th>
                  <Th w={"25%"}>퇴사일</Th>
                  <Th w={"10%"}>작업</Th>
                </Tr>
              </Thead>
              <Tbody>
                {data?.data.content.map((emp, index) => (
                  <Tr key={index}>
                    <Td>{emp.employeeNumber}</Td>
                    <Td>{emp.name}</Td>
                    <Td>{emp.startDate}</Td>
                    <Td>{emp.resignationDate ? emp.resignationDate : "-"}</Td>
                    <Td>
                      <HStack spacing={2}>
                        <Button size={"xs"} colorScheme="teal">
                          <Link to={`${emp.name}`}>수행현황</Link>
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
