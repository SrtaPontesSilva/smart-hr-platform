// frontend/src/services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://seu-backend-api.com', // Ajuste conforme necessário
});

// Interceptador de requisição: armazena informações da requisição no localStorage
api.interceptors.request.use(
  config => {
    try {
      // Salva os dados da requisição no localStorage usando a URL como chave
      const requestKey = `api_request_${config.url}`;
      const requestData = {
        url: config.url,
        method: config.method,
        data: config.data,
        params: config.params,
      };
      localStorage.setItem(requestKey, JSON.stringify(requestData));
    } catch (error) {
      console.error('Erro ao salvar requisição no localStorage:', error);
    }
    return config;
  },
  error => Promise.reject(error)
);

// Interceptador de resposta: armazena os dados da resposta no localStorage
api.interceptors.response.use(
  response => {
    try {
      // Salva os dados da resposta no localStorage usando a URL como chave
      const responseKey = `api_response_${response.config.url}`;
      localStorage.setItem(responseKey, JSON.stringify(response.data));
    } catch (error) {
      console.error('Erro ao salvar resposta no localStorage:', error);
    }
    return response;
  },
  error => Promise.reject(error)
);

export default api;
