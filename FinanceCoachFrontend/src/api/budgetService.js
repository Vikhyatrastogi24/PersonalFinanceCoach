// src/api/budgetService.js
import apiClient from "./apiClient";

// Budget API methods (adjust endpoints to match your backend)
const budgetService = {
  getBudgets: async () => {
    const response = await apiClient.get("/budgets");
    return response.data;
  },

  createBudget: async (budget) => {
    const response = await apiClient.post("/budgets", budget);
    return response.data;
  },

  updateBudget: async (id, budget) => {
    const response = await apiClient.put(`/budgets/${id}`, budget);
    return response.data;
  },

  deleteBudget: async (id) => {
    const response = await apiClient.delete(`/budgets/${id}`);
    return response.data;
  },
};

export default budgetService;
