import axios from 'axios';

// Create a new Axios instance for the Python/FastAPI service
const pythonApi = axios.create({
  baseURL: 'http://127.0.0.1:3000', // Your FastAPI server URL
});

export default pythonApi;
