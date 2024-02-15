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
import { useMutation } from '@tanstack/react-query';
import React, { ChangeEvent, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { ICRUDDepartmentRes } from '../../../types/department';
import { IErrorResponse } from '../../../types/common';
import { createDepartment } from '../../../api/departments';
import { primaryColor } from '../../../theme';

export default function DepartmentRegister() {
  const navigate = useNavigate();
  const toast = useToast();

  const [departmentName, setDepartmentName] = useState<string>('');

  const onChangeDepartmentName = (e: ChangeEvent<HTMLInputElement>) =>
    setDepartmentName(e.target.value);

  const onRegister = () => {
    if (departmentName === '' || departmentName === undefined) return;
    registerMutation.mutate();
  };

  const registerMutation = useMutation<ICRUDDepartmentRes, IErrorResponse>({
    mutationFn: () => createDepartment(departmentName),
    onSuccess: () => {
      toast({
        title: `등록 완료`,
        status: 'success',
        duration: 1500,
        isClosable: true,
      });
      setTimeout(() => {
        navigate('/mms/departments');
      }, 1500);
    },
    onError: (error) => {
      console.log(error);
      toast({
        title: `등록 실패`,
        description: `${error.response.data.errorMessage}`,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    },
  });

  const isDepartmentNameError =
    departmentName === undefined || departmentName === '';
  return (
    <>
      <Helmet>
        <title>{`부서 등록`}</title>
      </Helmet>
      <Box marginBottom={1}>
        <Text fontWeight={'semibold'} fontSize={'2xl'}>
          프로젝트 등록
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
          isLoading={registerMutation.isPending}
          isDisabled={isDepartmentNameError}
        >
          등록
        </Button>
      </HStack>
      <Skeleton
        isLoaded={departmentName !== undefined}
        height={'50%'}
        fadeDuration={1.6}
      >
        <HStack marginTop={10}>
          <Flex w={'100%'}>
            <Box flex={1} w={'50%'} h={'100%'}>
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
                    value={departmentName}
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
