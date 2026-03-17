import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { getMe, loginUser, logoutUser } from '../services/auth';

export const authKeys = {
  me: ['auth', 'me'] as const,
};

export function useGetMe() {
  return useQuery({
    queryKey: authKeys.me,
    queryFn: () => getMe(),
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: loginUser,
    onSuccess: (res) => {
      queryClient.setQueryData([...authKeys.me], res);
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: [...authKeys.me] });
    },
  });
}
