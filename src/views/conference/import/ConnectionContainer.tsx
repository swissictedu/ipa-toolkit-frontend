/* eslint-disable no-script-url */
import { gql, useLazyQuery } from '@apollo/client';
import ConnectionForm from '../../../components/conference/ConnectionForm';
import { Credentials } from '../../../models/Credentials';
import { CheckConnectionQuery, CheckConnectionQueryVariables } from '../../../../graphql-types';
import { Fragment, useEffect, useRef } from 'react';
import { Button, Result, Skeleton } from 'antd';
import { FormattedMessage, useIntl } from 'react-intl';
import { Affiliation } from '../../../models/Affiliations';

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
    <Fragment>
      <Button disabled={true} href="javascript:alert(document.cookie.split('=')[1]);">
        <FormattedMessage id="label.session-token-extractor" />
      </Button>
      <ConnectionForm checkConnection={checkConnection} loading={loading} />
      {called && loading && <Skeleton loading={loading} />}
      {data && (
        <Result
          status="success"
          title={intl.formatMessage({ id: 'success.connection-established' })}
          subTitle={`${data.pkorg?.sessionUser?.forename} ${data.pkorg?.sessionUser?.surname} (${data.pkorg?.sessionUser?.email})`}
        />
      )}
    </Fragment>
  );
}
