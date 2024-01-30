import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Radio,
  RadioGroup,
  Skeleton,
  VStack,
} from '@chakra-ui/react';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';
import { IGetProject } from '../../../types/project';
import { getProject } from '../../../api/api';
import { useQuery } from '@tanstack/react-query';
import { primaryColor } from '../../../theme';

export default function Edit() {
  const navigate = useNavigate();
  const { contractNumber } = useParams();

  const { isLoading, data, isError } = useQuery<IGetProject, Error>({
    queryKey: ['project', contractNumber],
    queryFn: () => getProject(contractNumber),
    enabled: contractNumber !== undefined,
  });

  console.log(isLoading, data, isError);

  const [pStatus, setPStatus] = useState<'YEAR' | 'SINGLE'>();
  const handleProjectStatus = (value: 'YEAR' | 'SINGLE') => setPStatus(value);

  const [operationRate, setOperationRate] = useState<'INCLUDE' | 'EXCEPT'>();
  const handleOperationRate = (value: 'INCLUDE' | 'EXCEPT') =>
    setOperationRate(value);

  const [startDate, setStartDate] = useState<string>();
  const handleStartDate = (event: ChangeEvent<HTMLInputElement>) =>
    setStartDate(event.target.value);

  const [endDate, setEndDate] = useState<string>();
  const handleEndDate = (event: ChangeEvent<HTMLInputElement>) =>
    setEndDate(event.target.value);

  const [contractor, setContractor] = useState<string>();
  const handleContractor = (e: ChangeEvent<HTMLInputElement>) =>
    setContractor(e.target.value);

  const [teamName, setTeamName] = useState<string>();
  const handleTeamName = (e: ChangeEvent<HTMLInputElement>) =>
    setTeamName(e.target.value);

  useEffect(() => {
    if (data && data.ok) {
      setPStatus(data.data.projectStatus);
      setOperationRate(data.data.operationRate);
      setStartDate(data.data.startDate);
      setEndDate(data.data.endDate);
      setContractor(data.data.contractor);
    }
  }, [data]);

  return (
    <>
      <Helmet>
        <title>{`프로젝트 - ${contractNumber}`}</title>
      </Helmet>
      <HStack py={2}>
        <Button size={'sm'} colorScheme="teal" onClick={() => navigate(-1)}>
          이전으로
        </Button>
      </HStack>
      {
        <Skeleton isLoaded={!isLoading}>
          {data && data.ok && (
            <HStack marginTop={10}>
              <Flex w={'100%'}>
                <Box flex={1} w={'50%'} h={'100%'}>
                  <VStack p={2}>
                    <FormControl marginTop={2}>
                      <FormLabel>계약번호</FormLabel>
                      <Input
                        size="md"
                        type="text"
                        value={data?.data.contractNumber}
                        disabled
                      />
                    </FormControl>

                    <FormControl marginTop={2}>
                      <FormLabel>원청</FormLabel>
                      <Input
                        size="md"
                        type="text"
                        value={
                          contractor === undefined
                            ? data.data.contractor
                            : contractor
                        }
                        focusBorderColor={primaryColor}
                        onChange={handleContractor}
                      />
                    </FormControl>

                    <FormControl marginTop={2}>
                      <FormLabel>부서</FormLabel>
                      <Input
                        size="md"
                        type="text"
                        value={data.data.departmentName}
                        focusBorderColor={primaryColor}
                        onChange={() => null}
                      />
                    </FormControl>

                    <FormControl marginTop={2}>
                      <FormLabel>팀명</FormLabel>
                      <Input
                        size="md"
                        type="text"
                        value={
                          teamName === undefined ? data.data.teamName : teamName
                        }
                        focusBorderColor={primaryColor}
                        onChange={handleTeamName}
                      />
                    </FormControl>

                    <FormControl marginTop={2}>
                      <FormLabel>상태</FormLabel>
                      <RadioGroup
                        value={pStatus}
                        defaultValue={data.data.projectStatus}
                        onChange={handleProjectStatus}
                        colorScheme={'teal'}
                      >
                        <HStack>
                          <Radio value={'YEAR'}>연간</Radio>
                          <Radio value={'SINGLE'}>단건</Radio>
                        </HStack>
                      </RadioGroup>
                    </FormControl>

                    <FormControl marginTop={2}>
                      <FormLabel>가동률</FormLabel>
                      <RadioGroup
                        value={operationRate}
                        defaultValue={data.data.operationRate}
                        onChange={handleOperationRate}
                        colorScheme={'teal'}
                      >
                        <HStack>
                          <Radio value={'INCLUDE'}>포함</Radio>
                          <Radio value={'EXCEPT'}>제외</Radio>
                        </HStack>
                      </RadioGroup>
                    </FormControl>
                  </VStack>
                </Box>
                <Box flex={1} w={'50%'} h={'100%'}>
                  <VStack p={2}>
                    <Flex w={'100%'}>
                      <FormControl marginTop={2} marginRight={5}>
                        <FormLabel>시작일</FormLabel>
                        <Input
                          size="md"
                          type="date"
                          value={startDate ? startDate : data.data.startDate}
                          focusBorderColor={primaryColor}
                          onChange={handleStartDate}
                        />
                      </FormControl>
                      <FormControl marginTop={2}>
                        <FormLabel>종료일</FormLabel>
                        <Input
                          size="md"
                          type="date"
                          value={endDate ? endDate : data.data.endDate}
                          focusBorderColor={primaryColor}
                          onChange={handleEndDate}
                        />
                      </FormControl>
                    </Flex>
                  </VStack>
                </Box>
              </Flex>
            </HStack>
          )}
        </Skeleton>
      }
    </>
  );
}
