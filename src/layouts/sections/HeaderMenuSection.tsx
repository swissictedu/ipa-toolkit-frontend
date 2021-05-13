import { ApiOutlined, LogoutOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import CONFIGURATION from '../../configuration';
import PkOrgConfiguration from '../../views/PkOrgConfiguration';

export default function HeaderMenuSection() {
  return (
    <Menu theme="dark" mode="horizontal" selectable={false}>
      <Menu.Item key="pkorg-configuration" icon={<ApiOutlined />}>
        <PkOrgConfiguration />
      </Menu.Item>
      <Menu.Item key="sign-out" icon={<LogoutOutlined />}>
        <Link to={CONFIGURATION.paths.signOut}>
          <FormattedMessage id="label.sign-out" />
        </Link>
      </Menu.Item>
    </Menu>
  );
}
