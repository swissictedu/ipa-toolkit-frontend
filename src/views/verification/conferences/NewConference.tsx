import { useMutation, gql } from '@apollo/client';
import { PageHeader } from 'antd';
import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router';
import { ConferenceInput, CreateConferenceMutation, CreateConferenceMutationVariables, IndexUsersQuery } from '../../../../graphql-types';
import ConferenceForm from '../../../components/verification/conferences/ConferenceForm';
import CONFIGURATION from '../../../configuration';
import DefaultLayout from '../../../layouts/DefaultLayout';
import { INDEX_CONFERENCES } from './ListConferences';

const CREATE_CONFERENCE = gql`
  mutation CreateConference($conference: ConferenceInput!) {
    conferences {
      createConference(conference: $conference) {
        conference {
          id
          name
        }
      }
    }
  }
`;

export default function NewConference() {
  const intl = useIntl();
  const navigate = useNavigate();
  const [createConferenceMutation, { loading }] = useMutation<CreateConferenceMutation, CreateConferenceMutationVariables>(CREATE_CONFERENCE, {
    update: (cache, { data }) => {
      const currentUsers = cache.readQuery<IndexUsersQuery>({ query: INDEX_CONFERENCES });
      cache.writeQuery({ query: INDEX_CONFERENCES, data: { conferences: { ...currentUsers?.users, ...data?.conferences?.createConference } } });
    }
  });

  const saveConference = (conference: ConferenceInput) => {
    createConferenceMutation({
      variables: { conference: { ...conference, participants: [] } }
    }).then(() => {
      navigate(CONFIGURATION.paths.verification.conference);
    });
  };

  return (
    <DefaultLayout
      pageHeader={
        <PageHeader
          title={intl.formatMessage({ id: 'label.conference-management' })}
          subTitle={intl.formatMessage({ id: 'label.new-conference' })}
          onBack={() => navigate(CONFIGURATION.paths.verification.conference)}
        />
      }
    >
      <ConferenceForm save={saveConference} loading={loading} />
    </DefaultLayout>
  );
}
