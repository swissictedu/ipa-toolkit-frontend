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
      <Form.Item name="email" label={intl.formatMessage({ id: 'attribute.email' })}>
        <Input />
      </Form.Item>
      <Form.Item name="name" label={intl.formatMessage({ id: 'attribute.name' })}>
        <Input />
      </Form.Item>
      <Form.Item name="nickname" label={intl.formatMessage({ id: 'attribute.nickname' })}>
        <Input />
      </Form.Item>
      <Form.Item name="password" label={intl.formatMessage({ id: 'attribute.password' })}>
        <Input.Password autoComplete="new-password" />
      </Form.Item>
      <Form.Item name="passwordConfirmation" label={intl.formatMessage({ id: 'attribute.password-confirmation' })}>
        <Input.Password autoComplete="new-password" />
      </Form.Item>
      <Form.Item>
        <Button htmlType="submit" type="primary" loading={loading}>
          <FormattedMessage id="action.save" tagName="span" />
        </Button>
      </Form.Item>
    </Form>
  );
}
