import { Button, Checkbox, Form, Input, Space } from 'antd';
import { FormattedMessage, useIntl } from 'react-intl';
import { useParams } from 'react-router';
import HelpContainer from '../../components/HelpContainer';
import DefaultLayout from '../../layouts/DefaultLayout';
import NarrowLayout from '../../layouts/NarrowLayout';
import HeaderSection from '../../layouts/sections/HeaderSection';

type VerificationResultForm = {
  change: boolean;
  comment: string;
};

export default function VerificationResult() {
  const params = useParams();
  const intl = useIntl();

  return (
    <DefaultLayout sider={null} header={<HeaderSection menu={null} />}>
      <NarrowLayout>
        <Space direction="vertical" size="large">
          <HelpContainer>
            <FormattedMessage id="help.verification-result" />
          </HelpContainer>
          <Form<VerificationResultForm>>
            <Form.Item label={intl.formatMessage({ id: 'attribute.change-of-evaluation' })} name="change" labelCol={{ span: 4 }}>
              <Checkbox />
            </Form.Item>
            <Form.Item label={intl.formatMessage({ id: 'attribute.comment' })} name="comment" labelCol={{ span: 4 }}>
              <Input.TextArea rows={10} />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 4 }}>
              <Button type="primary" htmlType="submit">
                <FormattedMessage id="action.hand-in" tagName="span" />
              </Button>
            </Form.Item>
          </Form>
        </Space>
      </NarrowLayout>
    </DefaultLayout>
  );
}
