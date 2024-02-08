import React, { ChangeEvent, useEffect, useState } from "react";
import {
  Box,
  Button,
  Flex,
  HStack,
  Icon,
  Input,
  Skeleton,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  IAddHistoryManMonthPayload,
  IEmployeeHistory,
  IGetEmployeeHistories,
} from "../../../types/employee-history";
import { IErrorResponse } from "../../../types/common";
import {
  getEmployeeHistory,
  saveHistoryManMonths,
} from "../../../api/employee-history";
import { Helmet } from "react-helmet-async";
import { primaryColor, titleColor } from "../../../theme";
import { useNavigate, useParams } from "react-router-dom";
import { IGetProject } from "../../../types/project";
import { getProject } from "../../../api/projects";
import { FaArrowLeft } from "react-icons/fa6";
import NoContent from "../../../components/no-content";
import { convertLevelEnToKo } from "../../../utils";
import { NumericFormat } from "react-number-format";

function getCopyEmployeeHistoryStateAndIndex(
  employeeHistory: IEmployeeHistory[],
  employeeHistoryId: number,
  manMonthId: number
) {
  // Copy employeeHistory state
  const updatedEmployeeHistory = [...employeeHistory];

  // 파라미터로 받은 employeeHistoryId를 통해 updatedEmployeeHistory에서 변경하고자 하는 history 객체를 찾는다.
  const indexToUpdateEmployeeHistory = updatedEmployeeHistory.findIndex(
    (h) => h.id === employeeHistoryId
  );
  // 파라미터로 받은 manMonthId를 통해 위에서 찾은 history의 객체에서 변경할 mm 객체를 mms 리스트에서 찾는다.
  const indexToUpdateManMonth = updatedEmployeeHistory[
    indexToUpdateEmployeeHistory
  ].mms.findIndex((mm) => mm.id === manMonthId);

  return {
    updatedEmployeeHistory,
    indexToUpdateEmployeeHistory,
    indexToUpdateManMonth,
  };
}

export default function ProjectStatisticsCurrentCondition() {
  const toast = useToast();
  const { contractNumber } = useParams();
  const navigate = useNavigate();
  const [searchYear, setSearchYear] = useState<string>(
    new Date().getFullYear().toString()
  );
  const [searchEmployeeName, setSearchEmployeeName] = useState<string>("");

  const { isLoading: projectLoading, data: projectData } = useQuery<
    IGetProject,
    IErrorResponse
  >({
    queryKey: ["project"],
    queryFn: () => getProject(contractNumber!),
    enabled: contractNumber !== undefined,
    refetchOnWindowFocus: false,
  });

  const { isLoading, data, refetch } = useQuery<
    IGetEmployeeHistories,
    IErrorResponse
  >({
    queryKey: ["employeeHistory"],
    queryFn: () =>
      getEmployeeHistory(contractNumber!, searchYear, searchEmployeeName),
    enabled: contractNumber !== undefined,
    refetchOnWindowFocus: false,
  });

  const handleKeyUp = (
    e: React.KeyboardEvent<HTMLInputElement | HTMLButtonElement>
  ) => {
    if (e.key === "Enter") searchByCond();
  };

  const [isAnyChanged, setIsAnyChanged] = useState<boolean>(false);

  const searchByCond = async () => {
    await refetch();
    setIsAnyChanged(false);
  };

  const [employeeHistory, setEmployeeHistory] = useState<IEmployeeHistory[]>(
    []
  );
  const [salaryInputs, setSalaryInputs] = useState<{ [key: string]: string }>(
    {}
  );
  const [calculateManMonthInputs, setCalculateManMonthInputs] = useState<{
    [key: string]: string;
  }>({});

  useEffect(() => {
    if (data && data.ok) {
      let salaryInputValues: { [key: string]: string } = {};
      let calculateInputValues: { [key: string]: string } = {};

      data.data.content.forEach((history) => {
        history.mms.forEach((mm) => {
          /*  기존 값을 남기는 방식
          if (
            salaryInputValues[`${history.id}-${mm.id}`] === "" ||
            salaryInputValues[`${history.id}-${mm.id}`] === undefined
          ) {
            salaryInputValues[`${history.id}-${mm.id}`] = "";
          } 
          */

          // 기존값을 지우는 방식
          salaryInputValues[`${history.id}-${mm.id}`] = "";
        });
      });

      data.data.content.forEach((history) => {
        history.mms.forEach((mm) => {
          /*  기존 값을 남기는 방식
          if (
            calculateInputValues[`${history.id}-${mm.id}`] === "" ||
            calculateInputValues[`${history.id}-${mm.id}`] === undefined
          ) {
            calculateInputValues[`${history.id}-${mm.id}`] = "";
          } 
          */

          // 기존값을 지우는 방식
          calculateInputValues[`cal-${history.id}-${mm.id}`] = "";
        });
      });

      setEmployeeHistory(data.data.content);
      setSalaryInputs(salaryInputValues);
      setCalculateManMonthInputs(calculateInputValues);
    }
  }, [data]);

  const handleSalary = (
    event: ChangeEvent<HTMLInputElement>,
    employeeHistoryId: number,
    manMonthId: number
  ) => {
    // 급여 입력 필드값
    const salary = +event.target.value.replaceAll(",", "");

    const {
      updatedEmployeeHistory,
      indexToUpdateEmployeeHistory,
      indexToUpdateManMonth,
    } = getCopyEmployeeHistoryStateAndIndex(
      employeeHistory,
      employeeHistoryId,
      manMonthId
    );

    // 위에서 찾은 history 객체와 그 객체의 mms 리스트에서 변경할 mm 객체의 inputManMonth 값을 가져온다.
    const inputManMonth =
      +updatedEmployeeHistory[indexToUpdateEmployeeHistory].mms[
        indexToUpdateManMonth
      ].inputManMonth;

    const plPrice =
      updatedEmployeeHistory[indexToUpdateEmployeeHistory].mms[
        indexToUpdateManMonth
      ].plPrice;
    const calculatePrice =
      updatedEmployeeHistory[indexToUpdateEmployeeHistory].mms[
        indexToUpdateManMonth
      ].calculatePrice;

    // 변경할 mm 객체에 대해서 기존값은 그대로 두고 inputPrice의 값을 수정(추가)한다.
    updatedEmployeeHistory[indexToUpdateEmployeeHistory].mms[
      indexToUpdateManMonth
    ] = {
      ...updatedEmployeeHistory[indexToUpdateEmployeeHistory].mms[
        indexToUpdateManMonth
      ],
      inputPrice: +(salary * inputManMonth).toFixed(0),
      monthSalary: salary,
      ...(((plPrice && calculatePrice) || (!plPrice && calculatePrice)) && {
        plPrice: +(
          calculatePrice - +(salary * inputManMonth).toFixed(0)
        ).toFixed(0),
      }),
    };
    // 변경한 employeeHistory를 적용한다.
    setEmployeeHistory(updatedEmployeeHistory);

    const copySalaryInputs = salaryInputs;
    copySalaryInputs[`${employeeHistoryId}-${manMonthId}`] =
      salary.toString() === "0" ? "" : salary.toString();
    setSalaryInputs(copySalaryInputs);

    setIsAnyChanged(true);
  };

  const handleCalculateManMonth = (
    event: React.ChangeEvent<HTMLInputElement>,
    employeeHistoryId: number,
    manMonthId: number
  ): void => {
    const calculateManMonth = +event.target.value;

    const {
      updatedEmployeeHistory,
      indexToUpdateEmployeeHistory,
      indexToUpdateManMonth,
    } = getCopyEmployeeHistoryStateAndIndex(
      employeeHistory,
      employeeHistoryId,
      manMonthId
    );

    const worthPerLevel =
      updatedEmployeeHistory[indexToUpdateEmployeeHistory].worth;

    const calculatePrice = calculateManMonth * worthPerLevel;

    const inputPrice =
      updatedEmployeeHistory[indexToUpdateEmployeeHistory].mms[
        indexToUpdateManMonth
      ].inputPrice;

    updatedEmployeeHistory[indexToUpdateEmployeeHistory].mms[
      indexToUpdateManMonth
    ] = {
      ...updatedEmployeeHistory[indexToUpdateEmployeeHistory].mms[
        indexToUpdateManMonth
      ],
      calculatePrice: +calculatePrice.toFixed(0),
      calculateManMonth: calculateManMonth.toString(),
      ...(inputPrice && { plPrice: +(calculatePrice - inputPrice).toFixed(0) }),
    };

    setEmployeeHistory(updatedEmployeeHistory);

    const copyCalculateManMonthInputs = calculateManMonthInputs;

    copyCalculateManMonthInputs[`cal-${employeeHistoryId}-${manMonthId}`] =
      calculateManMonth.toString();

    setCalculateManMonthInputs(copyCalculateManMonthInputs);

    setIsAnyChanged(true);
  };

  const addHistoryManMonthsMutation = useMutation<
    IGetEmployeeHistories,
    IErrorResponse,
    IAddHistoryManMonthPayload
  >({
    mutationFn: (variables: IAddHistoryManMonthPayload) =>
      saveHistoryManMonths(variables.historyId, variables.payload),
    onSuccess: () => {
      toast({
        title: `등록 완료`,
        status: "success",
        duration: 1500,
        isClosable: true,
      });
    },
    onError: (error) => {
      console.log(error);
      toast({
        title: `등록 실패`,
        description: `${error.response.data.errorMessage}`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    },
  });

  const handleSave = async (employeeId: number): Promise<void> => {
    const history = employeeHistory.find((h) => h.id === employeeId);

    if (history === null || history === undefined) return;

    await addHistoryManMonthsMutation.mutate({
      historyId: history.id.toString(),
      payload: history.mms,
    });
  };

  return (
    <>
      <Helmet>
        <title>{`투입 현황 ${contractNumber}`}</title>
      </Helmet>
      <Skeleton isLoaded={!projectLoading && !isLoading} height={"50vh"}>
        {/* 화면 상단 타이틀 */}
        <HStack marginBottom={5}>
          <Button
            variant={"ghost"}
            size={"sm"}
            colorScheme="teal"
            onClick={() => navigate(-1)}
          >
            <Icon as={FaArrowLeft} />
          </Button>
          <Text fontWeight={"semibold"} fontSize={"2xl"}>
            {`[${projectData?.data.teamName}] 투입 현황`}
          </Text>
          <HStack>
            <Text
              fontWeight={"hairline"}
            >{`(${projectData?.data.startDate}`}</Text>
            <Text fontWeight={"hairline"}>-</Text>
            <Text
              fontWeight={"hairline"}
            >{`${projectData?.data.endDate})`}</Text>
          </HStack>
        </HStack>
        {/* 화면 상단 타이틀 끝 */}

        {/* 화면 상단 단가*/}
        <HStack marginBottom={5}>
          <Flex direction={"column"}>
            <Text fontWeight={"hairline"}>단가</Text>
            <HStack marginTop={2}>
              {projectData?.data.unitPrices.map((up) => {
                return Object.entries(up).map((keyValue, index) => (
                  <Flex
                    key={index}
                    w={"100%"}
                    flexDirection={"column"}
                    border={"Highlight"}
                    borderStyle={"outset"}
                    borderWidth={1}
                    borderRadius={5}
                    borderColor={primaryColor}
                    p={2}
                  >
                    <Box>
                      <Text fontWeight={"bold"}>
                        {convertLevelEnToKo(keyValue[0])}
                      </Text>
                      <NumericFormat
                        value={keyValue[1]}
                        displayType="text"
                        thousandSeparator={","}
                        className="text-xl font-thin"
                      />
                    </Box>
                  </Flex>
                ));
              })}
            </HStack>
          </Flex>
        </HStack>
        {/* 화면 상단 단가 끝 */}

        {/* 검색 섹션 */}
        <HStack marginBottom={5} spacing={8}>
          <Box width={"min-content"} alignItems={"center"} display={"flex"}>
            <Text marginRight={2} fontWeight={"hairline"} width={"max-content"}>
              연도 (투입일 기준)
            </Text>
            <Input
              onChange={(event) => setSearchYear(event.target.value)}
              placeholder={new Date().getFullYear().toString()}
              size="sm"
              type="text"
              value={searchYear}
              width={110}
              focusBorderColor={primaryColor}
              onKeyUp={handleKeyUp}
            />
          </Box>
          <Box width={"min-content"} alignItems={"center"} display={"flex"}>
            <Text marginRight={2} fontWeight={"hairline"} width={"max-content"}>
              사원명
            </Text>
            <Input
              onChange={(event) => setSearchEmployeeName(event.target.value)}
              placeholder="최치원"
              size="sm"
              type="text"
              value={searchEmployeeName}
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
        {/* 검색 섹션 끝 */}

        {/* 화면 중단 리스트 */}
        {data &&
          data.ok &&
          employeeHistory.length > 0 &&
          employeeHistory.map((emp, index) => (
            <Flex
              key={index}
              border={"ButtonShadow"}
              borderColor={primaryColor}
              borderStyle={"double"}
              borderRadius={10}
              marginBottom={4}
            >
              <HStack spacing={5} w={"30%"}>
                <Flex
                  direction={"column"}
                  alignItems={"center"}
                  justifyContent={"center"}
                  w={"30%"}
                  py={6}
                  px={2}
                >
                  <Button
                    fontSize={"small"}
                    variant={"outline"}
                    p={1}
                    colorScheme={"teal"}
                    isDisabled={!isAnyChanged}
                    onClick={() => handleSave(emp.id)}
                  >
                    변경사항 저장
                  </Button>
                </Flex>

                <Flex
                  direction={"column"}
                  alignItems={"center"}
                  justifyContent={"center"}
                  w={"30%"}
                  py={6}
                  px={2}
                >
                  <Text fontSize={"small"} color={primaryColor}>
                    사번
                  </Text>
                  <Text fontSize={"small"}>{emp.employee.employeeNumber}</Text>
                </Flex>

                <Flex
                  direction={"column"}
                  alignItems={"center"}
                  justifyContent={"center"}
                  w={"30%"}
                >
                  <Text fontSize={"small"} color={primaryColor}>
                    이름
                  </Text>
                  <Text fontSize={"small"}>{emp.employee.name}</Text>
                </Flex>

                <Box w={"60%"} px={2} py={6} mb={2}>
                  <Flex height={5} w={"100%"} justifyContent={"flex-end"}>
                    <Text color={titleColor} fontSize={"smaller"}>
                      월 구분
                    </Text>
                  </Flex>
                  <Flex h={5} w={"100%"} justifyContent={"flex-end"}>
                    <Text color={titleColor} fontSize={"smaller"}>
                      실제 투입일
                    </Text>
                  </Flex>
                  <Flex height={5} w={"100%"} justifyContent={"flex-end"}>
                    <Text color={titleColor} fontSize={"smaller"}>
                      투입 MM
                    </Text>
                  </Flex>
                  <Flex height={5} w={"100%"} justifyContent={"flex-end"}>
                    <Text color={titleColor} fontSize={"smaller"}>
                      급여
                    </Text>
                  </Flex>
                  <Flex height={5} w={"100%"} justifyContent={"flex-end"}>
                    <Text color={titleColor} fontSize={"smaller"}>
                      투입 금액
                    </Text>
                  </Flex>

                  <Flex height={5} w={"100%"} justifyContent={"flex-end"}>
                    <Text color={titleColor} fontSize={"smaller"}>
                      정산 MM
                    </Text>
                  </Flex>
                  <Flex height={5} w={"100%"} justifyContent={"flex-end"}>
                    <Text color={titleColor} fontSize={"smaller"}>
                      정산 등급
                    </Text>
                  </Flex>
                  <Flex height={5} w={"100%"} justifyContent={"flex-end"}>
                    <Text color={titleColor} fontSize={"smaller"}>
                      정산 금액
                    </Text>
                  </Flex>
                  <Flex height={5} w={"100%"} justifyContent={"flex-end"}>
                    <Text color={titleColor} fontSize={"smaller"}>
                      손익액
                    </Text>
                  </Flex>
                </Box>
              </HStack>

              <HStack overflowX={"auto"} w={"70%"}>
                {emp.mms.map((month, index) => (
                  <Flex
                    key={index}
                    direction={"column"}
                    py={4}
                    px={2}
                    borderStyle={"outset"}
                    borderWidth={1}
                    borderColor={"Background"}
                    mb={2}
                    justifyContent={"flex-start"}
                  >
                    <Flex
                      alignItems={"center"}
                      justifyContent={"center"}
                      height={5}
                    >
                      <Text fontSize={"small"}>{`${month.month}월`}</Text>
                    </Flex>
                    <Flex
                      alignItems={"center"}
                      justifyContent={"space-between"}
                      w={"max-content"}
                      height={5}
                    >
                      <Text fontSize={"small"}>{month.durationStart}</Text>
                      <Box mb={1}>
                        <Text mx={3}>⇢</Text>
                      </Box>
                      <Text fontSize={"small"}>{month.durationEnd}</Text>
                    </Flex>
                    <Flex
                      alignItems={"center"}
                      justifyContent={"center"}
                      fontSize={"small"}
                    >
                      <Text>{month.inputManMonth}</Text>
                    </Flex>
                    <Flex
                      alignItems={"center"}
                      justifyContent={"center"}
                      fontSize={"small"}
                    >
                      <NumericFormat
                        value={
                          month.monthSalary
                            ? month.monthSalary
                            : salaryInputs[`${emp.id}-${month.id}`]
                        }
                        allowNegative={false}
                        thousandSeparator={","}
                        className="numeric-input h-4 rounded-md border border-inherit bg-inherit w-full text-center
                        focus:outline-none focus:border-2 focus:border-teal-500 transition-colors duration-200 box-border"
                        onChange={(event) =>
                          handleSalary(event, emp.id, month.id)
                        }
                      />
                    </Flex>

                    <Flex
                      alignItems={"center"}
                      justifyContent={"center"}
                      fontSize={"small"}
                    >
                      <NumericFormat
                        value={month.inputPrice ? month.inputPrice : 0}
                        displayType="text"
                        thousandSeparator={","}
                        className="text-sm font-thin"
                      />
                    </Flex>

                    <Box my={0.5}></Box>

                    <Flex
                      alignItems={"center"}
                      justifyContent={"center"}
                      fontSize={"small"}
                    >
                      <NumericFormat
                        value={
                          month.calculateManMonth
                            ? month.calculateManMonth
                            : calculateManMonthInputs[
                                `cal-${emp.id}-${month.id}`
                              ]
                        }
                        decimalScale={2}
                        className="h-4 rounded-md border border-inherit bg-inherit w-full text-center
                    focus:outline-none focus:border-2 focus:border-teal-500 transition-colors duration-200 box-border"
                        onChange={(event) =>
                          handleCalculateManMonth(event, emp.id, month.id)
                        }
                      />
                    </Flex>
                    <Flex
                      alignItems={"center"}
                      justifyContent={"center"}
                      fontSize={"small"}
                    >
                      <Text>{convertLevelEnToKo(month.calculateLevel)}</Text>
                    </Flex>
                    <Flex
                      alignItems={"center"}
                      justifyContent={"center"}
                      fontSize={"small"}
                    >
                      <NumericFormat
                        value={month.calculatePrice ? month.calculatePrice : 0}
                        displayType="text"
                        decimalScale={0}
                        thousandSeparator={","}
                        className="text-sm font-thin"
                      />
                    </Flex>
                    <Flex
                      alignItems={"center"}
                      justifyContent={"center"}
                      fontSize={"small"}
                    >
                      <NumericFormat
                        value={month.plPrice ? month.plPrice : 0}
                        displayType="text"
                        decimalScale={0}
                        thousandSeparator={","}
                        className="text-sm font-thin"
                      />
                    </Flex>
                  </Flex>
                ))}
              </HStack>
            </Flex>
          ))}

        {data && data.ok && employeeHistory.length === 0 && <NoContent />}
      </Skeleton>
    </>
  );
}
