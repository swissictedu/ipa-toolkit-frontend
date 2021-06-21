import { gql, useLazyQuery } from '@apollo/client';
import { Button, PageHeader } from 'antd';
import jsonexport from 'jsonexport';
import { FormattedMessage, useIntl } from 'react-intl';
import { DossierVerificationExportQuery } from '../../../graphql-types';
import DefaultLayout from '../../layouts/DefaultLayout';

const DOSSIER_VERIFICATION_EXPORT = gql`
  query DossierVerificationExport {
    dossiers {
      affiliation {
        tenantName
      }
      candidate {
        forename
        id
        surname
      }
      companyContact {
        forename
        id
        surname
      }
      companyMarkA
      companyMarkB
      companyPointsA
      companyPointsB
      conference {
        id
        name
      }
      expertMarkA
      expertMarkB
      expertMarkC
      expertPointsA
      expertPointsB
      finalMark
      expertPointsC
      id
      markDeduction
      primaryExpert {
        forename
        id
        surname
      }
      secondaryExpert {
        forename
        id
        surname
      }
      submittedMark
      verifications {
        changeGrading
        comment
        id
        participant {
          forename
          email
          surname
          id
        }
        verifiedAt
      }
    }
  }
`;

export default function VerificationExport() {
  const intl = useIntl();
  const [dossierVerificationExport, { loading }] = useLazyQuery<DossierVerificationExportQuery, DossierVerificationExportQuery>(DOSSIER_VERIFICATION_EXPORT, {
    fetchPolicy: 'network-only',
    onCompleted: async (data) => {
      const formattedExport = await jsonexport(data.dossiers || [], { verticalOutput: false });
      const exportBlob = new Blob([formattedExport], { type: 'text/csv' });
      const downloadUrl = window.URL.createObjectURL(exportBlob);
      window.location.assign(downloadUrl);
    }
  });

  return (
    <DefaultLayout pageHeader={<PageHeader title={intl.formatMessage({ id: 'label.verification' })} subTitle={intl.formatMessage({ id: 'label.data-export' })} />}>
      <Button type="primary" onClick={() => dossierVerificationExport()} loading={loading}>
        <FormattedMessage id="label.export-data" tagName="span" />
      </Button>
    </DefaultLayout>
  );
}
