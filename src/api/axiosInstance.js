/* eslint-disable prettier/prettier */
import axios from 'axios';

const API_BASE_URL = 'http://37.152.183.111:8000';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export default axiosInstance;
