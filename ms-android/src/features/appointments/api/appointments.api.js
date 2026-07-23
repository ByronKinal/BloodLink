import { mongoApi } from '../../../shared/api/api';

export const getAppointments = () => mongoApi.get('/api/v1/appointments');
