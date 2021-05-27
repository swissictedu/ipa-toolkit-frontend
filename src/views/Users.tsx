import { PlusOutlined } from '@ant-design/icons';
import { useQuery, gql } from '@apollo/client';
import { Button, PageHeader, Table, TableColumnType } from 'antd';
import { FormattedMessage, useIntl } from 'react-intl';
import { useNavigate, useOutlet } from 'react-router';
import { User, AllUsersQuery } from '../../graphql-types';
import CONFIGURATION from '../configuration';
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
  const outlet = useOutlet();
  const navigate = useNavigate();
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
    outlet ?? (
      <DefaultLayout
        pageHeader={
          <PageHeader
            title={intl.formatMessage({ id: 'label.user-management' })}
            extra={[
              <Button onClick={() => navigate(CONFIGURATION.paths.actions.new)} icon={<PlusOutlined />}>
                <FormattedMessage id="label.new-user" tagName="span" />
              </Button>
            ]}
          />
        }
      >
        <Table<User> columns={columns} dataSource={data?.users || []} loading={loading} />
      </DefaultLayout>
    )
  );
}
