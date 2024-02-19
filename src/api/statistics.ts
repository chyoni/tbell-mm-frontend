import { IGetStatisticsRes } from '../types/statistics';
import { instance } from './instance';

export const getHistoryStatistics = (
  year: string
): Promise<IGetStatisticsRes> =>
  instance.get(`statistics/all`, { params: { year } }).then((res) => res.data);
