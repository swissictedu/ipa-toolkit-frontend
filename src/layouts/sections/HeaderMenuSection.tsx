import { DashboardOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import { FormattedMessage } from 'react-intl';

export default function HeaderMenuSection() {
  return (
    <Menu theme="dark" mode="horizontal">
      <Menu.Item key="1" icon={<DashboardOutlined />}>
        <FormattedMessage id="label.overview" />
      </Menu.Item>
      <Menu.Item key="2" icon={<UserOutlined />}>
        <FormattedMessage id="label.account" />
      </Menu.Item>
      <Menu.Item key="sign-out" icon={<LogoutOutlined />}>
        <FormattedMessage id="label.sign-out" />
      </Menu.Item>
    </Menu>
  );
}
