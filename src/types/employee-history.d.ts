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

export interface IEmployeeHistory {
  id: number;
  employee: IEmployee;
  project: IProjectNotPrices;
  startDate: string;
  level: string;
  worth: number;
}

export interface IGetEmployeeHistories extends IResponse {
  data: IGetData<IEmployeeHistory>;
}
