import {
  Box,
  Button,
  Flex,
  HStack,
  Icon,
  Image,
  Text,
  useColorMode,
} from "@chakra-ui/react";
import React from "react";
import { FaMoon } from "react-icons/fa6";
import { IoSunny } from "react-icons/io5";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Header() {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Box
      userSelect={"none"}
      w={"full"}
      zIndex={10000}
      height={14}
      position={"fixed"}
      borderBottomStyle={"groove"}
      borderBottomWidth={1}
      bgColor={colorMode === "light" ? "white" : "#1A202C"}
    >
      <Flex
        w={"full"}
        px={2}
        py={1}
        justifyContent={"space-between"}
        h={"full"}
      >
        <HStack alignItems={"center"} justifyContent={"center"} pl={2}>
          <Link to={"/mms"}>
            <HStack>
              <Image
                src={logo}
                boxSize={"40px"}
                borderRadius={"full"}
                alt={"TBELL"}
              />
              <Text fontSize={"2xl"} fontStyle={"italic"} fontWeight={"black"}>
                TBELL
              </Text>
            </HStack>
          </Link>
        </HStack>
        <HStack alignItems={"center"} justifyContent={"center"}>
          <Button variant={"outline"} size={"sm"} onClick={toggleColorMode}>
            <Icon as={colorMode === "light" ? IoSunny : FaMoon} />{" "}
          </Button>
        </HStack>
      </Flex>
    </Box>
  );
}
