import { gql, useLazyQuery } from '@apollo/client';
import { Button, PageHeader, Table, TableColumnsType, TableProps, Tag, TagProps } from 'antd';
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
import { ArrayParam, BooleanParam, NumberParam, StringParam, useQueryParams } from 'use-query-params';

const INDEX_DOSSIERS = gql`
  query IndexDossiers($page: Int, $filter: DossierFilterInput) {
    dossiers(page: $page, filter: $filter) {
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

enum DossierTag {
  verified = 'verified',
  notVerified = 'not-verified',
  noInvitation = 'no-invitation',
  verifiedWithChanges = 'verified-with-change',
  noFinalMark = 'no-final-mark',
  insufficient = 'insufficient',
  justEnough = 'just-enough',
  veryGood = 'very-good'
}

const KEYS_WITH_SINGLE_SELECTION_FILTER = ['markDeduction', 'tags'];

export default function VerificationAssignment() {
  const intl = useIntl();
  const [indexDossiers, { loading, data }] = useLazyQuery<IndexDossiersQuery>(INDEX_DOSSIERS, { fetchPolicy: 'cache-and-network' });
  const [selection, setSelection] = useState<number[]>([]);
  const { paginationConfig, currentPage } = usePagination(data?.dossiers?.metadata.totalCount);

  const [queryParams, setQueryParams] = useQueryParams({
    tenantName: ArrayParam,
    markDeduction: BooleanParam,
    tags: StringParam,
    page: NumberParam
  });

  useEffect(() => {
    delete queryParams.page;
    indexDossiers({ variables: { page: currentPage ?? 1, filter: queryParams } });
  }, [indexDossiers, currentPage, queryParams]);

  const columns: TableColumnsType<AssignmentTable> = [
    {
      dataIndex: 'id',
      key: 'id',
      title: intl.formatMessage({ id: 'attribute.id' })
    },
    {
      dataIndex: ['affiliation', 'tenantName'],
      key: 'tenantName',
      title: intl.formatMessage({ id: 'label.tenant' }),
      filters: data?.uniqueTenantNames?.map((a) => ({ text: a, value: a })),
      filteredValue: queryParams.tenantName?.filter((n): n is string => !!n)
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
      filteredValue: queryParams.markDeduction === undefined || queryParams.markDeduction === null ? undefined : [queryParams.markDeduction],
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
      render: (value: DossierTag[]) =>
        value.map((t) => {
          let color: TagProps['color'] = 'default';
          if (t === DossierTag.verified) {
            color = 'success';
          } else if (t === DossierTag.notVerified || t === DossierTag.noFinalMark) {
            color = 'error';
          } else if (t === DossierTag.insufficient || t === DossierTag.justEnough || t === DossierTag.veryGood) {
            color = 'warning';
          }
          return (
            <Tag color={color} key={t}>
              <FormattedMessage id={`label.${t}`} />
            </Tag>
          );
        }),
      filters: Object.values(DossierTag).map((t) => ({ text: intl.formatMessage({ id: `label.${t}` }), value: t })),
      filteredValue: queryParams.tags ? [queryParams.tags] : undefined,
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

  const handleTableChanges: TableProps<AssignmentTable>['onChange'] = (_pagination, filters, _sorter, extra) => {
    switch (extra.action) {
      case 'filter':
        const parsedFilters = Object.entries(filters).reduce((acc, [key, value]) => {
          acc[key] = KEYS_WITH_SINGLE_SELECTION_FILTER.includes(key) ? value?.[0] : value;
          return acc;
        }, {} as Record<string, any>);

        setQueryParams({ ...queryParams, ...parsedFilters, page: 1 });
        break;
    }
  };

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
        onChange={handleTableChanges}
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
