import styled from '@emotion/styled';
import { Layout } from 'antd';
import { PropsWithChildren, ReactNode } from 'react';
import FooterSection from './sections/FooterSection';
import HeaderSection from './sections/HeaderSection';
import SiderSection from './sections/SiderSection';

const StyledContent = styled(Layout.Content)`
  background-color: var(--white);
  margin: 1.5rem;
  display: flex;
  flex-direction: column;
`;

type DefaultLayoutProps = PropsWithChildren<{
  header?: ReactNode;
  sider?: ReactNode;
  footer?: ReactNode;
}>;

export default function DefaultLayout({ children, header = <HeaderSection />, sider = <SiderSection />, footer = <FooterSection /> }: DefaultLayoutProps) {
  return (
    <Layout>
      {header}
      <Layout>
        {sider}
        <Layout>
          <StyledContent>{children}</StyledContent>
          {footer}
        </Layout>
      </Layout>
    </Layout>
  );
}
