import { useQuery, gql, useMutation } from '@apollo/client';
import { PageHeader, Spin } from 'antd';
import { useIntl } from 'react-intl';
import { useNavigate, useParams } from 'react-router';
import CONFIGURATION from '../../../configuration';
import DefaultLayout from '../../../layouts/DefaultLayout';
import {
  ReadConferenceQuery,
  ReadConferenceQueryVariables,
  UpdateConferenceMutation,
  UpdateConferenceMutationVariables,
  ConferenceInput,
  IndexConferencesQuery
} from '../../../../graphql-types';
import { INDEX_CONFERENCES } from './ListConferences';
import ConferenceForm from '../../../components/verification/conferences/ConferenceForm';

export const READ_CONFERENCE = gql`
  query ReadConference($id: Int!) {
    conferences(id: $id) {
      id
      name
      participants {
        id
        forename
        surname
        email
      }
    }
  }
`;

const UPDATE_CONFERENCE = gql`
  mutation UpdateConference($conference: ConferenceInput!) {
    conferences {
      updateConference(conference: $conference) {
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
  const { id } = useParams();
  const navigate = useNavigate();
  const { loading, data } = useQuery<ReadConferenceQuery, ReadConferenceQueryVariables>(READ_CONFERENCE, { variables: { id: parseInt(id || '0') }, fetchPolicy: 'network-only' });
  const [updateConferenceMutation, { loading: mutating }] = useMutation<UpdateConferenceMutation, UpdateConferenceMutationVariables>(UPDATE_CONFERENCE, {
    update: (cache, { data }) => {
      const currentConference = cache.readQuery<IndexConferencesQuery>({ query: INDEX_CONFERENCES });
      cache.writeQuery({
        query: INDEX_CONFERENCES,
        data: {
          conferences: currentConference?.conferences?.map((conference) =>
            conference.id === data?.conferences?.updateConference?.conference.id ? data.conferences.updateConference.conference : conference
          )
        }
      });
    }
  });

  const saveConference = (conference: ConferenceInput) => {
    const currentConference = data?.conferences?.find((conference) => conference);
    if (currentConference?.id) {
      updateConferenceMutation({ variables: { conference: { ...conference, id: currentConference.id } } }).then(() => {
        navigate(CONFIGURATION.paths.verification.conference);
      });
    }
  };

  let currentConference = data?.conferences?.find((conference) => conference);
  if (currentConference) {
    const participants = currentConference?.participants.map((p) => {
      const { __typename, ...participant } = p;
      return participant;
    });
    currentConference = { ...currentConference, participants };
  }

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
      {data ? <ConferenceForm save={saveConference} loading={loading || mutating} initialConference={currentConference} /> : <Spin />}
    </DefaultLayout>
  );
}
