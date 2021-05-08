declare global {
  interface Window {
    env: any;
  }
}

const externalApi = (window.env?.api as string).startsWith('//') ? undefined : window.env.api;

const CONFIGURATION = {
  env: {
    api: externalApi || process.env.API || 'http://localhost:3000/graphql'
  }
};

export default CONFIGURATION;
