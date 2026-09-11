import EventRow from './EventRow'
import { WEEKDAYS, dateKey, isSameDate, countdownInfo } from '../utils'

export default function CalendarView({
  events, now, profile, onJoin,
  calYear, calMonth, selectedKey,
  setCalYear, setCalMonth, setSelectedKey,
}) {
  const dayMap = new Map()
  events.forEach((ev) => {
    const key = dateKey(new Date(ev.start))
    if (!dayMap.has(key)) dayMap.set(key, [])
    dayMap.get(key).push(ev)
  })

  const firstOfMonth = new Date(calYear, calMonth, 1)
  const startWeekday = firstOfMonth.getDay()
  const totalDaysInMonth = new Date(calYear, calMonth + 1, 0).getDate()
  const totalCells = Math.ceil((startWeekday + totalDaysInMonth) / 7) * 7

  const cells = []
  for (let i = 0; i < totalCells; i++) {
    cells.push(new Date(calYear, calMonth, 1 - startWeekday + i))
  }

  function shiftMonth(delta) {
    let m = calMonth + delta
    let y = calYear
    if (m < 0) { m = 11; y -= 1 } else if (m > 11) { m = 0; y += 1 }
    setCalMonth(m)
    setCalYear(y)
  }

  function goToday() {
    const t = new Date()
    setCalYear(t.getFullYear())
    setCalMonth(t.getMonth())
    setSelectedKey(dateKey(t))
  }

  const [selY, selM, selD] = selectedKey.split('-').map(Number)
  const selDateObj = new Date(selY, selM, selD)
  const selEvents = (dayMap.get(selectedKey) || []).sort((a, b) => new Date(a.start) - new Date(b.start))

  return (
    <>
      <div className="calendar-wrap">
        <div className="cal-nav">
          <button onClick={() => setCalYear((y) => y - 1)} title="이전 해">«</button>
          <button onClick={() => shiftMonth(-1)} title="이전 달">‹</button>
          <div className="cal-month-label">{calYear}년 {calMonth + 1}월</div>
          <button onClick={() => shiftMonth(1)} title="다음 달">›</button>
          <button onClick={() => setCalYear((y) => y + 1)} title="다음 해">»</button>
          <button 
            className="cal-today-btn" 
            onClick={goToday}
            style={{ width: 'auto', minWidth: '48px', padding: '0 10px', whiteSpace: 'nowrap' }}
          >
            오늘
          </button>
        </div>
        <div className="cal-grid">
          {WEEKDAYS.map((wd, i) => (
            <div key={wd} className={`cal-weekday ${i === 0 ? 'sun' : i === 6 ? 'sat' : ''}`}>{wd}</div>
          ))}
          {cells.map((cellDate) => {
            const key = dateKey(cellDate)
            const isOther = cellDate.getMonth() !== calMonth
            const isToday = isSameDate(cellDate, now)
            const isSelected = key === selectedKey
            const wd = cellDate.getDay()
            const wdCls = wd === 0 ? 'sun' : wd === 6 ? 'sat' : ''
            const dayEvents = dayMap.get(key) || []
            const shown = dayEvents.slice(0, 4)

            return (
              <div
                key={key}
                className={`cal-cell ${isOther ? 'other-month' : ''} ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''} ${wdCls}`}
                onClick={() => {
                  setSelectedKey(key)
                  setCalYear(cellDate.getFullYear())
                  setCalMonth(cellDate.getMonth())
                }}
              >
                <div className="cal-date">{cellDate.getDate()}</div>
                {dayEvents.length > 0 && (
                  <div className="cal-dots">
                    {shown.map((ev) => {
                      const info = countdownInfo(new Date(ev.start), now)
                      const urgent = info.status === 'ongoing' || info.cls === 'amber'
                      return <span key={ev.id} className={`cal-dot ${urgent ? 'urgent' : ''}`} />
                    })}
                    {dayEvents.length > 4 && <span className="cal-more">+{dayEvents.length - 4}</span>}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      <div className="day-detail-header">
        {selDateObj.getMonth() + 1}월 {selDateObj.getDate()}일 ({WEEKDAYS[selDateObj.getDay()]})
        {isSameDate(selDateObj, now) ? ' · 오늘' : ''} 일정 <span className="count">· {selEvents.length}건</span>
      </div>
      {selEvents.length === 0 ? (
        <div className="empty-state">
          <strong>이 날은 등록된 이벤트가 없어요</strong>
          오른쪽 위 버튼으로 이 날짜에 모임을 열어보세요.
        </div>
      ) : (
        selEvents.map((ev) => (
          <EventRow key={ev.id} event={ev} now={now} profile={profile} onJoin={onJoin} />
        ))
      )}
    </>
  )
}