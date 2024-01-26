import {
  Box,
  Flex,
  Icon,
  ScaleFade,
  Skeleton,
  Text,
  VStack,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import {
  FaCar,
  FaCarSide,
  FaCirclePlus,
  FaDatabase,
  FaFlipboard,
  FaListOl,
} from 'react-icons/fa6';
import { ChevronUpIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { Link, useLocation } from 'react-router-dom';

enum Title {
  Dashboard,
  CanData,
  Vehicles,
  Register,
  Types,
  RegisterType,
  Edit,
}

export default function Sidebar() {
  const url = useLocation();

  const [currentTitle, setCurrentTitle] = useState<Title>(
    url.pathname === '/'
      ? Title.Dashboard
      : url.pathname === '/candata'
      ? Title.CanData
      : url.pathname === '/vehicles'
      ? Title.Vehicles
      : url.pathname === '/register'
      ? Title.Register
      : url.pathname === '/register/vtype'
      ? Title.RegisterType
      : url.pathname === '/vtypes'
      ? Title.Types
      : Title.Edit
  );
  const [isOpen, setIsOpen] = useState<boolean>(
    currentTitle === Title.Vehicles || currentTitle === Title.Register
  );
  const [isTypeOpen, setIsTypeOpen] = useState<boolean>(
    currentTitle === Title.Types || currentTitle === Title.RegisterType
  );

  return (
    <Skeleton
      width={'16rem'}
      isLoaded={true}
      height={'100vh'}
      position={'fixed'}
      top={0}
      left={0}
    >
      <Box
        userSelect={'none'}
        position={'fixed'}
        top={'14'}
        left={0}
        zIndex={40}
        w={'16rem'}
        height={'100vh'}
        className="transition-transform -translate-x-full sm:translate-x-0"
      >
        <Box
          h={'full'}
          px={3}
          py={4}
          overflowY={'auto'}
          borderRightStyle={'groove'}
          borderRightWidth={1}
        >
          <VStack spacing={2} fontWeight={'medium'}>
            <Link
              to={'/'}
              onClick={() => setCurrentTitle(Title.Dashboard)}
              className={
                currentTitle === Title.Dashboard
                  ? 'flex p-2 w-full items-center rounded-lg group text-blue-300 pointer-events-none'
                  : 'flex p-2 w-full items-center rounded-lg group hover:bg-gray-400'
              }
            >
              <Icon as={FaFlipboard} />
              <Text ml={3}>대시보드</Text>
            </Link>
            <Link
              to={'/candata'}
              onClick={() => setCurrentTitle(Title.CanData)}
              className={
                currentTitle === Title.CanData
                  ? 'flex p-2 w-full items-center rounded-lg group text-blue-300 pointer-events-none'
                  : 'flex p-2 w-full items-center rounded-lg group hover:bg-gray-400'
              }
            >
              <Icon as={FaDatabase} />
              <Text ml={3}>프로젝트 별 사원 투입현황</Text>
            </Link>
            <Link
              to={'/candata'}
              onClick={() => setCurrentTitle(Title.CanData)}
              className={
                currentTitle === Title.CanData
                  ? 'flex p-2 w-full items-center rounded-lg group text-blue-300 pointer-events-none'
                  : 'flex p-2 w-full items-center rounded-lg group hover:bg-gray-400'
              }
            >
              <Icon as={FaDatabase} />
              <Text ml={3}>사원별 프로젝트 수행현황</Text>
            </Link>
            <VStack w={'full'}>
              <Flex
                onClick={() => setIsOpen((prev) => !prev)}
                cursor={'pointer'}
                alignItems={'center'}
                justifyContent={'space-between'}
                w={'full'}
                p={2}
                fontSize={'1rem'}
                lineHeight={'1.5rem'}
                rounded={'lg'}
                className=" transition duration-75 group hover:bg-gray-400"
              >
                <Flex alignItems={'center'}>
                  <Icon as={FaCar} />
                  <Text ml={3} textAlign={'left'} whiteSpace={'nowrap'}>
                    프로젝트 관리
                  </Text>
                </Flex>
                {isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
              </Flex>
              {isOpen && (
                <ScaleFade in={isOpen} initialScale={0.9} className="w-full">
                  <VStack spacing={2} pl={6}>
                    <Link
                      to={'/vehicles'}
                      onClick={() => setCurrentTitle(Title.Vehicles)}
                      className={
                        currentTitle === Title.Vehicles
                          ? 'flex p-2 w-full items-center rounded-lg group text-blue-300 pointer-events-none'
                          : 'flex p-2 w-full items-center rounded-lg group hover:bg-gray-400'
                      }
                    >
                      <Icon as={FaListOl} />
                      <Text ml={3}>Vehicles</Text>
                    </Link>
                    <Link
                      to={'/register'}
                      onClick={() => setCurrentTitle(Title.Register)}
                      className={
                        currentTitle === Title.Register
                          ? 'flex p-2 w-full items-center rounded-lg group text-blue-300 pointer-events-none'
                          : 'flex p-2 w-full items-center rounded-lg group hover:bg-gray-400'
                      }
                    >
                      <Icon as={FaCirclePlus} />
                      <Text ml={3}>Register Vehicle</Text>
                    </Link>
                  </VStack>
                </ScaleFade>
              )}
              <Flex
                onClick={() => setIsTypeOpen((prev) => !prev)}
                cursor={'pointer'}
                alignItems={'center'}
                justifyContent={'space-between'}
                w={'full'}
                p={2}
                fontSize={'1rem'}
                lineHeight={'1.5rem'}
                rounded={'lg'}
                className=" transition duration-75 group hover:bg-gray-400"
              >
                <Flex alignItems={'center'}>
                  <Icon as={FaCarSide} />
                  <Text ml={3} textAlign={'left'} whiteSpace={'nowrap'}>
                    사원 관리
                  </Text>
                </Flex>
                {isTypeOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
              </Flex>
              {isTypeOpen && (
                <ScaleFade
                  in={isTypeOpen}
                  initialScale={0.9}
                  className="w-full"
                >
                  <VStack spacing={2} pl={6}>
                    <Link
                      to={'/vtypes'}
                      onClick={() => setCurrentTitle(Title.Types)}
                      className={
                        currentTitle === Title.Types
                          ? 'flex p-2 w-full items-center rounded-lg group text-blue-300 pointer-events-none'
                          : 'flex p-2 w-full items-center rounded-lg group hover:bg-gray-400'
                      }
                    >
                      <Icon as={FaListOl} />
                      <Text ml={3}>Types</Text>
                    </Link>
                    <Link
                      to={'/register/vtype'}
                      onClick={() => setCurrentTitle(Title.RegisterType)}
                      className={
                        currentTitle === Title.RegisterType
                          ? 'flex p-2 w-full items-center rounded-lg group text-blue-300 pointer-events-none'
                          : 'flex p-2 w-full items-center rounded-lg group hover:bg-gray-400'
                      }
                    >
                      <Icon as={FaCirclePlus} />
                      <Text ml={3}>Register Type</Text>
                    </Link>
                  </VStack>
                </ScaleFade>
              )}
            </VStack>
          </VStack>
        </Box>
      </Box>
    </Skeleton>
  );
}
