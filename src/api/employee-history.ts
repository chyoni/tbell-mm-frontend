import {
  ICompleteHistoryRes,
  ICreateEmployeeHistoryRes,
  IGetEmployeeHistories,
  ManMonth,
} from '../types/employee-history';
import { instance } from './instance';

export const addEmployeeHistory = (
  accessToken: string | null,
  refreshToken: string | null,
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
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Token': accessToken,
        },
      }
    )
    .then((res) => res.data);

export const getEmployeeHistory = (
  accessToken: string | null,
  refreshToken: string | null,
  page = 0,
  contractNumber?: string,
  year: string = new Date().getFullYear().toString(),
  employeeName?: string
): Promise<IGetEmployeeHistories> =>
  instance
    .get(`history`, {
      params: {
        page,
        contractNumber,
        ...(year && year !== undefined && year !== '' && { year }),
        ...(employeeName &&
          employeeName !== undefined &&
          employeeName !== '' && { employeeName }),
      },
      headers: { 'Access-Token': accessToken },
    })
    .then((res) => res.data);

export const saveHistoryManMonths = (
  accessToken: string | null,
  refreshToken: string | null,
  historyId: string,
  payload: ManMonth[]
): Promise<IGetEmployeeHistories> =>
  instance
    .post(`history/${historyId}/mms`, [...payload], {
      headers: {
        'Content-Type': 'application/json',
        'Access-Token': accessToken,
      },
    })
    .then((res) => res.data);

export const completeHistory = (
  accessToken: string | null,
  refreshToken: string | null,
  historyId: string,
  endDate: String
): Promise<ICompleteHistoryRes> =>
  instance
    .post(
      `history/${historyId}`,
      { endDate },
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Token': accessToken,
        },
      }
    )
    .then((res) => res.data);
