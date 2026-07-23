import { mongoApi } from '../../../shared/api/api';

export const getDashboardStats = () => mongoApi.get('/api/v1/reports/my-stats');
