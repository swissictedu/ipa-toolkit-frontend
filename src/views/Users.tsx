import { PageHeader } from 'antd';
import { useIntl } from 'react-intl';
import DefaultLayout from '../layouts/DefaultLayout';

export default function Users() {
  const intl = useIntl();
  return <DefaultLayout pageHeader={<PageHeader title={intl.formatMessage({ id: 'label.user-management' })} />}></DefaultLayout>;
}
