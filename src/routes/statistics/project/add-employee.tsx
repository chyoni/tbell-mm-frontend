import {
  HStack,
  Button,
  Box,
  Text,
  Skeleton,
  Flex,
  VStack,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  FormHelperText,
} from "@chakra-ui/react";
import React, { ChangeEvent, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import Select, { ActionMeta, SingleValue } from "react-select";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { ICreateEmployeeHistoryRes } from "../../../types/employee-history";
import { IErrorResponse, Option } from "../../../types/common";
import { addEmployeeHistory } from "../../../api/employee-history";
import { IGetProject } from "../../../types/project";
import { getProject } from "../../../api/projects";
import { primaryColor } from "../../../theme";
import { IGetEmployees } from "../../../types/employee";
import { getEmployees } from "../../../api/employees";
import { convertLevelEnToKo, unitPriceLv } from "../../../utils";

export default function ProjectStatisticsAddEmployee() {
  const { contractNumber } = useParams();
  const navigate = useNavigate();

  const { isLoading: projectLoading, data: projectData } = useQuery<
    IGetProject,
    IErrorResponse
  >({
    queryKey: ["project", contractNumber],
    queryFn: () => getProject(contractNumber!),
    enabled: contractNumber !== undefined,
  });

  const { isLoading: employeeLoading, data: employeeData } = useQuery<
    IGetEmployees,
    IErrorResponse
  >({
    queryKey: ["employees"],
    queryFn: () => getEmployees(0, 2000),
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (employeeData && employeeData.ok) {
      const employeeOptionList: { label: string; value: string }[] = [];

      employeeData.data.content.forEach((em) => {
        let option = {
          label: `${em.name} (${em.employeeNumber})`,
          value: em.employeeNumber,
        };
        employeeOptionList.push(option);
      });

      setEmployeeSelectOptions(employeeOptionList);
    }
  }, [employeeData]);

  useEffect(() => {
    if (projectData && projectData.ok) {
      const levelByProject: { label: string; value: string }[] = [];

      projectData.data.unitPrices.map((unitPrice) => {
        Object.entries(unitPrice).map((level) => {
          let option = {
            label: convertLevelEnToKo(level[0]),
            value: level[0],
          };

          levelByProject.push(option);
        });
      });
      setLevelSelectOptions(levelByProject);
    }
  }, [projectData]);

  const onAddEmployee = () => {
    console.log(employee, startDate, level);
  };

  const onEmployeeChange = (
    newValue: SingleValue<Option>,
    actionMeta: ActionMeta<Option>
  ) => {
    setEmployee(newValue);
  };

  const handleStartDate = (e: ChangeEvent<HTMLInputElement>) =>
    setStartDate(e.target.value);

  const onLevelChange = (
    newValue: SingleValue<Option>,
    actionMeta: ActionMeta<Option>
  ) => {
    setLevel(newValue);
  };

  const [employee, setEmployee] = useState<SingleValue<Option>>();
  const [employeeSelectOptions, setEmployeeSelectOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [startDate, setStartDate] = useState<string>("");
  const [level, setLevel] = useState<SingleValue<Option>>();
  const [levelSelectOptions, setLevelSelectOptions] = useState<
    { label: string; value: string }[]
  >([]);

  const addEmployeeMutation = useMutation<
    ICreateEmployeeHistoryRes,
    IErrorResponse
  >({
    mutationFn: () =>
      addEmployeeHistory(
        employee!.value,
        contractNumber!,
        startDate,
        level!.value
      ),
    onSuccess: () => {},
    onError: (error) => {},
  });

  const isEmployeeError = employee === undefined || employee === null;
  const isStartDateError = startDate === undefined || startDate === "";
  const isLevelError = level === undefined || level === null;
  return (
    <>
      <Helmet>
        <title>{`프로젝트 - ${contractNumber} 인력 투입`}</title>
      </Helmet>
      <Box marginBottom={1}>
        <Text fontWeight={"semibold"} fontSize={"2xl"}>
          {`[${projectData?.data.teamName}] 인력 투입`}
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
          onClick={onAddEmployee}
          isLoading={addEmployeeMutation.isPending}
          isDisabled={isEmployeeError || isStartDateError || isLevelError}
        >
          등록
        </Button>
      </HStack>
      <Skeleton
        isLoaded={!projectLoading && !employeeLoading}
        height={"50%"}
        fadeDuration={1.6}
      >
        {projectData &&
          employeeData &&
          employeeSelectOptions &&
          levelSelectOptions && (
            <HStack marginTop={10}>
              <Flex w={"100%"}>
                <Box flex={1} w={"50%"} h={"100%"}>
                  <VStack p={2}>
                    <FormControl
                      marginTop={2}
                      marginRight={5}
                      isInvalid={isEmployeeError}
                    >
                      <FormLabel>사원</FormLabel>
                      <Select
                        placeholder={"최치원"}
                        styles={{
                          control: (styles, props) => ({
                            backgroundColor: "none",
                            borderColor: isEmployeeError ? "#FC8181" : "none",
                            borderWidth: isEmployeeError ? 2 : 0,
                            borderBottomWidth: 1.5,
                            borderRadius: isEmployeeError ? 5 : 1,
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
                          input: (styles, props) => ({
                            ...styles,
                            color: primaryColor,
                          }),
                        }}
                        name={"employee"}
                        options={employeeSelectOptions.map((opt) => {
                          return { label: opt?.label, value: opt?.value };
                        })}
                        value={employee}
                        onChange={onEmployeeChange}
                        closeMenuOnSelect={true}
                      />
                      <FormHelperText>
                        타이핑을 통해 사원을 검색해보세요. 사번은 사원을
                        선택하면 자동 적용됩니다.
                      </FormHelperText>
                      {isEmployeeError && (
                        <FormErrorMessage>필수 필드입니다.</FormErrorMessage>
                      )}
                    </FormControl>
                  </VStack>
                </Box>
                <Box flex={1} w={"50%"} h={"100%"}>
                  <VStack p={2}>
                    <FormControl
                      marginTop={2}
                      marginRight={5}
                      isRequired
                      isInvalid={isStartDateError}
                    >
                      <FormLabel>투입일</FormLabel>
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
                      marginRight={5}
                      isInvalid={isLevelError}
                    >
                      <FormLabel>등급</FormLabel>
                      <Select
                        placeholder={"등급"}
                        styles={{
                          control: (styles, props) => ({
                            backgroundColor: "none",
                            borderColor: isLevelError ? "#FC8181" : "none",
                            borderWidth: isLevelError ? 2 : 0,
                            borderBottomWidth: 1.5,
                            borderRadius: isLevelError ? 5 : 1,
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
                        options={levelSelectOptions.map((level) => {
                          return { label: level.label, value: level.value };
                        })}
                        value={level}
                        onChange={onLevelChange}
                        closeMenuOnSelect={true}
                      />
                      <FormHelperText>
                        {`[${projectData.data.teamName}] 프로젝트에 적용된 등급만 노출됩니다.`}
                      </FormHelperText>
                      {isLevelError && (
                        <FormErrorMessage>필수 필드입니다.</FormErrorMessage>
                      )}
                    </FormControl>
                  </VStack>
                </Box>
              </Flex>
            </HStack>
          )}
      </Skeleton>
    </>
  );
}
