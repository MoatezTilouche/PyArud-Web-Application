/**
 * API Service for PyArud Backend
 * Handles all communication with the Flask API
 */
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error
      throw new Error(error.response.data.error || 'Server error');
    } else if (error.request) {
      // Request made but no response
      throw new Error('Unable to connect to server. Please check if the API is running.');
    } else {
      // Something else happened
      throw new Error(error.message || 'Unknown error occurred');
    }
  }
);

/**
 * Analyze a poem
 * @param {string[]} verses - Array of verse strings
 * @returns {Promise<Object>} Analysis result
 */
export const analyzePoem = async (verses) => {
  const response = await apiClient.post('/analyze', { verses });
  return response.data;
};

/**
 * Get information about a specific bahr (meter)
 * @param {string} bahrName - Name of the bahr
 * @returns {Promise<Object>} Bahr information
 */
export const getBahrInfo = async (bahrName) => {
  const response = await apiClient.get(`/bahr/${bahrName}`);
  return response.data;
};

/**
 * Validate a single verse
 * @param {string} verse - Verse text to validate
 * @returns {Promise<Object>} Validation result
 */
export const validateVerse = async (verse) => {
  const response = await apiClient.post('/validate', { verse });
  return response.data;
};

/**
 * Get API status
 * @returns {Promise<Object>} API status
 */
export const getApiStatus = async () => {
  const response = await apiClient.get('/status');
  return response.data;
};

export default {
  analyzePoem,
  getBahrInfo,
  validateVerse,
  getApiStatus,
};
