import { useState } from 'react'

export default function Onboarding({ initial, canCancel, onCancel, onSave }) {
  const [name, setName] = useState(initial?.name || '')
  const [major, setMajor] = useState(initial?.major || '')

  function submit(e) {
    e.preventDefault()
    if (!name.trim() || !major.trim()) return
    onSave({ name: name.trim(), major: major.trim() })
  }

  return (
    <div className="modal-overlay open">
      <div className="modal">
        <h2>시작하기 전에</h2>
        <p className="modal-desc">이름과 전공을 알려주세요. 이벤트를 등록하거나 참여할 때 표시돼요.</p>
        <form onSubmit={submit}>
          <div className="field">
            <label htmlFor="pName">이름</label>
            <input
              id="pName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="예: 김하늘"
              maxLength={20}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="pMajor">전공 / 학과</label>
            <input
              id="pMajor"
              value={major}
              onChange={(e) => setMajor(e.target.value)}
              placeholder="예: 컴퓨터공학과"
              maxLength={30}
              required
            />
          </div>
          <div className="modal-actions">
            {canCancel && (
              <button type="button" className="btn-ghost" onClick={onCancel}>취소</button>
            )}
            <button type="submit" className="btn-solid">저장하고 시작하기</button>
          </div>
        </form>
      </div>
    </div>
  )
}
