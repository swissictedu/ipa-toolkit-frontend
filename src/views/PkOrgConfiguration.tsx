import { Form, Input, Modal, Typography } from 'antd';
import { Fragment, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

export default function PkOrgConfiguration() {
  const intl = useIntl();
  const [open, isOpen] = useState(false);

  const toggleOpen = () => isOpen(!open);

  return (
    <Fragment>
      <Typography.Link onClick={toggleOpen}>
        <FormattedMessage id="label.pkorg-access" />
      </Typography.Link>
      <Modal title={intl.formatMessage({ id: 'label.pkorg-access' })} visible={open} onCancel={toggleOpen}>
        <Form layout="vertical">
          <Form.Item label={intl.formatMessage({ id: 'label.pkorg-endpoint' })}>
            <Input placeholder={intl.formatMessage({ id: 'label.pkorg-endpoint-placeholder' })} />
          </Form.Item>
          <Form.Item label={intl.formatMessage({ id: 'label.current-pkorg-session-key' })}>
            <Input placeholder={intl.formatMessage({ id: 'label.current-pkorg-session-key-placeholder' })} />
          </Form.Item>
        </Form>
      </Modal>
    </Fragment>
  );
}
