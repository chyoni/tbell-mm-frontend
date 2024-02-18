import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  HStack,
  Icon,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Skeleton,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import React, { ChangeEvent, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { FaArrowLeft } from "react-icons/fa6";
import { useNavigate, useParams } from "react-router-dom";
import {
  IAddHistoryManMonthPayload,
  ICompleteHistoryPayload,
  ICompleteHistoryRes,
  IEmployeeHistory,
  IGetEmployeeHistories,
} from "../../../types/employee-history";
import { IErrorResponse } from "../../../types/common";
import {
  completeHistory,
  getEmployeeHistory,
  saveHistoryManMonths,
} from "../../../api/employee-history";
import { primaryColor, titleColor } from "../../../theme";
import { NumericFormat } from "react-number-format";
import { convertLevelEnToKo } from "../../../utils";
import { getCopyEmployeeHistoryStateAndIndex } from "../project/by-project";
import Pagination from "../../../components/pagination";
import NoContentHistory from "../../../components/no-content-history";

export default function ByEmployeeStatistics() {
  const navigate = useNavigate();
  const toast = useToast();
  const { employeeName } = useParams();
  const [searchYear, setSearchYear] = useState<string>(
    new Date().getFullYear().toString()
  );
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

  const { isLoading, data, refetch } = useQuery<
    IGetEmployeeHistories,
    IErrorResponse
  >({
    queryKey: ["employeeHistory"],
    queryFn: () =>
      getEmployeeHistory(page, undefined, searchYear, employeeName),
    enabled: employeeName !== undefined,
    refetchOnWindowFocus: false,
  });

  const handleKeyUp = (
    e: React.KeyboardEvent<HTMLInputElement | HTMLButtonElement>
  ) => {
    if (e.key === "Enter") searchByCond();
  };

  const searchByCond = async () => {
    await refetch();
  };

  //
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
          salaryInputValues[`${history.id}-${mm.id}`] = "";
        });
      });

      data.data.content.forEach((history) => {
        history.mms.forEach((mm) => {
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
      ...(((plPrice && calculatePrice) ||
        (plPrice && !calculatePrice) ||
        (!plPrice && calculatePrice)) && {
        plPrice: calculatePrice
          ? +(calculatePrice - +(salary * inputManMonth).toFixed(0)).toFixed(0)
          : 0,
      }),
    };
    // 변경한 employeeHistory를 적용한다.
    setEmployeeHistory(updatedEmployeeHistory);

    const copySalaryInputs = salaryInputs;
    copySalaryInputs[`${employeeHistoryId}-${manMonthId}`] =
      salary.toString() === "0" ? "" : salary.toString();
    setSalaryInputs(copySalaryInputs);
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
  };

  const completeHistoryMutation = useMutation<
    ICompleteHistoryRes,
    IErrorResponse,
    ICompleteHistoryPayload
  >({
    mutationFn: (variables: ICompleteHistoryPayload) =>
      completeHistory(variables.historyId, variables.endDate),
    onSuccess: () => {
      toast({
        title: `등록 완료`,
        status: "success",
        duration: 1500,
        isClosable: true,
      });
      if (isEndDateModalOpen) onEndDateToggle();
    },
    onError: (error) => {
      console.log(error);
      toast({
        title: `투입종료일 지정 실패`,
        description: `${error.response.data.errorMessage}`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    },
  });

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

    const payload = history.mms.filter((mm) => {
      if (mm.calculateLevel === null || mm.calculateLevel === undefined)
        return false;
      if (mm.calculateManMonth === null || mm.calculateManMonth === undefined)
        return false;
      if (mm.calculatePrice === null || mm.calculatePrice === undefined)
        return false;
      if (
        mm.inputPrice === null ||
        mm.inputPrice === undefined ||
        mm.inputPrice === 0
      )
        return false;
      if (
        mm.monthSalary === null ||
        mm.monthSalary === undefined ||
        mm.monthSalary === 0
      )
        return false;
      if (mm.plPrice === null || mm.plPrice === undefined) return false;

      return true;
    });

    addHistoryManMonthsMutation.mutate({
      historyId: history.id.toString(),
      payload,
    });
  };

  const handleCompleteHistory = () => {
    if (
      makeEndDate === "" ||
      makeEndDate === null ||
      makeEndDate === undefined
    ) {
      toast({
        title: `투입종료일 지정이 되지 않았습니다.`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (
      selectedMakeEndDateHistory === undefined ||
      selectedMakeEndDateHistory === null
    )
      return;
    completeHistoryMutation.mutate({
      historyId: selectedMakeEndDateHistory.id.toString(),
      endDate: makeEndDate,
    });
  };

  const {
    onToggle: onEndDateToggle,
    isOpen: isEndDateModalOpen,
    onClose: onEndDateModalClose,
  } = useDisclosure();

  const [selectedMakeEndDateHistory, setSelectedMakeEndDateHistory] =
    useState<IEmployeeHistory>();

  const [makeEndDate, setMakeEndDate] = useState<string>("");
  const handlePopupPreSet = (emp: IEmployeeHistory) => {
    setSelectedMakeEndDateHistory(emp);

    setMakeEndDate(emp.endDate ? emp.endDate : "");

    onEndDateToggle();
  };

  const isMakeEndDateError = makeEndDate === undefined || makeEndDate === "";

  const handleMakeEndDate = (e: ChangeEvent<HTMLInputElement>) => {
    setMakeEndDate(e.target.value);
  };

  return (
    <>
      <Helmet>
        <title>{`사원별 프로젝트 수행현황`}</title>
      </Helmet>

      {/* 화면 상단 타이틀 */}
      <Skeleton isLoaded={!isLoading}>
        <Flex alignItems={"center"} marginBottom={5}>
          <Button
            variant={"ghost"}
            size={"sm"}
            colorScheme="teal"
            onClick={() => navigate(-1)}
          >
            <Icon as={FaArrowLeft} />
          </Button>

          <Text fontWeight={"semibold"} fontSize={"2xl"}>
            {`[${employeeName}] 투입 현황`}
          </Text>
          {employeeHistory.length > 0 && (
            <HStack spacing={10} marginLeft={3}>
              <Flex>
                <Text marginRight={2}>{"("}</Text>
                <Text fontWeight={"semibold"} marginRight={2}>
                  사번:
                </Text>
                <Text fontWeight={"hairline"}>
                  {employeeHistory[0].employee.employeeNumber}
                </Text>
              </Flex>

              <Flex>
                <Text fontWeight={"semibold"} marginRight={2}>
                  입사일:{" "}
                </Text>
                <Text fontWeight={"hairline"}>
                  {employeeHistory[0].employee.startDate}
                </Text>
              </Flex>

              <Flex>
                <Text fontWeight={"semibold"} marginRight={2}>
                  퇴사일:{" "}
                </Text>
                <Text fontWeight={"hairline"}>
                  {employeeHistory[0].employee.resignationDate
                    ? employeeHistory[0].employee.resignationDate
                    : "-"}
                </Text>
                <Text marginLeft={2}>{")"}</Text>
              </Flex>
            </HStack>
          )}
        </Flex>
      </Skeleton>
      {/* 화면 상단 타이틀 끝 */}

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

      {/* 페이징 버튼 */}
      <Pagination
        totalPages={data ? data.data.totalPages : 1}
        page={page}
        goToFirstPage={goToFirstPage}
        goToLastPage={goToLastPage}
        goToPrevPage={goToPrevPage}
        goToNextPage={goToNextPage}
        goToSpecificPage={goToSpecificPage}
      />
      <Box mb={5}></Box>
      {/* 페이징 버튼 끝 */}

      {/* 화면 중단 리스트 */}
      {data &&
        data.ok &&
        employeeHistory.length > 0 &&
        employeeHistory.map((ph, index) => (
          <Flex
            key={index}
            border={"ButtonShadow"}
            borderColor={primaryColor}
            borderStyle={"double"}
            borderRadius={10}
            marginBottom={4}
          >
            <HStack spacing={5} w={"40%"}>
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
                  onClick={() => handleSave(ph.id)}
                >
                  변경사항 저장
                </Button>
                <Button
                  fontSize={"small"}
                  marginTop={2}
                  variant={"outline"}
                  p={1}
                  colorScheme={"red"}
                  onClick={() => {
                    handlePopupPreSet(ph);
                  }}
                >
                  투입종료일 지정
                </Button>
                <Modal
                  isOpen={isEndDateModalOpen}
                  onClose={onEndDateModalClose}
                  size={"xl"}
                >
                  <ModalOverlay />
                  <ModalContent>
                    <ModalHeader>투입종료일 지정</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                      <Flex direction={"column"}>
                        <Text fontWeight={"hairline"} fontSize={"x-large"}>
                          {`${selectedMakeEndDateHistory?.employee.name}(${selectedMakeEndDateHistory?.employee.employeeNumber})`}
                        </Text>
                        <FormControl
                          marginTop={8}
                          marginRight={5}
                          isRequired
                          isInvalid={isMakeEndDateError}
                        >
                          <FormLabel>투입종료일</FormLabel>
                          <Input
                            size="md"
                            type="date"
                            value={
                              selectedMakeEndDateHistory?.endDate
                                ? selectedMakeEndDateHistory.endDate
                                : makeEndDate
                            }
                            focusBorderColor={primaryColor}
                            onChange={handleMakeEndDate}
                          />
                          <FormHelperText>
                            (저장 버튼 클릭 시 바로 적용)
                          </FormHelperText>
                          {isMakeEndDateError && (
                            <FormErrorMessage>
                              필수 필드입니다.
                            </FormErrorMessage>
                          )}
                        </FormControl>
                      </Flex>
                    </ModalBody>
                    <ModalFooter>
                      <Button
                        variant={"outline"}
                        mr={3}
                        onClick={onEndDateModalClose}
                      >
                        취소
                      </Button>
                      <Button
                        colorScheme="teal"
                        onClick={handleCompleteHistory}
                        isDisabled={completeHistoryMutation.isPending}
                        isLoading={completeHistoryMutation.isPending}
                      >
                        저장
                      </Button>
                    </ModalFooter>
                  </ModalContent>
                </Modal>
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
                  계약번호
                </Text>
                <Text fontSize={"small"}>{ph.project.contractNumber}</Text>
              </Flex>

              <Flex
                direction={"column"}
                alignItems={"center"}
                justifyContent={"center"}
                w={"40%"}
              >
                <Text fontSize={"small"} color={primaryColor}>
                  프로젝트
                </Text>
                <Text fontSize={"small"}>{ph.project.teamName}</Text>
              </Flex>

              <Box w={"50%"} px={2} py={6} mb={2}>
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

            <HStack overflowX={"auto"} w={"60%"}>
              {ph.mms.map((month, index) => (
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
                          : salaryInputs[`${ph.id}-${month.id}`]
                      }
                      allowNegative={false}
                      thousandSeparator={","}
                      className="numeric-input h-4 rounded-md border border-inherit bg-inherit w-full text-center
                        focus:outline-none focus:border-2 focus:border-teal-500 transition-colors duration-200 box-border"
                      onChange={(event) => handleSalary(event, ph.id, month.id)}
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
                          : calculateManMonthInputs[`cal-${ph.id}-${month.id}`]
                      }
                      decimalScale={2}
                      className="h-4 rounded-md border border-inherit bg-inherit w-full text-center
                    focus:outline-none focus:border-2 focus:border-teal-500 transition-colors duration-200 box-border"
                      onChange={(event) =>
                        handleCalculateManMonth(event, ph.id, month.id)
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
      {/* 화면 중단 리스트 끝 */}

      {/* 정상 응답을 받았지만 데이터가 없는 경우 */}
      {data && data.ok && employeeHistory.length === 0 && <NoContentHistory />}
      {/* 정상 응답을 받았지만 데이터가 없는 경우 끝 */}

      {/* 하단 페이징 버튼 */}
      {data?.data.totalPages !== 0 && (
        <Pagination
          totalPages={data ? data.data.totalPages : 1}
          page={page}
          goToFirstPage={goToFirstPage}
          goToLastPage={goToLastPage}
          goToPrevPage={goToPrevPage}
          goToNextPage={goToNextPage}
          goToSpecificPage={goToSpecificPage}
        />
      )}
      <Box height={"20px"}></Box>
      {/* 하단 페이징 버튼 끝 */}
    </>
  );
}
