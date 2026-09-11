import { useState } from 'react'

export default function Onboarding({ onSave, onCancel }) {
  const [name, setName] = useState('')
  const [major, setMajor] = useState('')
  const [studentId, setStudentId] = useState('') // 1. Added state for student ID (학번)

  function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim()) return

    onSave({
      name: name.trim(),
      major: major.trim(),
      studentId: studentId.trim(), // 2. Pass studentId in save handler
    })
  }

  return (
    <div className="modal-overlay open">
      <div className="modal">
        <h2>시작하기 전에</h2>
        <p className="description">
          이름, 전공, 학번을 알려주세요. 이벤트를 등록하거나 참여할 때 표시돼요.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="oName">이름</label>
            <input
              id="oName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="예: 홍길동"
              required
            />
          </div>

          {/* 3. Added 학번 input field */}
          <div className="field">
            <label htmlFor="oStudentId">학번</label>
            <input
              id="oStudentId"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              placeholder="예: 2024123456"
              required
            />
          </div>

          <div className="field">
            <label htmlFor="oMajor">전공 / 학과</label>
            <input
              id="oMajor"
              value={major}
              onChange={(e) => setMajor(e.target.value)}
              placeholder="예: 컴퓨터공학과"
            />
          </div>

          <div className="modal-actions">
            {onCancel && (
              <button type="button" className="btn-ghost" onClick={onCancel}>
                취소
              </button>
            )}
            <button type="submit" className="btn-solid">
              저장하고 시작하기
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}