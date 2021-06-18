import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useQuery, gql, useMutation } from '@apollo/client';
import { Button, message, PageHeader, Table, TableColumnType } from 'antd';
import { Fragment } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import { User, IndexUsersQuery, DeleteUserMutation, DeleteUserMutationVariables } from '../../../graphql-types';
import CONFIGURATION from '../../configuration';
import DefaultLayout from '../../layouts/DefaultLayout';

export const INDEX_USERS = gql`
  query IndexUsers {
    users {
      id
      email
      name
      nickname
    }
  }
`;

const DELETE_USER = gql`
  mutation DeleteUser($id: Int!) {
    users {
      deleteUser(id: $id) {
        user {
          id
        }
      }
    }
  }
`;

export default function ListUsers() {
  const intl = useIntl();
  const navigate = useNavigate();
  const { loading, data } = useQuery<IndexUsersQuery>(INDEX_USERS);
  const [deleteUser, { loading: mutating }] = useMutation<DeleteUserMutation, DeleteUserMutationVariables>(DELETE_USER, {
    update: (cache, { data }) => {
      const currentUsers = cache.readQuery<IndexUsersQuery>({ query: INDEX_USERS });
      cache.writeQuery({
        query: INDEX_USERS,
        data: { users: currentUsers?.users?.filter((user) => user.id !== data?.users?.deleteUser?.user.id) }
      });
    },
    onError: (error) => message.error(error.message)
  });

  const columns: TableColumnType<User>[] = [
    {
      dataIndex: 'email',
      key: 'email',
      title: intl.formatMessage({ id: 'attribute.email' })
    },
    {
      dataIndex: 'name',
      key: 'name',
      title: intl.formatMessage({ id: 'attribute.name' })
    },
    {
      dataIndex: 'nickname',
      key: 'nickname',
      title: intl.formatMessage({ id: 'attribute.nickname' })
    },
    {
      key: 'actions',
      title: intl.formatMessage({ id: 'label.actions' }),
      align: 'center',
      render: (_value, record) => (
        <Fragment>
          <Button.Group>
            <Button icon={<DeleteOutlined />} onClick={() => deleteUser({ variables: { id: record.id } })} />
            <Link to={`${CONFIGURATION.paths.actions.edit}/${record.id}`}>
              <Button icon={<EditOutlined />} />
            </Link>
          </Button.Group>
        </Fragment>
      )
    }
  ];

  return (
    <DefaultLayout
      pageHeader={
        <PageHeader
          title={intl.formatMessage({ id: 'label.user-management' })}
          extra={[
            <Button onClick={() => navigate(CONFIGURATION.paths.actions.new)} icon={<PlusOutlined />} key="new-action">
              <FormattedMessage id="label.new-user" tagName="span" />
            </Button>
          ]}
        />
      }
    >
      <Table<User> columns={columns} dataSource={data?.users?.map((user) => ({ ...user, key: user.email })) || []} loading={loading || mutating} />
    </DefaultLayout>
  );
}
