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

// Sources API
export const sourcesApi = {
  // Get all sources
  getSources: async (page = 1, limit = 50) => {
    try {
      const response = await api.get(`/sources?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching sources:', error);
      throw error;
    }
  },

  // Get a single source by ID
  getSource: async (sourceId) => {
    try {
      const response = await api.get(`/sources/${sourceId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching source:', error);
      throw error;
    }
  },

  // Create a new source
  createSource: async (sourceData) => {
    try {
      const response = await api.post('/sources', sourceData);
      return response.data;
    } catch (error) {
      console.error('Error creating source:', error);
      throw error;
    }
  },

  // Update a source
  updateSource: async (sourceId, sourceData) => {
    try {
      const response = await api.put(`/sources/${sourceId}`, sourceData);
      return response.data;
    } catch (error) {
      console.error('Error updating source:', error);
      throw error;
    }
  },

  // Delete a source
  deleteSource: async (sourceId) => {
    try {
      const response = await api.delete(`/sources/${sourceId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting source:', error);
      throw error;
    }
  },

  // Get source availability history
  getSourceAvailability: async (sourceId) => {
    try {
      const response = await api.get(`/sources/${sourceId}/availability`);
      return response.data;
    } catch (error) {
      console.error('Error fetching source availability:', error);
      throw error;
    }
  },

  // Get jobs associated with a source
  getSourceJobs: async (sourceId) => {
    try {
      const response = await api.get(`/sources/${sourceId}/jobs`);
      return response.data;
    } catch (error) {
      console.error('Error fetching source jobs:', error);
      throw error;
    }
  },

  // Create value-date-aware source
  createValueDateAwareSource: async (name) => {
    return sourcesApi.createSource({
      name,
      source_type: 'value_date_aware'
    });
  },

  // Create generic source
  createGenericSource: async (name) => {
    return sourcesApi.createSource({
      name,
      source_type: 'generic'
    });
  }
};

// Source availability API
export const sourceAvailabilityApi = {
  // Notify source available with value date
  notifySourceAvailable: async (sourceCode, valueDate = null) => {
    try {
      const payload = {
        source_code: sourceCode
      };
      
      if (valueDate) {
        payload.value_date = valueDate;
      }
      
      const response = await api.post('/sources/notify-available', payload);
      return response.data;
    } catch (error) {
      console.error('Error notifying source availability:', error);
      throw error;
    }
  },

  // Notify source available without value date
  notifyGenericSourceAvailable: async (sourceCode) => {
    return sourceAvailabilityApi.notifySourceAvailable(sourceCode);
  },

  // Notify value-date-aware source available
  notifyValueDateAwareSourceAvailable: async (sourceCode, valueDate) => {
    if (!valueDate) {
      throw new Error('Value date is required for value-date-aware sources');
    }
    return sourceAvailabilityApi.notifySourceAvailable(sourceCode, valueDate);
  }
};
