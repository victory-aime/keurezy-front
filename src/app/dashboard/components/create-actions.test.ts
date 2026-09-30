import { describe, expect, it } from 'vitest';
import { createActions } from './create-actions';

describe('createActions', () => {
  it("propose les 4 créations à qui a toutes les permissions (l'owner)", () => {
    expect(createActions(() => true).map((action) => action.label)).toEqual([
      'Nouveau bien',
      'Nouvelle annonce',
      'Planifier une visite',
      'Inviter un membre',
    ]);
  });

  it('ne propose que ce que le staff peut faire', () => {
    const actions = createActions((permission) => permission === 'schedule_visit');
    expect(actions.map((action) => action.label)).toEqual(['Planifier une visite']);
  });

  it('ne propose rien sans permission de création', () => {
    expect(createActions(() => false)).toEqual([]);
  });
});
