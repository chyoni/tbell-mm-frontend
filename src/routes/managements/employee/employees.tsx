import {
  HStack,
  Input,
  Button,
  Box,
  Text,
  Center,
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
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { primaryColor } from "../../../theme";
import Pagination from "../../../components/pagination";
import { useMutation, useQuery } from "@tanstack/react-query";
import { IGetEmployee, IGetEmployees } from "../../../types/employee";
import { deleteEmployee, getEmployees } from "../../../api/employees";
import { Link, useNavigate } from "react-router-dom";
import { IErrorResponse, IResponse } from "../../../types/common";

export default function Employees() {
  const toast = useToast();
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
  const [searchName, setSearchName] = useState<string>("");
  const handleKeyUp = (
    e: React.KeyboardEvent<HTMLButtonElement | HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      searchByCond();
    }
  };
  const searchByCond = () => {};

  const { isLoading, data } = useQuery<IGetEmployees, Error>({
    queryKey: ["employees"],
    queryFn: () => getEmployees(page, 10, searchName),
    refetchOnWindowFocus: true,
  });

  const {
    onToggle: onDeleteToggle,
    isOpen: isDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();
  const [deleteEmployeeNumber, setDeleteEmployeeNumber] = useState<string>("");
  const onDeleteEmployee = () => {
    if (deleteEmployeeNumber === "" || deleteEmployeeNumber === undefined)
      return;
    deleteMutation.mutate();
  };

  const deleteMutation = useMutation<IGetEmployee, IErrorResponse>({
    mutationFn: () => deleteEmployee(deleteEmployeeNumber),
    onSuccess: () => {
      toast({
        title: `삭제 완료`,
        status: "success",
        duration: 1200,
        isClosable: true,
      });

      setTimeout(() => {
        window.location.reload();
      }, 1500);
    },
    onError: (error) => {
      console.log(error);
      toast({
        title: `삭제 실패`,
        description: `${error.response.data.errorMessage}`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    },
  });
  return (
    <>
      <Helmet>
        <title>사원 리스트</title>
      </Helmet>
      <Box marginBottom={5}>
        <Text fontWeight={"semibold"} fontSize={"2xl"}>
          사원 리스트
        </Text>
      </Box>
      <HStack marginBottom={5} spacing={8}>
        <Box width={"max-content"} alignItems={"center"} display={"flex"}>
          <Text fontWeight={"hairline"} width={20}>
            사원명
          </Text>
          <Input
            onChange={(event) => setSearchName(event.target.value)}
            placeholder="최치원"
            size="sm"
            type="text"
            value={searchName}
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
                  <Th>사번</Th>
                  <Th>이름</Th>
                  <Th>입사일</Th>
                  <Th>퇴사일</Th>
                  <Th>작업</Th>
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
                          <Link to={`edit/${emp.employeeNumber}`}>수정</Link>
                        </Button>
                        <Button
                          size={"xs"}
                          colorScheme="red"
                          onClick={() => {
                            onDeleteToggle();
                            setDeleteEmployeeNumber(emp.employeeNumber);
                          }}
                        >
                          삭제
                        </Button>
                        <Modal isOpen={isDeleteOpen} onClose={onDeleteClose}>
                          <ModalOverlay />
                          <ModalContent>
                            <ModalHeader>사원 삭제</ModalHeader>
                            <ModalCloseButton />
                            <ModalBody>
                              이 작업은 되돌릴 수 없으며 해당 유저가 가진
                              프로젝트 수행 현황에도 영향을 미치게 됩니다. 정말
                              삭제 하시겠습니까?
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
                                onClick={onDeleteEmployee}
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
