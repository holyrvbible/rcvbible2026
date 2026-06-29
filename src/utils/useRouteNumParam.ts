import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";

/** Read a route param as a number (non-negative integers only). */
export function useRouteNumParam(paramName: string) {
  const maybeParam = useParams()[paramName];
  const navigate = useNavigate();
  const num =
    maybeParam && /^\d+$/.exec(maybeParam)
      ? parseInt(maybeParam, 10)
      : undefined;

  useEffect(() => {
    if (!num) void navigate("/404");
  }, [navigate, num]);

  return num;
}
