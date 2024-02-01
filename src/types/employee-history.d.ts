import { IResponse } from "./common";
import { IEmployee } from "./employee";
import { IProject } from "./project";

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
