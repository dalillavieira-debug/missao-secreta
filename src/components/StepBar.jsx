export default function StepBar({ total, current, done }) {
  return (
    <div className="flex gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-1 flex-1 rounded-full transition-all duration-300 ${
            done || i < current
              ? 'bg-gold-500'
              : i === current
              ? 'bg-gold-400/70'
              : 'bg-dark-600'
          }`}
        />
      ))}
    </div>
  )
}
