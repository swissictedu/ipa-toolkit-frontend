import { PageHeader } from 'antd';
import { useIntl } from 'react-intl';
import DefaultLayout from '../layouts/DefaultLayout';

export default function Dashboard() {
  const intl = useIntl();
  return <DefaultLayout pageHeader={<PageHeader title={intl.formatMessage({ id: 'label.dashboard' })} />}>sdf</DefaultLayout>;
}
