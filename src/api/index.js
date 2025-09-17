/* eslint-disable prettier/prettier */
// Main API module that exports all API functions
export { jobsApi, createScheduledJob, createSourceTriggeredJob } from './jobs_api';
export { sourcesApi, sourceAvailabilityApi } from './sources_api';
export { jobStatusApi, JOB_STATUS, TRIGGER_TYPE, SOURCE_TYPE } from './job_status_api';
export { systemApi } from './system_api';
export { scheduleApi, TIMEZONES } from './schedule_api';

// Re-export existing APIs
export * from './auth_api';
export * from './user_api';

// Common API configuration
export const API_CONFIG = {
  BASE_URL: 'http://localhost:8004',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3
};

// Common error handler
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    console.error('API Error:', {
      status: error.response.status,
      message: error.response.data?.detail || error.response.data?.message || 'Unknown error',
      url: error.config?.url
    });
    
    return {
      success: false,
      error: error.response.data?.detail || error.response.data?.message || 'Server error',
      status: error.response.status
    };
  } else if (error.request) {
    // Network error
    console.error('Network Error:', error.message);
    return {
      success: false,
      error: 'Network error - unable to connect to server',
      status: 0
    };
  } else {
    // Other error
    console.error('Error:', error.message);
    return {
      success: false,
      error: error.message,
      status: 0
    };
  }
};

// API wrapper with error handling
export const apiCall = async (apiFunction, ...args) => {
  try {
    const result = await apiFunction(...args);
    return {
      success: true,
      data: result
    };
  } catch (error) {
    return handleApiError(error);
  }
};
