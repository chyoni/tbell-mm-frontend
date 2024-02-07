import { IResponse } from "./common";
import { IEmployee } from "./employee";
import { IGetData } from "./pagable";
import { IProject, IProjectNotPrices } from "./project";

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
  level: string;
  worth: number;
  mms: ManMonth[];
}

export interface IGetEmployeeHistories extends IResponse {
  data: IGetData<IEmployeeHistory>;
}
