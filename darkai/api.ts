import axios from 'axios';

import { DefaultApi } from './apiClient/api';
import { Configuration } from './apiClient/configuration';
import { IS_DEV } from './const';
import { fbAuth } from './services/firebase';
import { logger } from './utils/logger';

const LOCAL_SERVER = 'http://localhost:3000';
// const REMOTE_SERVER = 'https://darkai.duckdns.org:5005';
const REMOTE_SERVER = 'https://darkai-a966676ae085.herokuapp.com';

// const BASE_PATH = IS_DEV ? LOCAL_SERVER : REMOTE_SERVER;
const BASE_PATH = REMOTE_SERVER;
logger.info('🚀 ~ BASE_PATH:', BASE_PATH);

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
      // logger.error('no idToken');
    }

    if (IS_DEV) {
      const path = (config.url || '').replace(BASE_PATH, '');
      logger.log(
        `🚀 ${idToken ? '🔒' : ''} ${config.method?.toUpperCase()} ${path}`,
      );
      // if (config.method?.toUpperCase() === 'POST' && config.data) {
      //   logger.log(JSON.parse(config.data));
      //   logger.log('------------------');
      // }
    }

    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

export const apiClient = new DefaultApi(config, undefined, axiosInstance);
