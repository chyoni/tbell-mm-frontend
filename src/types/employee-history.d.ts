import { IResponse } from './common';
import { IEmployee } from './employee';
import { IGetData } from './pagable';
import { IProject, IProjectNotPrices } from './project';

export interface ICreateEmployeeHistoryRes extends IResponse {
  data: {
    id: number;
    employee: IEmployee;
    project: IProject;
    startDate: string;
    level: string;
    worth: number;
  };
}

export interface ManMonth {
  id: number;
  year: number;
  month: number;
  durationStart: string;
  durationEnd: string;
  inputManMonth: string;
  monthSalary?: number;
  inputPrice?: number;
  calculateManMonth?: string;
  calculateLevel: string;
  calculatePrice?: number;
  plPrice?: number;
}

export interface IEmployeeHistory {
  id: number;
  employee: IEmployee;
  project: IProjectNotPrices;
  startDate: string;
  endDate?: string;
  level: string;
  worth: number;
  mms: ManMonth[];
}

export interface IGetEmployeeHistories extends IResponse {
  data: IGetData<IEmployeeHistory>;
}

export interface IAddHistoryManMonthPayload {
  accessToken: string | null;
  refreshToken: string | null;
  historyId: string;
  payload: ManMonth[];
}

export interface ICompleteHistoryPayload {
  accessToken: string | null;
  refreshToken: string | null;
  historyId: string;
  endDate: string;
}

export interface ICompleteHistoryRes extends IResponse {
  data: {
    id: number;
    employee: {
      employeeNumber: string;
      name: string;
      startDate: string;
      endDate?: string;
    };
    startDate: string;
    endDate: string;
  };
}
