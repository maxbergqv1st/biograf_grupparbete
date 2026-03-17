import type { AxiosResponse } from 'axios';

import { apiClient } from '../apiClient';
import type { ScreeningDto } from '../generated/models';



export const getScreening = (
  id: number,
): Promise<AxiosResponse<ScreeningDto>> => {
  return apiClient.get(`/screenings/${id}`);
};

export const getScreeningsByMovieId = (
  movieId: number,
): Promise<AxiosResponse<ScreeningDto[]>> => {
  return apiClient.get(`/screenings/by-movie-id/${movieId}`);
};
