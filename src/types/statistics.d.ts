import { IResponse } from "./common";

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

export interface IGetContractStatisticsRes extends IResponse {
  data: IGetContractStatistics[];
}

export interface IGetContractStatistics extends IGetStatistics {
  contractNumber: string;
  teamName: string;
}
