import { useEffect, useState } from 'react'
import { pad } from '../utils'

export default function AddEventModal({ open, defaultDate, onClose, onCreate }) {
  const [title, setTitle] = useState('')
  const [location, setLocation] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [capacity, setCapacity] = useState('')
  const [course, setCourse] = useState('')

  useEffect(() => {
    if (!open) return
    const base = defaultDate || new Date()
    setDate(`${base.getFullYear()}-${pad(base.getMonth() + 1)}-${pad(base.getDate())}`)
    const t = new Date()
    setTime(`${pad(t.getHours())}:${pad(t.getMinutes())}`)
  }, [open, defaultDate])

  if (!open) return null

  function submit(e) {
    e.preventDefault()
    if (!title || !location || !date || !time || !capacity) return
    onCreate({
      title,
      location,
      start: new Date(`${date}T${time}:00`).toISOString(),
      capacity: parseInt(capacity, 10),
      course: course.trim(),
    })
    setTitle('')
    setLocation('')
    setCapacity('')
    setCourse('')
  }

  return (
    <div
      className="modal-overlay open"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="modal">
        <h2>새 이벤트 등록</h2>
        <form onSubmit={submit}>
          <div className="field">
            <label htmlFor="fTitle">제목</label>
            <input id="fTitle" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="예: 도서관 앞 즉흥 스터디" required />
          </div>
          <div className="field">
            <label htmlFor="fLocation">장소</label>
            <input id="fLocation" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="예: 중앙도서관 1층 로비" required />
          </div>
          <div className="field-row">
            <div className="field">
              <label htmlFor="fDate">날짜</label>
              <input id="fDate" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
            </div>
            <div className="field">
              <label htmlFor="fTime">시간</label>
              <input id="fTime" type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
            </div>
          </div>
          <div className="field-row">
            <div className="field">
              <label htmlFor="fCapacity">최대 인원</label>
              <input id="fCapacity" type="number" min="1" max="999" value={capacity} onChange={(e) => setCapacity(e.target.value)} placeholder="예: 8" required />
            </div>
            <div className="field">
              <label htmlFor="fCourse">대상 전공 (선택)</label>
              <input id="fCourse" value={course} onChange={(e) => setCourse(e.target.value)} placeholder="비워두면 전체 전공" />
            </div>
          </div>
          <div className="modal-actions">
            <button type="button" className="btn-ghost" onClick={onClose}>취소</button>
            <button type="submit" className="btn-solid">등록하기</button>
          </div>
        </form>
      </div>
    </div>
  )
}
