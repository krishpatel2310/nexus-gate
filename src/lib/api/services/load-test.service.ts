import { apiClient } from "../client";
import { API_CONFIG } from "../config";
import type { LoadTestConfig, LoadTestStatus, LoadTestResults } from "../types";

const BASE_URL = `${API_CONFIG.LOAD_TESTER_URL}/load-test`;

export const loadTestService = {
  // POST /load-test/start - Start a new load test
  start: async (config: LoadTestConfig): Promise<{ testId: string }> => {
    return apiClient.post<{ testId: string }>(`${BASE_URL}/start`, config);
  },

  // GET /load-test/status/{testId} - Get load test status
  getStatus: async (testId: string): Promise<LoadTestStatus> => {
    return apiClient.get<LoadTestStatus>(`${BASE_URL}/status/${testId}`);
  },

  // GET /load-test/results/{testId} - Get load test results
  getResults: async (testId: string): Promise<LoadTestResults> => {
    return apiClient.get<LoadTestResults>(`${BASE_URL}/results/${testId}`);
  },

  // DELETE /load-test/stop/{testId} - Stop a running load test
  stop: async (testId: string): Promise<void> => {
    return apiClient.delete<void>(`${BASE_URL}/stop/${testId}`);
  },

  // GET /load-test/health - Health check endpoint
  health: async (): Promise<{ status: string }> => {
    return apiClient.get<{ status: string }>(`${BASE_URL}/health`);
  },
};
