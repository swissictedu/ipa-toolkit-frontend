import { useQuery, gql, useMutation } from '@apollo/client';
import { PageHeader, Spin } from 'antd';
import { useIntl } from 'react-intl';
import { useNavigate, useParams } from 'react-router';
import CONFIGURATION from '../../../configuration';
import DefaultLayout from '../../../layouts/DefaultLayout';
import {
  IndexUsersQuery,
  ReadConferenceQuery,
  ReadConferenceQueryVariables,
  UpdateConferenceMutation,
  UpdateConferenceMutationVariables,
  ConferenceInput
} from '../../../../graphql-types';
import { INDEX_CONFERENCES } from './ListConferences';
import ConferenceForm from '../../../components/verification/conferences/ConferenceForm';

export const READ_CONFERENCE = gql`
  query ReadConference($id: Int!) {
    conferences(id: $id) {
      id
      name
    }
  }
`;

const UPDATE_CONFERENCE = gql`
  mutation UpdateConference($id: Int!, $conference: ConferenceInput!) {
    conferences {
      updateConference(id: $id, conference: $conference) {
        conference {
          id
          name
        }
      }
    }
  }
`;

export default function EditConference() {
  const intl = useIntl();
  const params = useParams();
  const navigate = useNavigate();
  const { loading, data } = useQuery<ReadConferenceQuery, ReadConferenceQueryVariables>(READ_CONFERENCE, { variables: { id: parseInt(params.id) } });
  const [updateConferenceMutation, { loading: mutating }] = useMutation<UpdateConferenceMutation, UpdateConferenceMutationVariables>(UPDATE_CONFERENCE, {
    update: (cache, { data }) => {
      const currentUsers = cache.readQuery<IndexUsersQuery>({ query: INDEX_CONFERENCES });
      cache.writeQuery({
        query: INDEX_CONFERENCES,
        data: {
          users: currentUsers?.users?.map((conference) =>
            conference.id === data?.conferences?.updateConference?.conference.id ? data.conferences.updateConference.conference : conference
          )
        }
      });
    }
  });

  const saveConference = (conference: ConferenceInput) => {
    const currentConference = data?.conferences?.find((conference) => conference);
    if (currentConference?.id) {
      updateConferenceMutation({ variables: { conference: { ...conference, participants: [] }, id: currentConference.id } }).then(() => {
        navigate(CONFIGURATION.paths.verification.conference);
      });
    }
  };

  return (
    <DefaultLayout
      pageHeader={
        <PageHeader
          title={intl.formatMessage({ id: 'label.verification' })}
          subTitle={intl.formatMessage({ id: 'label.edit-conference' })}
          onBack={() => navigate(CONFIGURATION.paths.verification.conference)}
        />
      }
    >
      {data ? <ConferenceForm save={saveConference} loading={loading || mutating} initialConference={data?.conferences?.find((conference) => conference)} /> : <Spin />}
    </DefaultLayout>
  );
}
