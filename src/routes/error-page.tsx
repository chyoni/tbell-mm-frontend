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
          Oops!
        </Text>
        <Text mt={2} fontSize={"large"}>
          Sorry, an unexpected error has occurred.
        </Text>
        <Link to={"/"}>
          <Text ml={5} color={primaryColor}>
            Go home &rarr;
          </Text>
        </Link>
      </Flex>
    </>
  );
}
