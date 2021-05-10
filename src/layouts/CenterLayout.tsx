import styled from '@emotion/styled';
import { PropsWithChildren } from 'react';

const StyledContainer = styled.div`
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

type CenterLayoutProps = PropsWithChildren<{}>;

export default function CenterLayout({ children }: CenterLayoutProps) {
  return <StyledContainer>{children}</StyledContainer>;
}
