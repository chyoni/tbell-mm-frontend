import { useMutation, useQuery } from '@tanstack/react-query';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { IGetEmployee } from '../../../types/employee';
import { IErrorResponse } from '../../../types/common';
import {
  editEmployeeByEmployeeNumber,
  getEmployeeByEmployeeNumber,
} from '../../../api/employees';
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
} from '@chakra-ui/react';
import { Helmet } from 'react-helmet-async';
import { primaryColor } from '../../../theme';

export default function EmployeeEdit() {
  const toast = useToast();
  const navigate = useNavigate();
  const { employeeNumber } = useParams();

  const { isLoading, data } = useQuery<IGetEmployee, IErrorResponse>({
    queryKey: ['employee'],
    queryFn: () => getEmployeeByEmployeeNumber(employeeNumber!),
    enabled: employeeNumber !== undefined,
  });

  useEffect(() => {
    if (data && data.ok) {
      setEditName(data.data.name);
      setEditStartDate(data.data.startDate);
      if (data.data.resignationDate)
        setEditResignationDate(data.data.resignationDate);
    }
  }, [data]);

  const [editName, setEditName] = useState<string>('');
  const [editStartDate, setEditStartDate] = useState<string>('');
  const [editResignationDate, setEditResignationDate] = useState<string>('');

  const handleName = (e: ChangeEvent<HTMLInputElement>) =>
    setEditName(e.target.value);
  const handleStartDate = (e: ChangeEvent<HTMLInputElement>) =>
    setEditStartDate(e.target.value);
  const handleResignationDate = (e: ChangeEvent<HTMLInputElement>) =>
    setEditResignationDate(e.target.value);

  const onRegister = () => {
    if (
      employeeNumber === undefined ||
      employeeNumber === '' ||
      editName === undefined ||
      editName === '' ||
      editStartDate === '' ||
      editStartDate === undefined
    )
      return;
    editMutation.mutate();
  };

  const editMutation = useMutation<IGetEmployee, IErrorResponse>({
    mutationFn: () =>
      editEmployeeByEmployeeNumber(
        employeeNumber!,
        editName,
        editStartDate,
        editResignationDate
      ),
    onSuccess: () => {
      toast({
        title: `수정 완료`,
        status: 'success',
        duration: 1500,
        isClosable: true,
      });
    },
    onError: (error) => {
      console.log(error);
      toast({
        title: `수정 실패`,
        description: `${error.response.data.errorMessage}`,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    },
  });

  const isNameError = editName === '' || editName === undefined;
  const isStartDateError = editStartDate === '' || editStartDate === undefined;
  return (
    <>
      <Helmet>
        <title>{`사원 수정 - ${employeeNumber}`}</title>
      </Helmet>
      <Box marginBottom={1}>
        <Text fontWeight={'semibold'} fontSize={'2xl'}>
          사원 수정
        </Text>
      </Box>
      <HStack justifyContent={'space-between'}>
        <Button
          variant={'ghost'}
          size={'sm'}
          colorScheme="teal"
          onClick={() => navigate(-1)}
        >
          이전으로
        </Button>
        <Button
          size={'sm'}
          colorScheme="teal"
          onClick={onRegister}
          isLoading={editMutation.isPending}
          isDisabled={isNameError || isStartDateError}
        >
          등록
        </Button>
      </HStack>
      <Skeleton
        isLoaded={!isLoading && data && data.ok && editName !== ''}
        height={'50%'}
        fadeDuration={1.6}
      >
        <HStack marginTop={10}>
          <Flex w={'100%'}>
            <Box flex={1} w={'50%'} h={'100%'}>
              <VStack p={2}>
                <FormControl marginTop={2} isRequired isReadOnly>
                  <FormLabel>사번</FormLabel>
                  <Input
                    size="md"
                    type="text"
                    value={employeeNumber}
                    focusBorderColor={primaryColor}
                    disabled
                  />
                </FormControl>

                <FormControl marginTop={2} isRequired isInvalid={isNameError}>
                  <FormLabel>이름</FormLabel>
                  <Input
                    size="md"
                    type="text"
                    value={editName}
                    focusBorderColor={primaryColor}
                    onChange={handleName}
                  />
                  {isNameError && (
                    <FormErrorMessage>필수 필드입니다.</FormErrorMessage>
                  )}
                </FormControl>

                <Flex w={'100%'}>
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
                      value={editStartDate}
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
                      value={editResignationDate}
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
