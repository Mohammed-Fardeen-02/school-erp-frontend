import { apiClient } from '@/lib/api-client';
import type { ApiResponse } from '@/types/api.types';

export interface SystemHealthData {
  status: 'healthy' | 'degraded' | 'down';
  version: string;
  uptime: number;
}

export const httpService = {
  checkHealth: async (): Promise<ApiResponse<SystemHealthData>> => {
    return apiClient.get<ApiResponse<SystemHealthData>>('/health');
  },
};
