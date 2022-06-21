import { gql, useQuery } from '@apollo/client';
import { Table, TableColumnsType } from 'antd';
import { useIntl } from 'react-intl';
import { IndexParticipantsQuery, IndexParticipantsQueryVariables } from '../../../../graphql-types';
import { Unarray } from '../../../utils/types';

export const INDEX_PARTICIPANTS = gql`
  query IndexParticipants($conferenceId: Int!) {
    participants(conferenceId: $conferenceId) {
      id
      forename
      surname
      email
      verificationsCount
    }
  }
`;

type ParticipantsTable = Unarray<NonNullable<IndexParticipantsQuery['participants']>>;

type ParticipantListProps = {
  conferenceId: number;
};

export default function ParticipantList({ conferenceId }: ParticipantListProps) {
  const intl = useIntl();
  const { loading, data } = useQuery<IndexParticipantsQuery, IndexParticipantsQueryVariables>(INDEX_PARTICIPANTS, { variables: { conferenceId } });
  const columns: TableColumnsType<ParticipantsTable> = [
    {
      dataIndex: 'id',
      key: 'id',
      title: intl.formatMessage({ id: 'attribute.id' })
    },
    {
      dataIndex: 'forename',
      key: 'participantForename',
      title: intl.formatMessage({ id: 'attribute.forename' })
    },
    {
      dataIndex: 'surname',
      key: 'participantSurname',
      title: intl.formatMessage({ id: 'attribute.surname' })
    },
    {
      dataIndex: 'email',
      key: 'participantEmail',
      title: intl.formatMessage({ id: 'attribute.email' })
    },
    {
      dataIndex: 'verificationsCount',
      key: 'participantEmail',
      title: intl.formatMessage({ id: 'attribute.verifications-count' })
    }
  ];
  return (
    <Table<ParticipantsTable>
      title={() => intl.formatMessage({ id: 'label.assigned-participants' })}
      columns={columns}
      dataSource={data?.participants?.map((v) => ({ ...v, key: v.id })) ?? []}
      loading={loading}
      pagination={false}
    />
  );
}
