import { useEffect } from "react";

export function useSetDocumentTitle(title: string | null | undefined) {
  useEffect(() => {
    if (!title) return;
    document.title = title;
  }, [title]);
}
