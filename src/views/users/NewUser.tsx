import { useMutation, gql } from '@apollo/client';
import { PageHeader } from 'antd';
import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router';
import { CreateUserMutation, CreateUserMutationVariables, UserInput } from '../../../graphql-types';
import UserForm from '../../components/users/UserForm';
import CONFIGURATION from '../../configuration';
import DefaultLayout from '../../layouts/DefaultLayout';

const CREATE_USER = gql`
  mutation CreateUser($user: UserInput!) {
    users {
      createUser(user: $user) {
        user {
          name
        }
      }
    }
  }
`;

export default function NewUser() {
  const intl = useIntl();
  const navigate = useNavigate();
  const [createUser, { loading }] = useMutation<CreateUserMutation, CreateUserMutationVariables>(CREATE_USER);

  const saveNewUser = (user: UserInput) => {
    createUser({ variables: { user } }).then(() => {
      navigate(CONFIGURATION.paths.users);
    });
  };

  return (
    <DefaultLayout
      pageHeader={
        <PageHeader
          title={intl.formatMessage({ id: 'label.user-management' })}
          subTitle={intl.formatMessage({ id: 'label.new-user' })}
          onBack={() => navigate(CONFIGURATION.paths.users)}
        />
      }
    >
      <UserForm save={saveNewUser} loading={loading} />
    </DefaultLayout>
  );
}
