import { IResponse } from './common';
import { IGetData } from './pagable';

export interface IGetDepartments extends IResponse {
  data: IGetData<IDepartment>;
}

export interface IDepartment {
  [name: string];
}
