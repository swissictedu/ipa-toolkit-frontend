import { PageHeader } from 'antd';
import { useIntl } from 'react-intl';
import { sessionVar } from '../cache';
import DefaultLayout from '../layouts/DefaultLayout';

export default function Dashboard() {
  const intl = useIntl();
  return (
    <DefaultLayout
      pageHeader={
        <PageHeader
          title={intl.formatMessage({ id: 'label.dashboard' })}
          subTitle={intl.formatMessage({ id: 'content.welcome' }, { name: sessionVar()?.name ?? sessionVar()?.identifier })}
        />
      }
    ></DefaultLayout>
  );
}
