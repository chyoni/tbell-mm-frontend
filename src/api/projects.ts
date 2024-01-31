import {
  IEditProjectResponse,
  IGetProject,
  IGetProjects,
  IUnitPrice,
} from "../types/project";
import { instance } from "./instance";

export const getProjects = async (
  page: number,
  size: number,
  year?: string,
  teamName?: string
): Promise<IGetProjects> => {
  return instance
    .get("projects", {
      params: {
        page,
        size,
        ...(year !== undefined && year !== "" && { year }),
        ...(teamName !== undefined && teamName !== "" && { teamName }),
      },
    })
    .then((res) => res.data);
};

export const getProject = async (
  contractNumber: string
): Promise<IGetProject> =>
  instance.get(`projects/${contractNumber}`).then((res) => res.data);

export const editProject = async (
  contractNumber: string,
  teamName?: string,
  contractor?: string,
  startDate?: string,
  endDate?: string,
  projectStatus?: "YEAR" | "SINGLE",
  operationRate?: "INCLUDE" | "EXCEPT",
  departmentName?: string,
  unitPrices?: IUnitPrice[]
): Promise<IEditProjectResponse> =>
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
      { headers: { "Content-Type": "application/json" } }
    )
    .then((res) => res.data);
