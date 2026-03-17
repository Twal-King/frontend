export interface SourceLinkProps {
  title: string;
  url: string;
}

export function SourceLink({ title, url }: SourceLinkProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block text-xs text-accent hover:underline"
    >
      📎 {title}
    </a>
  );
}
