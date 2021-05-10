import { Layout } from 'antd';
import { PropsWithChildren, ReactNode } from 'react';
import FooterSection from './sections/FooterSection';

type DefaultLayoutProps = PropsWithChildren<{
  footer?: ReactNode;
}>;

export default function DefaultLayout({ children, footer = <FooterSection /> }: DefaultLayoutProps) {
  return (
    <Layout>
      <Layout.Content>{children}</Layout.Content>
      {footer}
    </Layout>
  );
}
