import { DossierInput } from '../../../graphql-types';

export default function mapToDossierInput(data: Record<string, string | number>[]): DossierInput[] {
  return data.map((dossier) => ({
    affiliation: {
      role: '',
      tenantId: '',
      tenantName: ''
    },
    candidate: {
      id: dossier['KandidatID'] as number,
      forename: dossier['VornameKAN'] as string,
      surname: dossier['NachnameKAN'] as string
    },
    primaryExpert: {
      id: dossier['IdHEX'] as number,
      forename: dossier['VornameHEX'] as string,
      surname: dossier['NachnameHEX'] as string
    },
    secondaryExpert: {
      id: dossier['IdNEX'] as number,
      forename: dossier['VornameNEX'] as string,
      surname: dossier['NachnameNEX'] as string
    },
    companyContact: {
      id: dossier['IdVF'] as number,
      forename: dossier['VornameVF'] as string,
      surname: dossier['NachnameVF'] as string
    },
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
    submittedMark: dossier['SchlussNoteEingereicht'] as string
  }));
}
