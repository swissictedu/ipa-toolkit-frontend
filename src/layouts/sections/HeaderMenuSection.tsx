import { LogoutOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import { Menu, MenuProps } from 'antd';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import CONFIGURATION from '../../configuration';

// TODO: Remove after fixed in ant
const menuWidth = css`
  min-width: 15rem;
  display: flex;
  justify-content: flex-end;
`;

export default function HeaderMenuSection() {
  const menuItems: MenuProps['items'] = [
    {
      key: CONFIGURATION.paths.signOut,
      icon: <LogoutOutlined />,
      label: (
        <Link to={CONFIGURATION.paths.signOut}>
          <FormattedMessage id="label.sign-out" />
        </Link>
      )
    }
  ];

  return <Menu theme="dark" mode="horizontal" selectable={false} css={menuWidth} items={menuItems} />;
}
