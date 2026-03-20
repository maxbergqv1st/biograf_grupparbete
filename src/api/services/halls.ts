import type { AxiosResponse } from 'axios';
import { apiClient } from '../apiClient';
import type { HallDto, HallSummaryDto } from '../generated/models/hallDto';

export const getAllHalls = (): Promise<AxiosResponse<HallSummaryDto[]>> => {
  return apiClient.get('/halls');
};

export const getHall = (id: number): Promise<AxiosResponse<HallDto>> => {
  return apiClient.get(`/halls/${id}`);
};