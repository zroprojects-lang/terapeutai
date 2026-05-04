'use client'

interface MoodChartProps {
  data: { date: string; mood: number }[]
}

export function MoodChart({ data }: MoodChartProps) {
  if (data.length === 0) return null

  const maxMood = 10
  const chartHeight = 200

  return (
    <div className="w-full">
      <div className="flex items-end gap-2 h-[200px]">
        {data.map((point, i) => {
          const height = (point.mood / maxMood) * chartHeight
          const color =
            point.mood >= 7
              ? 'bg-green-500'
              : point.mood >= 4
                ? 'bg-yellow-500'
                : 'bg-red-500'

          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-xs font-medium">{point.mood}</span>
              <div
                className={`w-full rounded-t ${color} transition-all min-w-[20px]`}
                style={{ height: `${height}px` }}
              />
              <span className="text-xs text-muted-foreground truncate w-full text-center">
                {point.date}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
