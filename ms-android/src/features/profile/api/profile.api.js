import { mongoApi } from '../../../shared/api/api';

export const getProfileMe = () => mongoApi.get('/api/v1/profiles/me');

export const getMyStats = () => mongoApi.get('/api/v1/reports/my-stats');
