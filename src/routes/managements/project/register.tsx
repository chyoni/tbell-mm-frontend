import {
  HStack,
  Box,
  Text,
  Button,
  Skeleton,
  Flex,
  VStack,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  RadioGroup,
  Radio,
  Select as ChakraSelect,
  Grid,
  IconButton,
  useToast,
} from "@chakra-ui/react";
import React, { ChangeEvent, useState } from "react";
import { Helmet } from "react-helmet-async";
import { NumericFormat } from "react-number-format";
import Select, { ActionMeta, SingleValue } from "react-select";
import { IoCloseCircleSharp } from "react-icons/io5";
import { primaryColor } from "../../../theme";
import { unitPriceLv, convertLevelEnToKo } from "../../../utils";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { IGetDepartments } from "../../../types/department";
import { getDepartments } from "../../../api/departments";
import { IResponse, Option } from "../../../types/common";
import {
  ICreateProjectPayload,
  IEditOrCreateProjectResponse,
  IUnitPrice,
} from "../../../types/project";
import { createProject } from "../../../api/projects";

export default function ProjectRegister() {
  const navigate = useNavigate();
  const toast = useToast();

  const { isLoading: departmentsLoading, data: departments } = useQuery<
    IGetDepartments,
    Error
  >({
    queryKey: ["departments"],
    queryFn: () => getDepartments(),
  });

  const [pStatus, setPStatus] = useState<"YEAR" | "SINGLE">("YEAR");
  const handleProjectStatus = (value: "YEAR" | "SINGLE") => setPStatus(value);

  const [operationRate, setOperationRate] = useState<"INCLUDE" | "EXCEPT">(
    "INCLUDE"
  );
  const handleOperationRate = (value: "INCLUDE" | "EXCEPT") =>
    setOperationRate(value);

  const [startDate, setStartDate] = useState<string>("");
  const handleStartDate = (event: ChangeEvent<HTMLInputElement>) =>
    setStartDate(event.target.value);

  const [endDate, setEndDate] = useState<string>("");
  const handleEndDate = (event: ChangeEvent<HTMLInputElement>) =>
    setEndDate(event.target.value);

  const [contractNumber, setContractNumber] = useState<string>("");
  const handleContractNumber = (e: ChangeEvent<HTMLInputElement>) =>
    setContractNumber(e.target.value);

  const [contractor, setContractor] = useState<string>("");
  const handleContractor = (e: ChangeEvent<HTMLInputElement>) =>
    setContractor(e.target.value);

  const [teamName, setTeamName] = useState<string>("");
  const handleTeamName = (e: ChangeEvent<HTMLInputElement>) =>
    setTeamName(e.target.value);

  const [department, setDepartment] = useState<string>("");
  const handleDepartments = (e: ChangeEvent<HTMLSelectElement>) =>
    setDepartment(e.target.value);

  const [selectedLevel, setSelectedLevel] = useState<SingleValue<Option>>();
  const onLevelChange = (
    newValue: SingleValue<Option>,
    actionMeta: ActionMeta<Option>
  ) => setSelectedLevel(newValue);

  const [selectedUnitPrice, setSelectedUnitPrice] = useState<string>("");
  const onSelectedUnitPriceChange = (e: ChangeEvent<HTMLInputElement>) =>
    setSelectedUnitPrice(e.target.value);

  const [unitPrices, setUnitPrices] = useState<IUnitPrice[]>([]);

  const clickRemoveUnitPrice = (level: string) => {
    const removedUnitPrices = unitPrices?.filter((up) => !(level in up));

    setUnitPrices(removedUnitPrices);
  };

  const keyUpPrice = (
    e: React.KeyboardEvent<HTMLButtonElement | HTMLInputElement>
  ) => {
    if (e.key === "Enter") onAddUnitPrice();
  };

  const onAddUnitPrice = () => {
    if (
      selectedLevel === undefined ||
      selectedLevel === null ||
      selectedUnitPrice === undefined
    ) {
      toast({
        title: `등급 또는 단가를 입력하세요.`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const cleanPrice = selectedUnitPrice.replaceAll(",", "");
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
    setSelectedUnitPrice("");
  };

  const onRegister = () => {
    if (
      isContractNumberError ||
      isContractorError ||
      isDepartmentError ||
      isTeamNameError ||
      isStartDateError ||
      isEndDateError ||
      isConfiguredUnitPriceError
    )
      return;

    registerMutation.mutate({
      contractNumber,
      teamName,
      contractor,
      startDate,
      endDate,
      projectStatus: pStatus,
      operationRate,
      departmentName: department,
      unitPrices,
    });
  };

  const registerMutation = useMutation<
    IEditOrCreateProjectResponse,
    IResponse,
    ICreateProjectPayload
  >({
    mutationFn: () =>
      createProject(
        contractNumber,
        teamName,
        contractor,
        startDate,
        endDate,
        pStatus,
        operationRate,
        department,
        unitPrices
      ),
    onSuccess(data, variables, context) {
      toast({
        title: `등록 완료`,
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
        title: `등록 실패`,
        description: `문제가 발생했습니다. 담당자에게 문의해 주세요.`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    },
  });

  const isContractNumberError =
    contractNumber === undefined || contractNumber === "";
  const isContractorError = contractor === undefined || contractor === "";
  const isDepartmentError = department === undefined || department === "";
  const isTeamNameError = teamName === undefined || teamName === "";
  const isStartDateError = startDate === undefined || startDate === "";
  const isEndDateError = endDate === undefined || endDate === "";
  const isConfiguredUnitPriceError = unitPrices.length === 0;

  return (
    <>
      <Helmet>
        <title>{`프로젝트 생성`}</title>
      </Helmet>
      <Box marginBottom={1}>
        <Text fontWeight={"semibold"} fontSize={"2xl"}>
          프로젝트 등록
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
          isDisabled={
            isContractNumberError ||
            isContractorError ||
            isDepartmentError ||
            isTeamNameError ||
            isStartDateError ||
            isEndDateError ||
            isConfiguredUnitPriceError
          }
        >
          등록
        </Button>
      </HStack>
      <Skeleton isLoaded={!departmentsLoading} height={"50%"} fadeDuration={3}>
        {departments && departments.ok && (
          <HStack marginTop={10}>
            <Flex w={"100%"}>
              <Box flex={1} w={"50%"} h={"100%"}>
                <VStack p={2}>
                  <FormControl
                    marginTop={2}
                    isRequired
                    isInvalid={isContractNumberError}
                  >
                    <FormLabel>계약번호</FormLabel>
                    <Input
                      size="md"
                      type="text"
                      value={contractNumber}
                      onChange={handleContractNumber}
                    />
                    {isContractNumberError && (
                      <FormErrorMessage>필수 필드입니다.</FormErrorMessage>
                    )}
                  </FormControl>

                  <FormControl
                    marginTop={2}
                    isRequired
                    isInvalid={isContractorError}
                  >
                    <FormLabel>원청</FormLabel>
                    <Input
                      size="md"
                      type="text"
                      value={contractor}
                      focusBorderColor={primaryColor}
                      onChange={handleContractor}
                    />
                    {isContractorError && (
                      <FormErrorMessage>필수 필드입니다.</FormErrorMessage>
                    )}
                  </FormControl>

                  <FormControl
                    marginTop={2}
                    isRequired
                    isInvalid={isDepartmentError}
                  >
                    <FormLabel>부서</FormLabel>
                    <ChakraSelect
                      variant={"flushed"}
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
                    {isDepartmentError && (
                      <FormErrorMessage>필수 필드입니다.</FormErrorMessage>
                    )}
                  </FormControl>

                  <FormControl
                    marginTop={2}
                    isRequired
                    isInvalid={isTeamNameError}
                  >
                    <FormLabel>팀명</FormLabel>
                    <Input
                      size="md"
                      type="text"
                      value={teamName}
                      focusBorderColor={primaryColor}
                      onChange={handleTeamName}
                    />
                    {isTeamNameError && (
                      <FormErrorMessage>필수 필드입니다.</FormErrorMessage>
                    )}
                  </FormControl>

                  <FormControl marginTop={2} isRequired>
                    <FormLabel>상태</FormLabel>
                    <RadioGroup
                      value={pStatus}
                      onChange={handleProjectStatus}
                      colorScheme={"teal"}
                    >
                      <HStack>
                        <Radio value={"YEAR"}>연간</Radio>
                        <Radio value={"SINGLE"}>단건</Radio>
                      </HStack>
                    </RadioGroup>
                  </FormControl>

                  <FormControl marginTop={2} isRequired>
                    <FormLabel>가동률</FormLabel>
                    <RadioGroup
                      value={operationRate}
                      onChange={handleOperationRate}
                      colorScheme={"teal"}
                    >
                      <HStack>
                        <Radio value={"INCLUDE"}>포함</Radio>
                        <Radio value={"EXCEPT"}>제외</Radio>
                      </HStack>
                    </RadioGroup>
                  </FormControl>
                </VStack>
              </Box>
              <Box flex={1} w={"50%"} h={"100%"}>
                <VStack p={2}>
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

                    <FormControl
                      marginTop={2}
                      isRequired
                      isInvalid={isEndDateError}
                    >
                      <FormLabel>종료일</FormLabel>
                      <Input
                        size="md"
                        type="date"
                        value={endDate}
                        focusBorderColor={primaryColor}
                        onChange={handleEndDate}
                      />
                      {isEndDateError && (
                        <FormErrorMessage>필수 필드입니다.</FormErrorMessage>
                      )}
                    </FormControl>
                  </Flex>

                  <Flex w={"100%"}>
                    <FormControl marginTop={2} marginRight={5}>
                      <FormLabel>등급</FormLabel>
                      <Select
                        placeholder={"등급"}
                        styles={{
                          control: (styles, props) => ({
                            backgroundColor: "none",
                            borderColor: "none",
                            borderWidth: 0,
                            borderBottomWidth: 1.5,
                            borderRadius: 1,
                            display: "flex",
                            ":hover": {
                              borderColor: primaryColor,
                            },
                          }),
                          option: (styles, props) => ({
                            ...styles,
                            color: "black",
                            backgroundColor: props.isSelected
                              ? primaryColor
                              : undefined,
                            ":hover": {
                              backgroundColor: props.isSelected
                                ? undefined
                                : "#edede9",
                            },
                          }),
                          singleValue: (styles, props) => ({
                            ...styles,
                            color: primaryColor,
                          }),
                        }}
                        name={"level"}
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
                        onKeyUp={keyUpPrice}
                        value={selectedUnitPrice}
                        thousandSeparator={","}
                        className="p-2 rounded-md border-2 border-inherit bg-inherit w-full 
                          focus:outline-none focus:border-2 focus:border-teal-500 transition-colors duration-200 box-border"
                        onChange={onSelectedUnitPriceChange}
                      />
                      <Flex justifyContent={"flex-end"} marginTop={3}>
                        <Button
                          colorScheme="teal"
                          variant={"ghost"}
                          onClick={onAddUnitPrice}
                        >
                          추가
                        </Button>
                      </Flex>
                    </FormControl>
                  </Flex>

                  <Box w={"100%"}>
                    <FormControl
                      isRequired
                      isInvalid={isConfiguredUnitPriceError}
                    >
                      <FormLabel>설정단가</FormLabel>
                      <Grid
                        templateColumns={"repeat(4, 1fr)"}
                        gap={5}
                        w={"100%"}
                        marginTop={5}
                      >
                        {unitPrices?.map((up) => {
                          return Object.entries(up).map((keyValue, index) => (
                            <Flex
                              key={index}
                              w={"100%"}
                              flexDirection={"column"}
                              border={"ButtonShadow"}
                              borderStyle={"groove"}
                              borderWidth={2}
                              borderRadius={5}
                              borderColor={primaryColor}
                              p={2}
                            >
                              <Flex justifyContent={"flex-end"}>
                                <IconButton
                                  onClick={() =>
                                    clickRemoveUnitPrice(keyValue[0])
                                  }
                                  variant="ghost"
                                  colorScheme="teal"
                                  aria-label="delete"
                                  fontSize="20px"
                                  size={"sm"}
                                  icon={<IoCloseCircleSharp />}
                                />
                              </Flex>
                              <Box>
                                <Text>{convertLevelEnToKo(keyValue[0])}</Text>
                                <NumericFormat
                                  value={keyValue[1]}
                                  displayType="text"
                                  thousandSeparator={","}
                                  className="text-xl font-semibold"
                                />
                              </Box>
                            </Flex>
                          ));
                        })}
                      </Grid>
                      {isConfiguredUnitPriceError && (
                        <FormErrorMessage>
                          적어도 한개의 설정 단가가 필요합니다.
                        </FormErrorMessage>
                      )}
                    </FormControl>
                  </Box>
                </VStack>
              </Box>
            </Flex>
          </HStack>
        )}
      </Skeleton>
    </>
  );
}
