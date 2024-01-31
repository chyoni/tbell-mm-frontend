import { instance } from "./instance";

export const getDepartments = async (
  page: number = 0,
  size: number = 100,
  departmentName?: string
) =>
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

export const deleteDepartment = async (departmentName: string) =>
  instance.delete(`departments/${departmentName}`).then((res) => res.data);
