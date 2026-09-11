import { countdownInfo, fmtTime } from '../utils'

export default function EventRow({ event, now, profile, onJoin }) {
  const start = new Date(event.start)
  const info = countdownInfo(start, now)
  const joinedCount = event.joinedNames.length
  const full = joinedCount >= event.capacity
  const joinedByMe = profile && event.joinedNames.includes(profile.name)
  const pct = Math.min(100, Math.round((joinedCount / event.capacity) * 100))
  const barCls = full ? 'full' : pct >= 80 ? 'warn' : ''

  let label, cls, disabled = false
  if (info.status === 'ended') {
    label = '종료됨'; cls = ''; disabled = true
  } else if (joinedByMe) {
    label = '참여 취소'; cls = 'joined'
  } else if (full) {
    label = '마감'; cls = ''; disabled = true
  } else {
    label = '참여하기'; cls = 'primary'
  }

  return (
    <div className={`row ${info.status === 'ended' ? 'ended' : ''}`}>
      <div className="flap">
        <div className={`flap-value ${info.cls}`}>{info.value}</div>
        <div className="flap-label">{info.label}</div>
      </div>
      <div className="row-main">
        <div className="row-title">{event.title}</div>
        <div className="row-meta">{event.location} · {fmtTime(start)}</div>
        <div className="row-tags">
          <span className="tag course">{event.course || '전체 전공'}</span>
          <span className="tag">등록: {event.organizer || '익명'}</span>
        </div>
      </div>
      <div className="row-capacity">
        <div className="capacity-text">{joinedCount}/{event.capacity}명</div>
        <div className="capacity-bar"><div className={`capacity-fill ${barCls}`} style={{ width: `${pct}%` }} /></div>
      </div>
      <button className={`join-btn ${cls}`} disabled={disabled} onClick={() => onJoin(event.id)}>
        {label}
      </button>
    </div>
  )
}
