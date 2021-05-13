import { PageHeader, Space, Steps } from 'antd';
import { ReactNode, useState } from 'react';
import { useIntl } from 'react-intl';
import Connection from '../../components/conference/Connection';
import DefaultLayout from '../../layouts/DefaultLayout';
import { Credentials } from '../../models/Credentials';

export default function ConferenceImport() {
  const intl = useIntl();
  const [currentStep, setCurrentStep] = useState(0);
  const nextStep = () => setCurrentStep(currentStep + 1);
  const previousStep = () => setCurrentStep(currentStep - 1);

  const testCredentials = (credentials: Credentials) => {
    console.log(credentials);
  }

  const steps: { title: string; element: ReactNode }[] = [
    { title: intl.formatMessage({ id: 'label.conference.connection' }), element: <Connection testCredentials={testCredentials} /> },
    { title: intl.formatMessage({ id: 'label.conference.selection' }), element: <div>joho1</div> },
    { title: intl.formatMessage({ id: 'label.conference.scraping' }), element: <div>joho2</div> }
  ];

  return (
    <DefaultLayout pageHeader={<PageHeader title={intl.formatMessage({ id: 'label.grading-conference' })} subTitle={intl.formatMessage({ id: 'label.data-import' })} />}>
      <Space direction="vertical" size="large">
        <Steps current={currentStep}>
          {steps.map((step) => (
            <Steps.Step key={step.title} title={step.title} />
          ))}
        </Steps>
        {steps[currentStep].element}
      </Space>
    </DefaultLayout>
  );
}
