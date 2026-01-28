import { DashboardData } from ".";

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T
}

export type DashboardResponse = ApiResponse<DashboardData>; 