import { gql, useLazyQuery } from '@apollo/client';
import { Button, Form, Input, message, Space, Table, TableColumnType } from 'antd';
import React, { Fragment, useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Credentials } from '../../../models/Credentials';
import { RetrieveEvaluationQuery, RetrieveEvaluationQueryVariables } from '../../../../graphql-types';
import { css } from '@emotion/react';
import CONFIGURATION from '../../../configuration';
import HelpContainer from '../../../components/HelpContainer';

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

type RecordType = Record<string, string | number>;

type ResultType = {
  fields: string[];
  rows: RecordType[];
  total: number;
};

type DataSourceType = RecordType & { key: number };

type EvaluationForm = {
  evaluationPath: string;
};

type SelectionContainerProps = {
  credentials: Credentials;
  isValid: (state: boolean) => void;
  setSelection: (selection: RecordType[]) => void;
};

export default function SelectionContainer({ isValid, credentials, setSelection }: SelectionContainerProps) {
  const intl = useIntl();
  const [columns, setColumns] = useState<TableColumnType<DataSourceType>[]>();
  const [dataSource, setDataSource] = useState<DataSourceType[]>();
  const [executeRetrieveEvaluation, { loading, data }] = useLazyQuery<RetrieveEvaluationQuery, RetrieveEvaluationQueryVariables>(RETRIEVE_EVALUATION);

  const retrieveEvaluation = (values: EvaluationForm) => {
    let evaluationPath = values.evaluationPath.replace(credentials.baseUrl, '');
    if (evaluationPath.indexOf('api=json') === -1) {
      evaluationPath = `${evaluationPath}&api=json`;
    }
    executeRetrieveEvaluation({ variables: { ...credentials, evaluationPath } });
  };

  const onSelectionChange = (_selectedRowKeys: React.Key[], selectedRows: DataSourceType[]) => {
    if (selectedRows.length > 0) {
      setSelection(selectedRows);
      isValid(true);
    } else {
      isValid(false);
    }
  };

  useEffect(() => {
    if (data?.pkorg?.evaluation?.result) {
      const result = JSON.parse(data.pkorg.evaluation.result) as ResultType;
      if (result.fields) {
        const parsedColumns: TableColumnType<DataSourceType>[] = result.fields.map((field) => ({ key: field, title: field, dataIndex: field }));
        // Get unique values for first row and create filters from it
        const uniqueFirstRowFilters = [...new Set(result.rows.map((row) => Object.values(row)[0]))].map((value) => ({ text: value, value }));
        parsedColumns[0] = {
          ...parsedColumns[0],
          defaultFilteredValue: [],
          filters: uniqueFirstRowFilters,
          onFilter: (value, record) => Object.values(record)[1].toString().indexOf(value.toString()) === 0
        };
        setColumns(parsedColumns);
        setDataSource(result.rows.map((row, i) => ({ key: i, ...row })));
      } else {
        message.error(intl.formatMessage({ id: 'error.unable-to-fetch' }));
      }
    }
  }, [data]);

  return (
    <Fragment>
      <Space direction="vertical" size="large">
        <HelpContainer>
          <FormattedMessage id="help.conference-import-selection" />
        </HelpContainer>
        <Form<EvaluationForm> layout="inline" onFinish={retrieveEvaluation}>
          <Form.Item
            label={intl.formatMessage({ id: 'label.evaluation-path' })}
            name="evaluationPath"
            css={flexGrow}
            rules={[{ required: true }]}
            initialValue={`${credentials.baseUrl}/${CONFIGURATION.defaultValues.evaluationPath}`}
          >
            <Input disabled={loading} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              <FormattedMessage id="action.load" tagName="span" />
            </Button>
          </Form.Item>
        </Form>
        <Table<DataSourceType>
          loading={loading}
          columns={columns}
          dataSource={dataSource}
          scroll={{ x: 800 }}
          rowSelection={{ type: 'checkbox', onChange: onSelectionChange }}
        ></Table>
      </Space>
    </Fragment>
  );
}
