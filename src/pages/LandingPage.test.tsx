import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import LandingPage from './LandingPage';

const renderLandingPage = () => {
  return render(
    <MemoryRouter>
      <LandingPage />
    </MemoryRouter>,
  );
};

describe('LandingPage', () => {
  it('renders the core Leadryve value proposition', () => {
    renderLandingPage();

    expect(
      screen.getByText(/Votre outil N°1 pour la génération de leads B2B au Cameroun/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Trouvez, qualifiez et contactez vos clients idéaux/i),
    ).toBeInTheDocument();
  });

  it('renders the main public navigation and call-to-action links', () => {
    renderLandingPage();

    expect(screen.getAllByRole('link', { name: /Tarifs/i }).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByRole('link', { name: /Politique de confidentialité/i }).length).toBeGreaterThanOrEqual(1);

    const ctaLinks = screen.getAllByRole('link', { name: /Commencer/i });
    expect(ctaLinks.length).toBeGreaterThanOrEqual(2);
    expect(ctaLinks.some((link) => link.getAttribute('href')?.includes('app.leadryve.com'))).toBe(true);
  });

  it('explains the four-step prospecting workflow', () => {
    renderLandingPage();

    expect(screen.getByText(/Renseignez votre profil/i)).toBeInTheDocument();
    expect(screen.getByText(/Créez votre mission/i)).toBeInTheDocument();
    expect(screen.getByText(/Générez des opportunités/i)).toBeInTheDocument();
    expect(screen.getByText(/Contactez et convertissez/i)).toBeInTheDocument();
  });
});
