import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MessageBubble } from '../MessageBubble';

describe('MessageBubble', () => {
  it('renders user message with right alignment and accent background', () => {
    const { container } = render(
      <MessageBubble role="user" content="Hello" timestamp="10:00 AM" />
    );
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.className).toContain('justify-end');

    const bubble = wrapper.firstElementChild as HTMLElement;
    expect(bubble.className).toContain('bg-accent');
    expect(bubble.className).toContain('text-white');
  });

  it('renders assistant message with left alignment and card background', () => {
    const { container } = render(
      <MessageBubble role="assistant" content="Hi there" timestamp="10:01 AM" />
    );
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.className).toContain('justify-start');

    const bubble = wrapper.firstElementChild as HTMLElement;
    expect(bubble.className).toContain('bg-card');
    expect(bubble.className).toContain('border-border');
    expect(bubble.className).toContain('text-primary');
  });

  it('renders message content', () => {
    render(
      <MessageBubble role="user" content="Test message content" timestamp="10:00 AM" />
    );
    expect(screen.getByText('Test message content')).toBeInTheDocument();
  });

  it('renders timestamp', () => {
    render(
      <MessageBubble role="user" content="Hello" timestamp="2:30 PM" />
    );
    expect(screen.getByText('2:30 PM')).toBeInTheDocument();
  });

  it('renders source links when provided', () => {
    const sources = [
      { title: 'Page One', url: 'https://notion.so/page-one' },
      { title: 'Page Two', url: 'https://notion.so/page-two' },
    ];
    render(
      <MessageBubble role="assistant" content="Answer" sources={sources} timestamp="10:00 AM" />
    );

    const link1 = screen.getByText(/Page One/);
    expect(link1).toBeInTheDocument();
    expect(link1.closest('a')).toHaveAttribute('href', 'https://notion.so/page-one');
    expect(link1.closest('a')).toHaveAttribute('target', '_blank');
    expect(link1.closest('a')).toHaveAttribute('rel', 'noopener noreferrer');

    const link2 = screen.getByText(/Page Two/);
    expect(link2).toBeInTheDocument();
    expect(link2.closest('a')).toHaveAttribute('href', 'https://notion.so/page-two');
  });

  it('does not render source section when sources is empty', () => {
    const { container } = render(
      <MessageBubble role="assistant" content="No sources" sources={[]} timestamp="10:00 AM" />
    );
    expect(container.querySelectorAll('a')).toHaveLength(0);
  });

  it('does not render source section when sources is undefined', () => {
    const { container } = render(
      <MessageBubble role="assistant" content="No sources" timestamp="10:00 AM" />
    );
    expect(container.querySelectorAll('a')).toHaveLength(0);
  });
});
