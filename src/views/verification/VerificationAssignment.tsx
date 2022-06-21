import { gql, useLazyQuery } from '@apollo/client';
import { Button, PageHeader, Table, TableColumnsType, Tag, TagProps } from 'antd';
import { CloudDownloadOutlined } from '@ant-design/icons';
import { Fragment, useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { IndexDossiersQuery } from '../../../graphql-types';
import SingleAssignmentModal from './assignment/SingleAssignmentModal';
import DefaultLayout from '../../layouts/DefaultLayout';
import { Unarray } from '../../utils/types';
import VerificationList from './assignment/VerificationList';
import MultiAssignmentModal from './assignment/MultiAssignmentModal';
import { usePagination } from '../../utils/pagination';

const INDEX_DOSSIERS = gql`
  query IndexDossiers($page: Int) {
    dossiers(page: $page) {
      collection {
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
          id
          name
        }
        submittedMark
        markDeduction
        tags
        dossierDownloadPath
      }
      metadata {
        totalCount
      }
    }
    uniqueTenantNames
  }
`;

type AssignmentTable = Unarray<NonNullable<NonNullable<IndexDossiersQuery['dossiers']>['collection']>>;

export default function VerificationAssignment() {
  const intl = useIntl();
  const [indexDossiers, { loading, data }] = useLazyQuery<IndexDossiersQuery>(INDEX_DOSSIERS, { fetchPolicy: 'cache-and-network' });
  const [selection, setSelection] = useState<number[]>([]);
  const { paginationConfig, currentPage } = usePagination(data?.dossiers?.metadata.totalCount);

  useEffect(() => {
    indexDossiers({ variables: { page: currentPage } });
  }, [indexDossiers, currentPage]);

  const columns: TableColumnsType<AssignmentTable> = [
    {
      dataIndex: 'id',
      key: 'id',
      title: intl.formatMessage({ id: 'attribute.id' })
    },
    {
      dataIndex: ['affiliation', 'tenantName'],
      key: 'affiliation.tenantName',
      title: intl.formatMessage({ id: 'label.tenant' }),
      filters: data?.uniqueTenantNames?.map((a) => ({ text: a, value: a })),
      onFilter: (value, record) => record.affiliation.tenantName === value
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
      render: (value: boolean) => (value ? intl.formatMessage({ id: 'label.yes' }) : intl.formatMessage({ id: 'label.no' })),
      filters: [
        { text: intl.formatMessage({ id: 'label.yes' }), value: true },
        { text: intl.formatMessage({ id: 'label.no' }), value: false }
      ],
      onFilter: (value, record) => record.markDeduction === value,
      filterMultiple: false
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
          } else if (t === 'not-verified' || t === 'no-final-mark') {
            color = 'error';
          } else if (t === 'insufficient' || t === 'just-enough' || t === 'very-good') {
            color = 'warning';
          }
          return (
            <Tag color={color} key={t}>
              <FormattedMessage id={`label.${t}`} />
            </Tag>
          );
        }),
      filters: [...new Set(data?.dossiers?.collection.flatMap((d) => d.tags))].map((t) => ({ text: intl.formatMessage({ id: `label.${t}` }), value: t })),
      onFilter: (value, record) => record.tags.indexOf(value.toString()) !== -1,
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
    <DefaultLayout
      pageHeader={
        <PageHeader
          title={intl.formatMessage({ id: 'label.verification' })}
          subTitle={intl.formatMessage({ id: 'label.assignment' })}
          extra={[<MultiAssignmentModal dossierIds={selection} key="multiAssignment" />]}
        />
      }
    >
      <Table<AssignmentTable>
        columns={columns}
        dataSource={data?.dossiers?.collection?.map((d) => ({ ...d, key: d.id })) ?? []}
        loading={loading}
        scroll={{ x: 800 }}
        expandable={{ expandedRowRender: (record) => <VerificationList dossierId={record.id} /> }}
        rowSelection={{
          selections: true,
          onChange: (rows) => {
            setSelection(rows.map((r) => parseInt(r.toString())));
          }
        }}
        pagination={paginationConfig}
      />
    </DefaultLayout>
  );
}
