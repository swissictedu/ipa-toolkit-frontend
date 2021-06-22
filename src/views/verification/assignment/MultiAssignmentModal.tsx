import { NotificationOutlined } from '@ant-design/icons';
import { gql, useLazyQuery } from '@apollo/client';
import { Button, Form, Modal, Select, Table, TableColumnsType } from 'antd';
import { Fragment, useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { ReadDossiersQuery, ReadDossiersQueryVariables } from '../../../../graphql-types';
import { Unarray } from '../../../utils/types';

const READ_DOSSIERS = gql`
  query ReadDossiers($ids: [Int!]) {
    dossiers(ids: $ids) {
      id
      conference {
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
`;

type AssignmentTable = Unarray<NonNullable<ReadDossiersQuery['dossiers']>>;

type MultiAssignmentModalProps = {
  dossierIds: number[];
};

export default function MultiAssignmentModal({ dossierIds }: MultiAssignmentModalProps) {
  const intl = useIntl();
  const [open, isOpen] = useState(false);
  const toggleOpen = () => isOpen(!open);
  const [readDossiers, { loading, data }] = useLazyQuery<ReadDossiersQuery, ReadDossiersQueryVariables>(READ_DOSSIERS, { variables: { ids: dossierIds } });

  useEffect(() => {
    if (open) {
      readDossiers();
    }
  }, [open, readDossiers]);

  const columns: TableColumnsType<AssignmentTable> = [
    {
      dataIndex: 'id',
      key: 'id',
      title: intl.formatMessage({ id: 'attribute.id' })
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
      render: (_value, record) => (
        <Form.Item>
          <Select>
            {record.conference.participants.map((p) => (
              <Select.Option value={p.id}>
                {p.forename} {p.surname}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      )
    }
  ];

  return (
    <Fragment>
      <Button icon={<NotificationOutlined />} onClick={() => toggleOpen()}>
        <FormattedMessage id="label.assign-selection" tagName="span" />
      </Button>
      <Modal title={intl.formatMessage({ id: 'label.verification-invitations' })} visible={open} onCancel={() => toggleOpen()} width="80%" confirmLoading={loading}>
        <Form>
          <Table<AssignmentTable> columns={columns} dataSource={data?.dossiers?.map((d) => ({ ...d, key: d.id })) ?? []} loading={loading} />
        </Form>
      </Modal>
    </Fragment>
  );
}
