import {
  Box,
  Button,
  Center,
  HStack,
  Input,
  Select,
  Skeleton,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { useQuery } from 'react-query';
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { getProjects } from '../../api/api';
import { IGetProjects } from '../../types/project';
import { primaryColor } from '../../theme';
import Pagination from '../../components/pagination';

export default function Projects() {
  const [page, setPage] = useState<number>(0);
  const [year, setYear] = useState<string | undefined>('');
  const [teamName, setTeamName] = useState<string | undefined>('');

  const { isLoading, data, refetch } = useQuery<IGetProjects, Error>(
    ['projects'],
    () => getProjects(page, 10),
    { refetchOnWindowFocus: false }
  );

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

  const searchByCond = async () => {
    console.log(year, teamName);
    refetch({});
  };

  const handleKeyUp = (
    e: React.KeyboardEvent<HTMLButtonElement | HTMLInputElement>
  ) => {
    if (e.key === 'Enter') searchByCond();
  };

  return (
    <>
      <Helmet>
        <title>프로젝트 리스트</title>
      </Helmet>
      <Box marginBottom={5}>
        <Text fontWeight={'semibold'} fontSize={'2xl'}>
          프로젝트 리스트
        </Text>
      </Box>
      <HStack marginBottom={5} spacing={8}>
        <Box width={'min-content'} alignItems={'center'} display={'flex'}>
          <Text
            marginRight={1}
            fontWeight={'hairline'}
            width={120}
            color={'teal'}
          >
            연도 (시작일 기준)
          </Text>
          <Input
            onChange={(event) => setYear(event.target.value)}
            placeholder="YYYY"
            size="sm"
            type="text"
            value={year}
            width={110}
            focusBorderColor={primaryColor}
            onKeyUp={handleKeyUp}
          />
        </Box>
        <Box width={'min-content'} alignItems={'center'} display={'flex'}>
          <Text
            marginRight={1}
            fontWeight={'hairline'}
            width={30}
            color={'teal'}
          >
            팀명
          </Text>
          <Input
            onChange={(event) => setTeamName(event.target.value)}
            placeholder="SK텔레콤 1팀"
            size="sm"
            type="text"
            value={teamName}
            width={200}
            focusBorderColor={primaryColor}
            onKeyUp={handleKeyUp}
          />
        </Box>
        <Button
          colorScheme="teal"
          size={'sm'}
          onClick={searchByCond}
          onKeyUp={handleKeyUp}
        >
          검색
        </Button>
      </HStack>
      <Skeleton
        isLoaded={!isLoading}
        height={'50%'}
        fadeDuration={1.6}
        speed={5}
      >
        {data && data.errorMessage && (
          <Center>
            <Text fontSize={'xx-large'} fontWeight={600}>
              Oops!
            </Text>
            <Text mt={2} fontSize={'large'}>
              {data.errorMessage}
            </Text>
          </Center>
        )}
        {data && data.ok && (
          <TableContainer>
            <Table size={'sm'}>
              <TableCaption>
                <Pagination
                  totalPages={data.data.totalPages}
                  page={page}
                  goToFirstPage={goToFirstPage}
                  goToLastPage={goToLastPage}
                  goToPrevPage={goToPrevPage}
                  goToNextPage={goToNextPage}
                  goToSpecificPage={goToSpecificPage}
                />
              </TableCaption>
              <Thead>
                <Tr>
                  <Th>계약번호</Th>
                  <Th>소속</Th>
                  <Th>팀명</Th>
                  <Th>상태</Th>
                  <Th>시작일</Th>
                  <Th>종료일</Th>
                  <Th>원청</Th>
                  <Th>작업</Th>
                </Tr>
              </Thead>
              <Tbody>
                {data?.data.content.map((p, index) => (
                  <Tr key={index}>
                    <Td>{p.contractNumber}</Td>
                    <Td>{p.departmentName}</Td>
                    <Td>{p.teamName}</Td>
                    <Td>{p.projectStatus === 'YEAR' ? '연간' : '단건'}</Td>
                    <Td>{p.startDate}</Td>
                    <Td>{p.endDate}</Td>
                    <Td>{p.contractor}</Td>
                    <Td>
                      <HStack spacing={2}>
                        <Button size={'xs'} colorScheme="teal">
                          <Link to={`/details/${p.contractNumber}`}>
                            세부 정보
                          </Link>
                        </Button>
                        <Button size={'xs'} colorScheme="teal">
                          <Link to={`/edit/${p.contractNumber}`}>수정</Link>
                        </Button>
                      </HStack>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        )}
      </Skeleton>
    </>
  );
}
