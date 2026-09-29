import { describe, expect, it } from 'vitest';
import { pickVisitRefs } from './visits';

describe('pickVisitRefs', () => {
  it('lit client, bien, agent et statut depuis les listes du formulaire', () => {
    const refs = pickVisitRefs({
      clientId: ['client-1'],
      propertyId: ['prop-1'],
      agentId: ['staff-1'],
      status: ['PLANNED'],
    });
    expect(refs).toEqual({
      clientId: 'client-1',
      propertyId: 'prop-1',
      agentId: 'staff-1',
      status: 'PLANNED',
    });
  });

  it("n'envoie aucun agent quand aucun n'est choisi", () => {
    const refs = pickVisitRefs({ clientId: ['c'], propertyId: ['p'], agentId: [] });
    expect(refs.agentId).toBeUndefined();
  });

  it("n'envoie jamais de leadId (supprimé du backend)", () => {
    const refs = pickVisitRefs({ clientId: ['c'], propertyId: ['p'], leadId: ['lead-1'] });
    expect(refs).not.toHaveProperty('leadId');
  });
});
