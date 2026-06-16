import axios from "axios";

const API_BASE = "http://localhost:8000/api";

const api = axios.create({  
  baseURL: API_BASE,
  timeout: 60000,
});

// Upload a document
export const uploadDocument = async (file, onProgress) => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await api.post("/upload/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress: (e) => {
      if (onProgress) onProgress(Math.round((e.loaded * 100) / e.total));
    },
  });
  return response.data;
};

// Get list of uploaded files
export const getFiles = async () => {
  const response = await api.get("/upload/files");  
  return response.data;
};

// Delete a file
export const deleteFile = async (filename) => {
  const response = await api.delete(`/upload/${filename}`);
  return response.data;
};

// Clear all documents
export const clearAll = async () => {
  const response = await api.delete("/upload/clear/all");
  return response.data;
};

// Send chat message
export const sendMessage = async (query, chatHistory = []) => {
  const response = await api.post("/chat/", {
    query,
    chat_history: chatHistory,
  });
  return response.data;
};

// Get system status
export const getStatus = async () => {
  const response = await api.get("/chat/status");   
  return response.data;
};
