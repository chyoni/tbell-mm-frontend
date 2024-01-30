import { IGetProject, IGetProjects } from './../types/project.d';
import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  withCredentials: false,
});

export const getProjects = async (
  page: number,
  size: number,
  year?: string,
  teamName?: string
): Promise<IGetProjects> => {
  return instance
    .get('projects', {
      params: {
        page,
        size,
        ...(year !== undefined && year !== '' && { year }),
        ...(teamName !== undefined && teamName !== '' && { teamName }),
      },
    })
    .then((res) => res.data);
};

export const getProject = async (
  contractNumber: string | undefined
): Promise<IGetProject> =>
  instance.get(`projects/${contractNumber}`).then((res) => res.data);

export const getDepartments = async () =>
  instance.get('departments').then((res) => res.data);
