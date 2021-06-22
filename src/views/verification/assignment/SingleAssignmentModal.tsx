import { MailOutlined } from '@ant-design/icons';
import { gql, useLazyQuery, useMutation } from '@apollo/client';
import { Button, Descriptions, Form, message, Modal, Select, Space } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { Fragment, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { CreateVerificationMutation, CreateVerificationMutationVariables, ReadDossierQuery, ReadDossierQueryVariables } from '../../../../graphql-types';
import { Unarray } from '../../../utils/types';

export const READ_DOSSIER = gql`
  query ReadDossier($id: Int!) {
    dossiers(id: $id) {
      conference {
        id
        participants {
          email
          forename
          surname
          id
        }
      }
      companyContact {
        forename
        surname
      }
      primaryExpert {
        forename
        surname
      }
      secondaryExpert {
        forename
        surname
      }
    }
  }
`;

const CREATE_VERIFICATION = gql`
  mutation CreateVerification($verifications: [VerificationInput!]!) {
    verifications {
      createVerification(verifications: $verifications) {
        verifications {
          id
        }
      }
    }
  }
`;

type SingleAssignmentModalForm = {
  participantId: string;
};

type SingleAssignmentModalProps = {
  dossierId: number;
};

function AdditionalDossierInformation({ dossier }: { dossier?: Unarray<ReadDossierQuery['dossiers']> }) {
  const intl = useIntl();
  return (
    <Descriptions size="small" bordered column={1}>
      <Descriptions.Item label={intl.formatMessage({ id: 'attribute.company-contact' })}>
        {dossier?.companyContact?.forename} {dossier?.companyContact?.surname}
      </Descriptions.Item>
      <Descriptions.Item label={intl.formatMessage({ id: 'attribute.primary-expert' })}>
        {dossier?.primaryExpert?.forename} {dossier?.primaryExpert?.surname}
      </Descriptions.Item>
      <Descriptions.Item label={intl.formatMessage({ id: 'attribute.secondary-expert' })}>
        {dossier?.secondaryExpert?.forename} {dossier?.secondaryExpert?.surname}
      </Descriptions.Item>
    </Descriptions>
  );
}

export default function SingleAssignmentModal({ dossierId }: SingleAssignmentModalProps) {
  const [open, isOpen] = useState(false);
  const toggleOpen = () => isOpen(!open);
  const [form] = useForm<SingleAssignmentModalForm>();
  const intl = useIntl();
  const [readDossier, { loading, data }] = useLazyQuery<ReadDossierQuery, ReadDossierQueryVariables>(READ_DOSSIER, { variables: { id: dossierId } });
  const [createVerification, { loading: mutating }] = useMutation<CreateVerificationMutation, CreateVerificationMutationVariables>(CREATE_VERIFICATION, {
    onCompleted: () => message.info(intl.formatMessage({ id: 'info.invitation-sent' })),
    onError: () => message.error(intl.formatMessage({ id: 'error.unable-to-send-invitation' }))
  });

  useEffect(() => {
    if (open) {
      readDossier();
    }
  }, [open, readDossier]);

  const handleSubmit = (values: SingleAssignmentModalForm) => {
    createVerification({ variables: { verifications: [{ dossierId, participantId: parseInt(values.participantId) }] } });
    toggleOpen();
  };

  return (
    <Fragment>
      <Button icon={<MailOutlined />} onClick={() => toggleOpen()} />
      <Modal
        visible={open}
        onCancel={() => toggleOpen()}
        onOk={() => form.validateFields().then(() => form.submit())}
        title={intl.formatMessage({ id: 'label.verification-invitation' })}
        confirmLoading={mutating}
      >
        <Space direction="vertical" size="large">
          <AdditionalDossierInformation dossier={data?.dossiers?.find((d) => d)} />
          <Form form={form} onFinish={handleSubmit}>
            <Form.Item name="participantId" label={intl.formatMessage({ id: 'label.participant' })} rules={[{ required: true }]}>
              <Select loading={loading}>
                {data?.dossiers
                  ?.find((d) => d)
                  ?.conference.participants.map((p) => (
                    <Select.Option value={p.id} key={p.id}>
                      {p.forename} {p.surname}
                    </Select.Option>
                  ))}
              </Select>
            </Form.Item>
          </Form>
        </Space>
      </Modal>
    </Fragment>
  );
}
