import { css } from '@emotion/react';
import { Layout } from 'antd';
import { FormattedMessage } from 'react-intl';
import { version } from '../../../package.json';

const footerStyles = css`
  && {
    padding: 0 1.5rem 1.5rem 1.5rem;
  }
`;

export default function FooterSection() {
  return (
    <Layout.Footer css={footerStyles}>
      <FormattedMessage id="project-name" /> {version}
    </Layout.Footer>
  );
}
