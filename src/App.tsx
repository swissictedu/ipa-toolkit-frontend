import { IntlProvider } from 'react-intl';
import DefaultLayout from './layouts/DefaultLayout';
import Router from './Router';
import { getMessages } from './utils/translations';

function App() {
  const locale = 'de-ch';

  return (
    <IntlProvider locale={locale} messages={getMessages(locale)}>
      <DefaultLayout>
        <Router />
      </DefaultLayout>
    </IntlProvider>
  );
}

export default App;
