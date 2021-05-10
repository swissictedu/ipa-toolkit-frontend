import styled from '@emotion/styled';
import { Layout, Menu } from 'antd';

const StyledSider = styled(Layout.Sider)`
  background-color: var(--white);
`;

export default function SiderSection() {
  return (
    <StyledSider width={220}>
      <Menu mode="inline">
        <Menu.Item>Import</Menu.Item>
      </Menu>
    </StyledSider>
  );
}
