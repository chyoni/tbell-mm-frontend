import {
  ICreateEmployeeRes,
  IGetEmployee,
  IGetEmployees,
} from "../types/employee";
import { instance } from "./instance";

export const getEmployees = async (
  page: number,
  size: number,
  employeeName?: string
): Promise<IGetEmployees> =>
  instance
    .get("employees", {
      params: {
        page,
        size,
        ...(employeeName !== undefined &&
          employeeName !== "" && { employeeName }),
      },
    })
    .then((res) => res.data);

export const deleteEmployee = async (
  employeeNumber: string
): Promise<IGetEmployee> =>
  instance.delete(`employees/${employeeNumber}`).then((res) => res.data);

export const createEmployee = async (
  employeeNumber: string,
  name: string,
  startDate: string,
  resignationDate?: string
): Promise<ICreateEmployeeRes> =>
  instance
    .post(
      `employees`,
      {
        employeeNumber,
        name,
        startDate,
        ...(resignationDate && resignationDate !== "" && { resignationDate }),
      },
      { headers: { "Content-Type": "application/json" } }
    )
    .then((res) => res.data);
