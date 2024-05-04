import {
  ICreateEmployeeRes,
  IGetEmployee,
  IGetEmployees,
} from '../types/employee';
import { instance } from './instance';

export const getEmployees = async (
  accessToken: string | null,
  refreshToken: string | null,
  page: number,
  size: number,
  name?: string,
  employeeNumber?: string,
  startDate?: string
): Promise<IGetEmployees> =>
  instance
    .get('employees', {
      headers: { 'Access-Token': accessToken },
      params: {
        page,
        size,
        ...(name !== undefined && name !== '' && { name }),
        ...(employeeNumber !== undefined &&
          employeeNumber !== '' && { employeeNumber }),
        ...(startDate !== undefined && startDate !== '' && { startDate }),
      },
    })
    .then((res) => res.data);

export const deleteEmployee = async (
  accessToken: string | null,
  refreshToken: string | null,
  employeeNumber: string
): Promise<IGetEmployee> =>
  instance
    .delete(`employees/${employeeNumber}`, {
      headers: { 'Access-Token': accessToken },
    })
    .then((res) => res.data);

export const createEmployee = async (
  accessToken: string | null,
  refreshToken: string | null,
  employeeNumber: string,
  name: string,
  startDate: string,
  resignationDate?: string
): Promise<ICreateEmployeeRes> =>
  instance
    .post(
      `employees`,
      {
        employeeNumber,
        name,
        startDate,
        ...(resignationDate && resignationDate !== '' && { resignationDate }),
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Token': accessToken,
        },
      }
    )
    .then((res) => res.data);

export const getEmployeeByEmployeeNumber = async (
  accessToken: string | null,
  refreshToken: string | null,
  employeeNumber: string
): Promise<IGetEmployee> =>
  instance
    .get(`employees/${employeeNumber}`, {
      headers: { 'Access-Token': accessToken },
    })
    .then((res) => res.data);

export const editEmployeeByEmployeeNumber = async (
  accessToken: string | null,
  refreshToken: string | null,
  employeeNumber: string,
  name: string,
  startDate: string,
  resignationDate: string
): Promise<IGetEmployee> =>
  instance
    .put(
      `employees/${employeeNumber}`,
      {
        employeeNumber,
        name,
        startDate,
        ...(resignationDate && resignationDate !== '' && { resignationDate }),
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Token': accessToken,
        },
      }
    )
    .then((res) => res.data);
