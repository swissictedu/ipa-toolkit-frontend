import { useParams } from 'react-router';
import DefaultLayout from '../../layouts/DefaultLayout';
import NarrowLayout from '../../layouts/NarrowLayout';
import HeaderSection from '../../layouts/sections/HeaderSection';
import HelpContainer from '../../components/HelpContainer';
import { FormattedMessage, useIntl } from 'react-intl';
import { Button, Form, Input, message, Space } from 'antd';
import CONFIGURATION from '../../configuration';

type DownloadForm = {
  password: string;
};

export default function VerificationDownload() {
  const params = useParams();
  const intl = useIntl();

  const handleDownload = (values: DownloadForm) => {
    fetch(`${CONFIGURATION.env.backend}${CONFIGURATION.backendPaths.verification.download}`, {
      method: 'GET',
      cache: 'no-cache',
      headers: {
        'X-Token': params.token,
        'X-Password': values.password
      }
    })
      .then((response) => {
        if (response.status === 200) {
          return response.blob();
        } else {
          throw new Error(intl.formatMessage({ id: 'error.insufficent-credentials' }));
        }
      })
      .then((blob) => {
        const downloadUrl = window.URL.createObjectURL(blob);
        window.location.assign(downloadUrl);
      })
      .catch((e: Error) => {
        message.warn(e.message);
      });
  };

  return (
    <DefaultLayout sider={null} header={<HeaderSection menu={null} />}>
      <NarrowLayout>
        <Space direction="vertical" size="large">
          <HelpContainer>
            <FormattedMessage id="help.verification-download" />
          </HelpContainer>
          <Form<DownloadForm> layout="vertical" onFinish={handleDownload}>
            <Form.Item label={intl.formatMessage({ id: 'attribute.password' })} name="password">
              <Input.Password autoComplete="new-password"></Input.Password>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                <FormattedMessage id="action.download" tagName="span" />
              </Button>
            </Form.Item>
          </Form>
        </Space>
      </NarrowLayout>
    </DefaultLayout>
  );
}
