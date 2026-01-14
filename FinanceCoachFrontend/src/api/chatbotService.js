// src/api/chatbotService.js
import apiClient from "./apiClient";

// Chatbot API methods
const chatbotService = {
  sendMessage: async (message) => {
    const response = await apiClient.post("/chatbot/message", { message });
    return response.data;
  },

  // Add other chatbot related API methods as needed
};

export default chatbotService;
