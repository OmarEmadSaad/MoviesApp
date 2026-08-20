import { useParams } from "react-router-dom";

export function useNumericParam(
  name = "id",
  { allowZero = false }: { allowZero?: boolean } = {},
): number | null {
  const params = useParams();
  const raw = params[name];
  if (!raw) return null;
  const value = Number(raw);
  if (!Number.isInteger(value)) return null;
  return value > 0 || (allowZero && value === 0) ? value : null;
}
