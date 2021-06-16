import { DossierInput, Affiliation } from '../../../graphql-types';

export default function mapToDossierInput(data: Record<string, string | number>[], affiliations: Affiliation[], dossierPath: string, conference: number): DossierInput[] {
  return data.map((dossier) => {
    const affiliation = affiliations.find((affiliation) => affiliation.tenantName === dossier['Fachrichtung']) ?? { tenantId: '', tenantName: '' };
    return {
      affiliation: { id: Number.parseInt(affiliation.tenantId), tenantName: affiliation.tenantName },
      candidate: {
        id: dossier['KandidatID'] as number,
        forename: dossier['VornameKAN'] as string,
        surname: dossier['NachnameKAN'] as string
      },
      primaryExpert: dossier['IdHEX']
        ? {
            id: dossier['IdHEX'] as number,
            forename: dossier['VornameHEX'] as string,
            surname: dossier['NachnameHEX'] as string
          }
        : undefined,
      secondaryExpert: dossier['IdNEX']
        ? {
            id: dossier['IdNEX'] as number,
            forename: dossier['VornameNEX'] as string,
            surname: dossier['NachnameNEX'] as string
          }
        : undefined,
      companyContact: dossier['IdVF']
        ? {
            id: dossier['IdVF'] as number,
            forename: dossier['VornameVF'] as string,
            surname: dossier['NachnameVF'] as string
          }
        : undefined,
      conferenceId: conference,
      companyPointsA: dossier['PunkteVfTeilA'] as string,
      companyPointsB: dossier['PunkteVfTeilB'] as string,
      companyMarkA: dossier['NoteVfTeilA'] as string,
      companyMarkB: dossier['NoteVfTeilB'] as string,
      expertPointsA: dossier['PunktePexTeilA'] as string,
      expertPointsB: dossier['PunktePexTeilB'] as string,
      expertPointsC: dossier['PunktePexTeilC'] as string,
      expertMarkA: dossier['NotePexTeilA'] as string,
      expertMarkB: dossier['NotePexTeilB'] as string,
      expertMarkC: dossier['NotePexTeilC'] as string,
      markDeduction: (dossier['Notenabzug'] as string) === 'Ja' ? true : false,
      finalMark: dossier['SchlussNoteErrechnet'] as string,
      submittedMark: dossier['SchlussNoteEingereicht'] as string,
      dossierPath: `${dossierPath}${affiliation.tenantId}/${dossier['KandidatID']}`
    };
  });
}
