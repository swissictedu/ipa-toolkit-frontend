import { PageHeader } from 'antd';
import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router';
import UserForm from '../../components/users/UserForm';
import DefaultLayout from '../../layouts/DefaultLayout';

export default function NewUser() {
  const intl = useIntl();
  const navigate = useNavigate();
  return (
    <DefaultLayout
      pageHeader={<PageHeader title={intl.formatMessage({ id: 'label.user-management' })} subTitle={intl.formatMessage({ id: 'label.new-user' })} onBack={() => navigate(-1)} />}
    >
      <UserForm />
    </DefaultLayout>
  );
}
