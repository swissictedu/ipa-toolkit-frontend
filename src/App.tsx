import { IntlProvider } from 'react-intl';
import Router from './Router';
import { getMessages } from './utils/translations';

function App() {
  const locale = 'de-ch';

  return (
    <IntlProvider locale={locale} messages={getMessages(locale)}>
      <Router />
    </IntlProvider>
  );
}

export default App;
