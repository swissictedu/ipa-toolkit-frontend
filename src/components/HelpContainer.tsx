import { Card } from 'antd';
import { PropsWithChildren } from 'react';

type HelpContainerProps = PropsWithChildren<{}>;

export default function HelpContainer({ children }: HelpContainerProps) {
  return <Card>{children}</Card>;
}
