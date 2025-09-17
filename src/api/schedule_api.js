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

// Schedule API
export const scheduleApi = {
  // Common cron expressions
  CRON_PATTERNS: {
    EVERY_MINUTE: '* * * * *',
    EVERY_5_MINUTES: '*/5 * * * *',
    EVERY_15_MINUTES: '*/15 * * * *',
    EVERY_30_MINUTES: '*/30 * * * *',
    HOURLY: '0 * * * *',
    DAILY_AT_9AM: '0 9 * * *',
    DAILY_AT_MIDNIGHT: '0 0 * * *',
    WEEKLY_MONDAY_9AM: '0 9 * * 1',
    MONTHLY_FIRST_DAY_9AM: '0 9 1 * *'
  },

  // Set job schedule
  setJobSchedule: async (jobId, cronExpression, timezone = 'UTC') => {
    try {
      const response = await api.post(`/jobs/${jobId}/schedule`, {
        cron_expression: cronExpression,
        timezone
      });
      return response.data;
    } catch (error) {
      console.error(`Error setting schedule for job ${jobId}:`, error);
      throw error;
    }
  },

  // Helper methods for common schedules
  setDailySchedule: async (jobId, hour = 9, minute = 0, timezone = 'UTC') => {
    const cronExpression = `${minute} ${hour} * * *`;
    return scheduleApi.setJobSchedule(jobId, cronExpression, timezone);
  },

  setHourlySchedule: async (jobId, minute = 0, timezone = 'UTC') => {
    const cronExpression = `${minute} * * * *`;
    return scheduleApi.setJobSchedule(jobId, cronExpression, timezone);
  },

  setWeeklySchedule: async (jobId, dayOfWeek = 1, hour = 9, minute = 0, timezone = 'UTC') => {
    const cronExpression = `${minute} ${hour} * * ${dayOfWeek}`;
    return scheduleApi.setJobSchedule(jobId, cronExpression, timezone);
  },

  setMonthlySchedule: async (jobId, dayOfMonth = 1, hour = 9, minute = 0, timezone = 'UTC') => {
    const cronExpression = `${minute} ${hour} ${dayOfMonth} * *`;
    return scheduleApi.setJobSchedule(jobId, cronExpression, timezone);
  },

  setIntervalSchedule: async (jobId, intervalMinutes, timezone = 'UTC') => {
    const cronExpression = `*/${intervalMinutes} * * * *`;
    return scheduleApi.setJobSchedule(jobId, cronExpression, timezone);
  }
};

// Common timezones
export const TIMEZONES = {
  UTC: 'UTC',
  EST: 'America/New_York',
  PST: 'America/Los_Angeles',
  CST: 'America/Chicago',
  MST: 'America/Denver',
  GMT: 'Europe/London',
  CET: 'Europe/Paris',
  JST: 'Asia/Tokyo',
  AEST: 'Australia/Sydney'
};
