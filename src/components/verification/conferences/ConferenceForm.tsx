import { Button, Form, Input } from 'antd';
import { FormattedMessage, useIntl } from 'react-intl';
import { Conference, ConferenceInput } from '../../../../graphql-types';

type ConferenceFormProps = {
  save: (user: ConferenceInput) => void;
  initialConference?: Conference;
  loading?: boolean;
};

export default function ConferenceForm({ save, initialConference, loading }: ConferenceFormProps) {
  const intl = useIntl();

  return (
    <Form<ConferenceInput> layout="vertical" onFinish={save} autoComplete="off" initialValues={initialConference}>
      <Form.Item name="name" label={intl.formatMessage({ id: 'attribute.name' })} rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="nickname" label={intl.formatMessage({ id: 'attribute.nickname' })}>
        <Input />
      </Form.Item>
      <Form.Item name="password" label={intl.formatMessage({ id: 'attribute.password' })} rules={[{ required: !initialConference }]}>
        <Input.Password autoComplete="new-password" minLength={6} />
      </Form.Item>
      <Form.Item name="passwordConfirmation" label={intl.formatMessage({ id: 'attribute.password-confirmation' })} rules={[{ required: !initialConference }]}>
        <Input.Password autoComplete="new-password" minLength={6} />
      </Form.Item>
      <Form.Item>
        <Button htmlType="submit" type="primary" loading={loading}>
          <FormattedMessage id="action.save" tagName="span" />
        </Button>
      </Form.Item>
    </Form>
  );
}
