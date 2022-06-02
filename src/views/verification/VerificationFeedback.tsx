import { gql, useMutation, useQuery } from '@apollo/client';
import { Button, Checkbox, Form, Input, message, Space, Spin } from 'antd';
import { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useNavigate, useParams } from 'react-router';
import {
  ReadVerificationFeedbackQuery,
  ReadVerificationFeedbackQueryVariables,
  SendVerificationFeedbackMutation,
  SendVerificationFeedbackMutationVariables
} from '../../../graphql-types';
import HelpContainer from '../../components/HelpContainer';
import CONFIGURATION from '../../configuration';
import DefaultLayout from '../../layouts/DefaultLayout';
import NarrowLayout from '../../layouts/NarrowLayout';
import HeaderSection from '../../layouts/sections/HeaderSection';

const READ_VERIFICATION_FEEDBACK = gql`
  query ReadVerificationFeedback($token: String!) {
    verificationFeedback(token: $token) {
      changeGrading
      comment
      dossier {
        candidate {
          forename
          surname
        }
      }
    }
  }
`;

const SEND_VERIFICATION_FEEDBACK = gql`
  mutation SendVerificationFeedback($token: String!, $changeGrading: Boolean!, $comment: String) {
    verificationFeedback(token: $token, changeGrading: $changeGrading, comment: $comment) {
      verification {
        id
      }
    }
  }
`;

type VerificationFeedbackForm = {
  changeGrading: boolean;
  comment: string;
};

export default function VerificationFeedback() {
  const [commentRequired, setCommentRequired] = useState(false);
  const params = useParams();
  const intl = useIntl();
  const navigate = useNavigate();
  const { loading, data } = useQuery<ReadVerificationFeedbackQuery, ReadVerificationFeedbackQueryVariables>(READ_VERIFICATION_FEEDBACK, {
    variables: {
      token: params.token || ''
    },
    fetchPolicy: 'network-only',
    onCompleted: (data) => setCommentRequired(data.verificationFeedback?.changeGrading || false),
    onError: () => {
      message.error(intl.formatMessage({ id: 'error.unable-to-fetch' }));
      navigate(CONFIGURATION.paths.signIn);
    }
  });
  const [sendVerificationFeedback, { loading: mutating }] = useMutation<SendVerificationFeedbackMutation, SendVerificationFeedbackMutationVariables>(SEND_VERIFICATION_FEEDBACK, {
    onError: () => message.error(intl.formatMessage({ id: 'error.unable-to-fetch' })),
    onCompleted: () => message.success(intl.formatMessage({ id: 'success.data-saved' }))
  });

  const handleSubmit = (values: VerificationFeedbackForm) => {
    sendVerificationFeedback({ variables: { ...values, token: params.token || '' } });
  };

  return (
    <DefaultLayout sider={null} header={<HeaderSection menu={null} />}>
      <NarrowLayout>
        {loading ? (
          <Spin />
        ) : (
          <Space direction="vertical" size="large">
            <HelpContainer>
              <FormattedMessage
                id="help.verification-result"
                values={{
                  forename: <strong>{data?.verificationFeedback?.dossier.candidate.forename}</strong>,
                  surname: <strong>{data?.verificationFeedback?.dossier.candidate.surname}</strong>,
                  url: <a href="https://docs.google.com/document/d/1EPDhMYzHcrlP4BDxou1gAWVuuYymCaVx3QeZe5e_Rwc">Änderungsformular</a>
                }}
              />
            </HelpContainer>
            <Form<VerificationFeedbackForm>
              onFinish={handleSubmit}
              initialValues={{ changeGrading: data?.verificationFeedback?.changeGrading || false, comment: data?.verificationFeedback?.comment }}
            >
              <Form.Item label={intl.formatMessage({ id: 'attribute.change-of-evaluation' })} name="changeGrading" labelCol={{ span: 4 }} valuePropName="checked">
                <Checkbox disabled={mutating} onChange={(e) => setCommentRequired(e.target.checked)} />
              </Form.Item>
              <Form.Item label={intl.formatMessage({ id: 'attribute.comment' })} name="comment" labelCol={{ span: 4 }} rules={[{ required: commentRequired }]}>
                <Input.TextArea rows={10} disabled={mutating} />
              </Form.Item>
              <Form.Item wrapperCol={{ offset: 4 }}>
                <Button type="primary" htmlType="submit" loading={mutating}>
                  <FormattedMessage id="action.hand-in" tagName="span" />
                </Button>
              </Form.Item>
            </Form>
          </Space>
        )}
      </NarrowLayout>
    </DefaultLayout>
  );
}
