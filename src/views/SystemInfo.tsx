import { InfoCircleOutlined } from '@ant-design/icons';
import { Button, Modal } from 'antd';
import React, { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import packageJSON from '../../package.json';

export default function SystemInfo() {
  const [open, isOpen] = useState(false);
  const toggleOpen = () => isOpen(!open);
  const intl = useIntl();

  return (
    <>
      <Button type="link" icon={<InfoCircleOutlined />} onClick={toggleOpen}>
        <span>
          <FormattedMessage id="project-name" /> {packageJSON.version}
        </span>
      </Button>
      <Modal title={intl.formatMessage({ id: 'label.system-info' })} visible={open} footer={null} onCancel={toggleOpen} closable>
        <FormattedMessage id="author" />
      </Modal>
    </>
  );
}
