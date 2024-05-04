import { ICRUDDepartmentRes, IGetDepartments } from '../types/department';
import { instance } from './instance';

export const getDepartments = async (
  accessToken: string | null,
  refreshToken: string | null,
  page: number = 0,
  size: number = 100,
  departmentName?: string
): Promise<IGetDepartments> =>
  instance
    .get('departments', {
      headers: { 'Access-Token': accessToken },
      params: {
        page,
        size,
        ...(departmentName !== undefined &&
          departmentName !== '' && { departmentName }),
      },
    })
    .then((res) => res.data);

export const deleteDepartment = async (
  accessToken: string | null,
  refreshToken: string | null,
  departmentName: string
): Promise<ICRUDDepartmentRes> =>
  instance
    .delete(`departments/${departmentName}`, {
      headers: { 'Access-Token': accessToken },
    })
    .then((res) => res.data);

export const editDepartment = async (
  accessToken: string | null,
  refreshToken: string | null,
  departmentName: string,
  updateDepartmentName: string
): Promise<ICRUDDepartmentRes> =>
  instance
    .put(
      `departments/${departmentName}`,
      { name: updateDepartmentName },
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Token': accessToken,
        },
      }
    )
    .then((res) => res.data);

export const createDepartment = async (
  accessToken: string | null,
  refreshToken: string | null,
  name: string
): Promise<ICRUDDepartmentRes> =>
  instance
    .post(
      `departments`,
      { name },
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Token': accessToken,
        },
      }
    )
    .then((res) => res.data);
