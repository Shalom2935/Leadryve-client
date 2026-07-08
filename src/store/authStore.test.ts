import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useAuthStore } from './authStore';

const openingHours = {
  monday: { start: '09:00', end: '17:00' },
  tuesday: { start: '09:00', end: '17:00' },
  wednesday: { start: '09:00', end: '17:00' },
  thursday: { start: '09:00', end: '17:00' },
  friday: { start: '09:00', end: '17:00' },
  saturday: { start: '', end: '' },
  sunday: { start: '', end: '' },
};

const profile = {
  name: 'Shalom Kamokoue',
  company_name: 'Leadryve',
  role: 'Founder',
  services: ['B2B lead generation'],
  sector: 'Software',
  geo_coverage: ['Cameroon'],
  employees: '1-10',
  opening_hours: openingHours,
  address: 'Douala',
  company_email: 'kamokoueshalom@gmail.com',
  phone_number: '',
  social_links: {},
  pitch: 'Helping businesses find qualified B2B opportunities.',
  email_provider: null,
};

const resetAuthStore = () => {
  useAuthStore.setState({
    token: null,
    isAuthenticated: false,
    isLoadingAuth: false,
    profile: null,
    isLoadingProfile: false,
  });
};

describe('authStore', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
    resetAuthStore();
  });

  it('stores the JWT token and fetches the user profile after login', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => profile,
    });
    vi.stubGlobal('fetch', fetchMock);

    useAuthStore.getState().login('access-token');

    expect(localStorage.getItem('token')).toBe('access-token');
    expect(useAuthStore.getState().isAuthenticated).toBe(true);

    await vi.waitFor(() => {
      expect(useAuthStore.getState().profile).toEqual(profile);
    });

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/profile/',
      expect.objectContaining({
        method: 'GET',
        headers: { Authorization: 'Bearer access-token' },
      }),
    );
  });

  it('clears authentication and profile state on logout', () => {
    useAuthStore.setState({
      token: 'access-token',
      isAuthenticated: true,
      profile,
    });
    localStorage.setItem('token', 'access-token');
    localStorage.setItem('userProfile', JSON.stringify(profile));

    useAuthStore.getState().logout();

    expect(useAuthStore.getState().token).toBeNull();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(useAuthStore.getState().profile).toBeNull();
    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('userProfile')).toBeNull();
  });

  it('logs out when the profile endpoint returns 401', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      text: async () => 'Unauthorized',
    });
    vi.stubGlobal('fetch', fetchMock);

    useAuthStore.setState({
      token: 'expired-token',
      isAuthenticated: true,
      profile,
    });
    localStorage.setItem('token', 'expired-token');

    await useAuthStore.getState().fetchProfile();

    expect(useAuthStore.getState().token).toBeNull();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(useAuthStore.getState().profile).toBeNull();
    expect(localStorage.getItem('token')).toBeNull();
  });
});
