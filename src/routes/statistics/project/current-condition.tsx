import React, { useState } from "react";
import {
  Box,
  Button,
  Flex,
  HStack,
  Icon,
  Input,
  Skeleton,
  Text,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { IGetEmployeeHistories } from "../../../types/employee-history";
import { IErrorResponse } from "../../../types/common";
import { getEmployeeHistory } from "../../../api/employee-history";
import { Helmet } from "react-helmet-async";
import { primaryColor, titleColor } from "../../../theme";
import { useNavigate, useParams } from "react-router-dom";
import { IGetProject } from "../../../types/project";
import { getProject } from "../../../api/projects";
import { FaArrowLeft } from "react-icons/fa6";
import NoContent from "../../../components/no-content";
import { convertLevelEnToKo } from "../../../utils";
import { NumericFormat } from "react-number-format";

export default function ProjectStatisticsCurrentCondition() {
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
  });

  const handleKeyUp = (
    e: React.KeyboardEvent<HTMLInputElement | HTMLButtonElement>
  ) => {
    if (e.key === "Enter") searchByCond();
  };

  const searchByCond = async () => await refetch();

  console.log(data, projectData);

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
                    border={"ButtonShadow"}
                    borderStyle={"groove"}
                    borderWidth={2}
                    borderRadius={5}
                    borderColor={primaryColor}
                    p={2}
                  >
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
            </HStack>
          </Flex>
        </HStack>
        {/* 화면 상단 단가 끝 */}

        {/* 검색 섹션 */}
        <HStack marginBottom={5} spacing={8}>
          <Box width={"min-content"} alignItems={"center"} display={"flex"}>
            <Text marginRight={2} fontWeight={"hairline"} width={"max-content"}>
              연도 (투입일 기준)
            </Text>
            <Input
              onChange={(event) => setSearchYear(event.target.value)}
              placeholder="YYYY"
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
              사원명
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
          data.data.content.length > 0 &&
          data.data.content.map((emp, index) => (
            <Flex
              key={index}
              border={"ButtonShadow"}
              borderColor={primaryColor}
              borderStyle={"double"}
              borderRadius={10}
              mb={10}
              p={2}
            >
              <HStack spacing={10} w={"30%"}>
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

                <Flex
                  direction={"column"}
                  alignItems={"flex-end"}
                  justifyContent={"center"}
                  w={"60%"}
                  px={2}
                  py={6}
                  mb={2}
                >
                  <Text color={titleColor} fontSize={"smaller"}>
                    월 구분
                  </Text>
                  <Text color={titleColor} fontSize={"smaller"}>
                    실제 투입일
                  </Text>
                  <Text color={titleColor} fontSize={"smaller"}>
                    투입 MM
                  </Text>
                  <Text color={titleColor} fontSize={"smaller"}>
                    투입 금액
                  </Text>
                  <Text color={titleColor} fontSize={"smaller"}>
                    정산 MM
                  </Text>
                  <Text color={titleColor} fontSize={"smaller"}>
                    정산 등급
                  </Text>
                  <Text color={titleColor} fontSize={"smaller"}>
                    정산 금액
                  </Text>
                  <Text color={titleColor} fontSize={"smaller"}>
                    손익액
                  </Text>
                </Flex>
              </HStack>

              <HStack overflowX={"scroll"} w={"70%"}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((month, index) => (
                  <Flex
                    key={index}
                    direction={"column"}
                    py={4}
                    px={2}
                    borderLeft={1}
                    borderLeftWidth={1}
                    borderLeftStyle={"dashed"}
                    borderColor={"#e9e5e5"}
                  >
                    <Flex alignItems={"center"} justifyContent={"center"}>
                      <Text fontSize={"small"}>1월</Text>
                    </Flex>
                    <Flex
                      alignItems={"center"}
                      justifyContent={"center"}
                      w={"max-content"}
                    >
                      <Text fontSize={"small"}>2020-01-02</Text>
                      <Text mx={3}>|</Text>
                      <Text fontSize={"small"}>2020-01-31</Text>
                    </Flex>
                    <Flex
                      alignItems={"center"}
                      justifyContent={"center"}
                      fontSize={"small"}
                    >
                      <Text>0.71</Text>
                    </Flex>
                    <Flex
                      alignItems={"center"}
                      justifyContent={"center"}
                      fontSize={"small"}
                    >
                      <Text>2,129,032</Text>
                    </Flex>
                    <Flex
                      alignItems={"center"}
                      justifyContent={"center"}
                      fontSize={"small"}
                    >
                      <Text>0.40</Text>
                    </Flex>
                    <Flex
                      alignItems={"center"}
                      justifyContent={"center"}
                      fontSize={"small"}
                    >
                      <Text>중급</Text>
                    </Flex>
                    <Flex
                      alignItems={"center"}
                      justifyContent={"center"}
                      fontSize={"small"}
                    >
                      <Text>2,400,000</Text>
                    </Flex>
                    <Flex
                      alignItems={"center"}
                      justifyContent={"center"}
                      fontSize={"small"}
                    >
                      <Text>270,968</Text>
                    </Flex>
                  </Flex>
                ))}
              </HStack>
            </Flex>
          ))}

        {data && data.ok && data.data.content.length === 0 && <NoContent />}
      </Skeleton>
    </>
  );
}
