import { AimOutlined, AuditOutlined, CalendarOutlined, DashboardOutlined, ExportOutlined, ImportOutlined, UserOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import { Layout, Menu } from 'antd';
import { FormattedMessage, useIntl } from 'react-intl';
import { Link, useLocation } from 'react-router-dom';
import CONFIGURATION from '../../configuration';
import { generatePathHierarchy } from '../../utils/url';

const SUB_MENU_KEYS = {
  verification: 'verification'
};

const siderStyles = css`
  background-color: var(--white);
`;

export default function SiderSection() {
  const intl = useIntl();
  const location = useLocation();

  return (
    <Layout.Sider width={244} css={siderStyles}>
      <Menu mode="inline" inlineCollapsed={false} defaultOpenKeys={Object.values(SUB_MENU_KEYS)} defaultSelectedKeys={generatePathHierarchy(location.pathname)}>
        <Menu.Item key={CONFIGURATION.paths.dashboard} icon={<DashboardOutlined />}>
          <Link to={CONFIGURATION.paths.dashboard}>
            <FormattedMessage id="label.dashboard" />
          </Link>
        </Menu.Item>
        <Menu.Item key={CONFIGURATION.paths.users} icon={<UserOutlined />}>
          <Link to={CONFIGURATION.paths.users}>
            <FormattedMessage id="label.user-management" />
          </Link>
        </Menu.Item>
        <Menu.Divider key="divider1" />
        <Menu.SubMenu key={SUB_MENU_KEYS.verification} icon={<AuditOutlined />} title={intl.formatMessage({ id: 'label.verification' })}>
          <Menu.Item key={CONFIGURATION.paths.verification.meeting} icon={<CalendarOutlined />}>
            <Link to={CONFIGURATION.paths.verification.meeting}>
              <FormattedMessage id="label.grading-conference" />
            </Link>
          </Menu.Item>
          <Menu.Item key={CONFIGURATION.paths.verification.import} icon={<ImportOutlined />}>
            <Link to={CONFIGURATION.paths.verification.import}>
              <FormattedMessage id="label.data-import" />
            </Link>
          </Menu.Item>
          <Menu.Item key={CONFIGURATION.paths.verification.assignment} icon={<AimOutlined />}>
            <Link to={CONFIGURATION.paths.verification.assignment}>
              <FormattedMessage id="label.assignment" />
            </Link>
          </Menu.Item>
          <Menu.Item key={CONFIGURATION.paths.verification.export} icon={<ExportOutlined />}>
            <Link to={CONFIGURATION.paths.verification.export}>
              <FormattedMessage id="label.data-export" />
            </Link>
          </Menu.Item>
        </Menu.SubMenu>
      </Menu>
    </Layout.Sider>
  );
}
