import { InMemoryCache, makeVar } from '@apollo/client';
import CONFIGURATION from './configuration';
import { Session } from './models/Session';

export const sessionVar = makeVar<Session | undefined>(
  (() => {
    const storedSession = localStorage.getItem(CONFIGURATION.localStorage.session);
    if (storedSession) {
      return JSON.parse(storedSession) as Session;
    }
    return undefined;
  })()
);
export function setSessionVar(session?: Session) {
  if (!session) {
    sessionVar(undefined);
    localStorage.removeItem(CONFIGURATION.localStorage.session);
  } else {
    sessionVar(session);
    localStorage.setItem(CONFIGURATION.localStorage.session, JSON.stringify(session));
  }
}

export const cacheInstance = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        session: {
          read() {
            return sessionVar();
          }
        }
      }
    }
  }
});
