import { MailOutlined } from '@ant-design/icons';
import { gql, useMutation, useQuery } from '@apollo/client';
import { Button, Form, Input, message, Modal, Select } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { Fragment, useState } from 'react';
import { useIntl } from 'react-intl';
import { CreateVerificationMutation, CreateVerificationMutationVariables, ReadDossierQuery, ReadDossierQueryVariables } from '../../../../graphql-types';

export const READ_DOSSIER = gql`
  query ReadDossier($id: Int!) {
    dossiers(id: $id) {
      conference {
        participants {
          email
          forename
          surname
          id
        }
      }
    }
  }
`;

const CREATE_VERIFICATION = gql`
  mutation CreateVerification($verification: VerificationInput!) {
    verifications {
      createVerification(verification: $verification) {
        verification {
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

export default function SingleAssignmentModal({ dossierId }: SingleAssignmentModalProps) {
  const [open, isOpen] = useState(false);
  const toggleOpen = () => isOpen(!open);
  const [form] = useForm<SingleAssignmentModalForm>();
  const intl = useIntl();
  const { loading, data } = useQuery<ReadDossierQuery, ReadDossierQueryVariables>(READ_DOSSIER, { variables: { id: dossierId } });
  const [createVerification, { loading: mutating }] = useMutation<CreateVerificationMutation, CreateVerificationMutationVariables>(CREATE_VERIFICATION, {
    onCompleted: () => message.info('Einladung verschickt.'),
    onError: () => message.error('Konnte keine Einladung verschicken, weil der Dateiimport noch nicht abgeschlossen ist.')
  });

  const handleSubmit = (values: SingleAssignmentModalForm) => {
    createVerification({ variables: { verification: { dossierId, participantId: parseInt(values.participantId) } } });
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
      >
        <Form form={form} onFinish={handleSubmit}>
          <Form.Item name="participantId" label={intl.formatMessage({ id: 'label.participant' })} rules={[{ required: true }]}>
            <Select loading={loading}>
              {data?.dossiers
                ?.find((d) => d)
                ?.conference.participants.map((p) => (
                  <Select.Option value={p.id}>
                    {p.forename} {p.surname}
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </Fragment>
  );
}
