import { useMutation, gql } from '@apollo/client';
import { PageHeader } from 'antd';
import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router';
import { CreateUserMutation, CreateUserMutationVariables, IndexUsersQuery, UserInput } from '../../../../graphql-types';
import UserForm from '../../../components/users/UserForm';
import CONFIGURATION from '../../../configuration';
import DefaultLayout from '../../../layouts/DefaultLayout';
import { INDEX_CONFERENCES } from './ListConferences';

const CREATE_USER = gql`
  mutation CreateUser($user: UserInput!) {
    users {
      createUser(user: $user) {
        user {
          id
          email
          name
          nickname
        }
      }
    }
  }
`;

export default function NewConference() {
  const intl = useIntl();
  const navigate = useNavigate();
  const [createUserMutation, { loading }] = useMutation<CreateUserMutation, CreateUserMutationVariables>(CREATE_USER, {
    update: (cache, { data }) => {
      const currentUsers = cache.readQuery<IndexUsersQuery>({ query: INDEX_CONFERENCES });
      cache.writeQuery({ query: INDEX_CONFERENCES, data: { users: { ...currentUsers?.users, ...data?.users?.createUser } } });
    }
  });

  const saveUser = (user: UserInput) => {
    createUserMutation({
      variables: { user }
    }).then(() => {
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
      <UserForm save={saveUser} loading={loading} />
    </DefaultLayout>
  );
}
