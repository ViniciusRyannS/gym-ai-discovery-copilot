import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function MarkdownView({ content, className = "" }: { content: string; className?: string }) {
  return (
    <div className={`markdown text-sm leading-relaxed text-foreground/90 ${className}`}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}
