import { instance } from "./instance";

export const getHistoryStatistics = (year: string) =>
  instance.get(`statistics/all`, { params: { year } }).then((res) => res.data);
