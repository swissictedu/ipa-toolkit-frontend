import { css } from '@emotion/react';
import { Button, Form, Input, Space, Table, TableColumnType, Select, message } from 'antd';
import { Fragment, useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { DossierInput, ImportDossiersMutation, ImportDossiersMutationVariables, IndexConferencesQuery } from '../../../../graphql-types';
import CONFIGURATION from '../../../configuration';
import { Credentials } from '../../../models/Credentials';
import mapToDossierInput from '../../../utils/mappers/DossierInputMapper';
import { gql, useMutation, useQuery } from '@apollo/client';
import { Affiliation } from '../../../models/Affiliations';
import HelpContainer from '../../../components/HelpContainer';
import { INDEX_CONFERENCES } from '../conferences/ListConferences';
import { useNavigate } from 'react-router';

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
  const navigate = useNavigate();
  const [dossierPath, setDossierPath] = useState(`${credentials.baseUrl}/${CONFIGURATION.defaultValues.dossierPath}`);
  const [conference, setConference] = useState(0);
  const [dossiers, setDossiers] = useState<DossierInput[]>([]);
  const [importDossiers, { loading: mutating, data }] = useMutation<ImportDossiersMutation, ImportDossiersMutationVariables>(IMPORT_DOSSIERS);
  const { loading, data: conferences } = useQuery<IndexConferencesQuery>(INDEX_CONFERENCES);

  useEffect(() => {
    setDossiers(mapToDossierInput(selection, affiliations, dossierPath, conference));
  }, [affiliations, selection, dossierPath, conference]);

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
        <Button type="link" href={value} loading={loading || mutating}>
          {value}
        </Button>
      )
    }
  ];

  const executeImportDossiers = () => {
    importDossiers({ variables: { ...credentials, dossiers } }).then(() => {
      message.info(intl.formatMessage({ id: 'label.importing-dossiers' }, { count: data?.pkorg?.importDossiers?.importCount }));
      navigate(CONFIGURATION.paths.dashboard);
    });
  };

  return (
    <Fragment>
      <Space direction="vertical" size="large">
        <HelpContainer>
          <FormattedMessage id="help.conference-import-import" />
        </HelpContainer>
        <Form layout="vertical">
          <Form.Item label={intl.formatMessage({ id: 'label.evaluation-path' })} name="dossierPath" css={flexGrow} rules={[{ required: true }]} initialValue={dossierPath}>
            <Input onChange={(e) => setDossierPath(e.target.value)} disabled={loading || mutating} />
          </Form.Item>
          <Form.Item label={intl.formatMessage({ id: 'label.grading-conference' })} name="conference" rules={[{ required: true }]}>
            <Select loading={loading} onChange={(value) => setConference(parseInt(value?.toString() || ''))}>
              {conferences?.conferences?.map((c) => (
                <Select.Option value={c.id}>{c.name}</Select.Option>
              ))}
            </Select>
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
        <Button type="primary" onClick={executeImportDossiers} disabled={conference === 0}>
          <FormattedMessage id="action.import" tagName="span" />
        </Button>
      </Space>
    </Fragment>
  );
}
