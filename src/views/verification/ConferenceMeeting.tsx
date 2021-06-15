import { PageHeader } from 'antd';
import { useIntl } from 'react-intl';
import DefaultLayout from '../../layouts/DefaultLayout';

export default function ConferenceMeeting() {
  const intl = useIntl();

  return (
    <DefaultLayout pageHeader={<PageHeader title={intl.formatMessage({ id: 'label.verification' })} subTitle={intl.formatMessage({ id: 'label.grading-conference' })} />}>
      Meeting
    </DefaultLayout>
  );
}
