import { loginInstance } from './instance';

export const logAdminIn = async (username: string, password: string) => {
  const formData = new FormData();
  formData.append('username', username);
  formData.append('password', password);

  return loginInstance
    .post(`login`, formData)
    .then((res) => res)
    .catch((error) => {
      console.log(error);
      return error;
    });
};
