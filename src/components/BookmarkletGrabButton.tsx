import { Button } from 'antd';
import { PropsWithChildren } from 'react';
import { generateBookmarklet } from '../utils/url';

type BookmarkletGrabButtonProps = PropsWithChildren<{
  code: string;
}>;

export default function BookmarkletGrabButton({ children, code }: BookmarkletGrabButtonProps) {
  return (
    <Button ref={(node) => node && node.setAttribute('href', generateBookmarklet(code))} disabled={true} href="#">
      {children}
    </Button>
  );
}
