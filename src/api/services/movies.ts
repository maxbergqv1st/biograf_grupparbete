import type { AxiosResponse } from 'axios';

import { apiClient } from '../apiClient';
import type {
  GetApiMoviesParams,
  MovieDto,
  MovieSummaryDto,
} from '../generated/models';

export const getAllMovies = (
  params?: GetApiMoviesParams,
): Promise<AxiosResponse<MovieSummaryDto[]>> => {
  return apiClient.get('/movies', { params });
};

export const getMovie = (id: number): Promise<AxiosResponse<MovieDto>> => {
  return apiClient.get(`/movies/${id}`);
};
