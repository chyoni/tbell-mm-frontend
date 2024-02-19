import { IGetStatistics } from '../types/statistics';
import { instance } from './instance';

export const getHistoryStatistics = (year: string): Promise<IGetStatistics> =>
  instance.get(`statistics/all`, { params: { year } }).then((res) => res.data);
