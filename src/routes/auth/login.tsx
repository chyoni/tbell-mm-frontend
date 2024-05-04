import {
  Button,
  Text,
  Skeleton,
  VStack,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Center,
  Box,
  HStack,
} from '@chakra-ui/react';
import React, { ChangeEvent, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { primaryColor } from '../../theme';
import { useAuth } from '../../context/\bauth-context';
import { HttpStatusCode } from 'axios';

export default function Login() {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const [anyLoginError, setAnyLoginError] = useState<string | null>(null);

  const { login } = useAuth();

  const onChangeUsername = (e: ChangeEvent<HTMLInputElement>) =>
    setUsername(e.target.value);

  const onChangePassword = (e: ChangeEvent<HTMLInputElement>) =>
    setPassword(e.target.value);

  const handleKeyUp = (
    e: React.KeyboardEvent<HTMLButtonElement | HTMLInputElement>
  ) => {
    if (e.key === 'Enter') {
      doLogin();
    }
  };

  const doLogin = async () => {
    const res = await login({ username, password });
    if (res === HttpStatusCode.Unauthorized) {
      setAnyLoginError('유저 정보가 올바르지 않습니다.');
    }
  };

  const isUsernameError = username === undefined || username === '';
  const isPasswordError = password === undefined || password === '';
  return (
    <>
      <Helmet>
        <title>{`로그인하세요`}</title>
      </Helmet>
      <Skeleton isLoaded={true} height={'50%'} fadeDuration={1.6}>
        <Center p={30} height={'100vh'}>
          <VStack
            p={20}
            w={'30%'}
            borderStyle={'outset'}
            borderWidth={1}
            borderColor={'Background'}
            borderRadius={'20px'}
          >
            <Text
              marginRight={2}
              fontWeight={'hairline'}
              width={'max-content'}
              fontSize={'xx-large'}
            >
              관리자이신가요?
            </Text>
            <FormControl marginTop={2} isRequired isInvalid={isUsernameError}>
              <FormLabel fontWeight={'hairline'}>Username</FormLabel>
              <Input
                size="md"
                type="text"
                value={username}
                focusBorderColor={primaryColor}
                onChange={onChangeUsername}
              />
              {isUsernameError && (
                <FormErrorMessage>필수 필드입니다.</FormErrorMessage>
              )}
            </FormControl>
            <FormControl marginTop={2} isRequired isInvalid={isPasswordError}>
              <FormLabel fontWeight={'hairline'}>Password</FormLabel>
              <Input
                size="md"
                type="password"
                value={password}
                focusBorderColor={primaryColor}
                onChange={onChangePassword}
                onKeyUp={handleKeyUp}
              />
              {isPasswordError && (
                <FormErrorMessage>필수 필드입니다.</FormErrorMessage>
              )}
            </FormControl>
            {anyLoginError && (
              <Text fontSize={'large'} textColor={'red'}>
                {anyLoginError}
              </Text>
            )}
            <VStack>
              <Button
                color={primaryColor}
                size={'md'}
                onClick={doLogin}
                isDisabled={isUsernameError || isPasswordError}
              >
                Login
              </Button>
              <HStack w={'100%'}>
                <Box
                  w={'45%'}
                  borderWidth={1}
                  borderStyle={'dashed'}
                  h={'1px'}
                  borderColor={'grey'}
                ></Box>
                <Text w={'10%'} fontWeight={'hairline'} textAlign={'center'}>
                  OR
                </Text>
                <Box
                  w={'45%'}
                  borderWidth={1}
                  borderStyle={'dashed'}
                  h={'1px'}
                  borderColor={'grey'}
                ></Box>
              </HStack>
              <Text fontWeight={'hairline'}>
                관리자 권한의 계정 부여는 담당자에게 문의하세요.
              </Text>
            </VStack>
          </VStack>
        </Center>
      </Skeleton>
    </>
  );
}
