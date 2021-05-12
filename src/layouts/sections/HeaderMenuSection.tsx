import { LogoutOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import CONFIGURATION from '../../configuration';

export default function HeaderMenuSection() {
  return (
    <Menu theme="dark" mode="horizontal">
      <Menu.Item key="sign-out" icon={<LogoutOutlined />}>
        <Link to={CONFIGURATION.paths.signOut}>
          <FormattedMessage id="label.sign-out" />
        </Link>
      </Menu.Item>
    </Menu>
  );
}
