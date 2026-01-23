import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.omni.sistema',
  appName: 'OMNI Sistema',
  webDir: 'dist/browser',
  server: {
    androidScheme: 'https'
  }
};

export default config;
