import {
  Box,
  Button,
  Flex,
  HStack,
  Input,
  Skeleton,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import React, { ChangeEvent, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { IGetStatistics, IGetStatisticsRes } from "../../types/statistics";
import { IErrorResponse } from "../../types/common";
import { getHistoryStatistics } from "../../api/statistics";
import { primaryColor, titleColor } from "../../theme";
import { getKoreaDateTime } from "../../utils";
import { NumericFormat } from "react-number-format";
import { IGetEmployees } from "../../types/employee";
import { getEmployees } from "../../api/employees";
import { IGetProjects } from "../../types/project";
import { getProjects } from "../../api/projects";
import { ResponsiveLine, Serie } from "@nivo/line";

export default function Home() {
  const [year, setYear] = useState<string>(new Date().getFullYear().toString());
  const [currentSelectedYear, setCurrentSelectedYear] = useState<string>(
    new Date().getFullYear().toString()
  );
  const [statisticsByYear, setStatisticsByYear] = useState<IGetStatistics[]>(
    []
  );
  const [statisticsLineData, setStatisticsLineData] = useState<Serie>({
    id: `${currentSelectedYear} 정산금액 추이`,
    data: [],
  });

  const { isLoading, data, refetch } = useQuery<
    IGetStatisticsRes,
    IErrorResponse
  >({
    queryKey: ["statistics"],
    queryFn: () => getHistoryStatistics(year),
    refetchOnWindowFocus: false,
    refetchInterval: 300000,
  });

  const { isLoading: employeesLoading, data: employeesData } = useQuery<
    IGetEmployees,
    IErrorResponse
  >({
    queryKey: ["employees"],
    queryFn: () => getEmployees(0, 10),
    refetchOnWindowFocus: false,
  });

  const { isLoading: projectsLoading, data: projectsData } = useQuery<
    IGetProjects,
    Error
  >({
    queryKey: ["projects"],
    queryFn: () => getProjects(0, 10),
    refetchOnWindowFocus: false,
  });

  const handleKeyUp = (
    e: React.KeyboardEvent<HTMLButtonElement | HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      searchByCond();
      setCurrentSelectedYear(year);
    }
  };
  const searchByCond = async () => {
    await refetch();
    setCurrentSelectedYear(year);
  };

  const changeYear = (event: ChangeEvent<HTMLInputElement>) => {
    const isNumber = /^\d+$/.test(event.target.value);
    if (isNumber) setYear(event.target.value);
  };

  useEffect(() => {
    if (data?.ok && data.data) {
      const cleanStatisticsByYear = [...data.data];

      const cleanStatisticsLineData: Serie = {
        id: `${year} 정산금액 추이`,
        data: [],
      };

      data.data.forEach((d) => {
        const x = `${year}-${d.month}-1`;
        const y = d.totalCalculatePrice || 0;

        const data = { x, y };

        cleanStatisticsLineData.data.push(data);
      });

      for (let month = 1; month <= 12; month++) {
        const existsMonth = cleanStatisticsByYear.findIndex(
          (item) => item.month === month
        );

        if (existsMonth === -1) {
          cleanStatisticsByYear.push({
            month,
            totalCalculateManMonth: null,
            totalCalculatePrice: null,
            totalInputManMonth: null,
            totalInputPrice: null,
          });

          cleanStatisticsLineData.data.push({
            x: `${year}-${month}-1`,
            y: 0,
          });
        }
      }

      cleanStatisticsByYear.sort((prev, next) => prev.month - next.month);
      cleanStatisticsLineData.data.sort(
        (prev, next) =>
          parseInt(prev.x!.toString().split("-", -1)[1]) -
          parseInt(next.x!.toString().split("-", -1)[1])
      );
      setStatisticsByYear(cleanStatisticsByYear);
      setStatisticsLineData(cleanStatisticsLineData);
    }
  }, [data, year]);

  console.log(statisticsLineData);

  return (
    <>
      <Helmet>
        <title>{`공수율 시스템 대시보드`}</title>
      </Helmet>
      <Text fontSize={"2xl"} fontWeight={"semibold"}>
        공수율 관리 시스템 대시보드
      </Text>
      <Skeleton isLoaded={!isLoading} borderRadius={20}>
        <VStack
          h={"max-content"}
          marginTop={8}
          px={10}
          py={5}
          border={"InactiveBorder"}
          borderStyle={"dashed"}
          borderRadius={20}
          borderWidth={2}
          direction={"column"}
        >
          <HStack justifyContent={"space-between"} marginBottom={3}>
            <Text fontWeight={"semibold"} fontSize={"sm"}>
              전체 공수율 현황
            </Text>
            <Text fontSize={"sm"} color={"#C6C7C9"}>
              {getKoreaDateTime()} 기준
            </Text>
          </HStack>

          {/* 검색 섹션 */}
          <HStack marginBottom={5} spacing={8}>
            <Box width={"min-content"} alignItems={"center"} display={"flex"}>
              <Text
                marginRight={2}
                fontWeight={"hairline"}
                width={"max-content"}
              >
                연도
              </Text>
              <Input
                onChange={(event) => changeYear(event)}
                placeholder={new Date().getFullYear().toString()}
                size="sm"
                type={"text"}
                value={year}
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

          {/* 데이터 */}
          <HStack>
            <Flex direction={"column"} marginRight={10}>
              <Flex alignItems={"center"} justifyContent={"center"}>
                <Text fontWeight={"bold"} fontSize={"large"}>
                  구분
                </Text>
              </Flex>
              <Box>
                <Text color={titleColor}>투입MM</Text>
              </Box>
              <Box>
                <Text color={titleColor}>투입금액</Text>
              </Box>
              <Box>
                <Text color={titleColor}>정산MM</Text>
              </Box>
              <Box>
                <Text color={titleColor}>정산금액</Text>
              </Box>
            </Flex>
            {statisticsByYear.map((s, index) => (
              <Flex direction={"column"} key={index} marginRight={6}>
                <Flex alignItems={"center"} justifyContent={"center"}>
                  <Text
                    fontWeight={"bold"}
                    fontSize={"large"}
                  >{`${s.month}월`}</Text>
                </Flex>
                <Flex alignItems={"center"} justifyContent={"center"}>
                  <Text fontWeight={"hairline"}>
                    {s.totalInputManMonth !== null ? s.totalInputManMonth : "-"}
                  </Text>
                </Flex>
                <Flex alignItems={"center"} justifyContent={"center"}>
                  <NumericFormat
                    value={s.totalInputPrice !== null ? s.totalInputPrice : "-"}
                    displayType="text"
                    thousandSeparator={","}
                    className="text-md font-thin"
                  />
                </Flex>
                <Flex alignItems={"center"} justifyContent={"center"}>
                  <Text fontWeight={"hairline"}>
                    {s.totalCalculateManMonth !== null
                      ? s.totalCalculateManMonth
                      : "-"}
                  </Text>
                </Flex>
                <Flex alignItems={"center"} justifyContent={"center"}>
                  <NumericFormat
                    value={
                      s.totalCalculatePrice !== null
                        ? s.totalCalculatePrice
                        : "-"
                    }
                    displayType="text"
                    thousandSeparator={","}
                    className="text-md font-thin"
                  />
                </Flex>
              </Flex>
            ))}
          </HStack>
          {/* 데이터 끝 */}
        </VStack>
      </Skeleton>

      <Skeleton isLoaded={!isLoading}>
        <HStack>
          <Box
            height={"40vh"}
            w={"full"}
            borderRadius={10}
            border={"InactiveBorder"}
            borderStyle={"dashed"}
            borderWidth={2}
            padding={2}
            marginTop={4}
          >
            <Flex justifyContent={"space-between"} marginBottom={3}>
              <Text fontWeight={"bold"} fontSize={"sm"}>
                {`${currentSelectedYear} 정산금액 추이도`}
              </Text>
              <Text fontSize={"sm"} color={"#C6C7C9"}>
                {getKoreaDateTime()} 기준
              </Text>
            </Flex>
            <ResponsiveLine
              animate
              motionConfig="wobbly"
              enableArea
              areaOpacity={0.07}
              colors={["rgb(97, 205, 187)", "rgb(244, 117, 96)"]}
              crosshairType="cross"
              axisBottom={{
                format: "%b",
                legendOffset: -12,
                tickValues: "every 1 months",
              }}
              curve="monotoneX"
              data={[statisticsLineData]}
              enablePointLabel
              enableGridX={true}
              margin={{
                bottom: 60,
                left: 80,
                right: 150,
                top: 20,
              }}
              pointBorderColor={{
                from: "color",
                modifiers: [["darker", 0.3]],
              }}
              theme={{
                text: {
                  fill: "#878d8c",
                },
                tooltip: {
                  container: { color: "black" },
                },
              }}
              legends={[
                {
                  anchor: "bottom-right",
                  direction: "column",
                  justify: false,
                  translateX: 100,
                  translateY: 0,
                  itemsSpacing: 0,
                  itemWidth: 70,
                  itemHeight: 18,
                  itemTextColor: "#999",
                  itemDirection: "left-to-right",
                  itemOpacity: 1,
                  symbolSize: 10,
                  symbolShape: "circle",
                  effects: [
                    {
                      on: "hover",
                      style: {
                        itemTextColor: "#000",
                      },
                    },
                  ],
                },
              ]}
              pointBorderWidth={1}
              pointSize={16}
              useMesh
              xFormat="time:%Y-%m"
              xScale={{
                format: "%Y-%m-%d",
                precision: "month",
                type: "time",
                useUTC: false,
              }}
              yScale={{
                type: "linear",
                stacked: false,
                min: "auto",
                max: "auto",
              }}
            />
          </Box>
        </HStack>
      </Skeleton>

      <Skeleton
        isLoaded={!employeesLoading && !projectsLoading}
        borderRadius={20}
      >
        <HStack marginTop={5}>
          <Stat
            borderWidth={2}
            border={"InactiveBorder"}
            borderStyle={"dashed"}
            padding={2}
            borderRadius={10}
            width={"min-content"}
          >
            <StatLabel>사원 수</StatLabel>
            <StatNumber fontSize={"3xl"}>
              {employeesData?.ok
                ? `${employeesData?.data.totalElements} 명`
                : "데이터를 불러오지 못했습니다."}
            </StatNumber>
            <StatHelpText>{getKoreaDateTime()} 기준</StatHelpText>
          </Stat>

          <Stat
            borderWidth={2}
            border={"InactiveBorder"}
            borderStyle={"dashed"}
            padding={2}
            borderRadius={10}
            width={"min-content"}
          >
            <StatLabel>프로젝트 수</StatLabel>
            <StatNumber fontSize={"3xl"}>
              {projectsData?.ok
                ? `${projectsData.data.totalElements} 개`
                : "데이터를 불러오지 못했습니다."}
            </StatNumber>
            <StatHelpText>{getKoreaDateTime()} 기준</StatHelpText>
          </Stat>
        </HStack>
      </Skeleton>
    </>
  );
}
