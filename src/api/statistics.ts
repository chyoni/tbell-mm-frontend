import {
  IGetContractStatisticsRes,
  IGetStatisticsRes,
} from "../types/statistics";
import { instance } from "./instance";

export const getHistoryStatistics = (
  year: string
): Promise<IGetStatisticsRes> =>
  instance.get(`statistics/all`, { params: { year } }).then((res) => res.data);

export const getContractHistory = (
  contractNumber: string,
  year: string = new Date().getFullYear().toString(),
  total: boolean = false
): Promise<IGetContractStatisticsRes> =>
  instance
    .get(`statistics/${contractNumber}`, { params: { year, total } })
    .then((res) => res.data);
