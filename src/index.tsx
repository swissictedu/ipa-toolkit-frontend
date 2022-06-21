import { ApolloClient, ApolloProvider, createHttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import React, { PropsWithChildren, useMemo } from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import CONFIGURATION from './configuration';
import { css, Global } from '@emotion/react';
import { BrowserRouter, useLocation, useNavigate } from 'react-router-dom';
import { Location } from 'history';
import { QueryParamProvider } from 'use-query-params';
import './index.less';
import { cacheInstance, sessionVar } from './cache';

const globalStyles = (
  <Global
    styles={css`
      html {
        height: 100%;
      }

      body {
        min-height: 100%;
        display: flex;
        flex-direction: column;
      }

      #root {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
      }

      input:autofill {
        filter: none;
      }
    `}
  />
);

const authLink = setContext((_, { headers }) => ({
  headers: {
    ...headers,
    'access-token': sessionVar()?.credentials.accessToken,
    'token-type': sessionVar()?.credentials.tokenType,
    client: sessionVar()?.credentials.client,
    expiry: sessionVar()?.credentials.expiry,
    uid: sessionVar()?.credentials.uid
  }
}));

const httpLink = createHttpLink({
  uri: CONFIGURATION.env.api
});

const client = new ApolloClient({ link: from([authLink, httpLink]), cache: cacheInstance });

const RouteAdapter: React.FC<PropsWithChildren> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const adaptedHistory = useMemo(
    () => ({
      replace(location: Location) {
        navigate(location, { replace: true, state: location.state });
      },
      push(location: Location) {
        navigate(location, {
          replace: false,
          state: location.state
        });
      }
    }),
    [navigate]
  );
  // @ts-ignore
  return children({ history: adaptedHistory, location });
};

function AppShell() {
  return (
    <React.StrictMode>
      <ApolloProvider client={client}>
        <BrowserRouter>
          <QueryParamProvider ReactRouterRoute={RouteAdapter}>
            {globalStyles}
            <App />
          </QueryParamProvider>
        </BrowserRouter>
      </ApolloProvider>
    </React.StrictMode>
  );
}

ReactDOM.render(<AppShell />, document.getElementById('root'));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
