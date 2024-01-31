import { IResponse } from "./common";
import { IGetData } from "./pagable";

export interface IEmployee {
  employeeNumber: string;
  name: string;
  startDate: string;
  resignationDate?: string;
}

export interface IGetEmployees extends IResponse {
  data: IGetData<IEmployee>;
}
