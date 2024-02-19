import { Box, Skeleton, Text } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { IGetStatistics } from '../../types/statistics';
import { IErrorResponse } from '../../types/common';
import { getHistoryStatistics } from '../../api/statistics';

export default function Home() {
  const [year, setYear] = useState<string>(new Date().getFullYear().toString());

  const { isLoading, data, refetch } = useQuery<IGetStatistics, IErrorResponse>(
    {
      queryKey: ['statistics'],
      queryFn: () => getHistoryStatistics(year),
    }
  );

  console.log(isLoading, data);

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
          border={'ButtonFace'}
          borderStyle={'dashed'}
          borderRadius={20}
          borderWidth={1}
        ></Box>
      </Skeleton>
    </>
  );
}
