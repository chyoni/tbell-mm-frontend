import { IResponse } from './common';

export interface IGetStatisticsRes extends IResponse {
  data: IGetStatistics[];
}

export interface IGetStatistics {
  month: number;
  totalInputManMonth: number | null;
  totalInputPrice: number | null;
  totalCalculateManMonth: number | null;
  totalCalculatePrice: number | null;
}
