import { useRef } from "react";
import { Paperclip } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type Props = {
  onText: (text: string, filename: string) => void;
  label?: string;
  className?: string;
  maxBytes?: number;
};

/**
 * Botão discreto para anexar arquivos .txt / .md em campos de texto longo.
 * Lê o conteúdo no cliente e devolve como string via onText.
 */
export function AttachTextFile({ onText, label = "Anexar .txt / .md", className, maxBytes = 512_000 }: Props) {
  const ref = useRef<HTMLInputElement>(null);

  return (
    <>
      <input
        ref={ref}
        type="file"
        accept=".txt,.md,text/plain,text/markdown"
        className="hidden"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          if (!file) return;
          const name = file.name.toLowerCase();
          if (!name.endsWith(".txt") && !name.endsWith(".md")) {
            toast.error("Formato não suportado. Envie .txt ou .md");
            return;
          }
          if (file.size > maxBytes) {
            toast.error(`Arquivo muito grande (máx. ${Math.round(maxBytes / 1024)} KB)`);
            return;
          }
          try {
            const text = await file.text();
            onText(text, file.name);
            toast.success(`${file.name} anexado`);
          } catch {
            toast.error("Não foi possível ler o arquivo");
          }
        }}
      />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => ref.current?.click()}
        className={className}
      >
        <Paperclip className="mr-1.5 h-3.5 w-3.5" />
        {label}
      </Button>
    </>
  );
}