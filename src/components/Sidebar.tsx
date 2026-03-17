interface SidebarProps {
  children: React.ReactNode;
}

export function Sidebar({ children }: SidebarProps) {
  return (
    <aside className="w-sidebar h-screen bg-card border-r border-border flex flex-col shrink-0">
      {children}
    </aside>
  );
}
