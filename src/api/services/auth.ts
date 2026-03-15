import type { AxiosResponse } from 'axios';

import { apiClient } from '../apiClient';
import type { LoginRequest, UserDto } from '../generated/models';

export const loginUser = (
  loginRequest: LoginRequest,
): Promise<AxiosResponse<UserDto>> => {
  return apiClient.post(`/api/auth/login`, loginRequest);
};

export const logoutUser = (): Promise<AxiosResponse<unknown>> => {
  return apiClient.delete(`/api/auth/logout`);
};

export const refreshToken = (): Promise<AxiosResponse<UserDto>> => {
  return apiClient.post(`/api/auth/refresh`);
};

export const getMe = (): Promise<AxiosResponse<UserDto>> => {
  return apiClient.get(`/api/auth/me`);
};
