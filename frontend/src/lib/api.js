import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

export const expenseAPI = {
  /**
   * Save expenses for a specific month
   */
  saveMonthExpenses: async (month, year, rows) => {
    try {
      const response = await axios.post(`${API_URL}/expenses/save`, {
        month,
        year,
        rows
      });
      return response.data;
    } catch (error) {
      console.error('Error saving expenses:', error);
      throw error;
    }
  },

  /**
   * Get expenses for a specific month
   */
  getMonthExpenses: async (year, month) => {
    try {
      const response = await axios.get(`${API_URL}/expenses/${year}/${month}`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        // No data found, return null
        return null;
      }
      console.error('Error fetching expenses:', error);
      throw error;
    }
  },

  /**
   * Get all expenses for a year
   */
  getYearExpenses: async (year) => {
    try {
      const response = await axios.get(`${API_URL}/expenses/year/${year}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching year expenses:', error);
      throw error;
    }
  },

  /**
   * Delete expenses for a specific month
   */
  deleteMonthExpenses: async (year, month) => {
    try {
      const response = await axios.delete(`${API_URL}/expenses/${year}/${month}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting expenses:', error);
      throw error;
    }
  }
};