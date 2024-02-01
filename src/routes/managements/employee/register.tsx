import {
  HStack,
  Button,
  Box,
  Text,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Skeleton,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import React, { ChangeEvent, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { ICreateEmployeeRes } from "../../../types/employee";
import { IErrorResponse } from "../../../types/common";
import { createEmployee } from "../../../api/employees";
import { primaryColor } from "../../../theme";

export default function EmployeeRegister() {
  const navigate = useNavigate();
  const toast = useToast();

  const [employeeNumber, setEmployeeNumber] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [resignationDate, setResignationDate] = useState<string>("");

  const onRegister = () => {
    if (
      employeeNumber === "" ||
      employeeNumber === undefined ||
      name === "" ||
      name === undefined ||
      startDate === "" ||
      startDate === undefined
    )
      return;
    registerMutation.mutate();
  };

  const registerMutation = useMutation<ICreateEmployeeRes, IErrorResponse>({
    mutationFn: () =>
      createEmployee(employeeNumber, name, startDate, resignationDate),
    onSuccess: () => {
      toast({
        title: `등록 완료`,
        status: "success",
        duration: 1500,
        isClosable: true,
      });
      setTimeout(() => {
        navigate("/employees");
      }, 1500);
    },
    onError: (error) => {
      console.log(error);
      toast({
        title: `등록 실패`,
        description: `${error.response.data.errorMessage}`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    },
  });

  const handleEmployeeNumber = (e: ChangeEvent<HTMLInputElement>) =>
    setEmployeeNumber(e.target.value);
  const handleName = (e: ChangeEvent<HTMLInputElement>) =>
    setName(e.target.value);
  const handleStartDate = (e: ChangeEvent<HTMLInputElement>) =>
    setStartDate(e.target.value);
  const handleResignationDate = (e: ChangeEvent<HTMLInputElement>) =>
    setResignationDate(e.target.value);

  const isEmployeeNumberError =
    employeeNumber === "" || employeeNumber === undefined;
  const isNameError = name === "" || name === undefined;
  const isStartDateError = startDate === "" || startDate === undefined;
  return (
    <>
      <Helmet>
        <title>{`사원 등록`}</title>
      </Helmet>
      <Box marginBottom={1}>
        <Text fontWeight={"semibold"} fontSize={"2xl"}>
          사원 등록
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
          onClick={onRegister}
          isLoading={registerMutation.isPending}
          isDisabled={isEmployeeNumberError || isNameError || isStartDateError}
        >
          등록
        </Button>
      </HStack>
      <Skeleton isLoaded={true} height={"50%"} fadeDuration={1.6}>
        <HStack marginTop={10}>
          <Flex w={"100%"}>
            <Box flex={1} w={"50%"} h={"100%"}>
              <VStack p={2}>
                <FormControl
                  marginTop={2}
                  isRequired
                  isInvalid={isEmployeeNumberError}
                >
                  <FormLabel>사번</FormLabel>
                  <Input
                    size="md"
                    type="text"
                    value={employeeNumber}
                    focusBorderColor={primaryColor}
                    onChange={handleEmployeeNumber}
                  />
                  {isEmployeeNumberError && (
                    <FormErrorMessage>필수 필드입니다.</FormErrorMessage>
                  )}
                </FormControl>

                <FormControl marginTop={2} isRequired isInvalid={isNameError}>
                  <FormLabel>이름</FormLabel>
                  <Input
                    size="md"
                    type="text"
                    value={name}
                    focusBorderColor={primaryColor}
                    onChange={handleName}
                  />
                  {isNameError && (
                    <FormErrorMessage>필수 필드입니다.</FormErrorMessage>
                  )}
                </FormControl>

                <Flex w={"100%"}>
                  <FormControl
                    marginTop={2}
                    marginRight={5}
                    isRequired
                    isInvalid={isStartDateError}
                  >
                    <FormLabel>시작일</FormLabel>
                    <Input
                      size="md"
                      type="date"
                      value={startDate}
                      focusBorderColor={primaryColor}
                      onChange={handleStartDate}
                    />
                    {isStartDateError && (
                      <FormErrorMessage>필수 필드입니다.</FormErrorMessage>
                    )}
                  </FormControl>

                  <FormControl marginTop={2}>
                    <FormLabel>종료일</FormLabel>
                    <Input
                      size="md"
                      type="date"
                      value={resignationDate}
                      focusBorderColor={primaryColor}
                      onChange={handleResignationDate}
                    />
                  </FormControl>
                </Flex>
              </VStack>
            </Box>
          </Flex>
        </HStack>
      </Skeleton>
    </>
  );
}
