export interface Fact {
  label: string;
  value: React.ReactNode | null;
}

export function FactList({ facts }: { facts: Fact[] }) {
  const present = facts.filter((fact) => fact.value != null && fact.value !== "");
  if (!present.length) return null;

  return (
    <dl className="space-y-3">
      {present.map((fact) => (
        <div key={fact.label}>
          <dt className="text-sm font-semibold text-white">{fact.label}</dt>
          <dd className="text-sm text-light-blue-400">{fact.value}</dd>
        </div>
      ))}
    </dl>
  );
}
