import { css } from '@emotion/react';
import { Button, Form, Input, Space, Table, TableColumnType } from 'antd';
import { Fragment, useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { DossierInput, ImportDossiersMutation, ImportDossiersMutationVariables } from '../../../../graphql-types';
import CONFIGURATION from '../../../configuration';
import { Credentials } from '../../../models/Credentials';
import mapToDossierInput from '../../../utils/mappers/DossierInputMapper';
import { gql, useLazyQuery, useMutation } from '@apollo/client';
import { Affiliation } from '../../../models/Affiliations';
import { Link } from 'react-router-dom';

const fullWidth = css`
  width: 100%;
`;

const flexGrow = css`
  && {
    flex-grow: 1;
  }
`;

const IMPORT_DOSSIERS = gql`
  mutation ImportDossiers($baseUrl: String!, $sessionToken: String!, $userAgent: String!, $dossiers: [DossierInput!]!) {
    pkorg(baseUrl: $baseUrl, sessionToken: $sessionToken, userAgent: $userAgent) {
      importDossiers(dossiers: $dossiers) {
        importCount
      }
    }
  }
`;

type ImportTable = {
  tenantName: string;
  candidateForename: string;
  candidateSurname: string;
  dossierPath: string;
};

type ImportContainerProps = {
  credentials: Credentials;
  affiliations: Affiliation[];
  selection: Record<string, string | number>[];
};

export default function ImportContainer({ credentials, affiliations, selection }: ImportContainerProps) {
  const intl = useIntl();
  const [dossierPath, setDossierPath] = useState(`${credentials.baseUrl}/${CONFIGURATION.defaultValues.dossierPath}`);
  const [dossiers, setDossiers] = useState<DossierInput[]>([]);
  const [importDossiers, { loading, data }] = useMutation<ImportDossiersMutation, ImportDossiersMutationVariables>(IMPORT_DOSSIERS);

  useEffect(() => {
    setDossiers(mapToDossierInput(selection, affiliations, dossierPath));
  }, [affiliations, selection, dossierPath]);

  const importTableColumns: TableColumnType<ImportTable>[] = [
    {
      title: intl.formatMessage({ id: 'label.tenant' }),
      dataIndex: 'tenantName'
    },
    {
      title: intl.formatMessage({ id: 'label.candidate-forename' }),
      dataIndex: 'candidateForename'
    },
    {
      title: intl.formatMessage({ id: 'label.candidate-surname' }),
      dataIndex: 'candidateSurname'
    },
    {
      title: intl.formatMessage({ id: 'label.dossier-path' }),
      dataIndex: 'dossierPath',
      render: (value: string) => (
        <Button type="link" href={value} loading={loading}>
          {value}
        </Button>
      )
    }
  ];

  const executeImportDossiers = () => {
    importDossiers({ variables: { ...credentials, dossiers } });
  };

  return (
    <Fragment>
      <Space direction="vertical" size="large" css={fullWidth}>
        <Form layout="inline">
          <Form.Item label={intl.formatMessage({ id: 'label.evaluation-path' })} name="dossierPath" css={flexGrow} rules={[{ required: true }]} initialValue={dossierPath}>
            <Input onChange={(e) => setDossierPath(e.target.value)} disabled={loading} />
          </Form.Item>
        </Form>
        <Table<ImportTable>
          columns={importTableColumns}
          dataSource={
            dossiers.map((dossier) => ({
              tenantName: dossier.affiliation.tenantName,
              candidateForename: dossier.candidate.forename,
              candidateSurname: dossier.candidate.surname,
              dossierPath: dossier.dossierPath
            })) as ImportTable[]
          }
        />
        <Button type="primary" onClick={executeImportDossiers}>
          <FormattedMessage id="action.import" tagName="span" />
        </Button>
        <span>{data?.pkorg?.importDossiers?.importCount}</span>
      </Space>
    </Fragment>
  );
}
