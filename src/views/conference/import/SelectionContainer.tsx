import { gql, useLazyQuery } from '@apollo/client';
import { Button, Form, Input, Space, Table } from 'antd';
import { Fragment, useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Credentials } from '../../../models/Credentials';
import { RetrieveEvaluationQuery, RetrieveEvaluationQueryVariables } from '../../../../graphql-types';
import { css } from '@emotion/react';

const fullWidth = css`
  width: 100%;
`;

const flexGrow = css`
  && {
    flex-grow: 1;
  }
`;

const RETRIEVE_EVALUATION = gql`
  query RetrieveEvaluation($baseUrl: String!, $sessionToken: String!, $userAgent: String!, $evaluationPath: String!) {
    pkorg(baseUrl: $baseUrl, sessionToken: $sessionToken, userAgent: $userAgent) {
      evaluation(evaluationPath: $evaluationPath) {
        result
      }
    }
  }
`;

type ResultType = {
  fields: string[];
  rows: Record<string, string | number>[];
  total: number;
};

type EvaluationForm = {
  evaluationPath: string;
};

type SelectionContainerProps = {
  credentials: Credentials;
  isValid: (state: boolean) => void;
};

export default function SelectionContainer({ isValid, credentials }: SelectionContainerProps) {
  const intl = useIntl();
  const [columns, setColumns] = useState<any>();
  const [dataSource, setDataSource] = useState<any>();
  const [evaluationPath, setEvaluationPath] = useState('');
  const [executeRetrieveEvaluation, { loading, data }] = useLazyQuery<RetrieveEvaluationQuery, RetrieveEvaluationQueryVariables>(RETRIEVE_EVALUATION);

  const retrieveEvaluation = () => {
    executeRetrieveEvaluation({ variables: { ...credentials, evaluationPath } });
  };

  useEffect(() => {
    if (data?.pkorg?.evaluation?.result) {
      const result = JSON.parse(data.pkorg.evaluation.result) as ResultType;
      setColumns(result.fields.map((field) => ({ key: field, title: field, dataIndex: field })));
      setDataSource(result.rows.map((row, i) => ({ key: i, ...row })));
    }
  }, [data]);

  return (
    <Fragment>
      <Space direction="vertical" size="large" css={fullWidth}>
        <Form<EvaluationForm> layout="inline" onFinish={retrieveEvaluation}>
          <Form.Item label={intl.formatMessage({ id: 'label.evaluation-path' })} name="evaluationPath" css={flexGrow} rules={[{ required: true }]}>
            <Input onChange={(e) => setEvaluationPath(`${e.target.value}&api=json`)} disabled={loading} />
          </Form.Item>
          <Form.Item label={intl.formatMessage({ id: 'label.preview' })}>{`${credentials.baseUrl}/${evaluationPath}`}</Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              <FormattedMessage id="action.load" tagName="span" />
            </Button>
          </Form.Item>
        </Form>
        <Table loading={loading} columns={columns} dataSource={dataSource} scroll={{ x: 800 }} rowSelection={{ type: 'checkbox', onSelect: () => console.log('j') }}></Table>
      </Space>
    </Fragment>
  );
}
