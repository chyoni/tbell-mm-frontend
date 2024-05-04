import {
  ICUDProjectResponse,
  IGetProject,
  IGetProjects,
  IUnitPrice,
} from '../types/project';
import { instance } from './instance';

export const getProjects = async (
  accessToken: string | null,
  refreshToken: string | null,
  page: number,
  size: number,
  year?: string,
  teamName?: string
): Promise<IGetProjects> => {
  return instance
    .get('projects', {
      headers: { 'Access-Token': accessToken },
      params: {
        page,
        size,
        ...(year !== undefined && year !== '' && { year }),
        ...(teamName !== undefined && teamName !== '' && { teamName }),
      },
    })
    .then((res) => res.data);
};

export const getProjectsForOptions = async (
  accessToken: string | null,
  refreshToken: string | null
) =>
  instance
    .get(`projects/options`, { headers: { 'Access-Token': accessToken } })
    .then((res) => res.data);

export const getProject = async (
  accessToken: string | null,
  refreshToken: string | null,
  contractNumber: string
): Promise<IGetProject> =>
  instance
    .get(`projects/${contractNumber}`, {
      headers: { 'Access-Token': accessToken },
    })
    .then((res) => res.data);

export const editProject = async (
  accessToken: string | null,
  refreshToken: string | null,
  contractNumber: string,
  teamName?: string,
  contractor?: string,
  startDate?: string,
  endDate?: string,
  projectStatus?: 'YEAR' | 'SINGLE',
  operationRate?: 'INCLUDE' | 'EXCEPT',
  departmentName?: string,
  unitPrices?: IUnitPrice[]
): Promise<ICUDProjectResponse> =>
  instance
    .put(
      `projects/${contractNumber}`,
      {
        ...(teamName !== undefined && { teamName }),
        ...(contractNumber !== undefined && { contractNumber }),
        ...(contractor !== undefined && { contractor }),
        ...(startDate !== undefined && { startDate }),
        ...(endDate !== undefined && { endDate }),
        ...(projectStatus !== undefined && { projectStatus }),
        ...(operationRate !== undefined && { operationRate }),
        ...(departmentName !== undefined && { departmentName }),
        ...(unitPrices !== undefined && { unitPrices }),
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Token': accessToken,
        },
      }
    )
    .then((res) => res.data);

export const createProject = async (
  accessToken: string | null,
  refreshToken: string | null,
  contractNumber: string,
  teamName: string,
  contractor: string,
  startDate: string,
  endDate: string,
  projectStatus: 'YEAR' | 'SINGLE',
  operationRate: 'INCLUDE' | 'EXCEPT',
  departmentName: string,
  unitPrices: IUnitPrice[]
): Promise<ICUDProjectResponse> =>
  instance
    .post(
      `projects`,
      {
        teamName,
        contractNumber,
        contractor,
        startDate,
        endDate,
        projectStatus,
        operationRate,
        departmentName,
        unitPrices,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Token': accessToken,
        },
      }
    )
    .then((res) => res.data);

export const deleteProject = async (
  accessToken: string | null,
  refreshToken: string | null,
  contractNumber: string
): Promise<ICUDProjectResponse> =>
  instance
    .delete(`projects/${contractNumber}`, {
      headers: { 'Access-Token': accessToken },
    })
    .then((res) => res.data);
