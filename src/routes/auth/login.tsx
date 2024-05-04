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
        <Center p={30}>
          <VStack
            p={20}
            w={'40%'}
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
              TBELL MMS
            </Text>
            <FormControl marginTop={2} isRequired isInvalid={isUsernameError}>
              <FormLabel>Username</FormLabel>
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
              <FormLabel>Password</FormLabel>
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
            <Button
              color={primaryColor}
              size={'md'}
              onClick={doLogin}
              isDisabled={isUsernameError || isPasswordError}
            >
              로그인
            </Button>
          </VStack>
        </Center>
      </Skeleton>
    </>
  );
}
