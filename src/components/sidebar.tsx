import {
  Box,
  Flex,
  Icon,
  ScaleFade,
  Skeleton,
  Text,
  VStack,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import {
  FaCirclePlus,
  FaFlipboard,
  FaListOl,
  FaTableCells,
  FaDiagramProject,
  FaDiagramNext,
} from "react-icons/fa6";
import { IoCellularSharp } from "react-icons/io5";
import { HiUser } from "react-icons/hi2";
import { ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Link, useLocation } from "react-router-dom";

enum Title {
  Dashboard,
  StatisticsProject,
  StatisticsEmployee,
  Departments,
  RegisterDepartment,
  Projects,
  RegisterProject,
  Employees,
  RegisterEmployee,
  Edit,
  NoTitle,
}

export default function Sidebar() {
  const url = useLocation();

  const [currentTitle, setCurrentTitle] = useState<Title>(
    url.pathname === "/"
      ? Title.Dashboard
      : url.pathname === "/statistics/projects"
      ? Title.StatisticsProject
      : url.pathname === "/statistics/employee"
      ? Title.StatisticsEmployee
      : url.pathname === "/projects"
      ? Title.Projects
      : url.pathname === "/projects/register"
      ? Title.RegisterProject
      : url.pathname === "/departments"
      ? Title.Departments
      : url.pathname === "/departments/register"
      ? Title.RegisterDepartment
      : url.pathname === "/employees"
      ? Title.Employees
      : url.pathname === "/employees/register"
      ? Title.RegisterEmployee
      : Title.NoTitle
  );

  const [isManageDepartmentOpen, setIsManageDepartmentOpen] = useState<boolean>(
    currentTitle === Title.Departments ||
      currentTitle === Title.RegisterDepartment
  );

  const [isManageProjectsOpen, setIsManageProjectsOpen] = useState<boolean>(
    currentTitle === Title.Projects || currentTitle === Title.RegisterProject
  );
  const [isManagementEmployeesOpen, setIsManagementEmployeesOpen] =
    useState<boolean>(
      currentTitle === Title.Employees ||
        currentTitle === Title.RegisterEmployee
    );

  useEffect(() => {
    setCurrentTitle(
      url.pathname === "/"
        ? Title.Dashboard
        : url.pathname === "/statistics/projects"
        ? Title.StatisticsProject
        : url.pathname === "/statistics/employee"
        ? Title.StatisticsEmployee
        : url.pathname === "/projects"
        ? Title.Projects
        : url.pathname === "/projects/register"
        ? Title.RegisterProject
        : url.pathname === "/departments"
        ? Title.Departments
        : url.pathname === "/departments/register"
        ? Title.RegisterDepartment
        : url.pathname === "/employees"
        ? Title.Employees
        : url.pathname === "/employees/register"
        ? Title.RegisterEmployee
        : Title.NoTitle
    );
  }, [url.pathname]);

  return (
    <Skeleton
      width={"16rem"}
      isLoaded={true}
      height={"100vh"}
      position={"fixed"}
      top={0}
      left={0}
    >
      <Box
        userSelect={"none"}
        position={"fixed"}
        top={"14"}
        left={0}
        zIndex={40}
        w={"16rem"}
        height={"100vh"}
        className="transition-transform -translate-x-full sm:translate-x-0"
      >
        <Box
          h={"full"}
          px={3}
          py={4}
          overflowY={"auto"}
          borderRightStyle={"groove"}
          borderRightWidth={1}
        >
          <VStack spacing={2} fontWeight={"medium"}>
            <Link
              to={"/"}
              onClick={() => setCurrentTitle(Title.Dashboard)}
              className={
                currentTitle === Title.Dashboard
                  ? "flex p-2 w-full items-center rounded-lg group text-teal-500 pointer-events-none"
                  : "flex p-2 w-full items-center rounded-lg group hover:bg-teal-600 hover:text-teal-200"
              }
            >
              <Icon as={FaFlipboard} />
              <Text ml={3}>대시보드</Text>
            </Link>

            <Link
              to={"/statistics/projects"}
              onClick={() => setCurrentTitle(Title.StatisticsProject)}
              className={
                currentTitle === Title.StatisticsProject
                  ? "flex p-2 w-full items-center rounded-lg group text-teal-500 pointer-events-none"
                  : "flex p-2 w-full items-center rounded-lg group hover:bg-teal-600 hover:text-teal-200"
              }
            >
              <Icon as={FaTableCells} />
              <Text ml={3}>프로젝트 별 사원 투입현황</Text>
            </Link>

            <Link
              to={"/statistics/employee"}
              onClick={() => setCurrentTitle(Title.StatisticsEmployee)}
              className={
                currentTitle === Title.StatisticsEmployee
                  ? "flex p-2 w-full items-center rounded-lg group text-teal-500 pointer-events-none"
                  : "flex p-2 w-full items-center rounded-lg group hover:bg-teal-600 hover:text-teal-200"
              }
            >
              <Icon as={IoCellularSharp} />
              <Text ml={3}>사원별 프로젝트 수행현황</Text>
            </Link>

            <VStack w={"full"}>
              <Flex
                onClick={() => setIsManageDepartmentOpen((prev) => !prev)}
                cursor={"pointer"}
                alignItems={"center"}
                justifyContent={"space-between"}
                w={"full"}
                p={2}
                fontSize={"1rem"}
                lineHeight={"1.5rem"}
                rounded={"lg"}
                className=" transition duration-75 group hover:bg-teal-600 hover:text-teal-200"
              >
                <Flex alignItems={"center"}>
                  <Icon as={FaDiagramNext} />
                  <Text ml={3} textAlign={"left"} whiteSpace={"nowrap"}>
                    부서 관리
                  </Text>
                </Flex>
                {isManageDepartmentOpen ? (
                  <ChevronUpIcon />
                ) : (
                  <ChevronDownIcon />
                )}
              </Flex>
              {isManageDepartmentOpen && (
                <ScaleFade
                  in={isManageDepartmentOpen}
                  initialScale={0.9}
                  className="w-full"
                >
                  <VStack spacing={2} pl={6}>
                    <Link
                      to={"/departments"}
                      onClick={() => setCurrentTitle(Title.Departments)}
                      className={
                        currentTitle === Title.Departments
                          ? "flex p-2 w-full items-center rounded-lg group text-teal-500 pointer-events-none"
                          : "flex p-2 w-full items-center rounded-lg group hover:bg-teal-600 hover:text-teal-200"
                      }
                    >
                      <Icon as={FaListOl} />
                      <Text ml={3}>부서 리스트</Text>
                    </Link>
                    <Link
                      to={"/departments/register"}
                      onClick={() => setCurrentTitle(Title.RegisterDepartment)}
                      className={
                        currentTitle === Title.RegisterDepartment
                          ? "flex p-2 w-full items-center rounded-lg group text-teal-500 pointer-events-none"
                          : "flex p-2 w-full items-center rounded-lg group hover:bg-teal-600 hover:text-teal-200"
                      }
                    >
                      <Icon as={FaCirclePlus} />
                      <Text ml={3}>부서 등록</Text>
                    </Link>
                  </VStack>
                </ScaleFade>
              )}

              <Flex
                onClick={() => setIsManageProjectsOpen((prev) => !prev)}
                cursor={"pointer"}
                alignItems={"center"}
                justifyContent={"space-between"}
                w={"full"}
                p={2}
                fontSize={"1rem"}
                lineHeight={"1.5rem"}
                rounded={"lg"}
                className=" transition duration-75 group hover:bg-teal-600 hover:text-teal-200"
              >
                <Flex alignItems={"center"}>
                  <Icon as={FaDiagramProject} />
                  <Text ml={3} textAlign={"left"} whiteSpace={"nowrap"}>
                    프로젝트 관리
                  </Text>
                </Flex>
                {isManageProjectsOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
              </Flex>
              {isManageProjectsOpen && (
                <ScaleFade
                  in={isManageProjectsOpen}
                  initialScale={0.9}
                  className="w-full"
                >
                  <VStack spacing={2} pl={6}>
                    <Link
                      to={"/projects"}
                      onClick={() => setCurrentTitle(Title.Projects)}
                      className={
                        currentTitle === Title.Projects
                          ? "flex p-2 w-full items-center rounded-lg group text-teal-500 pointer-events-none"
                          : "flex p-2 w-full items-center rounded-lg group hover:bg-teal-600 hover:text-teal-200"
                      }
                    >
                      <Icon as={FaListOl} />
                      <Text ml={3}>프로젝트 리스트</Text>
                    </Link>
                    <Link
                      to={"/projects/register"}
                      onClick={() => setCurrentTitle(Title.RegisterProject)}
                      className={
                        currentTitle === Title.RegisterProject
                          ? "flex p-2 w-full items-center rounded-lg group text-teal-500 pointer-events-none"
                          : "flex p-2 w-full items-center rounded-lg group hover:bg-teal-600 hover:text-teal-200"
                      }
                    >
                      <Icon as={FaCirclePlus} />
                      <Text ml={3}>프로젝트 등록</Text>
                    </Link>
                  </VStack>
                </ScaleFade>
              )}

              <Flex
                onClick={() => setIsManagementEmployeesOpen((prev) => !prev)}
                cursor={"pointer"}
                alignItems={"center"}
                justifyContent={"space-between"}
                w={"full"}
                p={2}
                fontSize={"1rem"}
                lineHeight={"1.5rem"}
                rounded={"lg"}
                className=" transition duration-75 group hover:bg-teal-600 hover:text-teal-200"
              >
                <Flex alignItems={"center"}>
                  <Icon as={HiUser} />
                  <Text ml={3} textAlign={"left"} whiteSpace={"nowrap"}>
                    사원 관리
                  </Text>
                </Flex>
                {isManagementEmployeesOpen ? (
                  <ChevronUpIcon />
                ) : (
                  <ChevronDownIcon />
                )}
              </Flex>
              {isManagementEmployeesOpen && (
                <ScaleFade
                  in={isManagementEmployeesOpen}
                  initialScale={0.9}
                  className="w-full"
                >
                  <VStack spacing={2} pl={6}>
                    <Link
                      to={"/employees"}
                      onClick={() => setCurrentTitle(Title.Employees)}
                      className={
                        currentTitle === Title.Employees
                          ? "flex p-2 w-full items-center rounded-lg group text-teal-500 pointer-events-none"
                          : "flex p-2 w-full items-center rounded-lg group hover:bg-teal-600 hover:text-teal-200"
                      }
                    >
                      <Icon as={FaListOl} />
                      <Text ml={3}>사원 리스트</Text>
                    </Link>
                    <Link
                      to={"/employees/register"}
                      onClick={() => setCurrentTitle(Title.RegisterEmployee)}
                      className={
                        currentTitle === Title.RegisterEmployee
                          ? "flex p-2 w-full items-center rounded-lg group text-teal-500 pointer-events-none"
                          : "flex p-2 w-full items-center rounded-lg group hover:bg-teal-600 hover:text-teal-200"
                      }
                    >
                      <Icon as={FaCirclePlus} />
                      <Text ml={3}>사원 등록</Text>
                    </Link>
                  </VStack>
                </ScaleFade>
              )}
            </VStack>
          </VStack>
        </Box>
      </Box>
    </Skeleton>
  );
}
