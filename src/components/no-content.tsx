import { Flex, Text } from "@chakra-ui/react";
import React from "react";

export default function NoContent() {
  return (
    <Flex alignItems={"center"} justifyContent={"center"} direction={"column"}>
      <Text fontWeight={"bold"} fontSize={"xx-large"}>
        😢 데이터가 없습니다.
      </Text>
      <Text>검색 조건을 변경해 보세요.</Text>
    </Flex>
  );
}
