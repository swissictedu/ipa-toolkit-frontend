import { Button, Form, Input } from 'antd';
import { FormattedMessage, useIntl } from 'react-intl';
import { UserInput } from '../../../graphql-types';

type UserFormProps = {
  save: (user: UserInput) => void;
  loading?: boolean;
};

export default function UserForm({ save, loading }: UserFormProps) {
  const intl = useIntl();

  return (
    <Form<UserInput> layout="vertical" onFinish={save} autoComplete="off">
      <Form.Item name="email" label={intl.formatMessage({ id: 'attribute.email' })} rules={[{ required: true }]}>
        <Input type="email" />
      </Form.Item>
      <Form.Item name="name" label={intl.formatMessage({ id: 'attribute.name' })} rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="nickname" label={intl.formatMessage({ id: 'attribute.nickname' })}>
        <Input />
      </Form.Item>
      <Form.Item name="password" label={intl.formatMessage({ id: 'attribute.password' })} rules={[{ required: true }]}>
        <Input.Password autoComplete="new-password" minLength={6} />
      </Form.Item>
      <Form.Item name="passwordConfirmation" label={intl.formatMessage({ id: 'attribute.password-confirmation' })} rules={[{ required: true }]}>
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
