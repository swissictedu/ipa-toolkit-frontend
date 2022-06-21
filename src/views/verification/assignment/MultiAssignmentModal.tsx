import { NotificationOutlined } from '@ant-design/icons';
import { gql, useLazyQuery, useMutation } from '@apollo/client';
import { css } from '@emotion/react';
import { Button, Form, Input, message, Modal, Select, Space, Table, TableColumnsType } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { Fragment, useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { CreateVerificationsMutation, CreateVerificationsMutationVariables, ReadDossiersQuery, ReadDossiersQueryVariables } from '../../../../graphql-types';
import HelpContainer from '../../../components/HelpContainer';
import { Unarray } from '../../../utils/types';

const fullWidth = css`
  && {
    flex-grow: 1;
  }
`;

const removeMarginRight = css`
  && {
    margin-right: 0;
  }
`;

const READ_DOSSIERS = gql`
  query ReadDossiers($ids: [Int!]) {
    dossiers(ids: $ids) {
      collection {
        id
        conference {
          id
          name
          participants {
            email
            forename
            surname
            id
          }
        }
        candidate {
          forename
          surname
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
  }
`;

const CREATE_VERIFICATIONS = gql`
  mutation CreateVerifications($verifications: [VerificationInput!]!) {
    verifications {
      createVerification(verifications: $verifications) {
        verifications {
          id
        }
      }
    }
  }
`;

type DistributionForm = { participantIds: number[] };
type AssignmentForm = { assignments: { dossierId: number; participantId: number }[] };
type AssignmentTable = Unarray<NonNullable<ReadDossiersQuery['dossiers']>['collection']>;

type MultiAssignmentModalProps = {
  dossierIds: number[];
};

export default function MultiAssignmentModal({ dossierIds }: MultiAssignmentModalProps) {
  const intl = useIntl();
  const [open, isOpen] = useState(false);
  const toggleOpen = () => isOpen(!open);
  const [readDossiers, { loading, data }] = useLazyQuery<ReadDossiersQuery, ReadDossiersQueryVariables>(READ_DOSSIERS, { variables: { ids: dossierIds } });
  const [form] = useForm<AssignmentForm>();
  const [createVerifications, { loading: mutating }] = useMutation<CreateVerificationsMutation, CreateVerificationsMutationVariables>(CREATE_VERIFICATIONS, {
    onCompleted: () => message.info(intl.formatMessage({ id: 'info.invitations-sent' })),
    onError: () => message.error(intl.formatMessage({ id: 'error.unable-to-send-invitation' }))
  });

  useEffect(() => {
    if (open) {
      readDossiers();
    }
  }, [open, readDossiers]);

  const columns: TableColumnsType<AssignmentTable> = [
    {
      dataIndex: 'id',
      key: 'id',
      title: intl.formatMessage({ id: 'attribute.id' }),
      render: (value, _record, index) => (
        <Fragment>
          <span key="idValue">{value}</span>
          <Form.Item hidden name={['assignments', index, 'dossierId']} key="idFormItem" initialValue={value}>
            <Input type="hidden" value={value} />
          </Form.Item>
        </Fragment>
      )
    },
    {
      dataIndex: ['candidate', 'forename'],
      key: 'candidateForename',
      title: intl.formatMessage({ id: 'label.candidate-forename' })
    },
    {
      dataIndex: ['candidate', 'surname'],
      key: 'candidateSurname',
      title: intl.formatMessage({ id: 'label.candidate-surname' })
    },
    {
      dataIndex: ['primaryExpert', 'forename'],
      key: 'primaryExpertForename',
      title: intl.formatMessage({ id: 'label.primary-expert-forename' })
    },
    {
      dataIndex: ['primaryExpert', 'surname'],
      key: 'primaryExpertSurname',
      title: intl.formatMessage({ id: 'label.primary-expert-surname' })
    },
    {
      dataIndex: ['secondaryExpert', 'forename'],
      key: 'secondaryExpertForename',
      title: intl.formatMessage({ id: 'label.secondary-expert-forename' })
    },
    {
      dataIndex: ['secondaryExpert', 'surname'],
      key: 'secondaryExpertSurname',
      title: intl.formatMessage({ id: 'label.secondary-expert-surname' })
    },
    {
      key: 'assignment',
      title: intl.formatMessage({ id: 'label.assignment' }),
      width: '200px',
      render: (_value, record, index) => (
        <Form.Item name={['assignments', index, 'participantId']} rules={[{ required: true }]}>
          <Select>
            {record.conference.participants.map((p) => (
              <Select.Option value={p.id} key={p.id}>
                {p.forename} {p.surname}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      )
    }
  ];

  const handleSubmit = (values: AssignmentForm) => {
    createVerifications({ variables: { verifications: values.assignments } });
    toggleOpen();
  };

  const handleDistribution = (values: DistributionForm) => {
    if (data?.dossiers) {
      const participantAmount = values.participantIds.length;
      const assignments: AssignmentForm['assignments'] = data.dossiers.collection.map((d, i) => ({
        dossierId: d.id,
        participantId: values.participantIds[i % participantAmount]
      }));
      form.setFieldsValue({ assignments });
    }
  };

  return (
    <Fragment>
      <Button icon={<NotificationOutlined />} onClick={() => toggleOpen()} disabled={dossierIds.length <= 1}>
        <FormattedMessage id="label.assign-selection" tagName="span" />
      </Button>
      <Modal
        title={intl.formatMessage({ id: 'label.verification-invitations' })}
        visible={open}
        onCancel={() => toggleOpen()}
        width="80%"
        confirmLoading={loading || mutating}
        onOk={() => form.validateFields().then(() => form.submit())}
      >
        <Space direction="vertical" size="large">
          {/* Checking if the selection spread over different conferences */}
          {[...new Set(data?.dossiers?.collection.map((d) => d.conference.name))].length === 1 ? (
            <Form<DistributionForm> layout="inline" onFinish={handleDistribution}>
              <Form.Item css={fullWidth} name="participantIds">
                <Select mode="multiple" showArrow>
                  {data?.dossiers?.collection?.[0]?.conference.participants.map((p) => (
                    <Select.Option value={p.id} key={p.id}>
                      {p.forename} {p.surname}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item css={removeMarginRight}>
                <Button htmlType="submit">
                  <FormattedMessage id="label.distribute" tagName="span" />
                </Button>
              </Form.Item>
            </Form>
          ) : (
            <HelpContainer>
              <FormattedMessage id="help.different-conferences" />
            </HelpContainer>
          )}
          <Form onFinish={handleSubmit} form={form}>
            <Table<AssignmentTable> columns={columns} dataSource={data?.dossiers?.collection.map((d) => ({ ...d, key: d.id })) ?? []} loading={loading} />
          </Form>
        </Space>
      </Modal>
    </Fragment>
  );
}
