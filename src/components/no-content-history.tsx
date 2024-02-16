import { Flex, Text } from '@chakra-ui/react';
import React from 'react';

export default function NoContentHistory() {
  return (
    <Flex alignItems={'center'} justifyContent={'center'} direction={'column'}>
      <Text fontWeight={'bold'} fontSize={'xx-large'}>
        😢 이 유저의 프로젝트 수행 정보가 없습니다.
      </Text>
      <Text>유저에게 프로젝트를 할당하세요.</Text>
    </Flex>
  );
}
