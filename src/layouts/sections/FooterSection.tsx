import { Layout } from 'antd';
import { FormattedMessage } from 'react-intl';
import { version } from '../../../package.json';

export default function FooterSection() {
  return (
    <Layout.Footer>
      <FormattedMessage id="project-name" />
      {version}
    </Layout.Footer>
  );
}
