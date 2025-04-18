// import { AppLayout } from './AppLayout';
// import { render, screen } from '@testing-library/react';
// import { beforeEach, expect, test, vi } from 'vitest';
// import { useIsMobile } from '@/hooks/use-mobile';
// import { MemoryRouter } from 'react-router-dom';
// import '@testing-library/jest-dom';

// vi.mock('@/hooks/use-mobile');

// beforeEach(() => {
//   vi.clearAllMocks();
// });

// test('renders sidebar, top bar, and main content', () => {
//   (useIsMobile as vi.MockedFunction<typeof useIsMobile>).mockReturnValue(false);
//   render(
//     <MemoryRouter>
//       <AppLayout>Main Content</AppLayout>
//     </MemoryRouter>
//   );
//   expect(screen.getByRole('complementary')).toBeInTheDocument();
//   expect(screen.getByRole('banner')).toBeInTheDocument();
//   expect(screen.getByText('Main Content')).toBeInTheDocument();
// });