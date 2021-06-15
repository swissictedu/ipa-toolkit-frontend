import { gql, useMutation, useQuery } from '@apollo/client';
import { Button, message, PageHeader, Table, TableColumnType } from 'antd';
import { Fragment } from 'react';
import { useIntl } from 'react-intl';
import { IndexDossiersQuery, CreateVerificationMutation, CreateVerificationMutationVariables } from '../../../graphql-types';
import InvitationForm from '../../components/conference/InvitationForm';
import DefaultLayout from '../../layouts/DefaultLayout';
import { Unarray } from '../../utils/types';

const INDEX_DOSSIERS = gql`
  query IndexDossiers {
    dossiers {
      id
      candidate {
        forename
        surname
        id
      }
      submittedMark
      markDeduction
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

type AssignmentTable = Unarray<NonNullable<IndexDossiersQuery['dossiers']>>;

export default function VerificationAssignment() {
  const intl = useIntl();
  const { loading, data } = useQuery<IndexDossiersQuery>(INDEX_DOSSIERS);
  const [createVerification, { loading: mutating }] = useMutation<CreateVerificationMutation, CreateVerificationMutationVariables>(CREATE_VERIFICATION, {
    onCompleted: () => message.info('Einladung verschickt.'),
    onError: () => message.error('Konnte keine Einladung verschicken, weil der Dateiimport noch nicht abgeschlossen ist.')
  });

  const columns: TableColumnType<AssignmentTable>[] = [
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
      dataIndex: 'submittedMark',
      key: 'submittedMark',
      title: intl.formatMessage({ id: 'attribute.submittedMark' })
    },
    {
      dataIndex: 'markDeduction',
      key: 'markDeduction',
      title: intl.formatMessage({ id: 'attribute.markDeduction' }),
      render: (value: boolean) => (value ? intl.formatMessage({ id: 'label.yes' }) : intl.formatMessage({ id: 'label.no' }))
    },
    {
      key: 'actions',
      title: intl.formatMessage({ id: 'label.actions' }),
      align: 'center',
      render: (_value, record) => (
        <Fragment>
          <Button.Group>
            <InvitationForm invite={(email) => createVerification({ variables: { verification: { email, dossierId: record.id } } })} />
          </Button.Group>
        </Fragment>
      )
    }
  ];

  return (
    <DefaultLayout pageHeader={<PageHeader title={intl.formatMessage({ id: 'label.verification' })} subTitle={intl.formatMessage({ id: 'label.assignment' })} />}>
      <Table<AssignmentTable> columns={columns} dataSource={data?.dossiers ?? []} loading={loading || mutating} />
    </DefaultLayout>
  );
}
