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
    signOut: '/sign-out',
    users: '/users',
    verification: {
      meeting: '/verification/event',
      import: '/verification/import',
      assignment: '/verification/assignment',
      export: '/verification/export',
      result: '/verification/result/:token'
    },
    actions: {
      new: 'new',
      edit: 'edit'
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
