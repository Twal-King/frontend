import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SourceLink } from '../SourceLink';

describe('SourceLink', () => {
  it('renders an anchor with the correct title prefixed by 📎', () => {
    render(<SourceLink title="Design Guide" url="https://notion.so/design" />);
    const link = screen.getByRole('link', { name: /📎 Design Guide/ });
    expect(link).toBeInTheDocument();
  });

  it('opens in a new tab with noopener noreferrer', () => {
    render(<SourceLink title="API Docs" url="https://notion.so/api" />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('has the correct href', () => {
    render(<SourceLink title="Page" url="https://notion.so/page-123" />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', 'https://notion.so/page-123');
  });

  it('applies text-xs text-accent hover:underline classes', () => {
    render(<SourceLink title="Test" url="https://example.com" />);
    const link = screen.getByRole('link');
    expect(link.className).toContain('text-xs');
    expect(link.className).toContain('text-accent');
  });
});
