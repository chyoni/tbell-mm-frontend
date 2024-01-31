import { IResponse } from "./common";
import { IGetData } from "./pagable";

export interface IGetProjects extends IResponse {
  data: IGetData<IProject>;
}

export interface IGetProject extends IResponse {
  data: IProject;
}

export interface IProject {
  contractNumber: string;
  teamName: string;
  contractor: string;
  startDate: string;
  endDate: string;
  projectStatus: "YEAR" | "SINGLE";
  operationRate: "INCLUDE" | "EXCEPT";
  departmentName: string;
  unitPrices: IUnitPrice[];
}

export interface IUnitPrice {
  [key: string]: number;
}

export interface IEditOrCreateProjectResponse extends IResponse {
  data: IProject;
}

export interface IEditProjectPayload {
  contractNumber: string;
  teamName?: string;
  contractor?: string;
  startDate?: string;
  endDate?: string;
  projectStatus?: "YEAR" | "SINGLE";
  operationRate?: "INCLUDE" | "EXCEPT";
  departmentName?: string;
  unitPrices?: IUnitPrice[];
}

export interface ICreateProjectPayload {
  contractNumber: string;
  teamName: string;
  contractor: string;
  startDate: string;
  endDate: string;
  projectStatus: "YEAR" | "SINGLE";
  operationRate: "INCLUDE" | "EXCEPT";
  departmentName: string;
  unitPrices: IUnitPrice[];
}
