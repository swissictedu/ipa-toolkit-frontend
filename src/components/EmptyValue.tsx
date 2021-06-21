import { css } from '@emotion/react';
import { FormattedMessage } from 'react-intl';

const EmptyValueStyle = css`
  color: #aaa;
  cursor: not-allowed;
`;

export default function EmptyValue() {
  return (
    <span css={EmptyValueStyle}>
      <FormattedMessage id="label.empty-value" />
    </span>
  );
}
