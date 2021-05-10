import { PropsWithChildren } from 'react';

type CenterLayoutProps = PropsWithChildren<{}>;

export default function CenterLayout({ children }: CenterLayoutProps) {
  return <div>{children}</div>;
}
