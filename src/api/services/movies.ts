import type { AxiosResponse } from 'axios';

import { apiClient } from '../apiClient';
import type {
  GetApiV2MoviesParams,
  MovieDto,
  MovieSummaryDto,
} from '../generated/models';

export const getAllMovies = (
  params?: GetApiV2MoviesParams,
): Promise<AxiosResponse<MovieSummaryDto[]>> => {
  return apiClient.get('/movies', { params });
};

export const getMovie = (id: number): Promise<AxiosResponse<MovieDto>> => {
  return apiClient.get(`/movies/${id}`);
};
