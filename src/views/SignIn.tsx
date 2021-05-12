import { gql, useMutation } from '@apollo/client';
import { css } from '@emotion/react';
import { Button, Card, Form, Input, message } from 'antd';
import { FormattedMessage, useIntl } from 'react-intl';
import CenterLayout from '../layouts/CenterLayout';
import DefaultLayout from '../layouts/DefaultLayout';
import HeaderSection from '../layouts/sections/HeaderSection';
import { SignInMutation, SignInMutationVariables } from '../../graphql-types';
import { useState } from 'react';
import { setSessionVar } from '../cache';
import { useNavigate } from 'react-router';
import CONFIGURATION from '../configuration';

const formStyles = css`
  .ant-form-item:last-of-type {
    margin-bottom: 0;
  }
`;

const cardStyles = css`
  width: 26rem;
`;

const SIGN_IN = gql`
  mutation SignIn($email: String!, $password: String!) {
    userLogin(email: $email, password: $password) {
      authenticatable {
        email
        name
      }
      credentials {
        accessToken
        expiry
      }
    }
  }
`;

export default function SignIn() {
  const intl = useIntl();
  const [loading, isLoading] = useState(false);
  const [form] = Form.useForm<SignInMutationVariables>();
  const [signIn] = useMutation<SignInMutation, SignInMutationVariables>(SIGN_IN);
  const navigate = useNavigate();

  const submitSignIn = (values: SignInMutationVariables) => {
    isLoading(true);
    signIn({ variables: values })
      .then(({ data }) => {
        const userLogin = data?.userLogin;
        if (userLogin) {
          setSessionVar({
            expiration: userLogin.credentials.expiry,
            identifier: userLogin.authenticatable.email,
            name: userLogin.authenticatable.name ?? '',
            token: userLogin.credentials.accessToken
          });
        }
        navigate(CONFIGURATION.paths.dashboard);
      })
      .catch(() => {
        message.error(intl.formatMessage({ id: 'error.wrong-credentials' }));
        form.setFields([
          { name: 'email', errors: [''] },
          { name: 'password', errors: [''] }
        ]);
      })
      .finally(() => {
        isLoading(false);
      });
  };

  return (
    <DefaultLayout sider={null} header={<HeaderSection menu={null} />}>
      <CenterLayout>
        <Card title={intl.formatMessage({ id: 'view.sign-in' })} css={cardStyles}>
          <Form form={form} onFinish={submitSignIn} css={formStyles}>
            <Form.Item label={intl.formatMessage({ id: 'attribute.email' })} name="email" rules={[{ required: true }]} labelCol={{ span: 8 }}>
              <Input disabled={loading} />
            </Form.Item>
            <Form.Item label={intl.formatMessage({ id: 'attribute.password' })} name="password" rules={[{ required: true }]} labelCol={{ span: 8 }}>
              <Input.Password disabled={loading} />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 8 }}>
              <Button type="primary" htmlType="submit" loading={loading}>
                <FormattedMessage id="action.sign-in" tagName="span" />
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </CenterLayout>
    </DefaultLayout>
  );
}
