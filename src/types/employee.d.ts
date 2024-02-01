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

export interface IGetEmployee extends IResponse {
  data: IEmployee;
}

export interface ICreateEmployeeRes extends IResponse {
  data: { employeeNumber: string; name: string };
}
