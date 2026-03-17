import { NavLink } from 'react-router-dom';
import { cn } from '../utils/cn';
import { Sidebar } from './Sidebar';
import { Logo } from './Logo';
import { Button } from './Button';
import { HealthIndicator } from './HealthIndicator';

interface LayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { to: '/', label: '💬 챗봇' },
  { to: '/admin', label: '📦 임베딩 관리', end: true },
  { to: '/admin/notion', label: '🔗 Notion 동기화' },
  { to: '/admin/documents', label: '📄 문서 관리' },
  { to: '/admin/settings', label: '⚙️ 청킹 설정' },
  { to: '/admin/guide', label: '📖 가이드' },
];

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex w-full min-h-screen bg-main">
      <Sidebar>
        <Logo />
        <nav className="flex flex-col gap-1 p-4 flex-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={'end' in item ? item.end : undefined}
              className={({ isActive }) =>
                cn(
                  'px-3 py-2 rounded-xl text-sm transition-colors',
                  isActive
                    ? 'bg-hover text-primary'
                    : 'text-secondary hover:text-primary hover:bg-hover'
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <HealthIndicator />
      </Sidebar>
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="flex items-center justify-end gap-2 px-6 py-3 border-b border-border shrink-0">
          <Button variant="ghost" size="sm">로그인</Button>
          <Button variant="primary" size="sm">회원가입</Button>
        </header>
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
