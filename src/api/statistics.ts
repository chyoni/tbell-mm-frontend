import {
  IGetContractStatisticsRes,
  IGetStatisticsRes,
} from '../types/statistics';
import { instance } from './instance';

export const getHistoryStatistics = (
  accessToken: string | null,
  refreshToken: string | null,
  year: string
): Promise<IGetStatisticsRes> =>
  instance
    .get(`statistics/all`, {
      params: { year },
      headers: { 'Access-Token': accessToken },
    })
    .then((res) => res.data);

export const getContractHistory = (
  accessToken: string | null,
  refreshToken: string | null,
  contractNumber: string,
  year: string = new Date().getFullYear().toString(),
  total: boolean = false
): Promise<IGetContractStatisticsRes> =>
  instance
    .get(`statistics/${contractNumber}`, {
      params: { year, total },
      headers: { 'Access-Token': accessToken },
    })
    .then((res) => res.data);
