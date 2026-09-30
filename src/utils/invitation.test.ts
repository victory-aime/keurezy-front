import { describe, expect, it } from 'vitest';
import { invitationErrorState } from './invitation';

describe('invitationErrorState', () => {
  it('traduit les codes du backend en états d’écran', () => {
    expect(invitationErrorState('INVITATION_EXPIRED')).toBe('expired');
    expect(invitationErrorState('INVITATION_ALREADY_USED_OR_CANCELLED')).toBe('used');
    expect(invitationErrorState('INVITATION_NOT_FOUND')).toBe('notFound');
  });

  it('retombe sur un état générique', () => {
    expect(invitationErrorState(undefined)).toBe('unknown');
    expect(invitationErrorState('INTERNAL')).toBe('unknown');
  });
});
