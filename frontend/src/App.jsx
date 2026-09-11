import { useCallback, useEffect, useState } from 'react'
import Header from './components/Header'
import Onboarding from './components/Onboarding'
import AddEventModal from './components/AddEventModal'
import CalendarView from './components/CalendarView'
import Timeline from './components/Timeline'
import { fetchEvents, createEvent, updateEvent, deleteEvent, joinEvent } from './api'
import { dateKey, matchesMyMajor } from './utils'

const PROFILE_KEY = 'todaymeetup_profile'

export default function App() {
  const [profile, setProfile] = useState(null)
  const [profileLoaded, setProfileLoaded] = useState(false)
  const [editingProfile, setEditingProfile] = useState(false)

  const [events, setEvents] = useState([])
  const [viewMode, setViewMode] = useState('calendar') // 'calendar' | 'list'
  const [filter, setFilter] = useState('all') // 'all' | 'mine'
  const [addOpen, setAddOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState(null)

  const today = new Date()
  const [calYear, setCalYear] = useState(today.getFullYear())
  const [calMonth, setCalMonth] = useState(today.getMonth())
  const [selectedKey, setSelectedKey] = useState(dateKey(today))

  const [nowTick, setNowTick] = useState(Date.now())

  // load saved profile once on mount
  useEffect(() => {
    const saved = localStorage.getItem(PROFILE_KEY)
    if (saved) {
      try { setProfile(JSON.parse(saved)) } catch { /* ignore bad cache */ }
    }
    setProfileLoaded(true)
  }, [])

  const loadEvents = useCallback(async () => {
    try {
      const data = await fetchEvents()
      setEvents(data)
    } catch (e) {
      console.error('failed to load events', e)
    }
  }, [])

  // poll the backend + tick the clock once we have a profile
  useEffect(() => {
    if (!profile) return
    loadEvents()
    const poll = setInterval(loadEvents, 15000)
    const tick = setInterval(() => setNowTick(Date.now()), 15000)
    return () => { clearInterval(poll); clearInterval(tick) }
  }, [profile, loadEvents])

  function saveProfile(p) {
    setProfile(p)
    localStorage.setItem(PROFILE_KEY, JSON.stringify(p))
    setEditingProfile(false)
  }

  async function handleJoin(id) {
    if (!profile) return
    try {
      const updated = await joinEvent(id, profile.name)
      setEvents((evts) => evts.map((e) => (e.id === id ? updated : e)))
    } catch (e) {
      console.error('failed to join event', e)
    }
  }

  async function handleCreate(payload) {
    try {
      const created = await createEvent({ ...payload, organizer: profile.name })
      setEvents((evts) => [...evts, created])
      setAddOpen(false)
    } catch (e) {
      console.error('failed to create event', e)
    }
  }

  async function handleUpdate(id, payload) {
    try {
      const updated = await updateEvent(id, payload)
      setEvents((evts) => evts.map((e) => (e.id === id ? updated : e)))
      setEditingEvent(null)
    } catch (e) {
      console.error('failed to update event', e)
    }
  }

  async function handleDelete(id) {
    try {
      await deleteEvent(id)
      setEvents((evts) => evts.filter((e) => e.id !== id))
    } catch (e) {
      console.error('failed to delete event', e)
    }
  }

  if (!profileLoaded) return null

  if (!profile || editingProfile) {
    return (
      <Onboarding
        initial={profile}
        canCancel={!!profile}
        onCancel={() => setEditingProfile(false)}
        onSave={saveProfile}
      />
    )
  }

  const now = new Date(nowTick)
  const visibleEvents = filter === 'mine'
    ? events.filter((ev) => matchesMyMajor(ev.course, profile.major))
    : events

  const [dy, dm, dd] = selectedKey.split('-').map(Number)
  const defaultDateForModal = viewMode === 'calendar' ? new Date(dy, dm, dd) : new Date()

  return (
    <div className="app">
      <Header
        profile={profile}
        onEditProfile={() => setEditingProfile(true)}
        onAddEvent={() => setAddOpen(true)}
      />

      <div className="controls-bar" style={{ display: 'flex' }}>
        <div className="btn-group">
          <button className={`tab-btn ${viewMode === 'calendar' ? 'active' : ''}`} onClick={() => setViewMode('calendar')}>캘린더</button>
          <button className={`tab-btn ${viewMode === 'list' ? 'active' : ''}`} onClick={() => setViewMode('list')}>타임라인</button>
        </div>
        <div className="btn-group">
          <button className={`tab-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>전체</button>
          <button className={`tab-btn ${filter === 'mine' ? 'active' : ''}`} onClick={() => setFilter('mine')}>내 전공 · {profile.major}</button>
        </div>
      </div>

      <div id="board">
        {viewMode === 'calendar' ? (
          <CalendarView
            events={visibleEvents}
            now={now}
            profile={profile}
            onJoin={handleJoin}
            onEdit={setEditingEvent}
            onDelete={handleDelete}
            calYear={calYear}
            calMonth={calMonth}
            selectedKey={selectedKey}
            setCalYear={setCalYear}
            setCalMonth={setCalMonth}
            setSelectedKey={setSelectedKey}
          />
        ) : (
          <Timeline
            events={visibleEvents}
            now={now}
            profile={profile}
            onJoin={handleJoin}
            onEdit={setEditingEvent}
            onDelete={handleDelete}
            emptyLabel={filter === 'mine' ? '내 전공에 맞는 이벤트가 아직 없어요' : '아직 등록된 이벤트가 없어요'}
          />
        )}
      </div>

      <AddEventModal
        open={addOpen || !!editingEvent}
        defaultDate={defaultDateForModal}
        event={editingEvent}
        onClose={() => { setAddOpen(false); setEditingEvent(null) }}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
      />
    </div>
  )
}