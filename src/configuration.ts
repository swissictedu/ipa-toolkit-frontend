declare global {
  interface Window {
    env: any;
  }
}

const injectedEnvApi = (window.env?.api as string).startsWith('//') ? undefined : window.env.api;

const CONFIGURATION = {
  env: {
    api: injectedEnvApi || process.env.API || 'http://localhost:3000/graphql',
    backend: injectedEnvApi?.replace('/graphql', '') || process.env.API?.replace('/graphql', '') || 'http://localhost:3000'
  },
  paths: {
    dashboard: '/',
    signIn: '/sign-in',
    signOut: '/sign-out',
    users: '/users',
    verification: {
      conference: '/verification/conference',
      import: '/verification/import',
      assignment: '/verification/assignment',
      export: '/verification/export',
      result: '/verification/result/:token',
      download: '/verification/download/:token'
    },
    actions: {
      new: 'new',
      edit: 'edit'
    }
  },
  backendPaths: {
    verification: {
      download: '/verification/download'
    }
  },
  defaultValues: {
    evaluationPath: 'verwaltung/301/40?nauswertungid=149',
    dossierPath: 'generate-zip/'
  },
  localStorage: {
    session: 'session'
  }
};

export default CONFIGURATION;
