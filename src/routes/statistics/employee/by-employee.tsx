import { Center, Text } from "@chakra-ui/react";
import React from "react";
import { Helmet } from "react-helmet-async";

export default function ByEmployeeStatistics() {
  return (
    <>
      <Helmet>
        <title>{`사원별 프로젝트 수행현황`}</title>
      </Helmet>
      <Center>
        <Text fontSize={"xx-large"} fontWeight={"bold"}>
          🥺 작업중입니다
        </Text>
      </Center>
    </>
  );
}
