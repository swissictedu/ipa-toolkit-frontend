import { gql, useQuery } from '@apollo/client';
import { Table, TableColumnsType } from 'antd';
import { useIntl } from 'react-intl';
import { IndexVerificationsQuery, IndexVerificationsQueryVariables } from '../../../../graphql-types';
import { Unarray } from '../../../utils/types';

const INDEX_VERIFICATIONS = gql`
  query IndexVerifications($dossierId: Int) {
    verifications(dossierId: $dossierId) {
      id
      changeGrading
      comment
      participant {
        forename
        surname
        email
      }
    }
  }
`;

type VerificationListTable = Unarray<NonNullable<IndexVerificationsQuery['verifications']>>;

type VerificationListProps = {
  dossierId: number;
};

export default function VerificationList({ dossierId }: VerificationListProps) {
  const intl = useIntl();
  const { loading, data } = useQuery<IndexVerificationsQuery, IndexVerificationsQueryVariables>(INDEX_VERIFICATIONS, { variables: { dossierId } });
  const columns: TableColumnsType<VerificationListTable> = [
    {
      dataIndex: 'id',
      key: 'id',
      title: intl.formatMessage({ id: 'attribute.id' })
    },
    {
      dataIndex: ['participant', 'forename'],
      key: 'participantForename',
      title: intl.formatMessage({ id: 'attribute.forename' })
    },
    {
      dataIndex: ['participant', 'surname'],
      key: 'participantSurname',
      title: intl.formatMessage({ id: 'attribute.surname' })
    },
    {
      dataIndex: ['participant', 'email'],
      key: 'participantEmail',
      title: intl.formatMessage({ id: 'attribute.email' })
    },
    {
      dataIndex: 'changeGrading',
      key: 'changeGrading',
      title: intl.formatMessage({ id: 'attribute.change-of-evaluation' }),
      render: (value: boolean) => (value ? intl.formatMessage({ id: 'label.yes' }) : intl.formatMessage({ id: 'label.no' }))
    },
    {
      dataIndex: 'comment',
      key: 'comment',
      title: intl.formatMessage({ id: 'attribute.comment' })
    }
  ];
  return (
    <Table<VerificationListTable>
      title={() => intl.formatMessage({ id: 'label.assigned-participants' })}
      columns={columns}
      dataSource={data?.verifications || []}
      loading={loading}
      pagination={false}
    />
  );
}
