import styled from '@emotion/styled';
import { Button, PageHeader, Space, Steps } from 'antd';
import { ReactNode, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import DefaultLayout from '../../layouts/DefaultLayout';
import { Credentials } from '../../models/Credentials';
import ConnectionContainer from './import/ConnectionContainer';
import SelectionContainer from './import/SelectionContainer';

const ActionsContainer = styled.div`
  flex-grow: 1;
  display: flex;
  align-items: end;
  justify-content: center;
`;

export default function ConferenceImport() {
  const intl = useIntl();
  const [currentStep, setCurrentStep] = useState(0);
  const [credentials, setCredentials] = useState<Credentials>();
  const [valid, isValid] = useState(false);
  const nextStep = () => {
    setCurrentStep(currentStep + 1);
    isValid(false);
  };
  const previousStep = () => setCurrentStep(currentStep - 1);

  const steps: { title: string; element: ReactNode }[] = [
    {
      title: intl.formatMessage({ id: 'label.conference.connection' }),
      element: <ConnectionContainer isValid={isValid} setCredentials={setCredentials} />
    },
    {
      title: intl.formatMessage({ id: 'label.conference.selection' }),
      element: credentials && <SelectionContainer isValid={isValid} credentials={credentials} />
    },
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
      <ActionsContainer>
        {currentStep > 0 && (
          <Button type="primary" size="large" onClick={previousStep}>
            <FormattedMessage id="action.previous" />
          </Button>
        )}
        <Button type="primary" size="large" onClick={nextStep} disabled={!valid}>
          <FormattedMessage id="action.next" />
        </Button>
      </ActionsContainer>
    </DefaultLayout>
  );
}
