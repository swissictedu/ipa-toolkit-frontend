import { css } from '@emotion/react';
import { Layout } from 'antd';
import { PropsWithChildren, ReactNode } from 'react';
import FooterSection from './sections/FooterSection';
import HeaderSection from './sections/HeaderSection';
import SiderSection from './sections/SiderSection';

const innerLayoutStyles = css`
  .ant-layout-content .ant-page-header {
    padding: 0 0 0.9rem 0;
  }
`;

const contentStyles = css`
  background-color: var(--white);
  padding: 1.333333rem;
  margin: 1.333333rem;
  display: flex;
  flex-direction: column;
`;

type DefaultLayoutProps = PropsWithChildren<{
  header?: ReactNode;
  sider?: ReactNode;
  footer?: ReactNode;
  pageHeader?: ReactNode;
}>;

export default function DefaultLayout({ children, header = <HeaderSection />, sider = <SiderSection />, footer = <FooterSection />, pageHeader }: DefaultLayoutProps) {
  return (
    <Layout>
      {header}
      <Layout>
        {sider}
        <Layout css={innerLayoutStyles}>
          <Layout.Content css={contentStyles}>
            {pageHeader}
            {children}
          </Layout.Content>
          {footer}
        </Layout>
      </Layout>
    </Layout>
  );
}
