import { Button, Form, Input } from 'antd';
import { FormattedMessage, useIntl } from 'react-intl';
import { UserInput } from '../../../graphql-types';

type UserFormProps = {
  save: (user: UserInput) => void;
};

export default function UserForm() {
  const intl = useIntl();

  return (
    <Form<UserInput>>
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
        <Input.Password />
      </Form.Item>
      <Form.Item>
        <Button htmlType="submit" type="primary">
          <FormattedMessage id="action.save" />
        </Button>
      </Form.Item>
    </Form>
  );
}
