import { axiosInstance } from './axios';

export interface LoginDto {
  email: string;
  password?: string;
}

export const authService = {
  login: (data: LoginDto) => axiosInstance.post('/auth/login', data).then((res: any) => res.data),
  loginResident: (data: LoginDto) => axiosInstance.post('/auth/login-resident', data).then((res: any) => res.data),
  register: (data: any) => axiosInstance.post('/auth/register-owner', data).then((res: any) => res.data),
};
