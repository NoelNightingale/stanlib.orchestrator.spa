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

// Job Status and Execution API
export const jobStatusApi = {
  // Update job status
  updateJobStatus: async (jobExecutionId, status, details = null) => {
    try {
      const payload = {
        job_execution_id: jobExecutionId,
        status
      };
      
      if (details) {
        payload.details = details;
      }
      
      const response = await api.post('/job-status', payload);
      return response.data;
    } catch (error) {
      console.error('Error updating job status:', error);
      throw error;
    }
  },

  // Mark job as started
  markJobStarted: async (jobExecutionId, details = 'Job execution started successfully') => {
    return jobStatusApi.updateJobStatus(jobExecutionId, 'started', details);
  },

  // Mark job as running
  markJobRunning: async (jobExecutionId, details = 'Job is currently running') => {
    return jobStatusApi.updateJobStatus(jobExecutionId, 'running', details);
  },

  // Mark job as completed
  markJobCompleted: async (jobExecutionId, details = 'Job completed successfully') => {
    return jobStatusApi.updateJobStatus(jobExecutionId, 'completed', details);
  },

  // Mark job as errored
  markJobErrored: async (jobExecutionId, errorDetails) => {
    return jobStatusApi.updateJobStatus(jobExecutionId, 'errored', errorDetails);
  },

  // Mark job as cancelled
  markJobCancelled: async (jobExecutionId, details = 'Job was cancelled') => {
    return jobStatusApi.updateJobStatus(jobExecutionId, 'cancelled', details);
  }
};

// Job Status Constants
export const JOB_STATUS = {
  PENDING: 'pending',
  STARTED: 'started',
  RUNNING: 'running',
  COMPLETED: 'completed',
  ERRORED: 'errored',
  CANCELLED: 'cancelled'
};

// Trigger Type Constants
export const TRIGGER_TYPE = {
  SCHEDULED: 'scheduled',
  SOURCE_AVAILABILITY: 'source_availability'
};

// Source Type Constants
export const SOURCE_TYPE = {
  VALUE_DATE_AWARE: 'value_date_aware',
  GENERIC: 'generic'
};
