import { useQuery, gql } from '@apollo/client';
import { PageHeader, Table, TableColumnType } from 'antd';
import { useIntl } from 'react-intl';
import { User, AllUsersQuery } from '../../graphql-types';
import DefaultLayout from '../layouts/DefaultLayout';

const ALL_USERS = gql`
  query AllUsers {
    users {
      email
      name
      nickname
    }
  }
`;

export default function Users() {
  const intl = useIntl();
  const { loading, data } = useQuery<AllUsersQuery>(ALL_USERS);
  const columns: TableColumnType<User>[] = [
    {
      dataIndex: 'email',
      title: intl.formatMessage({ id: 'attribute.email' })
    },
    {
      dataIndex: 'name',
      title: intl.formatMessage({ id: 'attribute.name' })
    },
    {
      dataIndex: 'nickname',
      title: intl.formatMessage({ id: 'attribute.nickname' })
    }
  ];

  return (
    <DefaultLayout pageHeader={<PageHeader title={intl.formatMessage({ id: 'label.user-management' })} />}>
      <Table<User> columns={columns} dataSource={data?.users || []} loading={loading} />
    </DefaultLayout>
  );
}
