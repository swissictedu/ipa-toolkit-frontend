import { PageHeader } from 'antd';
import { useIntl } from 'react-intl';
import DefaultLayout from '../../layouts/DefaultLayout';

export default function ConferenceImport() {
  const intl = useIntl();

  return (
    <DefaultLayout pageHeader={<PageHeader title={intl.formatMessage({ id: 'label.grading-conference' })} subTitle={intl.formatMessage({ id: 'label.data-import' })} />}>
      Import
    </DefaultLayout>
  );
}
