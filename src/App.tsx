import { ConfigProvider } from 'antd';
import { IntlProvider } from 'react-intl';
import Router from './Router';
import { getMessages } from './utils/translations';
import deDE from 'antd/lib/locale/de_DE';

function App() {
  const locale = 'de-ch';

  return (
    <IntlProvider locale={locale} messages={getMessages(locale)}>
      <ConfigProvider locale={deDE}>
        <Router />
      </ConfigProvider>
    </IntlProvider>
  );
}

export default App;
