/* eslint-disable no-script-url */
import { gql, useLazyQuery } from '@apollo/client';
import ConnectionForm from '../../../components/verification/ConnectionForm';
import { Credentials } from '../../../models/Credentials';
import { CheckConnectionQuery, CheckConnectionQueryVariables } from '../../../../graphql-types';
import { useEffect, useRef } from 'react';
import { Result, Skeleton, Space } from 'antd';
import { FormattedMessage, useIntl } from 'react-intl';
import { Affiliation } from '../../../models/Affiliations';
import BookmarkletGrabButton from '../../../components/BookmarkletGrabButton';
import HelpContainer from '../../../components/HelpContainer';

// see https://gist.github.com/stefanmaric/2abf96c740191cda3bc7a8b0fc905a7d
const COPY_SESSION_TOKEN_BOOKMARKLET =
  'var b=document.createElement("textarea"),c=document.getSelection();b.textContent=document.cookie.split("=")[1],document.body.appendChild(b),c.removeAllRanges(),b.select(),document.execCommand("copy"),c.removeAllRanges(),document.body.removeChild(b)';

const CHECK_CONNECTION = gql`
  query CheckConnection($baseUrl: String!, $sessionToken: String!, $userAgent: String!) {
    pkorg(baseUrl: $baseUrl, sessionToken: $sessionToken, userAgent: $userAgent) {
      sessionUser {
        email
        forename
        surname
        affiliations {
          tenantName
          tenantId
          role
        }
      }
    }
  }
`;

type ConnectionContainerProps = {
  isValid: (state: boolean) => void;
  setCredentials: (credentials: Credentials) => void;
  setAffiliations: (affiliations: Affiliation[]) => void;
};

export default function ConnectionContainer({ isValid, setCredentials, setAffiliations }: ConnectionContainerProps) {
  const currentCredentials = useRef<Credentials>();
  const intl = useIntl();
  const [executeCheckConnection, { called, loading, data }] = useLazyQuery<CheckConnectionQuery, CheckConnectionQueryVariables>(CHECK_CONNECTION);

  const checkConnection = (credentials: Credentials) => {
    currentCredentials.current = credentials;
    executeCheckConnection({ variables: { ...credentials } });
  };

  useEffect(() => {
    if (data && data.pkorg?.sessionUser?.email && currentCredentials.current) {
      isValid(true);
      setAffiliations(data.pkorg.sessionUser.affiliations);
      setCredentials(currentCredentials.current);
    }
  }, [data, isValid, setCredentials, setAffiliations]);

  return (
    <Space direction="vertical" size="large">
      <HelpContainer>
        <p dangerouslySetInnerHTML={{ __html: intl.formatMessage({ id: 'help.conference-import-connection' }) }} />
        <div>
          <BookmarkletGrabButton code={COPY_SESSION_TOKEN_BOOKMARKLET}>
            <FormattedMessage id="label.copy-session-token-bookmarklet" />
          </BookmarkletGrabButton>
        </div>
      </HelpContainer>
      <ConnectionForm checkConnection={checkConnection} loading={loading} />
      {called && loading && <Skeleton loading={loading} />}
      {data && (
        <Result
          status="success"
          title={intl.formatMessage({ id: 'success.connection-established' })}
          subTitle={`${data.pkorg?.sessionUser?.forename} ${data.pkorg?.sessionUser?.surname} (${data.pkorg?.sessionUser?.email})`}
        />
      )}
    </Space>
  );
}
