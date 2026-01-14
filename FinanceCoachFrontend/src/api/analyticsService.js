// src/api/analyticsService.js
import apiClient from "./apiClient";

// Analytics API methods (adjust endpoints to match your backend)
const analyticsService = {
  getDashboardData: async () => {
    const response = await apiClient.get("/analytics/dashboard");
    return response.data;
  },

  getSpendingTrends: async () => {
    const response = await apiClient.get("/analytics/spending-trends");
    return response.data;
  },

  // Add additional analytics methods if needed
};

export default analyticsService;
