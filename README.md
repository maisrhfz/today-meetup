# 오늘모임 (Today Meetup)

Campus last-minute-events board. Separate backend (Flask API) and frontend
(Vite + React), matching the two-project split the practice run flagged for
the real event.

## Project structure

```
backend/
  app.py            Flask API: list/create events, join/leave
  requirements.txt
  vercel.json       deploys app.py as a Python serverless function
  .env.example

frontend/
  index.html
  src/
    main.jsx
    App.jsx                  wires profile + events + views together
    api.js                   fetch calls to the backend
    utils.js                 countdown / date-grouping / major-matching helpers
    styles.css
    components/
      Header.jsx
      Onboarding.jsx         name + major capture
      AddEventModal.jsx      create-event form (title, location, date/time, capacity, course)
      CalendarView.jsx       month grid + day detail list
      Timeline.jsx           scrolling list grouped by ongoing/today/later
      EventRow.jsx           countdown flap + capacity bar + join button
  package.json
  vite.config.js
  .env.example
```

## Local dev

```bash
# backend
cd backend
cp .env.example .env
pip install -r requirements.txt
python app.py                 # http://localhost:5000

# frontend (separate terminal)
cd frontend
cp .env.example .env
npm install
npm run dev                   # http://localhost:5173
```

## Data model

Each event: `{ id, title, location, start (ISO), capacity, course, organizer, joinedNames: [] }`.
`course` empty string = open to every major. `joinedNames` doubles as the
attendee list and the headcount (`joinedNames.length`).

Storage is in-memory on the backend — resets on cold start. Fine for a demo;
swap for Vercel KV/Postgres if the real topic needs events to survive restarts.

## Splitting the work across 4 people

**1. Backend / API — `backend/`**
Own `app.py`: request validation, error responses, and (if there's time) a
real datastore instead of the in-memory list. Deploy `backend/` as its own
Vercel project and hand the deployed URL to whoever owns integration.

**2. Frontend — Calendar & Timeline — `frontend/src/components/CalendarView.jsx`, `Timeline.jsx`, `EventRow.jsx`**
Own the two browsing views students actually scroll through. Natural
follow-ups: color the calendar dots by course instead of urgency, add a week
view, tune mobile spacing.

**3. Frontend — Forms & Identity — `frontend/src/components/Onboarding.jsx`, `AddEventModal.jsx`, `Header.jsx`**
Own name/major capture, the add-event form, and profile editing. Natural
follow-ups: inline validation messages, a major autosuggest list, editing an
event you posted.

**4. Integration & Deploy**
Point `frontend/.env`'s `VITE_API_URL` at the deployed backend, set the
backend's `ALLOWED_ORIGIN` to the deployed frontend's domain, deploy
`frontend/` as its own Vercel project, turn off Deployment Protection on both
so judges can open the links without a Vercel login, and run the demo once
on an actual phone before presenting.
