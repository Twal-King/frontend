import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PageRow } from '../PageRow';
import type { NotionPage } from '../../types';

function renderRow(overrides: Partial<NotionPage> = {}, selected = false) {
  const page: NotionPage = {
    id: 'page-1',
    title: 'Test Page',
    embeddingStatus: 'pending',
    updatedAt: null,
    notionUrl: 'https://notion.so/page-1',
    ...overrides,
  };
  const onToggle = vi.fn();
  const onEmbed = vi.fn();

  const { container } = render(
    <table>
      <tbody>
        <PageRow page={page} selected={selected} onToggle={onToggle} onEmbed={onEmbed} />
      </tbody>
    </table>
  );

  return { page, onToggle, onEmbed, container };
}

describe('PageRow', () => {
  it('renders page title', () => {
    renderRow({ title: '프로젝트 개요' });
    expect(screen.getByText('프로젝트 개요')).toBeInTheDocument();
  });

  it('renders embedding status badge', () => {
    renderRow({ embeddingStatus: 'completed' });
    expect(screen.getByText('완료')).toBeInTheDocument();
  });

  it('shows "--" when updatedAt is null', () => {
    renderRow({ updatedAt: null });
    expect(screen.getByText('--')).toBeInTheDocument();
  });

  it('shows relative time when updatedAt is set', () => {
    const recent = new Date(Date.now() - 60_000).toISOString();
    renderRow({ updatedAt: recent });
    expect(screen.getByText('1분 전')).toBeInTheDocument();
  });

  it('shows "임베딩" button for pending status', () => {
    renderRow({ embeddingStatus: 'pending' });
    const btn = screen.getByRole('button', { name: '임베딩' });
    expect(btn).toBeEnabled();
  });

  it('shows "재시도" button for failed status', () => {
    renderRow({ embeddingStatus: 'failed' });
    const btn = screen.getByRole('button', { name: '재시도' });
    expect(btn).toBeEnabled();
  });

  it('disables button for processing status', () => {
    renderRow({ embeddingStatus: 'processing' });
    const btn = screen.getByRole('button', { name: '임베딩' });
    expect(btn).toBeDisabled();
  });

  it('disables button for completed status', () => {
    renderRow({ embeddingStatus: 'completed' });
    const btn = screen.getByRole('button', { name: '임베딩' });
    expect(btn).toBeDisabled();
  });

  it('calls onToggle with page id when checkbox is clicked', async () => {
    const { onToggle } = renderRow({ id: 'abc-123' });
    const checkbox = screen.getByRole('checkbox');
    await userEvent.click(checkbox);
    expect(onToggle).toHaveBeenCalledWith('abc-123');
  });

  it('calls onEmbed with page id when action button is clicked', async () => {
    const { onEmbed } = renderRow({ id: 'abc-123', embeddingStatus: 'pending' });
    await userEvent.click(screen.getByRole('button', { name: '임베딩' }));
    expect(onEmbed).toHaveBeenCalledWith('abc-123');
  });

  it('renders checkbox as checked when selected is true', () => {
    renderRow({}, true);
    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'true');
  });
});
