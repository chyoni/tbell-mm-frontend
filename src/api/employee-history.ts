import {
  ICreateEmployeeHistoryRes,
  IGetEmployeeHistories,
} from "../types/employee-history";
import { instance } from "./instance";

export const addEmployeeHistory = (
  employeeNumber: string,
  contractNumber: string,
  startDate: string,
  level: string
): Promise<ICreateEmployeeHistoryRes> =>
  instance
    .post(
      `history`,
      {
        employeeNumber,
        contractNumber,
        startDate,
        level,
      },
      { headers: { "Content-Type": "application/json" } }
    )
    .then((res) => res.data);

export const getEmployeeHistory = (
  contractNumber: string,
  year?: string,
  employeeName?: string
): Promise<IGetEmployeeHistories> =>
  instance
    .get(`history`, {
      params: {
        contractNumber,
        ...(year && year !== undefined && year !== "" && { year }),
        ...(employeeName &&
          employeeName !== undefined &&
          employeeName !== "" && { employeeName }),
      },
    })
    .then((res) => res.data);
