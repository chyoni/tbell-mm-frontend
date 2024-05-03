import axios from "axios";

export const instance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  withCredentials: true,
});

export const loginInstance = axios.create({
  baseURL: process.env.REACT_APP_LOGIN_URL,
  withCredentials: true,
});
