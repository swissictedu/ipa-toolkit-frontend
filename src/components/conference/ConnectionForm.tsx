import { Button, Form, Input } from 'antd';
import { FormattedMessage, useIntl } from 'react-intl';
import { Credentials } from '../../models/Credentials';

type ConnectionProps = {
  checkConnection?: (credentials: Credentials) => void;
  loading?: boolean;
};

export default function ConnectionForm({ loading = false, checkConnection }: ConnectionProps) {
  const intl = useIntl();

  return (
    <Form<Credentials> layout="vertical" onFinish={checkConnection}>
      <Form.Item
        label={intl.formatMessage({ id: 'label.pkorg-endpoint' })}
        name="baseUrl"
        rules={[{ required: true }]}
        initialValue={intl.formatMessage({ id: 'label.pkorg-endpoint-default' }, { year: new Date().getFullYear() })}
      >
        <Input placeholder={intl.formatMessage({ id: 'label.pkorg-endpoint-placeholder' }, { year: new Date().getFullYear() })} disabled={loading} />
      </Form.Item>
      <Form.Item label={intl.formatMessage({ id: 'label.user-agent' })} name="userAgent" rules={[{ required: true }]} initialValue={navigator.userAgent}>
        <Input disabled={loading} />
      </Form.Item>
      <Form.Item label={intl.formatMessage({ id: 'label.session-token' })} name="sessionToken" rules={[{ required: true }]}>
        <Input placeholder={intl.formatMessage({ id: 'label.session-token-placeholder' })} disabled={loading} />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          <FormattedMessage id="action.test-entry" tagName="span" />
        </Button>
      </Form.Item>
    </Form>
  );
}
