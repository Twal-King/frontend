import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Modal } from '../Modal';

describe('Modal', () => {
  // Validates: Requirements 9.6
  describe('open/close rendering', () => {
    it('renders nothing when open is false', () => {
      const { container } = render(
        <Modal open={false} onClose={vi.fn()}>
          <p>Content</p>
        </Modal>
      );
      expect(container.innerHTML).toBe('');
    });

    it('renders dialog when open is true', () => {
      render(
        <Modal open={true} onClose={vi.fn()}>
          <p>Content</p>
        </Modal>
      );
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('sets aria-modal to true on dialog', () => {
      render(
        <Modal open={true} onClose={vi.fn()}>
          <p>Content</p>
        </Modal>
      );
      expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
    });
  });

  describe('overlay click', () => {
    it('calls onClose when overlay is clicked', () => {
      const handleClose = vi.fn();
      render(
        <Modal open={true} onClose={handleClose}>
          <p>Content</p>
        </Modal>
      );
      const overlay = screen.getByRole('presentation');
      fireEvent.click(overlay);
      expect(handleClose).toHaveBeenCalledTimes(1);
    });

    it('does not call onClose when dialog content is clicked', () => {
      const handleClose = vi.fn();
      render(
        <Modal open={true} onClose={handleClose}>
          <p>Content</p>
        </Modal>
      );
      fireEvent.click(screen.getByText('Content'));
      expect(handleClose).not.toHaveBeenCalled();
    });
  });

  describe('title', () => {
    it('renders title when provided', () => {
      render(
        <Modal open={true} onClose={vi.fn()} title="My Title">
          <p>Content</p>
        </Modal>
      );
      expect(screen.getByText('My Title')).toBeInTheDocument();
    });

    it('does not render title heading when not provided', () => {
      render(
        <Modal open={true} onClose={vi.fn()}>
          <p>Content</p>
        </Modal>
      );
      expect(screen.queryByRole('heading')).not.toBeInTheDocument();
    });

    it('sets aria-label on dialog to match title', () => {
      render(
        <Modal open={true} onClose={vi.fn()} title="My Title">
          <p>Content</p>
        </Modal>
      );
      expect(screen.getByRole('dialog')).toHaveAttribute('aria-label', 'My Title');
    });
  });
});
