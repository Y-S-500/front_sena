import packageInfo from '../../package.json';

export const environment = {
  production: true,
  appVersion: packageInfo.version,
  url: 'https://localhost:44388/api/',
};

