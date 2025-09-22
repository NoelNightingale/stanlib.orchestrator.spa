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

// Jobs API
export const jobsApi = {
  // Create a new job
  createJob: async (jobData) => {
    try {
      const response = await api.post('/jobs', jobData);
      return response.data;
    } catch (error) {
      console.error('Error creating job:', error);
      throw error;
    }
  },

  // Get all jobs with pagination
  getJobs: async (skip = 0, limit = 10) => {
    try {
      const response = await api.get('/jobs', {
        params: { skip, limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching jobs:', error);
      throw error;
    }
  },

  // Get job by ID
  getJobById: async (jobId) => {
    try {
      const response = await api.get(`/jobs/${jobId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching job ${jobId}:`, error);
      throw error;
    }
  },

  // Delete job
  deleteJob: async (jobId) => {
    try {
      const response = await api.delete(`/jobs/${jobId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting job ${jobId}:`, error);
      throw error;
    }
  },

  // Get sources associated with a job
  getJobSources: async (jobId) => {
    try {
      const response = await api.get(`/jobs/${jobId}/sources`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching sources for job ${jobId}:`, error);
      throw error;
    }
  },

  // Associate sources to job
  associateSourcesToJob: async (jobId, sourceIds) => {
    try {
      const response = await api.post(`/jobs/${jobId}/sources`, {
        source_ids: sourceIds
      });
      return response.data;
    } catch (error) {
      console.error(`Error associating sources to job ${jobId}:`, error);
      throw error;
    }
  },

  // Set job schedule
  setJobSchedule: async (jobId, scheduleData) => {
    try {
      const response = await api.post(`/jobs/${jobId}/schedule`, scheduleData);
      return response.data;
    } catch (error) {
      console.error(`Error setting schedule for job ${jobId}:`, error);
      throw error;
    }
  },

  // Get job execution status
  getJobStatus: async (jobId, skip = 0, limit = 10) => {
    try {
      const response = await api.get(`/jobs/${jobId}/status`, {
        params: { skip, limit }
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching job status for ${jobId}:`, error);
      throw error;
    }
  }
};

// Job creation helpers
export const createScheduledJob = async (name, description, callbackUrl, cronExpression, timezone = 'UTC') => {
  const jobData = {
    name,
    description,
    callback_url: callbackUrl,
    trigger_type: 'scheduled'
  };
  
  const job = await jobsApi.createJob(jobData);
  
  if (cronExpression) {
    await jobsApi.setJobSchedule(job.id, {
      cron_expression: cronExpression,
      timezone
    });
  }
  
  return job;
};

export const createSourceTriggeredJob = async (name, description, callbackUrl, sourceIds = []) => {
  const jobData = {
    name,
    description,
    callback_url: callbackUrl,
    trigger_type: 'source_availability'
  };
  
  const job = await jobsApi.createJob(jobData);
  
  if (sourceIds.length > 0) {
    await jobsApi.associateSourcesToJob(job.id, sourceIds);
  }
  
  return job;
};
