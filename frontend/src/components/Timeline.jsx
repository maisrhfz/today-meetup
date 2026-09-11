import EventRow from './EventRow'
import { countdownInfo, dateHeaderLabel } from '../utils'

export default function Timeline({ events, now, profile, onJoin, onEdit, onDelete, emptyLabel }) {
  const sorted = [...events].sort((a, b) => new Date(a.start) - new Date(b.start))

  if (sorted.length === 0) {
    return (
      <div className="empty-state">
        <strong>{emptyLabel}</strong>
        오른쪽 위 버튼으로 첫 모임을 열어보세요.
      </div>
    )
  }

  const ongoing = []
  const byDate = new Map()

  sorted.forEach((ev) => {
    const start = new Date(ev.start)
    const info = countdownInfo(start, now)
    if (info.status === 'ongoing') {
      ongoing.push(ev)
    } else {
      const key = start.toDateString()
      if (!byDate.has(key)) byDate.set(key, [])
      byDate.get(key).push(ev)
    }
  })

  return (
    <>
      {ongoing.length > 0 && (
        <>
          <div className="group-header">지금 진행 중 <span className="count">· {ongoing.length}건</span></div>
          {ongoing.map((ev) => (
            <EventRow key={ev.id} event={ev} now={now} profile={profile} onJoin={onJoin} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </>
      )}
      {[...byDate.entries()].map(([key, list]) => (
        <div key={key}>
          <div className="group-header">
            {dateHeaderLabel(new Date(list[0].start), now)} <span className="count">· {list.length}건</span>
          </div>
          {list.map((ev) => (
            <EventRow key={ev.id} event={ev} now={now} profile={profile} onJoin={onJoin} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </div>
      ))}
    </>
  )
}