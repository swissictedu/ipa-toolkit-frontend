import { css } from '@emotion/react';
import { Button, Form, Input } from 'antd';
import { Fragment, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import CONFIGURATION from '../../../configuration';
import { Credentials } from '../../../models/Credentials';

const fullWidth = css`
  width: 100%;
`;

const flexGrow = css`
  && {
    flex-grow: 1;
  }
`;

type ImportContainerProps = {
  credentials: Credentials;
  selection: Record<string, string | number>[];
};

type ImportForm = {};

export default function ImportContainer({ credentials, selection }: ImportContainerProps) {
  const intl = useIntl();
  const [dossierPath, setDossierPath] = useState('');
  const generateDossierPaths = () => {};
  const loading = false;

  return (
    <Fragment>
      <Form<ImportForm> layout="inline" onFinish={generateDossierPaths}>
        <Form.Item
          label={intl.formatMessage({ id: 'label.evaluation-path' })}
          name="evaluationPath"
          css={flexGrow}
          rules={[{ required: true }]}
          initialValue={CONFIGURATION.defaultValues.dossierPath}
        >
          <Input onChange={(e) => setDossierPath(`${e.target.value}&api=json`)} disabled={loading} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            <FormattedMessage id="action.load" tagName="span" />
          </Button>
        </Form.Item>
      </Form>
    </Fragment>
  );
}
