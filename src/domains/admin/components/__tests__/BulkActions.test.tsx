import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { BulkActions } from '../BulkActions';

describe('BulkActions', () => {
  const defaultProps = {
    selectedCount: 3,
    onBulkEmbed: vi.fn(),
    bulkProgress: null,
  };

  it('renders nothing when selectedCount is 0 and no bulk progress', () => {
    const { container } = render(
      <BulkActions selectedCount={0} onBulkEmbed={vi.fn()} bulkProgress={null} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('shows selected count text', () => {
    render(<BulkActions {...defaultProps} />);
    expect(screen.getByText('3개 선택됨')).toBeInTheDocument();
  });

  it('shows 일괄 임베딩 button', () => {
    render(<BulkActions {...defaultProps} />);
    expect(screen.getByRole('button', { name: '일괄 임베딩' })).toBeInTheDocument();
  });

  it('disables button when selectedCount is 0 but bulk is running', () => {
    render(
      <BulkActions
        selectedCount={0}
        onBulkEmbed={vi.fn()}
        bulkProgress={{ isRunning: true, completed: 1, total: 5 }}
      />
    );
    expect(screen.getByRole('button', { name: '일괄 임베딩' })).toBeDisabled();
  });

  it('disables button when bulk is running', () => {
    render(
      <BulkActions
        selectedCount={3}
        onBulkEmbed={vi.fn()}
        bulkProgress={{ isRunning: true, completed: 2, total: 3 }}
      />
    );
    expect(screen.getByRole('button', { name: '일괄 임베딩' })).toBeDisabled();
  });

  it('calls onBulkEmbed when button is clicked', async () => {
    const onBulkEmbed = vi.fn();
    render(<BulkActions {...defaultProps} onBulkEmbed={onBulkEmbed} />);
    await userEvent.click(screen.getByRole('button', { name: '일괄 임베딩' }));
    expect(onBulkEmbed).toHaveBeenCalledOnce();
  });

  it('shows progress bar and percentage when bulk is running', () => {
    render(
      <BulkActions
        selectedCount={3}
        onBulkEmbed={vi.fn()}
        bulkProgress={{ isRunning: true, completed: 1, total: 4 }}
      />
    );
    expect(screen.getByText('25%')).toBeInTheDocument();
  });

  it('calculates progress correctly with Math.round', () => {
    render(
      <BulkActions
        selectedCount={2}
        onBulkEmbed={vi.fn()}
        bulkProgress={{ isRunning: true, completed: 1, total: 3 }}
      />
    );
    // Math.round((1/3) * 100) = 33
    expect(screen.getByText('33%')).toBeInTheDocument();
  });

  it('does not show progress bar when not running', () => {
    render(<BulkActions {...defaultProps} />);
    expect(screen.queryByText('%')).not.toBeInTheDocument();
  });
});
