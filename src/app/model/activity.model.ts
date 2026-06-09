

export type ActivityType = 'SPORT' | 'HYDRATATION';

export interface Activity {
  id: number;
  name: string;
  type: ActivityType;
  value: number;
  createdAt: string;
}
