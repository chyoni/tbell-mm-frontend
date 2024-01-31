import { Flex, Text } from "@chakra-ui/react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useRouteError } from "react-router-dom";
import { primaryColor } from "../theme";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <>
      <Helmet>
        <title>Error Page</title>
      </Helmet>
      <Flex
        w={"full"}
        height={"100vh"}
        justifyContent={"center"}
        alignItems={"center"}
        flexDirection={"column"}
      >
        <Text fontSize={"xx-large"} fontWeight={600}>
          😢 잘못된 경로입니다.
        </Text>
        <Text mt={2} fontSize={"large"}>
          올바르지 않은 경로를 통해 들어온 것 같습니다.
        </Text>
        <Link to={"/"}>
          <Text ml={5} color={primaryColor}>
            메인화면으로 돌아가기 &rarr;
          </Text>
        </Link>
      </Flex>
    </>
  );
}
