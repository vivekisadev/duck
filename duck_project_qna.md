# Duck Project: Core Concepts & Q&A Study Guide

This document summarizes the core technical concepts implemented in the Duck project (both the Website and the CLI simulation) and provides potential interview/review questions you might be asked, along with how to answer them.

---

## 1. Core Technical Concepts We Implemented

### A. Terminal Simulation & State Management (React)
- **Concept:** We built a custom `InteractiveTerminal.jsx` component that mimics a real CLI. 
- **How it works:** It uses React state (`useState`) to track an array of command history. When a user types a command, it parses the input, matches it against a centralized command dictionary (`src/ai/prompts.js`), and simulates a typing effect before rendering the output.
- **Why it matters:** It demonstrates an understanding of controlled components, event handling (`onKeyDown` for Enter), and separating UI logic from business logic (moving commands to `prompts.js`).

### B. Dynamic Navbar & Scroll Listeners
- **Concept:** A "contracting" Navbar that shrinks and becomes a fixed glassmorphic header when the user scrolls down.
- **How it works:** We used a React `useEffect` to attach a `scroll` event listener to the window. Based on the `window.scrollY` threshold, a boolean state (`isScrolled`) toggles Tailwind classes like `backdrop-blur-md` and `fixed` to achieve the effect dynamically.

### C. Advanced CSS & Tailwind Integration
- **Concept:** A highly customized Duck theme using CSS Variables and Tailwind.
- **How it works:** We defined base colors (`--paper`, `--ink`, `--red`) in `index.css` under `@layer base`. We then configured `tailwind.config.js` to map these variables to Tailwind utility classes (like `bg-ink`, `text-red`).
- **Why it matters:** This approach allows for instant global theme changes (like Dark/Light mode) without having to rewrite utility classes across hundreds of components.

### D. The "Timewarp" / Git Backdate Feature
- **Concept:** The `duck backdate` command manipulates Git history to create commits in the past.
- **How it works:** It runs isolated Git commands via Node.js (likely using `child_process`). To fake the date, it temporarily overrides the `GIT_AUTHOR_DATE` and `GIT_COMMITTER_DATE` environment variables during the `git commit` process. We also had to chunk operations carefully so we didn't pollute the actual environment.

### E. Frontend Build Pipeline (Vite & PostCSS)
- **Concept:** Understanding how the code actually compiles.
- **How it works:** React code is bundled by Vite. The CSS is processed by PostCSS, which reads `tailwind.config.js` to generate only the CSS utility classes you actually used. When we had a trailing bracket syntax error in the JS config, it crashed the CSS pipeline, demonstrating how tightly integrated these build tools are.

---

## 2. Potential Questions & How to Answer Them

### Architecture & Design
**Q: Why did you move the commands out of the Terminal component and into `src/ai/prompts.js`?**
> **A:** "To adhere to the principle of Separation of Concerns. The Terminal component should only care about *rendering* the UI and handling keyboard events. By moving the command definitions and logic to a separate file, the code becomes much more modular. It makes it easier to add 50 new commands later without making the React component thousands of lines long."

**Q: How does the glassmorphism (frosted glass) effect work on your Navbar?**
> **A:** "It relies on the CSS `backdrop-filter: blur()` property. In Tailwind, I applied the `backdrop-blur-md` utility class along with a slightly transparent background color (`bg-ink/90`). This tells the browser to blur whatever elements are currently being rendered *behind* the navbar."

### React & State Management
**Q: How do you handle keeping the terminal scrolled to the bottom when new commands are entered?**
> **A:** "I use a React `useRef` hook attached to the bottom of the terminal container. Whenever the command history state array updates, a `useEffect` hook triggers and calls `.scrollIntoView()` on that ref, ensuring the newest output is always visible."

**Q: Isn't adding a scroll listener to the window bad for performance? How did you handle that in the Navbar?**
> **A:** "Scroll events fire hundreds of times per second. To optimize this, the `useEffect` returns a cleanup function to remove the listener when the component unmounts to prevent memory leaks. If performance became an issue, I would wrap the event handler in a `throttle` or `debounce` function so it only calculates the scroll position every 50-100ms."

### Node.js & Tooling
**Q: How does the `duck backdate` command fake a commit date without changing the system clock?**
> **A:** "Git looks for specific environment variables when a commit is created. Using Node.js, we spawn a child process to run `git commit` and pass custom `GIT_AUTHOR_DATE` and `GIT_COMMITTER_DATE` variables into that specific process's environment. This fakes the date for Git without affecting the user's actual computer clock."

**Q: We ran into a weird bug where a syntax error in `tailwind.config.js` caused an error in `index.css`. Can you explain why that happened?**
> **A:** "Vite uses PostCSS to compile CSS. When PostCSS sees the `@tailwind` directive in `index.css`, it loads `tailwind.config.js` to figure out what utility classes to generate. Because there was an extra closing bracket in the config file, the internal Javascript parser (`sucrase`) crashed while trying to build the CSS. The error bubbled up and blamed the CSS file because that's what initiated the build process."
