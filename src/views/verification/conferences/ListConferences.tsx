import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useQuery, gql } from '@apollo/client';
import { Button, PageHeader, Table, TableColumnType } from 'antd';
import { Fragment } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import { Conference, IndexConferencesQuery } from '../../../../graphql-types';
import CONFIGURATION from '../../../configuration';
import DefaultLayout from '../../../layouts/DefaultLayout';
import ParticipantList from './ParticipantList';

export const INDEX_CONFERENCES = gql`
  query IndexConferences {
    conferences {
      id
      name
    }
  }
`;

type ConferenceListItem = Pick<Conference, 'id' | 'name'>;

export default function ListConferences() {
  const intl = useIntl();
  const navigate = useNavigate();
  const { loading, data } = useQuery<IndexConferencesQuery>(INDEX_CONFERENCES);

  const columns: TableColumnType<ConferenceListItem>[] = [
    {
      dataIndex: 'name',
      key: 'name',
      title: intl.formatMessage({ id: 'attribute.name' })
    },
    {
      key: 'actions',
      title: intl.formatMessage({ id: 'label.actions' }),
      align: 'center',
      render: (_value, record) => (
        <Fragment>
          <Button.Group>
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
          title={intl.formatMessage({ id: 'label.verification' })}
          subTitle={intl.formatMessage({ id: 'label.grading-conference' })}
          extra={[
            <Button onClick={() => navigate(CONFIGURATION.paths.actions.new)} icon={<PlusOutlined />} key="new-action">
              <FormattedMessage id="label.new-conference" tagName="span" />
            </Button>
          ]}
        />
      }
    >
      <Table<ConferenceListItem>
        columns={columns}
        dataSource={data?.conferences?.map((conference) => ({ ...conference, key: conference.id })) || []}
        loading={loading}
        expandable={{ expandedRowRender: (record) => <ParticipantList conferenceId={record.id} /> }}
      />
    </DefaultLayout>
  );
}
