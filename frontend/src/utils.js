export const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토']

export function pad(n) {
  return n.toString().padStart(2, '0')
}

export function dateKey(d) {
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
}

export function isSameDate(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

export function fmtTime(d) {
  const h = d.getHours()
  const period = h < 12 ? '오전' : '오후'
  const h12 = h % 12 === 0 ? 12 : h % 12
  return `${period} ${h12}:${pad(d.getMinutes())}`
}

export function dateHeaderLabel(d, now) {
  const tomorrow = new Date(now)
  tomorrow.setDate(now.getDate() + 1)
  let prefix = ''
  if (isSameDate(d, now)) prefix = '오늘 · '
  else if (isSameDate(d, tomorrow)) prefix = '내일 · '
  return `${prefix}${d.getMonth() + 1}월 ${d.getDate()}일 (${WEEKDAYS[d.getDay()]})`
}

// start/end are the event's real start and end Date objects.
// upcoming -> ongoing (LIVE) once `now` reaches start, ended once `now` reaches end.
export function countdownInfo(start, end, now) {
  if (now < start) {
    const diff = start - now
    const mins = Math.round(diff / 60000)
    if (mins < 60) {
      return { status: 'upcoming', value: `${mins}분`, label: '후 시작', cls: 'amber' }
    }
    if (diff < 24 * 3600000) {
      const h = Math.floor(diff / 3600000)
      const m = Math.round((diff % 3600000) / 60000)
      return { status: 'upcoming', value: `${h}시간 ${m}분`, label: '후 시작', cls: h < 3 ? 'amber' : 'teal' }
    }
    const days = Math.ceil(diff / (24 * 3600000))
    return { status: 'upcoming', value: `D-${days}`, label: '예정', cls: 'dim' }
  }

  if (now < end) {
    return { status: 'ongoing', value: 'LIVE', label: '진행 중', cls: 'teal' }
  }

  return { status: 'ended', value: '종료', label: '모임 끝', cls: 'dim' }
}

export function matchesMyMajor(course, myMajor) {
  if (!course) return true
  if (!myMajor) return false
  const a = course.toLowerCase()
  const b = myMajor.toLowerCase()
  return a.includes(b) || b.includes(a)
}