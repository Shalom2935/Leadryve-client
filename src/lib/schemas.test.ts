import { describe, expect, it } from 'vitest';
import {
  dashboardMissionsSchema,
  loginSchema,
  paginatedMissionLeadsSchema,
} from './schemas';

describe('authentication schemas', () => {
  it('accepts a valid login payload', () => {
    const result = loginSchema.safeParse({
      email: 'kamokoueshalom@gmail.com',
      password: 'secure-password',
    });

    expect(result.success).toBe(true);
  });

  it('rejects malformed login payloads with actionable errors', () => {
    const result = loginSchema.safeParse({
      email: 'not-an-email',
      password: '',
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.email).toContain('Email valide requis');
      expect(result.error.flatten().fieldErrors.password).toContain('Mot de passe requis');
    }
  });
});

describe('mission schemas', () => {
  const validMission = {
    id: 42,
    name: 'Prospection PME Douala',
    target_location: 'Douala',
    target_sector: 'Software services',
    lead_count: 25,
    notes: 'Prioritize companies with public contact emails',
    created_at: '2026-07-07T12:00:00.000Z',
    progress: 64,
    status: 'in_progress',
  };

  it('accepts valid dashboard mission collections', () => {
    const result = dashboardMissionsSchema.safeParse([validMission]);

    expect(result.success).toBe(true);
  });

  it('guards mission progress and status values from invalid API responses', () => {
    const result = dashboardMissionsSchema.safeParse([
      {
        ...validMission,
        progress: 140,
        status: 'archived',
      },
    ]);

    expect(result.success).toBe(false);
  });
});

describe('lead schemas', () => {
  it('accepts paginated leads with nullable contact fields returned by the API', () => {
    const result = paginatedMissionLeadsSchema.safeParse({
      count: 1,
      items: [
        {
          id: 7,
          company_name: 'KamerTech SARL',
          address: null,
          score: 0.82,
          email: 'kamokoueshalom@gmail.com',
          phone: null,
          reason: null,
          created_at: '2026-07-07T12:00:00.000Z',
        },
      ],
    });

    expect(result.success).toBe(true);
  });
});
