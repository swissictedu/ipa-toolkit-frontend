declare global {
  interface Window {
    env: any;
  }
}

const injectedEnvApi = (window.env?.api as string).startsWith('//') ? undefined : window.env.api;

const CONFIGURATION = {
  env: {
    api: injectedEnvApi || process.env.API || 'http://localhost:3000/graphql'
  },
  paths: {
    dashboard: '/',
    signIn: '/sign-in',
    signOut: '/sign-out'
  },
  localStorage: {
    session: 'session'
  }
};

export default CONFIGURATION;
