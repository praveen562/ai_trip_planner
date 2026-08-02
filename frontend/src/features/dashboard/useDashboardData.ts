import { useQuery } from '@tanstack/react-query';
import { getDashboardData } from './dashboardService';

export function useDashboardData() {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: getDashboardData
  });
}
