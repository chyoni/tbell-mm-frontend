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
  Select as ChakraSelect,
  Skeleton,
  VStack,
  Grid,
  Text,
  IconButton,
  useToast,
} from '@chakra-ui/react';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { NumericFormat } from 'react-number-format';
import Select, { ActionMeta, SingleValue } from 'react-select';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';
import { IGetProject, IUnitPrice } from '../../../types/project';
import { getDepartments, getProject } from '../../../api/api';
import { useQuery } from '@tanstack/react-query';
import { primaryColor } from '../../../theme';
import { IGetDepartments } from '../../../types/department';
import { convertLevelEnToKo, unitPriceLv } from '../../../utils';
import { Option } from '../../../types/common';
import { IoCloseCircleSharp } from 'react-icons/io5';

export default function Edit() {
  const navigate = useNavigate();
  const toast = useToast();
  const { contractNumber } = useParams();

  const { isLoading, data } = useQuery<IGetProject, Error>({
    queryKey: ['project', contractNumber],
    queryFn: () => getProject(contractNumber),
    enabled: contractNumber !== undefined,
  });

  const { isLoading: departmentsLoading, data: departments } = useQuery<
    IGetDepartments,
    Error
  >({
    queryKey: ['departments'],
    queryFn: () => getDepartments(),
  });

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

  const [department, setDepartment] = useState<string>();
  const handleDepartments = (e: ChangeEvent<HTMLSelectElement>) =>
    setDepartment(e.target.value);

  const [selectedLevel, setSelectedLevel] = useState<SingleValue<Option>>();
  const onLevelChange = (
    newValue: SingleValue<Option>,
    actionMeta: ActionMeta<Option>
  ) => setSelectedLevel(newValue);

  const [selectedUnitPrice, setSelectedUnitPrice] = useState<string>();
  const onSelectedUnitPriceChange = (e: ChangeEvent<HTMLInputElement>) =>
    setSelectedUnitPrice(e.target.value);

  const [unitPrices, setUnitPrices] = useState<IUnitPrice[]>([]);

  const clickRemoveUnitPrice = (level: string) => {
    const removedUnitPrices = unitPrices?.filter((up) => !(level in up));

    setUnitPrices(removedUnitPrices);
  };

  const onAddUnitPrice = () => {
    if (
      selectedLevel === undefined ||
      selectedLevel === null ||
      selectedUnitPrice === undefined
    ) {
      toast({
        title: `등급 또는 단가를 입력하세요.`,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const cleanPrice = selectedUnitPrice.replaceAll(',', '');
    const clean = selectedLevel.value;

    const newUnitPrice = {
      [clean]: +cleanPrice,
    };

    const copiedUnitPrices = unitPrices.slice();

    const index = copiedUnitPrices.findIndex((unitPrice) => clean in unitPrice);

    if (index !== -1) {
      copiedUnitPrices[index][clean] = +cleanPrice;
    } else {
      copiedUnitPrices.push(newUnitPrice);
    }

    setUnitPrices(copiedUnitPrices);
  };

  useEffect(() => {
    if (data && data.ok) {
      setPStatus(data.data.projectStatus);
      setOperationRate(data.data.operationRate);
      setStartDate(data.data.startDate);
      setEndDate(data.data.endDate);
      setContractor(data.data.contractor);
      setDepartment(data.data.departmentName);
      setUnitPrices(data.data.unitPrices);

      /* data.data.unitPrices.map((up) => {
        console.log(up);
        Object.entries(up).map((a) => console.log(a[0], a[1]));
      }); */
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
        <Skeleton isLoaded={!isLoading && !departmentsLoading}>
          {data && data.ok && departments && departments.ok && (
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
                      <ChakraSelect
                        variant={'flushed'}
                        focusBorderColor={primaryColor}
                        onChange={handleDepartments}
                        value={department}
                      >
                        {departments.data.content.map((d, index) => (
                          <option key={index} value={d.name}>
                            {d.name}
                          </option>
                        ))}
                      </ChakraSelect>
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

                    <Flex w={'100%'}>
                      <FormControl marginTop={2} marginRight={5}>
                        <FormLabel>등급</FormLabel>
                        <Select
                          placeholder={'등급'}
                          styles={{
                            control: (styles, props) => ({
                              backgroundColor: 'none',
                              borderColor: 'none',
                              borderWidth: 0,
                              borderBottomWidth: 1.5,
                              borderRadius: 1,
                              display: 'flex',
                              ':hover': {
                                borderColor: primaryColor,
                              },
                            }),
                            option: (styles, props) => ({
                              ...styles,
                              color: 'black',
                              backgroundColor: props.isSelected
                                ? primaryColor
                                : undefined,
                              ':hover': {
                                backgroundColor: props.isSelected
                                  ? undefined
                                  : '#edede9',
                              },
                            }),
                            singleValue: (styles, props) => ({
                              ...styles,
                              color: primaryColor,
                            }),
                          }}
                          name={'level'}
                          options={unitPriceLv.map((lv) => {
                            return {
                              label: lv.label,
                              value: lv.value,
                            };
                          })}
                          value={selectedLevel}
                          onChange={onLevelChange}
                          closeMenuOnSelect={true}
                        />
                      </FormControl>

                      <FormControl>
                        <FormLabel>단가</FormLabel>
                        <NumericFormat
                          value={selectedUnitPrice}
                          thousandSeparator={','}
                          className="p-2 rounded-md border-2 border-inherit bg-inherit w-full 
                          focus:outline-none focus:border-2 focus:border-teal-500 transition-colors duration-200 box-border"
                          onChange={onSelectedUnitPriceChange}
                        />
                        <Flex justifyContent={'flex-end'} marginTop={3}>
                          <Button
                            colorScheme="teal"
                            variant={'ghost'}
                            onClick={onAddUnitPrice}
                          >
                            추가
                          </Button>
                        </Flex>
                      </FormControl>
                    </Flex>

                    <Box w={'100%'}>
                      <Text>설정단가</Text>
                      <Grid
                        templateColumns={'repeat(6, 1fr)'}
                        gap={5}
                        w={'100%'}
                        marginTop={5}
                      >
                        {unitPrices?.map((up) => {
                          return Object.entries(up).map((keyValue, index) => (
                            <Flex
                              key={index}
                              w={'100%'}
                              flexDirection={'column'}
                              border={'ButtonShadow'}
                              borderStyle={'groove'}
                              borderWidth={2}
                              borderRadius={5}
                              borderColor={primaryColor}
                              p={2}
                            >
                              <Flex justifyContent={'flex-end'}>
                                <IconButton
                                  onClick={() =>
                                    clickRemoveUnitPrice(keyValue[0])
                                  }
                                  variant="ghost"
                                  colorScheme="teal"
                                  aria-label="delete"
                                  fontSize="20px"
                                  size={'sm'}
                                  icon={<IoCloseCircleSharp />}
                                />
                              </Flex>
                              <Box>
                                <Text>{convertLevelEnToKo(keyValue[0])}</Text>
                                <NumericFormat
                                  value={keyValue[1]}
                                  displayType="text"
                                  thousandSeparator={','}
                                  className="text-xl font-semibold"
                                />
                              </Box>
                            </Flex>
                          ));
                        })}
                      </Grid>
                    </Box>
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
