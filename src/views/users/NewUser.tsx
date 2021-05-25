import { PageHeader } from 'antd';
import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router';
import DefaultLayout from '../../layouts/DefaultLayout';

export default function NewUser() {
  const intl = useIntl();
  const navigate = useNavigate();
  return <DefaultLayout pageHeader={<PageHeader title={intl.formatMessage({ id: 'label.user-management' })} onBack={() => navigate(-1)} />}></DefaultLayout>;
}
