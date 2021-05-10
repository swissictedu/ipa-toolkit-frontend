import styled from '@emotion/styled';
import { Layout } from 'antd';
import { FormattedMessage } from 'react-intl';
import { version } from '../../../package.json';

const StyledFooter = styled(Layout.Footer)`
  padding: 0 1.5rem 1.5rem 1.5rem;
`;

export default function FooterSection() {
  return (
    <StyledFooter>
      <FormattedMessage id="project-name" /> {version}
    </StyledFooter>
  );
}
