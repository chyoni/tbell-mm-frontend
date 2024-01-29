import { IGetProjects } from './../types/project.d';
import { QueryFunctionContext } from '@tanstack/react-query';
import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  withCredentials: false,
});

/* export const getProjects = async ({
  queryKey,
}: QueryFunctionContext): Promise<IGetProjects> => {
  const [, page, size, year, teamName] = queryKey;
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
}; */

export const getProjects = async (
  page: number,
  size: number
): Promise<IGetProjects> => {
  return instance
    .get('projects', {
      params: {
        page,
        /* size,
        ...(year !== undefined && year !== '' && { year }),
        ...(teamName !== undefined && teamName !== '' && { teamName }), */
      },
    })
    .then((res) => res.data);
};
