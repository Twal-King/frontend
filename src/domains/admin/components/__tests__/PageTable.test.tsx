import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PageTable } from '../PageTable';
import type { NotionPage } from '../../types';

const mockPages: NotionPage[] = [
  { id: '1', title: 'Page A', embeddingStatus: 'pending', updatedAt: null, notionUrl: 'https://notion.so/1', documentId: 'doc-1', documentStatus: 'PENDING' },
  { id: '2', title: 'Page B', embeddingStatus: 'completed', updatedAt: new Date().toISOString(), notionUrl: 'https://notion.so/2', documentId: 'doc-2', documentStatus: 'COMPLETED' },
];

function renderTable(overrides: Partial<Parameters<typeof PageTable>[0]> = {}) {
  const props = {
    pages: mockPages,
    selectedIds: new Set<string>(),
    isAllSelected: false,
    onToggle: vi.fn(),
    onSelectAll: vi.fn(),
    onEmbed: vi.fn(),
    isLoading: false,
    error: null,
    ...overrides,
  };

  render(<PageTable {...props} />);
  return props;
}

describe('PageTable', () => {
  it('renders table headers', () => {
    renderTable();
    expect(screen.getByText('페이지 제목')).toBeInTheDocument();
    expect(screen.getByText('상태')).toBeInTheDocument();
    expect(screen.getByText('업데이트')).toBeInTheDocument();
    expect(screen.getByText('액션')).toBeInTheDocument();
  });

  it('renders a row for each page', () => {
    renderTable();
    expect(screen.getByText('Page A')).toBeInTheDocument();
    expect(screen.getByText('Page B')).toBeInTheDocument();
  });

  it('shows loading spinner when isLoading is true', () => {
    renderTable({ isLoading: true });
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.queryByText('페이지 제목')).not.toBeInTheDocument();
  });

  it('shows error message when error is set', () => {
    renderTable({ error: '로드 실패' });
    expect(screen.getByText('로드 실패')).toBeInTheDocument();
    expect(screen.queryByText('페이지 제목')).not.toBeInTheDocument();
  });

  it('shows empty state when pages is empty and not loading', () => {
    renderTable({ pages: [] });
    expect(screen.getByText('표시할 페이지가 없습니다')).toBeInTheDocument();
  });

  it('calls onSelectAll when header checkbox is clicked', async () => {
    const props = renderTable();
    const checkboxes = screen.getAllByRole('checkbox');
    await userEvent.click(checkboxes[0]);
    expect(props.onSelectAll).toHaveBeenCalled();
  });

  it('marks header checkbox as checked when isAllSelected is true', () => {
    renderTable({ isAllSelected: true });
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes[0]).toHaveAttribute('aria-checked', 'true');
  });
});
