import axios from 'axios';

// const {
//   API_URL
// } = process.env;
const BASE_URL = 'http://165.22.54.199/api/v1';

export const publicRequest = axios.create({
  baseURL: BASE_URL,
});
