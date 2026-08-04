import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getProfile, createProfile, updateProfile } from './profileService';
import type { ProfileFormValues } from './schemas';

const PROFILE_QUERY_KEY = ['profile'];

export function useProfile() {
  return useQuery({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: getProfile
  });
}

export function useSaveProfile(mode: 'create' | 'edit') {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: ProfileFormValues) => (mode === 'create' ? createProfile(values) : updateProfile(values)),
    onSuccess: (data) => {
      queryClient.setQueryData(PROFILE_QUERY_KEY, data);
    }
  });
}
