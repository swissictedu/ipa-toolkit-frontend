import { gql, useLazyQuery } from '@apollo/client';
import Connection from '../../../components/conference/Connection';
import { Credentials } from '../../../models/Credentials';
import { CheckConnectionQuery, CheckConnectionQueryVariables } from '../../../../graphql-types';
import { Fragment, useEffect } from 'react';
import { Result, Skeleton } from 'antd';
import { useIntl } from 'react-intl';

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
};

export default function ConnectionContainer({ isValid }: ConnectionContainerProps) {
  const intl = useIntl();
  const [executeCheckConnection, { called, loading, data }] = useLazyQuery<CheckConnectionQuery, CheckConnectionQueryVariables>(CHECK_CONNECTION);

  const checkConnection = (credentials: Credentials) => {
    executeCheckConnection({ variables: { ...credentials } });
  };

  useEffect(() => {
    if (data && data.pkorg?.sessionUser?.email) {
      isValid(true);
    }
  }, [data, isValid]);

  return (
    <Fragment>
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
