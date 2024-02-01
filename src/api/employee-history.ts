import { ICreateEmployeeHistoryRes } from "../types/employee-history";
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
