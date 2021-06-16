import { Button, Form, Input, Space } from 'antd';
import { FormattedMessage, useIntl } from 'react-intl';
import { Conference, ConferenceInput } from '../../../../graphql-types';
import { Fragment } from 'react';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';

const participantRowStyle = css`
  width: 100%;
  align-items: center;

  .ant-space-item:not(:last-child) {
    flex-grow: 1;
  }
`;

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
      <Form.Item name="password" label={intl.formatMessage({ id: 'attribute.password' })} rules={[{ required: !initialConference }]}>
        <Input.Password autoComplete="new-password" minLength={6} />
      </Form.Item>
      <Form.List name="participants">
        {(fields, { add, remove }) => (
          <Fragment>
            {fields.map((field) => (
              <Space key={field.key} align="baseline" css={participantRowStyle}>
                <Form.Item
                  {...field}
                  name={[field.name, 'forename']}
                  fieldKey={[field.name, 'forename']}
                  label={intl.formatMessage({ id: 'attribute.forename' })}
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  {...field}
                  name={[field.name, 'surname']}
                  fieldKey={[field.name, 'surname']}
                  label={intl.formatMessage({ id: 'attribute.surname' })}
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  {...field}
                  name={[field.name, 'email']}
                  fieldKey={[field.name, 'email']}
                  label={intl.formatMessage({ id: 'attribute.email' })}
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>
                <MinusCircleOutlined onClick={() => remove(field.name)} />
              </Space>
            ))}
            <Form.Item>
              <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                <FormattedMessage id="label.add-participant" tagName="span" />
              </Button>
            </Form.Item>
          </Fragment>
        )}
      </Form.List>
      <Form.Item>
        <Button htmlType="submit" type="primary" loading={loading}>
          <FormattedMessage id="action.save" tagName="span" />
        </Button>
      </Form.Item>
    </Form>
  );
}
