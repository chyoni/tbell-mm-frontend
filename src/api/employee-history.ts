import {
  ICompleteHistoryRes,
  ICreateEmployeeHistoryRes,
  IGetEmployeeHistories,
  ManMonth,
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
  year: string = new Date().getFullYear().toString(),
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

export const saveHistoryManMonths = (
  historyId: string,
  payload: ManMonth[]
): Promise<IGetEmployeeHistories> =>
  instance
    .post(`history/${historyId}/mms`, [...payload], {
      headers: { "Content-Type": "application/json" },
    })
    .then((res) => res.data);

export const completeHistory = (
  historyId: string,
  endDate: String
): Promise<ICompleteHistoryRes> =>
  instance
    .post(
      `history/${historyId}`,
      { endDate },
      {
        headers: { "Content-Type": "application/json" },
      }
    )
    .then((res) => res.data);
