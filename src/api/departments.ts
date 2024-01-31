import { instance } from "./instance";

export const getDepartments = async () =>
  instance.get("departments").then((res) => res.data);
