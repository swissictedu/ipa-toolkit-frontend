import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import CONFIGURATION from './configuration';
import { css, Global } from '@emotion/react';
import { BrowserRouter } from 'react-router-dom';

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
    `}
  />
);

const client = new ApolloClient({ uri: CONFIGURATION.env.api, cache: new InMemoryCache() });

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
