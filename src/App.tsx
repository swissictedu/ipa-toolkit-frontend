import { ConfigProvider } from 'antd';
import { IntlProvider } from 'react-intl';
import Router from './Router';
import { getMessages } from './utils/translations';
import deDE from 'antd/lib/locale/de_DE';
import ErrorBoundary from './views/ErrorBoundary';

function App() {
  const locale = 'de-ch';

  return (
    <ErrorBoundary>
      <IntlProvider locale={locale} messages={getMessages(locale)}>
        <ConfigProvider locale={deDE}>
          <Router />
        </ConfigProvider>
      </IntlProvider>
    </ErrorBoundary>
  );
}

export default App;
