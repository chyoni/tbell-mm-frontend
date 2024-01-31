import { ICRUDDepartmentRes, IGetDepartments } from "../types/department";
import { instance } from "./instance";

export const getDepartments = async (
  page: number = 0,
  size: number = 100,
  departmentName?: string
): Promise<IGetDepartments> =>
  instance
    .get("departments", {
      params: {
        page,
        size,
        ...(departmentName !== undefined &&
          departmentName !== "" && { departmentName }),
      },
    })
    .then((res) => res.data);

export const deleteDepartment = async (
  departmentName: string
): Promise<ICRUDDepartmentRes> =>
  instance.delete(`departments/${departmentName}`).then((res) => res.data);

export const editDepartment = async (
  departmentName: string,
  updateDepartmentName: string
): Promise<ICRUDDepartmentRes> =>
  instance
    .put(
      `departments/${departmentName}`,
      { name: updateDepartmentName },
      { headers: { "Content-Type": "application/json" } }
    )
    .then((res) => res.data);

export const createDepartment = async (
  name: string
): Promise<ICRUDDepartmentRes> =>
  instance
    .post(
      `departments`,
      { name },
      { headers: { "Content-Type": "application/json" } }
    )
    .then((res) => res.data);
