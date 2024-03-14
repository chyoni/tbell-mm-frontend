import {
  Button,
  Flex,
  HStack,
  Icon,
  IconButton,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Text,
  useToast,
} from "@chakra-ui/react";
import React from "react";
import {
  FaAngleLeft,
  FaAngleRight,
  FaAnglesLeft,
  FaAnglesRight,
  FaEllipsis,
} from "react-icons/fa6";
import { primaryColor } from "../theme";

interface IPagination {
  page: number;
  totalPages: number;
  goToFirstPage: () => void;
  goToLastPage: (lastPage: number) => void;
  goToPrevPage: () => void;
  goToNextPage: () => void;
  goToSpecificPage: (page: number) => void;
}

export default function Pagination({
  page,
  totalPages,
  goToFirstPage,
  goToLastPage,
  goToPrevPage,
  goToNextPage,
  goToSpecificPage,
}: IPagination) {
  const lastPage = totalPages;
  // total < 10 ? 0 : total % 10 === 0 ? total / 10 : Math.floor(total / 10 + 1);
  const toast = useToast();
  let viewPage = page + 1;

  const handleNavigatePage = (valueAsString: string) => {
    console.log(valueAsString);
    if (valueAsString === "") return;
    if (lastPage < +valueAsString) {
      toast({
        title: `마지막 페이지는 ${lastPage} 페이지 입니다.`,
        description: "페이지 번호를 마지막 페이지보다 낮거나 같게 설정하세요.",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    goToSpecificPage(+valueAsString);
  };

  return (
    <Flex justifyContent={"space-between"}>
      {/* << < 버튼 */}
      <HStack spacing={"2"}>
        <IconButton
          size={{ sm: "xs", md: "xs", lg: "xs", "2xl": "md" }}
          isDisabled={page === 0}
          colorScheme="teal"
          onClick={goToFirstPage}
          aria-label={"First Page"}
          icon={<FaAnglesLeft />}
        />
        <IconButton
          size={{ sm: "xs", md: "xs", lg: "xs", "2xl": "md" }}
          isDisabled={page === 0}
          colorScheme="teal"
          onClick={goToPrevPage}
          aria-label={"Prev Page"}
          icon={<FaAngleLeft />}
        />
      </HStack>

      {/* 가운데 번호 버튼 */}
      <HStack mx={1}>
        {lastPage !== 0 && page + 1 !== lastPage && (
          <Button
            size={{ sm: "xs", md: "xs", lg: "xs", "2xl": "md" }}
            isDisabled={page !== lastPage}
            onClick={goToPrevPage}
            colorScheme={"teal"}
            variant={page + 1 === lastPage ? "outline" : "solid"}
          >
            {viewPage}
          </Button>
        )}
        <Icon as={FaEllipsis} w={10} h={5} />
        {lastPage !== 0 && (
          <Button
            size={{ sm: "xs", md: "xs", lg: "xs", "2xl": "md" }}
            isDisabled={page + 1 === lastPage || lastPage === 0}
            onClick={() => goToLastPage(lastPage - 1)}
            colorScheme={"teal"}
            variant={page + 1 === lastPage ? "solid" : "outline"}
          >
            {lastPage}
          </Button>
        )}

        {/* {lastPage !== 0 && (
          <HStack>
            <Text
              display={{
                sm: "none",
                md: "none",
                lg: "none",
                "2xl": "none",
                "3xl": "flex",
              }}
            >
              Go to
            </Text>
            <NumberInput
              onChange={handleNavigatePage}
              value={page}
              min={1}
              max={lastPage}
              clampValueOnBlur={false}
              borderColor={"gray"}
              focusBorderColor={primaryColor}
            >
              <NumberInputField width={"16"} fontSize={"x-small"} />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </HStack>
        )} */}
      </HStack>

      {/* >> > 버튼 */}
      <HStack>
        <IconButton
          size={{ sm: "xs", md: "xs", lg: "xs", "2xl": "md" }}
          isDisabled={lastPage === 0 || page + 1 === lastPage}
          onClick={goToNextPage}
          aria-label={"Next Page"}
          colorScheme="teal"
          icon={<FaAngleRight />}
        />
        <IconButton
          size={{ sm: "xs", md: "xs", lg: "xs", "2xl": "md" }}
          isDisabled={lastPage === 0 || page + 1 === lastPage}
          onClick={() => goToLastPage(lastPage - 1)}
          aria-label={"Last Page"}
          colorScheme="teal"
          icon={<FaAnglesRight />}
        />
      </HStack>
    </Flex>
  );
}
