import { Box, Flex, HStack, Skeleton, Text } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { IGetStatistics, IGetStatisticsRes } from '../../types/statistics';
import { IErrorResponse } from '../../types/common';
import { getHistoryStatistics } from '../../api/statistics';

export default function Home() {
  const [year, setYear] = useState<string>(new Date().getFullYear().toString());
  const [statisticsByYear, setStatisticsByYear] = useState<IGetStatistics[]>(
    []
  );

  const { isLoading, data, refetch } = useQuery<
    IGetStatisticsRes,
    IErrorResponse
  >({
    queryKey: ['statistics'],
    queryFn: () => getHistoryStatistics(year),
  });

  useEffect(() => {
    if (data?.ok && data.data) {
      const cleanStatisticsByYear = [...data.data];

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
        }
      }

      cleanStatisticsByYear.sort((prev, next) => prev.month - next.month);
      setStatisticsByYear(cleanStatisticsByYear);
    }
  }, [data]);

  console.log(isLoading, data, statisticsByYear);

  return (
    <>
      <Helmet>
        <title>{`공수율 시스템 대시보드`}</title>
      </Helmet>
      <Text fontSize={'2xl'} fontWeight={'semibold'}>
        공수율 관리 시스템 대시보드
      </Text>
      <Skeleton isLoaded={!isLoading}>
        <Box
          w={'full'}
          h={'50vh'}
          marginTop={8}
          p={10}
          border={'ButtonFace'}
          borderStyle={'dashed'}
          borderRadius={20}
          borderWidth={1}
        >
          <HStack>
            <Flex direction={'column'} marginRight={10}>
              <Flex alignItems={'center'} justifyContent={'center'}>
                <Text>전체</Text>
              </Flex>
              <Box>
                <Text>투입MM</Text>
              </Box>
              <Box>
                <Text>투입금액</Text>
              </Box>
              <Box>
                <Text>정산MM</Text>
              </Box>
              <Box>
                <Text>정산금액</Text>
              </Box>
            </Flex>
            {statisticsByYear.map((s, index) => (
              <Flex direction={'column'} key={index}>
                <Flex alignItems={'center'} justifyContent={'center'}>
                  <Text>{`${s.month}월`}</Text>
                </Flex>
                <Flex alignItems={'center'} justifyContent={'center'}>
                  <Text>
                    {s.totalInputManMonth !== null ? s.totalInputManMonth : '-'}
                  </Text>
                </Flex>
                <Flex alignItems={'center'} justifyContent={'center'}>
                  <Text>
                    {s.totalInputPrice !== null ? s.totalInputPrice : '-'}
                  </Text>
                </Flex>
                <Flex alignItems={'center'} justifyContent={'center'}>
                  <Text>
                    {s.totalCalculateManMonth !== null
                      ? s.totalCalculateManMonth
                      : '-'}
                  </Text>
                </Flex>
                <Flex alignItems={'center'} justifyContent={'center'}>
                  <Text>
                    {s.totalCalculatePrice !== null
                      ? s.totalCalculatePrice
                      : '-'}
                  </Text>
                </Flex>
              </Flex>
            ))}
          </HStack>
        </Box>
      </Skeleton>
    </>
  );
}
