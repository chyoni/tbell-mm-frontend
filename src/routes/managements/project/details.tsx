import {
  HStack,
  Button,
  Skeleton,
  Flex,
  VStack,
  FormControl,
  FormLabel,
  Input,
  RadioGroup,
  Radio,
  Select as ChakraSelect,
  Grid,
  Box,
  Text,
} from "@chakra-ui/react";
import React from "react";
import { Helmet } from "react-helmet-async";
import { NumericFormat } from "react-number-format";
import { primaryColor } from "../../../theme";
import { convertLevelEnToKo } from "../../../utils";
import { useNavigate, useParams } from "react-router-dom";
import { getProject } from "../../../api/projects";
import { IGetProject } from "../../../types/project";
import { useQuery } from "@tanstack/react-query";

export default function ProjectDetails() {
  const navigate = useNavigate();

  const { contractNumber } = useParams();

  const { isLoading, data } = useQuery<IGetProject, Error>({
    queryKey: ["project", contractNumber],
    queryFn: () => getProject(contractNumber!),
    enabled: contractNumber !== undefined,
  });

  return (
    <>
      <Helmet>
        <title>{`프로젝트 - ${contractNumber}`}</title>
      </Helmet>
      <Box marginBottom={1}>
        <Text fontWeight={"semibold"} fontSize={"2xl"}>
          프로젝트 정보
        </Text>
      </Box>
      <HStack justifyContent={"space-between"}>
        <Button
          variant={"ghost"}
          size={"sm"}
          colorScheme="teal"
          onClick={() => navigate(-1)}
        >
          이전으로
        </Button>
      </HStack>
      {
        <Skeleton isLoaded={!isLoading} height={"50%"} fadeDuration={1.6}>
          {data && data.ok && (
            <HStack marginTop={10}>
              <Flex w={"100%"}>
                <Box flex={1} w={"50%"} h={"100%"}>
                  <VStack p={2}>
                    <FormControl marginTop={2} isReadOnly isRequired>
                      <FormLabel>계약번호</FormLabel>
                      <Input
                        size="md"
                        type="text"
                        value={data?.data.contractNumber}
                        focusBorderColor={primaryColor}
                        userSelect={"none"}
                      />
                    </FormControl>

                    <FormControl marginTop={2} isRequired isReadOnly>
                      <FormLabel>원청</FormLabel>
                      <Input
                        size="md"
                        type="text"
                        value={data.data.contractor}
                        focusBorderColor={primaryColor}
                        userSelect={"none"}
                      />
                    </FormControl>

                    <FormControl marginTop={2} isRequired isReadOnly>
                      <FormLabel>부서</FormLabel>
                      <ChakraSelect
                        variant={"flushed"}
                        disabled
                        focusBorderColor={primaryColor}
                        value={data.data.departmentName}
                        userSelect={"none"}
                      >
                        <option>{data.data.departmentName}</option>
                      </ChakraSelect>
                    </FormControl>

                    <FormControl marginTop={2} isRequired isReadOnly>
                      <FormLabel>팀명</FormLabel>
                      <Input
                        size="md"
                        type="text"
                        value={data.data.teamName}
                        focusBorderColor={primaryColor}
                        userSelect={"none"}
                      />
                    </FormControl>

                    <FormControl marginTop={2} isRequired isReadOnly>
                      <FormLabel>상태</FormLabel>
                      <RadioGroup
                        defaultValue={data.data.projectStatus}
                        colorScheme={"teal"}
                        userSelect={"none"}
                      >
                        <HStack>
                          <Radio value={"YEAR"}>연간</Radio>
                          <Radio value={"SINGLE"}>단건</Radio>
                        </HStack>
                      </RadioGroup>
                    </FormControl>

                    <FormControl marginTop={2} isRequired isReadOnly>
                      <FormLabel>가동률</FormLabel>
                      <RadioGroup
                        defaultValue={data.data.operationRate}
                        colorScheme={"teal"}
                      >
                        <HStack>
                          <Radio value={"INCLUDE"}>포함</Radio>
                          <Radio value={"EXCEPT"}>제외</Radio>
                        </HStack>
                      </RadioGroup>
                    </FormControl>
                  </VStack>
                </Box>
                <Box flex={1} w={"50%"} h={"100%"}>
                  <VStack p={2}>
                    <Flex w={"100%"}>
                      <FormControl
                        marginTop={2}
                        marginRight={5}
                        isRequired
                        isReadOnly
                      >
                        <FormLabel>시작일</FormLabel>
                        <Input
                          size="md"
                          type="date"
                          value={data.data.startDate}
                          focusBorderColor={primaryColor}
                        />
                      </FormControl>

                      <FormControl marginTop={2} isRequired isReadOnly>
                        <FormLabel>종료일</FormLabel>
                        <Input
                          size="md"
                          type="date"
                          value={data.data.endDate}
                          focusBorderColor={primaryColor}
                        />
                      </FormControl>
                    </Flex>

                    <Box w={"100%"}>
                      <FormControl isRequired isReadOnly>
                        <FormLabel>설정단가</FormLabel>
                        <Grid
                          templateColumns={"repeat(4, 1fr)"}
                          gap={5}
                          w={"100%"}
                          marginTop={5}
                        >
                          {data.data.unitPrices.map((up) => {
                            return Object.entries(up).map((keyValue, index) => (
                              <Flex
                                key={index}
                                w={"100%"}
                                flexDirection={"column"}
                                border={"ButtonShadow"}
                                borderStyle={"groove"}
                                borderWidth={2}
                                borderRadius={5}
                                borderColor={primaryColor}
                                p={2}
                              >
                                <Box>
                                  <Text>{convertLevelEnToKo(keyValue[0])}</Text>
                                  <NumericFormat
                                    value={keyValue[1]}
                                    displayType="text"
                                    thousandSeparator={","}
                                    className="text-xl font-semibold"
                                  />
                                </Box>
                              </Flex>
                            ));
                          })}
                        </Grid>
                      </FormControl>
                    </Box>
                  </VStack>
                </Box>
              </Flex>
            </HStack>
          )}
        </Skeleton>
      }
    </>
  );
}
