import axios from 'axios';

import { DefaultApi } from './api/api';
import { Configuration } from './api/configuration';
import { IS_DEV } from './const';
import { fbAuth } from './services/firebase';

const LOCAL_SERVER = 'http://localhost:3000';
const REMOTE_SERVER = 'http://85.222.235.31:5005';

const BASE_PATH = IS_DEV ? LOCAL_SERVER : REMOTE_SERVER;
console.info('🚀 ~ BASE_PATH:', BASE_PATH);

const config = new Configuration({
  basePath: BASE_PATH,
});

const axiosInstance = axios.create();

axiosInstance.interceptors.request.use(
  async config => {
    const idToken = await fbAuth.currentUser?.getIdToken(true);
    if (idToken) {
      config.headers.Authorization = `Bearer ${idToken}`;
    } else {
      // console.error('no idToken');
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

export const apiClient = new DefaultApi(config, undefined, axiosInstance);
