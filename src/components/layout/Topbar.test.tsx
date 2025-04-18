// import { render, screen, fireEvent } from '@testing-library/react';
// import { expect, test, beforeEach, vi } from 'vitest';
// import { Topbar } from './Topbar';
// import { useIsMobile } from '@/hooks/use-mobile'
// import { MemoryRouter } from 'react-router-dom';

// vi.mock('@/hooks/use-mobile');

// beforeEach(() => {
//     vi.clearAllMocks();
//   });

// test('renders topbar', () => {
//   const onToggleSidebar = vi.fn();
//   (useIsMobile as vi.MockedFunction<typeof useIsMobile>).mockReturnValue(false);
//   render(
//     <MemoryRouter>
//       <Topbar onToggleSidebar={onToggleSidebar} />
//     </MemoryRouter>
//   );
//   expect(screen.getByRole('banner')).toBeInTheDocument();
// });

// test('mobile menu button toggles sidebar', () => {
//   const onToggleSidebar = vi.fn();
//   (useIsMobile as vi.MockedFunction<typeof useIsMobile>).mockReturnValue(true);
//   render(
//     <MemoryRouter>
//       <Topbar onToggleSidebar={onToggleSidebar} />
//     </MemoryRouter>
//   );  
//   // Select the button using its name attribute
//   const menuButton = screen.getByRole('button', { selector: 'button[name="menu"]' });
//   fireEvent.click(menuButton);
//   expect(onToggleSidebar).toHaveBeenCalled();
// });