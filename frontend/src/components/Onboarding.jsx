import { useState } from 'react'

const KU_MAJORS_DATA = [
  {
    college: "경영대학",
    majors: ["경영학과"]
  },
  {
    college: "공과대학",
    majors: [
      "화공생명공학과", "신소재공학과", "건축사회환경공학과", 
      "건축학과", "기계공학부", "산업경영공학부", 
      "전기전자공학부", "반도체공학과", "차세대통신학과"
    ]
  },
  {
    college: "문과대학",
    majors: [
      "국어국문학과", "철학과", "한국사학과", "사학과", "심리학과", 
      "사회학과", "한문학과", "영어영문학과", "독어독문학과", 
      "불어불문학과", "중어중문학과", "노어노문학과", "일어일문학과", 
      "서어서문학과", "언어학과"
    ]
  },
  {
    college: "생명과학대학",
    majors: [
      "생명과학부", "생명공학부", "식품공학과", 
      "환경생태공학부", "식품자원경제학과"
    ]
  },
  {
    college: "정경대학",
    majors: ["정치외교학과", "경제학과", "통계학과", "행정학과"]
  },
  {
    college: "이과대학",
    majors: ["수학과", "물리학과", "화학과", "지구환경과학과"]
  },
  {
    college: "정보대학",
    majors: ["컴퓨터학과", "데이터과학과"]
  },
  {
    college: "국제대학",
    majors: ["국제학부"]
  },
  {
    college: "기타 독립학부 및 전문대학",
    majors: [
      "미디어학부", "의과대학(의예과/의학과)", "간호대학", 
      "사범대학", "보건과학대학", "스마트보안학부", "융합전공"
    ]
  }
]

export default function Onboarding({ onSave, onCancel }) {
  const [name, setName] = useState('')
  const [major, setMajor] = useState('')
  const [studentId, setStudentId] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim()) return

    onSave({
      name: name.trim(),
      major: major.trim(),
      studentId: studentId.trim(),
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
              list="ku-majors-list"
              value={major}
              onChange={(e) => setMajor(e.target.value)}
              placeholder="예: 컴퓨터학과 (선택 또는 직접 입력)"
            />
            <datalist id="ku-majors-list">
              {KU_MAJORS_DATA.map((group) =>
                group.majors.map((m) => (
                  <option key={m} value={m}>
                    {m} ({group.college})
                  </option>
                ))
              )}
            </datalist>
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