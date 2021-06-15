import { useQuery, gql, useMutation } from '@apollo/client';
import { PageHeader, Spin } from 'antd';
import { useIntl } from 'react-intl';
import { useNavigate, useParams } from 'react-router';
import UserForm from '../../../components/users/UserForm';
import CONFIGURATION from '../../../configuration';
import DefaultLayout from '../../../layouts/DefaultLayout';
import { ReadUserQuery, ReadUserQueryVariables, UpdateUserMutation, UpdateUserMutationVariables, IndexUsersQuery, UserInput } from '../../../../graphql-types';
import { INDEX_CONFERENCES } from './ListConferences';

export const READ_USER = gql`
  query ReadUser($id: Int!) {
    users(id: $id) {
      id
      email
      name
      nickname
    }
  }
`;

const UPDATE_USER = gql`
  mutation UpdateUser($id: Int!, $user: UserInput!) {
    users {
      updateUser(id: $id, user: $user) {
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

export default function EditConference() {
  const intl = useIntl();
  const params = useParams();
  const navigate = useNavigate();
  const { loading, data } = useQuery<ReadUserQuery, ReadUserQueryVariables>(READ_USER, { variables: { id: parseInt(params.id) } });
  const [updateUserMutation, { loading: mutating }] = useMutation<UpdateUserMutation, UpdateUserMutationVariables>(UPDATE_USER, {
    update: (cache, { data }) => {
      const currentUsers = cache.readQuery<IndexUsersQuery>({ query: INDEX_CONFERENCES });
      cache.writeQuery({
        query: INDEX_CONFERENCES,
        data: { users: currentUsers?.users?.map((user) => (user.id === data?.users?.updateUser?.user.id ? data.users.updateUser.user : user)) }
      });
    }
  });

  const saveUser = (user: UserInput) => {
    const currentUser = data?.users?.find((user) => user);
    if (currentUser?.id) {
      updateUserMutation({ variables: { user, id: currentUser.id } }).then(() => {
        navigate(CONFIGURATION.paths.users);
      });
    }
  };

  return (
    <DefaultLayout
      pageHeader={
        <PageHeader
          title={intl.formatMessage({ id: 'label.user-management' })}
          subTitle={intl.formatMessage({ id: 'label.edit-user' })}
          onBack={() => navigate(CONFIGURATION.paths.users)}
        />
      }
    >
      {data ? <UserForm save={saveUser} loading={loading || mutating} initialUser={data?.users?.find((user) => user)} /> : <Spin />}
    </DefaultLayout>
  );
}
