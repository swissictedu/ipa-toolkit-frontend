import { MailOutlined } from '@ant-design/icons';
import { Button, Form, Input, Modal } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { Fragment, useState } from 'react';
import { useIntl } from 'react-intl';

type InvitationFormModel = {
  email: string;
};

type InvitationFormProps = {
  invite: (email: string) => void;
};

export default function InvitationForm({ invite }: InvitationFormProps) {
  const [open, isOpen] = useState(false);
  const toggleOpen = () => isOpen(!open);
  const [form] = useForm<InvitationFormModel>();
  const intl = useIntl();

  const handleSubmit = (values: InvitationFormModel) => {
    invite(values.email);
    toggleOpen();
  };

  return (
    <Fragment>
      <Button icon={<MailOutlined />} onClick={() => toggleOpen()} />
      <Modal
        visible={open}
        onCancel={() => toggleOpen()}
        onOk={() => form.validateFields().then(() => form.submit())}
        title={intl.formatMessage({ id: 'label.verification-invitation' })}
      >
        <Form form={form} onFinish={handleSubmit}>
          <Form.Item name="email" label={intl.formatMessage({ id: 'attribute.email' })} rules={[{ required: true }]}>
            <Input type="email" />
          </Form.Item>
        </Form>
      </Modal>
    </Fragment>
  );
}
