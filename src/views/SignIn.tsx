import styled from '@emotion/styled';
import { Button, Card, Form, Input } from 'antd';
import { FormattedMessage, useIntl } from 'react-intl';
import CenterLayout from '../layouts/CenterLayout';
import DefaultLayout from '../layouts/DefaultLayout';
import HeaderSection from '../layouts/sections/HeaderSection';

const StyledForm = styled(Form)`
  .ant-form-item:last-of-type {
    margin-bottom: 0;
  }
`;

export default function SignIn() {
  const intl = useIntl();

  return (
    <DefaultLayout sider={null} header={<HeaderSection menu={null} />}>
      <CenterLayout>
        <Card title={intl.formatMessage({ id: 'view.sign-in' })}>
          <StyledForm>
            <Form.Item label={intl.formatMessage({ id: 'attribute.username' })} name="username" rules={[{ required: true, message: 'Please input your username!' }]}>
              <Input />
            </Form.Item>
            <Form.Item label={intl.formatMessage({ id: 'attribute.password' })} name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
              <Input.Password />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 8, span: 4 }}>
              <Button type="primary" htmlType="submit">
                <FormattedMessage id="action.sign-in" />
              </Button>
            </Form.Item>
          </StyledForm>
        </Card>
      </CenterLayout>
    </DefaultLayout>
  );
}
