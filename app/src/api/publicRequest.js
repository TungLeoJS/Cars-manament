import axios from 'axios';

const {
  API_URL
} = process.env;
const BASE_URL = API_URL;

export const publicRequest = axios.create({
  baseURL: BASE_URL,
});
