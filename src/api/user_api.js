/* eslint-disable prettier/prettier */
import axios from 'axios';

const API_URL = 'http://localhost:8004';

// Get all users
export const fetchUsers = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/users/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get a single user by ID
export const fetchUserById = async (id, token) => {
  try {
    const response = await axios.get(`${API_URL}/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Create a new user
export const createUser = async (userData, token) => {
  try {
    const response = await axios.post(`${API_URL}/users/`, userData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update a user
export const updateUser = async (id, userData, token) => {
  try {
    console.log('updateUser JSON body:', userData);
    const response = await axios.put(`${API_URL}/users/${id}`, userData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete a user
export const deleteUser = async (id, token) => {
  try {
    await axios.delete(`${API_URL}/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    throw error;
  }
};

// Get grants for a user
export const fetchUserGrants = async (userId, token) => {
  try {
    const response = await axios.get(`${API_URL}/users/${userId}/grants`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('fetchUserGrants response:', response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Add a grant to a user
export const addUserGrant = async (userId, grantData, token) => {
  try {
    console.log('addUserGrant JSON body:', userId);
    const response = await axios.post(`${API_URL}/users/${userId}/grants`, grantData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Remove a grant from a user
export const deleteUserGrant = async (userId, grantId, token) => {
  try {
    await axios.delete(`${API_URL}/users/${userId}/grants/${grantId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    throw error;
  }
};

// Get all grants
export const fetchAllGrants = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/grants/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
