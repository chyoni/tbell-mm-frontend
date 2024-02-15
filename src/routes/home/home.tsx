import { Box, Text } from "@chakra-ui/react";
import React from "react";
import { Helmet } from "react-helmet-async";

export default function Home() {
  return (
    <>
      <Helmet>
        <title>{`공수율 시스템 대시보드`}</title>
      </Helmet>
      <Box>
        <Text>Dashboard</Text>
      </Box>
    </>
  );
}
