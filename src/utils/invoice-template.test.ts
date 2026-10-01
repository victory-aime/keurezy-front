import { describe, expect, it } from 'vitest';
import { insertVariable, unknownVariables } from './invoice-template';

const catalogue = { client: { nom: 'Nom du client' }, facture: { echeance: 'Échéance' } };

describe('unknownVariables', () => {
  it('accepte le catalogue, refuse le reste', () => {
    expect(
      unknownVariables('Bonjour {{client.nom}}, avant le {{ facture.echeance }}', catalogue),
    ).toEqual([]);
    expect(unknownVariables('{{client.secret}} {{client.nom', catalogue)).toEqual([
      'client.secret',
      '{{…}}',
    ]);
  });
});

describe('insertVariable', () => {
  it('insère au curseur et place le curseur après la variable', () => {
    expect(insertVariable('Bonjour !', { start: 8, end: 8 }, 'client.nom')).toEqual({
      text: 'Bonjour {{client.nom}}!',
      cursor: 22,
    });
  });

  it('remplace la sélection', () => {
    expect(insertVariable('Bonjour X', { start: 8, end: 9 }, 'client.nom').text).toBe(
      'Bonjour {{client.nom}}',
    );
  });
});
