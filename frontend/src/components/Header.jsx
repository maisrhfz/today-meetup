import { useTheme } from "../useTheme";
import { useEffect, useState } from 'react'
import { pad } from '../utils'

export default function Header({ profile, onEditProfile, onAddEvent }) {
  const [clock, setClock] = useState('')
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    const tick = () => {
      const d = new Date()
      setClock(`${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`)
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="board-header">
      <div className="brand-block">
        <div className="brand">오늘모임</div>
        <div className="brand-sub">캠퍼스 실시간 모임 게시판</div>
      </div>
      <div className="header-right">
        <button className="profile-chip" onClick={onEditProfile}>
          <span className="dot" />
          <span>{profile ? `${profile.name} · ${profile.major}` : '프로필 설정'}</span>
        </button>
        <div className="live-clock">{clock}</div>
        <button className="add-btn" onClick={onAddEvent}>+ 이벤트 등록</button>
        <button className="profile-chip" onClick={toggleTheme} aria-label="Toggle dark mode">
          {theme === "dark" ? "☀️" : "🌙"}
        </button>
      </div>
    </div>
  )
}
