import styled from '@emotion/styled';
import { Layout, Typography } from 'antd';
import { FormattedMessage } from 'react-intl';
import { ReactNode } from 'react';
import HeaderMenuSection from './HeaderMenuSection';
import { Link } from 'react-router-dom';

const AppTitle = styled(Typography.Title)`
  && {
    font-size: 1.6rem;
    color: var(--white);
    margin: 0;
  }
`;

const StyledHeader = styled(Layout.Header)`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

type HeaderSectionProps = {
  menu?: ReactNode;
};

export default function HeaderSection({ menu = <HeaderMenuSection /> }: HeaderSectionProps) {
  return (
    <StyledHeader>
      <Link to="/">
        <AppTitle>
          <FormattedMessage id="project-name" />
        </AppTitle>
      </Link>
      {menu}
    </StyledHeader>
  );
}
