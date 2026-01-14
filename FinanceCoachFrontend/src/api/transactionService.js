// src/api/transactionService.js
import apiClient from "./apiClient";

const transactionService = {
  getTransactions: async (params = {}) => {
    const response = await apiClient.get("/transactions", { params });
    return response.data;
  },

  uploadTransactions: async (formData) => {
    const response = await apiClient.post("/transactions/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  updateTransaction: async (id, updatedData) => {
    // Update a single transaction by ID
    const response = await apiClient.put(`/transactions/${id}`, updatedData);
    return response.data;
  },
};

export default transactionService;
