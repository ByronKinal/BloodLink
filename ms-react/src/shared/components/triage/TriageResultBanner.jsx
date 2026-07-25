export function TriageResultBanner({ evaluation }) {
  if (!evaluation) {
    return null
  }

  const isApto = evaluation.result === 'APTO'

  return (
    <div
      className={`rounded-[14px] border px-4 py-4 ${
        isApto
          ? 'border-[rgba(40,160,96,0.25)] bg-[rgba(40,160,96,0.06)]'
          : 'border-[rgba(212,32,64,0.25)] bg-[rgba(212,32,64,0.06)]'
      }`}
    >
      <p className={`text-[14px] font-bold ${isApto ? 'text-verde-v' : 'text-rojo'}`}>
        Resultado: {evaluation.result}
      </p>

      {evaluation.reasons?.length > 0 ? (
        <ul className="mt-2 space-y-1 text-[12px] text-txt3 list-disc list-inside">
          {evaluation.reasons.map((reason) => (
            <li key={reason}>{reason}</li>
          ))}
        </ul>
      ) : (
        <p className="mt-1 text-[12px] text-txt3">No se encontraron impedimentos para donar.</p>
      )}
    </div>
  )
}
