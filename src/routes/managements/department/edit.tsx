import {
  HStack,
  Button,
  Box,
  Text,
  useToast,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Skeleton,
  VStack,
} from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import React, { ChangeEvent, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router-dom";
import { ICRUDDepartmentRes } from "../../../types/department";
import { IErrorResponse } from "../../../types/common";
import { editDepartment } from "../../../api/departments";
import { primaryColor } from "../../../theme";

export default function DepartmentEdit() {
  const { departmentName } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [updateDepartmentName, setUpdateDepartmentName] = useState<string>();

  const onChangeDepartmentName = (e: ChangeEvent<HTMLInputElement>) => {
    setUpdateDepartmentName(e.target.value);
  };

  useEffect(() => {
    if (departmentName) {
      setUpdateDepartmentName(departmentName);
    }
  }, [departmentName]);

  const onEdit = () => {
    if (
      departmentName === "" ||
      departmentName === undefined ||
      updateDepartmentName === "" ||
      updateDepartmentName === undefined
    )
      return;
    editMutation.mutate();
  };

  const editMutation = useMutation<ICRUDDepartmentRes, IErrorResponse>({
    mutationFn: () => editDepartment(departmentName!, updateDepartmentName!),
    onSuccess: () => {
      toast({
        title: `수정 완료`,
        status: "success",
        duration: 1500,
        isClosable: true,
      });
    },
    onError: (error) => {
      console.log(error);
      toast({
        title: `수정 실패`,
        description: `${error.response.data.errorMessage}`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    },
  });

  const isDepartmentNameError =
    updateDepartmentName === undefined || updateDepartmentName === "";
  return (
    <>
      <Helmet>
        <title>{`부서 수정 - ${departmentName}`}</title>
      </Helmet>
      <Box marginBottom={1}>
        <Text fontWeight={"semibold"} fontSize={"2xl"}>
          부서 수정
        </Text>
      </Box>
      <HStack justifyContent={"space-between"}>
        <Button
          variant={"ghost"}
          size={"sm"}
          colorScheme="teal"
          onClick={() => navigate(-1)}
        >
          이전으로
        </Button>
        <Button
          size={"sm"}
          colorScheme="teal"
          onClick={onEdit}
          isLoading={editMutation.isPending}
          isDisabled={isDepartmentNameError}
        >
          수정
        </Button>
      </HStack>
      <Skeleton
        isLoaded={
          departmentName !== undefined && updateDepartmentName !== undefined
        }
        height={"50%"}
        fadeDuration={1.6}
      >
        <HStack marginTop={10}>
          <Flex w={"100%"}>
            <Box flex={1} w={"50%"} h={"100%"}>
              <VStack p={2}>
                <FormControl
                  marginTop={2}
                  isRequired
                  isInvalid={isDepartmentNameError}
                >
                  <FormLabel>부서명</FormLabel>
                  <Input
                    size="md"
                    type="text"
                    value={updateDepartmentName}
                    focusBorderColor={primaryColor}
                    onChange={onChangeDepartmentName}
                  />
                  {isDepartmentNameError && (
                    <FormErrorMessage>필수 필드입니다.</FormErrorMessage>
                  )}
                </FormControl>
              </VStack>
            </Box>
          </Flex>
        </HStack>
      </Skeleton>
    </>
  );
}
