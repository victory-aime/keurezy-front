import { describe, expect, it } from 'vitest';
import { canAccess } from './permissions';

describe('canAccess', () => {
  it("autorise toujours le propriétaire de l'agence", () => {
    expect(canAccess({ isOwner: true, permissions: [] }, 'delete_property')).toBe(true);
  });

  it('autorise un membre qui a la permission', () => {
    const member = { isOwner: false, permissions: ['view_properties', 'manage_land'] };
    expect(canAccess(member, 'manage_land')).toBe(true);
  });

  it("refuse un membre qui n'a pas la permission", () => {
    const member = { isOwner: false, permissions: ['view_properties'] };
    expect(canAccess(member, 'delete_property')).toBe(false);
  });

  it('refuse tout à un membre sans permission', () => {
    expect(canAccess({ isOwner: false, permissions: [] }, 'view_properties')).toBe(false);
  });
});
