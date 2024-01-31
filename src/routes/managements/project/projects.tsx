import {
  Box,
  Button,
  Center,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
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
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { deleteProject, getProjects } from "../../../api/projects";
import { ICUDProjectResponse, IGetProjects } from "../../../types/project";
import { primaryColor } from "../../../theme";
import Pagination from "../../../components/pagination";
import { IResponse } from "../../../types/common";

export default function Projects() {
  const toast = useToast();
  const navigate = useNavigate();

  const [page, setPage] = useState<number>(0);
  const [year, setYear] = useState<string | undefined>("");
  const [teamName, setTeamName] = useState<string | undefined>("");

  // year 또는 teamName을 state로 관리하고 있을 때 그 값이 변경될 때 즉시(onChangeEvent) 이 쿼리를 다시 패치하고 싶으면 queryKey의 배열안에 year랑 teamName을 넣으면 된다.
  // 그럼 state가 변하면 당연히 변한 상태에 따라 쿼리를 다시 실행하게 되는것은 합리적이다. 근데 만약, 상태로 관리하지만 내가 딱 입력을 다하고 특정 시점에 이 쿼리를 다시 패치 하고 싶다면 (clickEvent)
  // queryKey는 그 state를 넣지말고 실행하는 API Function에만 아래처럼 파라미터로 던진다음에 click event에 refetch를 실행해주면 된다.
  const { isLoading, data, refetch } = useQuery<IGetProjects, Error>({
    queryKey: ["projects"],
    queryFn: () => getProjects(page, 10, year, teamName),
    refetchOnWindowFocus: false,
  });

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

  const searchByCond = async () => await refetch();

  const handleKeyUp = (
    e: React.KeyboardEvent<HTMLButtonElement | HTMLInputElement>
  ) => {
    if (e.key === "Enter") searchByCond();
  };

  const {
    onToggle: onDeleteToggle,
    isOpen: isDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();

  const [deleteContractNumber, setDeleteContractNumber] = useState<string>("");

  const deleteMutation = useMutation<ICUDProjectResponse, IResponse>({
    mutationFn: () => deleteProject(deleteContractNumber),
    onSuccess: () => {
      toast({
        title: `삭제 완료`,
        status: "success",
        duration: 1500,
        isClosable: true,
      });

      setTimeout(() => {
        navigate("/projects");
      }, 1500);
    },

    onError: (error) => {
      console.log(error);
      toast({
        title: `삭제 실패`,
        description: `문제가 발생했습니다. 담당자에게 문의해 주세요.`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    },
  });

  const onDeleteProject = () => {
    if (deleteContractNumber === "" || deleteContractNumber === undefined)
      return;
    deleteMutation.mutate();
  };

  return (
    <>
      <Helmet>
        <title>프로젝트 리스트</title>
      </Helmet>
      <Box marginBottom={5}>
        <Text fontWeight={"semibold"} fontSize={"2xl"}>
          프로젝트 리스트
        </Text>
      </Box>
      <HStack marginBottom={5} spacing={8}>
        <Box width={"min-content"} alignItems={"center"} display={"flex"}>
          <Text marginRight={1} fontWeight={"hairline"} width={120}>
            연도 (시작일 기준)
          </Text>
          <Input
            onChange={(event) => setYear(event.target.value)}
            placeholder="YYYY"
            size="sm"
            type="text"
            value={year}
            width={110}
            focusBorderColor={primaryColor}
            onKeyUp={handleKeyUp}
          />
        </Box>
        <Box width={"min-content"} alignItems={"center"} display={"flex"}>
          <Text marginRight={1} fontWeight={"hairline"} width={30}>
            팀명
          </Text>
          <Input
            onChange={(event) => setTeamName(event.target.value)}
            placeholder="SK텔레콤 1팀"
            size="sm"
            type="text"
            value={teamName}
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
                  <Th>계약번호</Th>
                  <Th>소속</Th>
                  <Th>팀명</Th>
                  <Th>상태</Th>
                  <Th>시작일</Th>
                  <Th>종료일</Th>
                  <Th>원청</Th>
                  <Th>작업</Th>
                </Tr>
              </Thead>
              <Tbody>
                {data?.data.content.map((p, index) => (
                  <Tr key={index}>
                    <Td>{p.contractNumber}</Td>
                    <Td>{p.departmentName}</Td>
                    <Td>{p.teamName}</Td>
                    <Td>{p.projectStatus === "YEAR" ? "연간" : "단건"}</Td>
                    <Td>{p.startDate}</Td>
                    <Td>{p.endDate}</Td>
                    <Td>{p.contractor}</Td>
                    <Td>
                      <HStack spacing={2}>
                        <Button size={"xs"} colorScheme="teal">
                          <Link to={`details/${p.contractNumber}`}>
                            세부 정보
                          </Link>
                        </Button>
                        <Button size={"xs"} colorScheme="teal">
                          <Link to={`edit/${p.contractNumber}`}>수정</Link>
                        </Button>
                        <Button
                          size={"xs"}
                          colorScheme="red"
                          onClick={() => {
                            onDeleteToggle();
                            setDeleteContractNumber(p.contractNumber);
                          }}
                        >
                          삭제
                        </Button>
                        <Modal isOpen={isDeleteOpen} onClose={onDeleteClose}>
                          <ModalOverlay />
                          <ModalContent>
                            <ModalHeader>프로젝트 삭제</ModalHeader>
                            <ModalCloseButton />
                            <ModalBody>
                              이 작업은 되돌릴 수 없습니다. 정말로 삭제
                              하시겠습니까?
                            </ModalBody>
                            <ModalFooter>
                              <Button
                                variant={"outline"}
                                mr={3}
                                onClick={onDeleteClose}
                              >
                                취소
                              </Button>
                              <Button
                                colorScheme="red"
                                onClick={onDeleteProject}
                                isDisabled={deleteMutation.isPending}
                                isLoading={deleteMutation.isPending}
                              >
                                삭제
                              </Button>
                            </ModalFooter>
                          </ModalContent>
                        </Modal>
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
