import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AdminPage } from '../AdminPage';

// Mock all hooks used by AdminPage
vi.mock('../../hooks/usePages', () => ({
  usePages: () => ({
    pages: [
      { id: '1', title: 'Page A', embeddingStatus: 'pending' as const, updatedAt: null, notionUrl: 'https://notion.so/1' },
      { id: '2', title: 'Page B', embeddingStatus: 'completed' as const, updatedAt: '2024-01-01T00:00:00Z', notionUrl: 'https://notion.so/2' },
    ],
    page: 1,
    totalPages: 1,
    isLoading: false,
    error: null,
    fetchPages: vi.fn(),
    goToPage: vi.fn(),
    updatePageStatus: vi.fn(),
  }),
}));

vi.mock('../../hooks/usePageFilter', () => ({
  usePageFilter: (pages: unknown[]) => ({
    filter: { status: 'all', search: '' },
    filteredPages: pages,
    setStatus: vi.fn(),
    setSearch: vi.fn(),
    resetFilter: vi.fn(),
  }),
}));

vi.mock('../../hooks/useBulkSelection', () => ({
  useBulkSelection: () => ({
    selectedIds: new Set<string>(),
    toggle: vi.fn(),
    selectAll: vi.fn(),
    clear: vi.fn(),
    isSelected: vi.fn(() => false),
    isAllSelected: vi.fn(() => false),
  }),
}));

vi.mock('../../hooks/useEmbedding', () => ({
  useEmbedding: () => ({
    isLoading: false,
    error: null,
    bulkProgress: null,
    requestEmbedding: vi.fn(),
    requestBulkEmbedding: vi.fn(),
  }),
}));

describe('AdminPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the page title', () => {
    render(<AdminPage />);
    expect(screen.getByText('임베딩 관리')).toBeInTheDocument();
  });

  it('renders the page table with rows', () => {
    render(<AdminPage />);
    expect(screen.getByText('Page A')).toBeInTheDocument();
    expect(screen.getByText('Page B')).toBeInTheDocument();
  });

  it('renders filter bar with status tabs', () => {
    render(<AdminPage />);
    expect(screen.getByText('전체')).toBeInTheDocument();
    expect(screen.getAllByText('대기').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('완료').length).toBeGreaterThanOrEqual(1);
  });

  it('renders table column headers', () => {
    render(<AdminPage />);
    expect(screen.getByText('페이지 제목')).toBeInTheDocument();
    expect(screen.getByText('상태')).toBeInTheDocument();
    expect(screen.getByText('액션')).toBeInTheDocument();
  });

  it('has max-w-table class for centered layout', () => {
    const { container } = render(<AdminPage />);
    const wrapper = container.querySelector('.max-w-table');
    expect(wrapper).toBeInTheDocument();
  });
});
