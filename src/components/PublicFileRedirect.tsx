import { useEffect } from "react";

export const PublicFileRedirect: React.FC<{ filePath: string }> = ({
  filePath,
}) => {
  useEffect(() => {
    globalThis.location.replace(`/${filePath}`);
  }, [filePath]);

  return null;
};
