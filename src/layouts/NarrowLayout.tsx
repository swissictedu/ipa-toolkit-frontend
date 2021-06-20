import styled from '@emotion/styled';
import { PropsWithChildren } from 'react';

const NarrowLayoutContainer = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-self: center;
  min-width: 60rem;
  max-width: 60rem;

  @media all and (max-width: 72rem) {
    min-width: 100%;
  }
`;

type NarrowLayoutProps = PropsWithChildren<{}>;

export default function NarrowLayout({ children }: NarrowLayoutProps) {
  return <NarrowLayoutContainer>{children}</NarrowLayoutContainer>;
}
