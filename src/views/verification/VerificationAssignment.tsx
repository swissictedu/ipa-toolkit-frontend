import { gql, useQuery } from '@apollo/client';
import { Button, PageHeader, Table, TableColumnsType, Tag, TagProps } from 'antd';
import { CloudDownloadOutlined } from '@ant-design/icons';
import { Fragment } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { IndexDossiersQuery } from '../../../graphql-types';
import SingleAssignmentModal from './assignment/SingleAssignmentModal';
import DefaultLayout from '../../layouts/DefaultLayout';
import { Unarray } from '../../utils/types';
import VerificationList from './assignment/VerificationList';
import { ColumnFilterItem } from 'antd/lib/table/interface';

const INDEX_DOSSIERS = gql`
  query IndexDossiers {
    dossiers {
      id
      affiliation {
        tenantName
      }
      candidate {
        forename
        surname
        id
      }
      conference {
        name
      }
      submittedMark
      markDeduction
      tags
      dossierDownloadPath
    }
  }
`;

type AssignmentTable = Unarray<NonNullable<IndexDossiersQuery['dossiers']>>;

export default function VerificationAssignment() {
  const intl = useIntl();
  const { loading, data } = useQuery<IndexDossiersQuery>(INDEX_DOSSIERS, { fetchPolicy: 'cache-and-network' });

  const columns: TableColumnsType<AssignmentTable> = [
    {
      dataIndex: 'id',
      key: 'id',
      title: intl.formatMessage({ id: 'attribute.id' })
    },
    {
      dataIndex: ['affiliation', 'tenantName'],
      key: 'affiliation.tenantName',
      title: intl.formatMessage({ id: 'label.tenant' })
    },
    {
      dataIndex: ['candidate', 'forename'],
      key: 'candidateForename',
      title: intl.formatMessage({ id: 'label.candidate-forename' })
    },
    {
      dataIndex: ['candidate', 'surname'],
      key: 'candidateSurname',
      title: intl.formatMessage({ id: 'label.candidate-surname' })
    },
    {
      dataIndex: 'submittedMark',
      key: 'submittedMark',
      title: intl.formatMessage({ id: 'attribute.submittedMark' })
    },
    {
      dataIndex: 'markDeduction',
      key: 'markDeduction',
      title: intl.formatMessage({ id: 'attribute.markDeduction' }),
      render: (value: boolean) => (value ? intl.formatMessage({ id: 'label.yes' }) : intl.formatMessage({ id: 'label.no' }))
    },
    {
      dataIndex: ['conference', 'name'],
      key: 'conferenceName',
      title: intl.formatMessage({ id: 'label.grading-conference' })
    },
    {
      dataIndex: 'tags',
      key: 'tags',
      title: intl.formatMessage({ id: 'label.tags' }),
      render: (value: string[]) =>
        value.map((t) => {
          let color: TagProps['color'] = 'default';
          if (t === 'verified') {
            color = 'success';
          } else if (t === 'not-verified') {
            color = 'red';
          } else if (t === 'insufficient' || t === 'just-enough' || t === 'very-good') {
            color = 'warning';
          }
          return (
            <Tag color={color}>
              <FormattedMessage id={`label.${t}`} />
            </Tag>
          );
        }),
      filters: [...new Set(data?.dossiers?.flatMap((d) => d.tags))].map((t) => ({ text: intl.formatMessage({ id: `label.${t}` }), value: t })),
      onFilter: (value, record) => {
        return record.tags.indexOf(value.toString()) !== -1;
      },
      filterMultiple: false
    },
    {
      key: 'actions',
      title: intl.formatMessage({ id: 'label.actions' }),
      align: 'center',
      render: (_value, record) => (
        <Fragment>
          <Button.Group>
            {record.dossierDownloadPath ? (
              <Fragment>
                <Button href={record.dossierDownloadPath} icon={<CloudDownloadOutlined />} />
                <SingleAssignmentModal dossierId={record.id} />
              </Fragment>
            ) : null}
          </Button.Group>
        </Fragment>
      )
    }
  ];

  return (
    <DefaultLayout pageHeader={<PageHeader title={intl.formatMessage({ id: 'label.verification' })} subTitle={intl.formatMessage({ id: 'label.assignment' })} />}>
      <Table<AssignmentTable>
        columns={columns}
        dataSource={data?.dossiers?.map((d) => ({ ...d, key: d.id })) ?? []}
        loading={loading}
        scroll={{ x: 800 }}
        expandable={{ expandedRowRender: (record) => <VerificationList dossierId={record.id} /> }}
        rowSelection={{ selections: true }}
      />
    </DefaultLayout>
  );
}
