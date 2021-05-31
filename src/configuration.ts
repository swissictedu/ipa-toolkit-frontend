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
    conference: {
      meeting: '/conference/event',
      import: '/conference/import',
      assignment: '/conference/assignment',
      export: '/conference/export'
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
