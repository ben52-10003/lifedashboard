# Your Life Dashboard

A personal dashboard inspired by [*Designing Your Life*](https://designingyour.life/) by Bill Burnett and Dave Evans.

## Features

### Dashboard tab
- Four editable gauges (Health, Work, Play, Love)
- Free-text notes for each life area
- Red-light indicators when a gauge is at half or below
- Summary strip showing how many areas need redesign

### Compass tab
- **Workview** — write your philosophy of work (~250 words) with prompt questions for guidance
- **Lifeview** — write what matters most to you (~250 words)
- **Integration** — reflect on how your Workview and Lifeview complement, clash, and drive each other
- **True North** — compass context plus calibration notes for periodic rechecks

### Journal tab
- **Activity Log** — record the primary activities of each day and rate how *engaged* (absorbed / in flow) and *energized* (draining ↔ energizing) you were
- Optional notes on each activity to drill into what made it work—or not
- **Weekly reflection** — look over the log for trends, insights, and surprises, then note what you might double up on or redesign
- **AEIOU** — zoom in on Activities, Environments, Interactions, Objects, and Users when a log entry is too vague
- Cadence reminders when logging has gone quiet, or when this week’s reflection is still empty

### Mind Map tab
- **Three maps** — Engagement, Energy, and Flow, each with a different center from your Good Time Journal
- Pick a journal activity for the center, or type your own
- Branch outward by adding connected words; aim for three or four layers and a dozen or more elements in the outer ring
- **Life alternative** — pick three disparate outer-ring items, combine them into a possible job description, name the role, and draw a napkin sketch
- Do this three times, once per map, and keep the three versions different from one another

### Odyssey tab
- **Three alternative five-year lives** — the story you tell today, an alternative path if that were gone, and a wildcard
- A six-word title, questions the plan raises, and an easy next action
- A visual 0–5 year timeline for work and personal milestones
- Dashboard gauges for resources, likability, confidence, and coherence
- Optional notes on geography, learning, impact, and what life looks like
- Space to record how each alternative energizes you after you present it

**Try Stuff** (Good Time Journal):
1. Complete a log of your daily activities. Note when you are engaged and/or energized and what you are doing. Try to do this daily, or at least every few days.
2. Continue this daily logging for three weeks.
3. At the end of each week, jot down your reflections—notice which activities are engaging and energizing, and which ones are not.
4. Are there any surprises in your reflections?
5. Zoom in and try to get even more specific about what does or does not engage and energize you.
6. Use the AEIOU method as needed to help you in your reflections.

**Try Stuff** (Mind Mapping):
1. If you didn’t keep a Good Time Journal, go back and do that first.
2. Make three different mind maps, each three or four layers deep, with a dozen or more elements in the outer ring.
3. **Engagement** — put a highly engaging journal activity at the center and branch out.
4. **Energy** — put something really energizing at the center and map from there.
5. **Flow** — put a flow experience at the center and finish the map.
6. From each outer ring, pick three disparate items, combine them into a possible job description, name the role, and draw a napkin sketch. Do this three times, and keep the versions different.

**Try Stuff** (Odyssey Planning):
1. Create three alternative five-year plans.
2. Give each alternative a descriptive six-word title, and write down three questions that arise out of each version of you.
3. Complete each gauge on the dashboard—ranking each alternative for resources, likability, confidence, and coherence.
4. Present your plan to another person, a group, or your Life Design Team. Note how each alternative energizes you.

All data is saved automatically in your browser (`localStorage`).

## Getting started

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (typically `http://localhost:5174`).

## Build for production

```bash
npm run build
npm run preview
```

## Data privacy

All dashboard, compass, journal, mind map, and odyssey data stays in your browser. Nothing is sent to a server.

## Inspired by

Burnett, Bill; Evans, Dave. *Designing Your Life: How to Build a Well-Lived, Joyful Life.*
