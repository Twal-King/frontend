import { cn } from '@/utils/cn';
import type { Session } from '../types';

export interface SessionSidebarProps {
  sessions: Session[];
  activeSessionId: string | null;
  onNewSession: () => void;
  onSelectSession: (sessionId: string) => void;
}

type DateGroup = '오늘' | '어제' | '이전';

function getDateGroup(dateStr: string): DateGroup {
  const now = new Date();
  const date = new Date(dateStr);

  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfYesterday = new Date(startOfToday.getTime() - 86_400_000);

  if (date >= startOfToday) return '오늘';
  if (date >= startOfYesterday) return '어제';
  return '이전';
}

function groupSessionsByDate(sessions: Session[]): { group: DateGroup; sessions: Session[] }[] {
  const order: DateGroup[] = ['오늘', '어제', '이전'];
  const map = new Map<DateGroup, Session[]>();

  for (const session of sessions) {
    const group = getDateGroup(session.updatedAt);
    const list = map.get(group) ?? [];
    list.push(session);
    map.set(group, list);
  }

  return order
    .filter((g) => map.has(g))
    .map((g) => ({ group: g, sessions: map.get(g)! }));
}

export function SessionSidebar({
  sessions,
  activeSessionId,
  onNewSession,
  onSelectSession,
}: SessionSidebarProps) {
  const grouped = groupSessionsByDate(sessions);

  return (
    <aside className="w-sidebar h-full bg-card border-r border-border flex flex-col shrink-0">
      <div className="p-4">
        <button
          type="button"
          onClick={onNewSession}
          className={cn(
            'w-full inline-flex items-center justify-center font-medium transition-colors rounded-xl',
            'bg-accent text-white px-4 py-2 text-sm hover:bg-accent-hover'
          )}
        >
          + 새 대화
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 pb-4" aria-label="세션 목록">
        {grouped.map(({ group, sessions: groupSessions }) => (
          <div key={group} className="mb-4">
            <h3 className="px-2 mb-1 text-xs text-secondary font-medium">{group}</h3>
            <ul>
              {groupSessions.map((session) => (
                <li key={session.id}>
                  <button
                    type="button"
                    onClick={() => onSelectSession(session.id)}
                    className={cn(
                      'w-full text-left px-3 py-2 rounded-xl text-sm transition-colors truncate',
                      session.id === activeSessionId
                        ? 'bg-hover text-primary'
                        : 'text-secondary hover:bg-hover hover:text-primary'
                    )}
                  >
                    {session.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
