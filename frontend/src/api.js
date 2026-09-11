const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export async function fetchEvents() {
  const res = await fetch(`${API_URL}/api/events`)
  if (!res.ok) throw new Error('failed to load events')
  return res.json()
}

export async function createEvent(payload) {
  const res = await fetch(`${API_URL}/api/events`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error('failed to create event')
  return res.json()
}

export async function joinEvent(id, name) {
  const res = await fetch(`${API_URL}/api/events/${id}/join`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  })
  if (!res.ok) throw new Error('failed to join event')
  return res.json()
}
