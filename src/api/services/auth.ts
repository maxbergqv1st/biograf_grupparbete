import type { AxiosResponse } from 'axios';

import { apiClient } from '../apiClient';
import type { LoginRequest, UserDto } from '../generated/models';

export type RegisterRequest = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
};

export const loginUser = (
  loginRequest: LoginRequest,
): Promise<AxiosResponse<UserDto>> => {
  return apiClient.post(`/auth/login`, loginRequest);
};

export const registerUser = (
  data: RegisterRequest,
): Promise<AxiosResponse<UserDto>> => {
  return apiClient.post(`/auth/register`, data);
};

export const logoutUser = (): Promise<AxiosResponse<unknown>> => {
  return apiClient.delete(`/auth/logout`);
};

export const refreshToken = (): Promise<AxiosResponse<UserDto>> => {
  return apiClient.post(`/auth/refresh`);
};

export const getMe = (): Promise<AxiosResponse<UserDto>> => {
  return apiClient.get(`/auth/me`);
};

export const verifyEmail = (
  token: string,
): Promise<AxiosResponse<{ message: string }>> => {
  return apiClient.post(`/auth/verify-email`, { token });
};

export const forgotPassword = (
  email: string,
): Promise<AxiosResponse<{ message: string }>> => {
  return apiClient.post(`/auth/forgot-password`, { email });
};

export const resetPassword = (
  token: string,
  newPassword: string,
): Promise<AxiosResponse<{ message: string }>> => {
  return apiClient.post(`/auth/reset-password`, { token, newPassword });
};

