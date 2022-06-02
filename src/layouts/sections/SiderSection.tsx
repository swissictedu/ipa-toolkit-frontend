import { AimOutlined, AuditOutlined, CalendarOutlined, DashboardOutlined, ExportOutlined, ImportOutlined, UserOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import { Layout, Menu, MenuProps } from 'antd';
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

  const menuItems: MenuProps['items'] = [
    {
      key: CONFIGURATION.paths.dashboard,
      icon: <DashboardOutlined />,
      label: (
        <Link to={CONFIGURATION.paths.dashboard}>
          <FormattedMessage id="label.dashboard" />
        </Link>
      )
    },
    {
      key: CONFIGURATION.paths.users,
      icon: <UserOutlined />,
      label: (
        <Link to={CONFIGURATION.paths.users}>
          <FormattedMessage id="label.user-management" />
        </Link>
      )
    },
    {
      type: 'divider'
    },
    {
      key: SUB_MENU_KEYS.verification,
      icon: <AuditOutlined />,
      label: intl.formatMessage({ id: 'label.verification' }),
      children: [
        {
          key: CONFIGURATION.paths.verification.conference,
          icon: <CalendarOutlined />,
          label: (
            <Link to={CONFIGURATION.paths.verification.conference}>
              <FormattedMessage id="label.grading-conference" />
            </Link>
          )
        },
        {
          key: CONFIGURATION.paths.verification.import,
          icon: <ImportOutlined />,
          label: (
            <Link to={CONFIGURATION.paths.verification.import}>
              <FormattedMessage id="label.data-import" />
            </Link>
          )
        },
        {
          key: CONFIGURATION.paths.verification.assignment,
          icon: <AimOutlined />,
          label: (
            <Link to={CONFIGURATION.paths.verification.assignment}>
              <FormattedMessage id="label.assignment" />
            </Link>
          )
        },
        {
          key: CONFIGURATION.paths.verification.export,
          icon: <ExportOutlined />,
          label: (
            <Link to={CONFIGURATION.paths.verification.export}>
              <FormattedMessage id="label.data-export" />
            </Link>
          )
        }
      ]
    }
  ];

  return (
    <Layout.Sider width={244} css={siderStyles} collapsed={false}>
      <Menu mode="inline" defaultOpenKeys={Object.values(SUB_MENU_KEYS)} defaultSelectedKeys={generatePathHierarchy(location.pathname)} items={menuItems} />
    </Layout.Sider>
  );
}
