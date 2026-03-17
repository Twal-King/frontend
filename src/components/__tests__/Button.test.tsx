import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Button } from '../Button';

describe('Button', () => {
  // Validates: Requirements 9.1
  describe('variant classes', () => {
    it('applies primary variant classes by default', () => {
      render(<Button>Click</Button>);
      const btn = screen.getByRole('button', { name: 'Click' });
      expect(btn.className).toContain('bg-accent');
      expect(btn.className).toContain('text-white');
      expect(btn.className).toContain('hover:bg-accent-hover');
    });

    it('applies secondary variant classes', () => {
      render(<Button variant="secondary">Click</Button>);
      const btn = screen.getByRole('button', { name: 'Click' });
      expect(btn.className).toContain('bg-transparent');
      expect(btn.className).toContain('border');
      expect(btn.className).toContain('border-border');
      expect(btn.className).toContain('text-primary');
      expect(btn.className).toContain('hover:bg-hover');
    });

    it('applies ghost variant classes', () => {
      render(<Button variant="ghost">Click</Button>);
      const btn = screen.getByRole('button', { name: 'Click' });
      expect(btn.className).toContain('bg-transparent');
      expect(btn.className).toContain('text-secondary');
      expect(btn.className).toContain('hover:text-primary');
      expect(btn.className).toContain('hover:bg-hover');
    });
  });

  describe('disabled state', () => {
    it('applies disabled styles when disabled', () => {
      render(<Button disabled>Click</Button>);
      const btn = screen.getByRole('button', { name: 'Click' });
      expect(btn).toBeDisabled();
      expect(btn.className).toContain('disabled:opacity-40');
      expect(btn.className).toContain('disabled:cursor-not-allowed');
    });

    it('does not trigger onClick when disabled', () => {
      const handleClick = vi.fn();
      render(<Button disabled onClick={handleClick}>Click</Button>);
      const btn = screen.getByRole('button', { name: 'Click' });
      fireEvent.click(btn);
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('size classes', () => {
    it('applies md size classes by default', () => {
      render(<Button>Click</Button>);
      const btn = screen.getByRole('button', { name: 'Click' });
      expect(btn.className).toContain('px-4');
      expect(btn.className).toContain('py-2');
      expect(btn.className).toContain('text-sm');
    });

    it('applies sm size classes', () => {
      render(<Button size="sm">Click</Button>);
      const btn = screen.getByRole('button', { name: 'Click' });
      expect(btn.className).toContain('px-3');
      expect(btn.className).toContain('py-1.5');
      expect(btn.className).toContain('text-xs');
    });
  });
});
