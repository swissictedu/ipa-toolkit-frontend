import { ApolloClient, ApolloProvider, createHttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import CONFIGURATION from './configuration';
import { css, Global } from '@emotion/react';
import { BrowserRouter } from 'react-router-dom';
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

function AppShell() {
  return (
    <React.StrictMode>
      <ApolloProvider client={client}>
        <BrowserRouter>
          {globalStyles}
          <App />
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
