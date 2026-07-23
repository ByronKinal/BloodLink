import { mongoApi } from '../../../shared/api/api';

export const getTriageHistory = () => mongoApi.get('/api/v1/triage');

export const submitTriage = (payload) => mongoApi.post('/api/v1/triage', payload);
