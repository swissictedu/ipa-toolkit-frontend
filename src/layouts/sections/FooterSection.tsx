import { css } from '@emotion/react';
import { Layout } from 'antd';
import SystemInfo from '../../views/SystemInfo';

const footerStyles = css`
  && {
    padding: 0 1.333333rem 1.333333rem 1.333333rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

export default function FooterSection() {
  return (
    <Layout.Footer css={footerStyles}>
      <SystemInfo />
    </Layout.Footer>
  );
}
