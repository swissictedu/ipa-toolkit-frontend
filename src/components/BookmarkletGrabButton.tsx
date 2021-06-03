import { BookOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import { Button } from 'antd';
import { PropsWithChildren } from 'react';
import { generateBookmarklet } from '../utils/url';

const buttonStyle = css`
  cursor: grab;
`;

type BookmarkletGrabButtonProps = PropsWithChildren<{
  code: string;
}>;

export default function BookmarkletGrabButton({ children, code }: BookmarkletGrabButtonProps) {
  return (
    <Button ref={(node) => node && node.setAttribute('href', generateBookmarklet(code))} href="#" icon={<BookOutlined />} css={buttonStyle}>
      <span>{children}</span>
    </Button>
  );
}
