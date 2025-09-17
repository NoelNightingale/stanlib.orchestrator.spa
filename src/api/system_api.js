/* eslint-disable prettier/prettier */
import axios from 'axios';

const API_URL = 'http://localhost:8004';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// System Health and Info API
export const systemApi = {
  // Get API root information
  getApiInfo: async () => {
    try {
      const response = await api.get('/');
      return response.data;
    } catch (error) {
      console.error('Error fetching API info:', error);
      throw error;
    }
  },

  // Health check
  healthCheck: async () => {
    try {
      const response = await api.get('/health');
      return response.data;
    } catch (error) {
      console.error('Error performing health check:', error);
      throw error;
    }
  },

  // Check if API is available
  isApiAvailable: async () => {
    try {
      await systemApi.healthCheck();
      return true;
    } catch (error) {
      return false;
    }
  }
};
