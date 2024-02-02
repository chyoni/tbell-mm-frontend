import React, { useState } from "react";
import {
  Box,
  Button,
  Divider,
  Flex,
  HStack,
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
import { useParams } from "react-router-dom";
import { IGetProject } from "../../../types/project";
import { getProject } from "../../../api/projects";

export default function ProjectStatisticsCurrentCondition() {
  const { contractNumber } = useParams();
  const [searchYear, setSearchYear] = useState<string>("");
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

  return (
    <>
      <Helmet>
        <title>{`투입 현황 ${contractNumber}`}</title>
      </Helmet>
      <Skeleton isLoaded={!projectLoading && !isLoading}>
        <Box marginBottom={5}>
          <Text fontWeight={"semibold"} fontSize={"2xl"}>
            {`[${projectData?.data.teamName}] 투입 현황`}
          </Text>
        </Box>
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

        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(() => (
          <Flex
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
                <Text fontSize={"small"}>20200102</Text>
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
                <Text fontSize={"small"}>최치원</Text>
              </Flex>

              <Flex
                direction={"column"}
                alignItems={"flex-end"}
                justifyContent={"center"}
                w={"60%"}
                px={2}
                py={6}
                mb={4}
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
      </Skeleton>
    </>
  );
}
