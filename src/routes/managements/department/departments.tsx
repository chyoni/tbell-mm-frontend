import {
  HStack,
  Input,
  Box,
  Text,
  Button,
  Skeleton,
  Center,
  TableContainer,
  Table,
  TableCaption,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Pagination from "../../../components/pagination";
import { primaryColor } from "../../../theme";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ICRUDDepartmentRes, IGetDepartments } from "../../../types/department";
import { deleteDepartment, getDepartments } from "../../../api/departments";
import { IErrorResponse } from "../../../types/common";

export default function Departments() {
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
  const [departmentName, setDepartmentName] = useState<string>("");
  const handleKeyUp = (
    e: React.KeyboardEvent<HTMLButtonElement | HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      searchByCond();
    }
  };

  const searchByCond = async () => await refetch();

  const { data, isLoading, refetch } = useQuery<IGetDepartments, Error>({
    queryKey: ["departments", page],
    queryFn: () => getDepartments(page, 100, departmentName),
  });

  const {
    onToggle: onDeleteToggle,
    isOpen: isDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();

  const [deleteDepartmentName, setDeleteDepartmentName] = useState<string>("");

  const onDeleteDepartment = () => {
    if (deleteDepartmentName === "" || deleteDepartmentName === undefined)
      return;
    deleteMutation.mutate();
  };

  const deleteMutation = useMutation<ICRUDDepartmentRes, IErrorResponse>({
    mutationFn: () => deleteDepartment(deleteDepartmentName),
    onSuccess: () => {
      toast({
        title: `삭제 완료`,
        status: "success",
        duration: 1500,
        isClosable: true,
      });

      setTimeout(() => {
        window.location.reload();
      }, 2000);
    },

    onError: (error) => {
      console.log(error);
      toast({
        title: `삭제 실패`,
        description: `${error.response.data.errorMessage}`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    },
  });
  return (
    <>
      <Helmet>
        <title>부서 리스트</title>
      </Helmet>
      <Box marginBottom={5}>
        <Text fontWeight={"semibold"} fontSize={"2xl"}>
          부서 리스트
        </Text>
      </Box>
      <HStack marginBottom={5} spacing={8}>
        <Box width={"max-content"} alignItems={"center"} display={"flex"}>
          <Text fontWeight={"hairline"} width={"max-content"} marginRight={2}>
            부서명
          </Text>
          <Input
            onChange={(event) => setDepartmentName(event.target.value)}
            placeholder="개발연구소"
            size="sm"
            type="text"
            value={departmentName}
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
                  <Th w={"90%"}>부서명</Th>
                  <Th w={"10%"}>작업</Th>
                </Tr>
              </Thead>
              <Tbody>
                {data?.data.content.map((p, index) => (
                  <Tr key={index}>
                    <Td>{p.name}</Td>
                    <Td>
                      <HStack spacing={2}>
                        <Button size={"xs"} colorScheme="teal">
                          <Link to={`edit/${p.name}`}>수정</Link>
                        </Button>
                        <Button
                          size={"xs"}
                          colorScheme="red"
                          onClick={() => {
                            onDeleteToggle();
                            setDeleteDepartmentName(p.name);
                          }}
                        >
                          삭제
                        </Button>
                        <Modal isOpen={isDeleteOpen} onClose={onDeleteClose}>
                          <ModalOverlay />
                          <ModalContent>
                            <ModalHeader>부서 삭제</ModalHeader>
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
                                onClick={onDeleteDepartment}
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
