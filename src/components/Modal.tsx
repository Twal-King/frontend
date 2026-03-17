interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export function Modal({ open, onClose, title, children }: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
        role="presentation"
      />
      <div
        className="relative bg-card border border-border rounded-2xl p-6 w-full max-w-md mx-4"
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        {title && <h2 className="text-xl font-semibold text-primary mb-4">{title}</h2>}
        {children}
      </div>
    </div>
  );
}
