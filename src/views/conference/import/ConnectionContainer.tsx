import { gql, useLazyQuery } from '@apollo/client';
import Connection from '../../../components/conference/Connection';
import { Credentials } from '../../../models/Credentials';
import { CheckConnectionQuery, CheckConnectionQueryVariables } from '../../../../graphql-types';
import { Fragment, useEffect, useRef } from 'react';
import { Button, Result, Skeleton } from 'antd';
import { FormattedMessage, useIntl } from 'react-intl';

const CHECK_CONNECTION = gql`
  query CheckConnection($baseUrl: String!, $sessionToken: String!, $userAgent: String!) {
    pkorg(baseUrl: $baseUrl, sessionToken: $sessionToken, userAgent: $userAgent) {
      sessionUser {
        email
        forename
        surname
      }
    }
  }
`;

type ConnectionContainerProps = {
  isValid: (state: boolean) => void;
  setCredentials: (credentials: Credentials) => void;
};

export default function ConnectionContainer({ isValid, setCredentials }: ConnectionContainerProps) {
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
      setCredentials(currentCredentials.current);
    }
  }, [data, isValid, setCredentials]);

  return (
    <Fragment>
      <Button disabled={true} href="javascript:alert(document.cookie.split('=')[1]);">
        <FormattedMessage id="label.session-token-extractor" />
      </Button>
      <Connection checkConnection={checkConnection} loading={loading} />
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
