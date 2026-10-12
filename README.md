# Ayush Kumar // Portfolio

An interactive Game Boy-inspired portfolio built with React, Vite, and Tailwind CSS. Turn on the console, boot it with **Start**, and browse the profile, projects, skills, and terminal screens.

## Controls

- Click the power switch, then press **Start** to boot the console.
- Use the on-screen D-pad and **A/B** buttons, or use the keyboard:
  - **Arrow keys** or **WASD**: move through menus and scroll content.
  - **Enter**, **Space**, or **Z**: A/confirm/enter content.
  - **Escape**, **Backspace**, or **X**: B/back to the menu.
- **Select** toggles the screen scanlines.
- The **SFX ON/OFF** button toggles Web Audio sound effects.
- Click the portrait on **MYSELF** to open a larger view; click outside it or press **Escape** to close.
- In the terminal, type `help`, `clear`, `echo <text>`, or `exit`; press **Enter** to run a command. **Escape** also returns to the profile screen.

## Development

Install dependencies, then start the Vite development server:

```bash
npm install
npm run dev
```

The app is available at the local URL printed by Vite.

## Build and checks

```bash
npm run build    # create a production build in dist/
npm run preview  # preview the production build locally
npm run lint     # run ESLint
```

There is currently no automated test suite configured for this project.

Portfolio content is kept in `src/data/portfolio.js`, and the portrait and favicon are local assets under `public/`. The display fonts are loaded from Google Fonts to preserve the original pixel/CRT visual style; system fallbacks remain configured for offline rendering.
