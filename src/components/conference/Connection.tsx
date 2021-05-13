import { Button, Form, Input } from 'antd';
import { FormattedMessage, useIntl } from 'react-intl';
import { Credentials } from '../../models/Credentials';

type ConnectionProps = {
  testCredentials?: (credentials: Credentials) => void;
  loading?: boolean;
};

export default function Connection({ loading = false, testCredentials }: ConnectionProps) {
  const intl = useIntl();

  return (
    <Form<Credentials> layout="vertical" onFinish={testCredentials}>
      <Form.Item label={intl.formatMessage({ id: 'label.pkorg-endpoint' })} name="endpoint" rules={[{ required: true }]}>
        <Input placeholder={intl.formatMessage({ id: 'label.pkorg-endpoint-placeholder' }, { year: new Date().getFullYear() })} />
      </Form.Item>
      <Form.Item label={intl.formatMessage({ id: 'label.current-pkorg-session-key' })} name="sessionToken" rules={[{ required: true }]}>
        <Input placeholder={intl.formatMessage({ id: 'label.current-pkorg-session-key-placeholder' })} />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          <FormattedMessage id="action.test-entry" tagName="span" />
        </Button>
      </Form.Item>
    </Form>
  );
}
