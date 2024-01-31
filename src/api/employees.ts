import { IGetEmployees } from "../types/employee";
import { instance } from "./instance";

export const getEmployees = async (
  page: number,
  size: number,
  employeeName?: string
): Promise<IGetEmployees> =>
  instance
    .get("/employees", {
      params: {
        page,
        size,
        ...(employeeName !== undefined &&
          employeeName !== "" && { employeeName }),
      },
    })
    .then((res) => res.data);
