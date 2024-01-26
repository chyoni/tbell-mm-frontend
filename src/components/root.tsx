import { Box, HStack, VStack } from '@chakra-ui/react';
import React from 'react';
import Header from './header';
import { Outlet } from 'react-router-dom';
import Sidebar from './sidebar';

export default function Root() {
  return (
    <VStack spacing={0}>
      <Header />

      <HStack w={'full'}>
        <Sidebar />
        <Box w={'full'} height={'100vh'} py={16} px={4} ml={{ sm: 64 }}>
          <Outlet />
        </Box>
      </HStack>
    </VStack>
  );
}
