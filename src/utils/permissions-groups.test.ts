import { describe, expect, it } from 'vitest';
import { mergePermissionGroups, planFeatureForPath } from './permissions';

describe('mergePermissionGroups', () => {
  it('un module par catégorie, permissions sans doublon, modules vides retirés', () => {
    const merged = mergePermissionGroups([
      { category: 'INVOICING', permissions: [{ id: 'view' }, { id: 'manage' }] },
      { category: 'INVOICING', permissions: [] },
      { category: 'USERS', permissions: [{ id: 'invite' }] },
      { category: 'USERS', permissions: [{ id: 'invite' }, { id: 'send' }] },
    ]);
    expect(merged).toEqual([
      { category: 'INVOICING', permissions: [{ id: 'view' }, { id: 'manage' }] },
      { category: 'USERS', permissions: [{ id: 'invite' }, { id: 'send' }] },
    ]);
  });
});

describe('planFeatureForPath', () => {
  const links = [
    { path: '/dashboard', feature: undefined },
    { path: '/dashboard/team', feature: 'manage_users' },
    { path: '/dashboard/invoicing/invoices', feature: 'manage_invoices' },
    { path: '/dashboard/invoicing/templates' },
  ];
  it('le lien le plus précis, sous-pages comprises', () => {
    expect(planFeatureForPath('/dashboard/team/add', links)).toBe('manage_users');
    expect(planFeatureForPath('/dashboard/invoicing/invoices', links)).toBe('manage_invoices');
  });
  it('aucune fonctionnalité exigée ailleurs (ni sur un préfixe partiel)', () => {
    expect(planFeatureForPath('/dashboard/invoicing/templates', links)).toBeUndefined();
    expect(planFeatureForPath('/dashboard/teams', links)).toBeUndefined();
  });
});
