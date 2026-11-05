// ==UserScript==
// @name        Dark Horse phone layout
// @match       https://darkhorseacademy.teachable.com/courses/*/lectures/*
// @grant       none
// @run-at      document-idle
// ==/UserScript==

(function () {
  // CONSTANTS
  const FONT_URL = 'https://fonts.googleapis.com/css2?family=Barlow+Semi+Condensed:wght@700&display=swap';
  const STORAGE_PREFIX = 'dhr:done:';

  const CSS = `
html.dhr {
  --dhr-accent: #ff6b1a;
  --dhr-accent-ink: #1a1d3a;
  --dhr-bar: #11152e;
  --dhr-bar-ink: #ffffff;
  --dhr-bg: #ffffff;
  --dhr-border: #e3e4ea;
  --dhr-control: #7a7f95;
  --dhr-danger: #c62828;
  --dhr-display: 'Barlow Semi Condensed', Metropolis, sans-serif;
  --dhr-done: #1f7a4d;
  --dhr-focus: #1d5fd6;
  --dhr-ink: #1a1d3a;
  --dhr-mark: #d9530a;
  --dhr-muted: #5b5f73;
  --dhr-on-status: #ffffff;
  --dhr-row: #f5f6f9;
}

html.dhr,
html.dhr body {
  background: var(--dhr-bg) !important;
  overflow: visible !important;
}
html.dhr body {
  padding-bottom: calc(76px + env(safe-area-inset-bottom)) !important;
}

/* Teachable's own header, lesson sidebar and completion marks */
html.dhr body > header,
html.dhr #courseSidebar,
html.dhr #lecture_heading,
html.dhr #lecture_content_complete_button {
  display: none !important;
}

/* One page scroll instead of a scrolling box inside the page */
html.dhr section.lecture-page-layout {
  height: auto !important;
  inset: auto !important;
  margin: 0 !important;
  overflow: visible !important;
  padding: 0 !important;
  position: static !important;
}
html.dhr .course-mainbar {
  float: none !important;
  margin: 0 auto !important;
  max-width: 720px !important;
  padding: 0 16px !important;
  width: auto !important;
}
html.dhr section.lecture-page-layout,
html.dhr .course-mainbar,
html.dhr .course-mainbar * {
  background-color: transparent !important;
}
html.dhr .course-mainbar,
html.dhr .course-mainbar * {
  color: var(--dhr-ink) !important;
}
html.dhr .course-mainbar .lecture-text-container,
html.dhr .course-mainbar p,
html.dhr .course-mainbar li {
  font-size: 17px !important;
  line-height: 1.55 !important;
}
html.dhr .course-mainbar li {
  margin: 0 0 6px !important;
}
html.dhr .course-mainbar h1,
html.dhr .course-mainbar h2 {
  font-family: var(--dhr-display) !important;
  font-size: 23px !important;
  font-weight: 700 !important;
  letter-spacing: 0.01em !important;
  line-height: 1.2 !important;
  margin: 28px 0 8px !important;
}
html.dhr .course-mainbar h3,
html.dhr .course-mainbar h4 {
  font-size: 18px !important;
  font-weight: 700 !important;
  line-height: 1.3 !important;
  margin: 20px 0 6px !important;
}
html.dhr .lecture-attachment {
  margin: 0 !important;
  padding: 0 !important;
}

/* Videos run edge to edge at 16:9 */
html.dhr .lecture-attachment-type-video {
  margin: 12px -16px 20px !important;
}
html.dhr .hotmart_video_player {
  height: auto !important;
  padding: 0 !important;
  position: relative !important;
}
html.dhr .hotmart_video_player iframe {
  aspect-ratio: 16 / 9;
  display: block !important;
  height: auto !important;
  position: static !important;
  width: 100% !important;
}

/* Top bar */
.dhr-top {
  align-items: center;
  background: var(--dhr-bar);
  color: var(--dhr-bar-ink);
  display: flex;
  font-size: 15px;
  gap: 8px;
  height: 52px;
  padding: 0 8px;
  position: sticky;
  top: 0;
  z-index: 50;
}
.dhr-top a,
.dhr-top button {
  align-items: center;
  background: none;
  border: 0;
  border-radius: 8px;
  color: var(--dhr-bar-ink) !important;
  display: flex;
  font: inherit;
  font-weight: 600;
  gap: 6px;
  min-height: 44px;
  padding: 0 10px;
  text-decoration: none !important;
}
.dhr-top .dhr-position {
  flex: 1;
  font-variant-numeric: tabular-nums;
  opacity: 0.85;
  text-align: center;
}
/* Buttons on the dark bars get an outline so they read as buttons rather
   than as links like Course. */
.dhr-top button,
.dhr-close {
  border: 1.5px solid rgb(255 255 255 / 55%);
  border-radius: 999px;
  margin-right: 4px;
  min-height: 36px;
  padding: 0 14px;
  position: relative;
}
/* The outline is drawn at 36px so the bar stays light, but the button still
   answers taps across a 44px band. */
.dhr-top button::after,
.dhr-close::after {
  content: '';
  inset: -5px -4px;
  position: absolute;
}

/* Chevrons are drawn, not typed, so screen readers just say "Back" */
.dhr-back::before,
.dhr-fwd::after {
  border: solid currentColor;
  border-width: 0 0 2.5px 2.5px;
  content: '';
  flex: none;
  height: 8px;
  transform: rotate(45deg);
  width: 8px;
}
.dhr-fwd::after {
  transform: rotate(-135deg);
}

/* Lesson title block */
.dhr-head {
  margin: 0 auto;
  max-width: 720px;
  padding: 20px 16px 0;
}
.dhr-course {
  color: var(--dhr-muted);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.08em;
  margin: 0 0 6px;
  text-transform: uppercase;
}
.dhr-title {
  color: var(--dhr-ink);
  font-family: var(--dhr-display);
  font-size: 34px;
  font-weight: 700;
  letter-spacing: 0.01em;
  line-height: 1.05;
  margin: 0;
  overflow-wrap: anywhere;
}
.dhr-meta {
  align-items: center;
  border-bottom: 1px solid var(--dhr-border);
  display: flex;
  gap: 12px;
  justify-content: space-between;
  margin-top: 14px;
  padding-bottom: 16px;
}
.dhr-length {
  align-items: center;
  color: var(--dhr-muted);
  display: flex;
  font-size: 15px;
  font-variant-numeric: tabular-nums;
  font-weight: 600;
  gap: 6px;
}
/* A bare 18:57 could be a time of day; the clock says it's a length. */
.dhr-length::before {
  background: currentColor;
  content: '';
  height: 16px;
  mask: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2.4' stroke-linecap='round' stroke-linejoin='round'><circle cx='12' cy='12' r='9'/><path d='M12 7v5l3 2'/></svg>") center / contain no-repeat;
  width: 16px;
}
.dhr-toggle {
  align-items: center;
  background: var(--dhr-bg);
  border: 2px solid var(--dhr-control);
  border-radius: 999px;
  color: var(--dhr-ink);
  display: flex;
  font: inherit;
  font-size: 15px;
  font-weight: 600;
  gap: 8px;
  min-height: 44px;
  padding: 0 16px;
}
.dhr-toggle[aria-pressed='true'] {
  background: var(--dhr-done);
  border-color: var(--dhr-done);
  color: var(--dhr-on-status);
}

/* Bottom bar */
.dhr-bottom {
  background: var(--dhr-bg);
  border-top: 1px solid var(--dhr-border);
  bottom: 0;
  display: flex;
  gap: 10px;
  left: 0;
  padding: 10px 12px calc(10px + env(safe-area-inset-bottom));
  position: fixed;
  right: 0;
  z-index: 50;
}
.dhr-bottom a {
  align-items: center;
  border-radius: 12px;
  display: flex;
  font-size: 16px;
  font-weight: 700;
  gap: 8px;
  justify-content: center;
  min-height: 52px;
  text-decoration: none !important;
}
.dhr-prev {
  border: 2px solid var(--dhr-control);
  color: var(--dhr-ink) !important;
  flex: 0 0 96px;
}
.dhr-next {
  background: var(--dhr-accent);
  color: var(--dhr-accent-ink) !important;
  flex: 1;
}
.dhr-bottom a[aria-disabled='true'] {
  opacity: 0.4;
  pointer-events: none;
}

/* Lesson list */
.dhr-lessons {
  background: var(--dhr-bg);
  border: 0;
  color: var(--dhr-ink);
  height: 100dvh;
  margin: 0;
  max-height: none;
  max-width: none;
  padding: 0;
  width: 100%;
}
.dhr-lessons::backdrop {
  background: rgb(0 0 0 / 50%);
}
@media (min-width: 600px) {
  .dhr-lessons {
    margin-left: auto;
    width: 420px;
  }
}
.dhr-lessons-head {
  background: var(--dhr-bar);
  color: var(--dhr-bar-ink);
  padding: 8px 8px 16px 16px;
  position: sticky;
  top: 0;
  z-index: 1;
}
.dhr-lessons-head-row {
  align-items: center;
  display: flex;
  justify-content: space-between;
}
.dhr-lessons-head h2 {
  color: var(--dhr-bar-ink);
  font-family: var(--dhr-display);
  font-size: 24px;
  font-weight: 700;
  letter-spacing: 0.01em;
  margin: 0;
}
.dhr-close {
  background: none;
  color: var(--dhr-bar-ink);
  font: inherit;
  font-weight: 600;
}
.dhr-progress-text {
  font-size: 15px;
  margin: 4px 0 8px;
  opacity: 0.85;
}
.dhr-progress {
  background: rgb(255 255 255 / 20%);
  border-radius: 999px;
  height: 8px;
  margin-right: 8px;
  overflow: hidden;
}
.dhr-progress span {
  background: var(--dhr-accent);
  display: block;
  height: 100%;
}
.dhr-section {
  color: var(--dhr-muted);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.08em;
  margin: 0;
  padding: 20px 16px 8px;
  text-transform: uppercase;
}
.dhr-list {
  list-style: none;
  margin: 0;
  padding: 0;
}
.dhr-list a {
  align-items: center;
  border-bottom: 1px solid var(--dhr-border);
  color: var(--dhr-ink) !important;
  display: flex;
  font-size: 16px;
  gap: 12px;
  min-height: 52px;
  padding: 8px 16px;
  text-decoration: none !important;
}
.dhr-list a[aria-current='page'] {
  background: var(--dhr-row);
  box-shadow: inset 4px 0 var(--dhr-mark);
  font-weight: 700;
}
.dhr-check {
  align-items: center;
  border: 2px solid var(--dhr-control);
  border-radius: 50%;
  display: flex;
  flex: none;
  height: 24px;
  justify-content: center;
  width: 24px;
}
.dhr-check.is-done {
  background: var(--dhr-done);
  border-color: var(--dhr-done);
}
.dhr-check.is-done::after {
  border: solid var(--dhr-bg);
  border-width: 0 2.5px 2.5px 0;
  content: '';
  height: 10px;
  margin-top: -3px;
  transform: rotate(45deg);
  width: 5px;
}
.dhr-name {
  flex: 1;
}
/* Finished lessons step back so the eye lands on what's left to do */
.dhr-list a:not([aria-current]):has(.is-done) .dhr-name {
  color: var(--dhr-muted);
}
.dhr-dur {
  color: var(--dhr-muted);
  font-size: 14px;
  font-variant-numeric: tabular-nums;
}
.dhr-reset {
  background: none;
  border: 2px solid var(--dhr-control);
  border-radius: 10px;
  color: var(--dhr-ink);
  display: block;
  font: inherit;
  font-weight: 600;
  margin: 24px 16px 32px;
  min-height: 48px;
  padding: 0 16px;
  width: calc(100% - 32px);
}
.dhr-reset.is-armed {
  background: var(--dhr-danger);
  border-color: var(--dhr-danger);
  color: var(--dhr-on-status);
}

/* One focus ring for everything we draw, thick enough to see at a glance.
   On the dark bars it goes white so it stands out from the navy. */
.dhr :focus-visible {
  outline: 3px solid var(--dhr-focus) !important;
  outline-offset: 2px;
}
.dhr-top :focus-visible,
.dhr-lessons-head :focus-visible {
  outline-color: var(--dhr-bar-ink) !important;
}
.dhr-list a:focus-visible {
  outline-offset: -3px;
}
/* Phone on its side: about 300px of height to work with, so the bars stop
   following the page and the video gets the whole height. */
@media (orientation: landscape) and (max-height: 500px) {
  html.dhr body {
    padding-bottom: 0 !important;
  }
  .dhr-top {
    height: 44px;
    position: static;
  }
  .dhr-head {
    padding-top: 10px;
  }
  .dhr-title {
    font-size: 26px;
  }
  .dhr-meta {
    margin-top: 6px;
  }
  html.dhr .lecture-attachment-type-video {
    margin: 8px 0 16px !important;
  }
  html.dhr .hotmart_video_player iframe {
    margin: 0 auto !important;
    width: min(100%, calc((100svh - 16px) * 16 / 9)) !important;
  }
  .dhr-bottom {
    border-top: 0;
    margin: 8px auto 0;
    max-width: 720px;
    position: static;
  }
  .dhr-lessons-head {
    position: static;
  }
}
.dhr .visually-hidden {
  clip-path: inset(50%);
  height: 1px;
  overflow: hidden;
  position: absolute;
  white-space: nowrap;
  width: 1px;
}
`;

  // READING THE PAGE

  function getCourseKey() {
    return location.pathname.split('/')[2];
  }

  function getLectureId() {
    return location.pathname.split('/').pop();
  }

  // Teachable puts the length in the lesson name, like "CATCH (18:57)", so we
  // split it back out to show it on its own.
  function splitName(text) {
    const match = text.trim().match(/^(.*?)\s*\((\d+:\d+(?::\d+)?)\)$/);
    if (match) {
      return { duration: match[2], name: match[1] };
    } else {
      return { duration: '', name: text.trim() };
    }
  }

  // The lesson names mix shouting caps ("RELEASE & RECOVERY") with title case
  // ("Drag Factor Overview"), so the list puts them all in sentence case.
  // This happens in the text rather than in CSS so screen readers don't
  // spell out the all-caps names letter by letter. The course's own name and
  // the school's name are proper nouns and keep their capitals.
  function toSentenceCase(text) {
    const properNouns = [
      document.querySelector('#courseSidebar h2')?.innerText.trim(),
      'Dark Horse',
    ].filter(Boolean);
    let out = text.toLowerCase().replace(/^(\P{L}*)(\p{L})/u, (_, lead, first) => (
      lead + first.toUpperCase()
    ));
    for (const noun of properNouns) {
      const at = out.toLowerCase().indexOf(noun.toLowerCase());
      if (at !== -1) {
        out = out.slice(0, at) + noun + out.slice(at + noun.length);
      }
    }
    return out;
  }

  function getLessons() {
    const lessons = [];
    for (const section of document.querySelectorAll(
      '#courseSidebar .course-section',
    )) {
      const sectionTitle = section
        .querySelector('.section-title')
        ?.innerText.trim() ?? '';
      for (const item of section.querySelectorAll('li.section-item')) {
        const { duration, name } = splitName(
          item.querySelector('.lecture-name')?.innerText ?? '',
        );
        lessons.push({
          duration,
          id: item.dataset.lectureId,
          name,
          section: sectionTitle,
          url: item.dataset.lectureUrl,
        });
      }
    }
    return lessons;
  }

  // OUR OWN COMPLETION RECORD

  function readDone() {
    try {
      const parsed = JSON.parse(
        localStorage.getItem(STORAGE_PREFIX + getCourseKey()) ?? '[]',
      );
      if (
        Array.isArray(parsed)
        && parsed.every((id) => typeof id === 'string')
      ) {
        return new Set(parsed);
      } else {
        return new Set();
      }
    } catch {
      return new Set();
    }
  }

  function writeDone(done) {
    try {
      localStorage.setItem(
        STORAGE_PREFIX + getCourseKey(),
        JSON.stringify([...done]),
      );
    } catch {
      // Storage can be blocked; the page still works, it just forgets.
    }
  }

  // BUILDING THE PAGE

  function el(tag, props = {}, children = []) {
    const node = document.createElement(tag);
    for (const [key, value] of Object.entries(props)) {
      if (key === 'text') {
        node.textContent = value;
      } else if (key.startsWith('aria-') || key.startsWith('data-')) {
        node.setAttribute(key, value);
      } else {
        node[key] = value;
      }
    }
    node.append(...children);
    return node;
  }

  // The list is drawn fresh each time it opens, so a lesson marked done a
  // moment ago shows up without a reload.
  function fillLessonList(dialog, lessons, done, currentId) {
    dialog.replaceChildren();
    const count = lessons.filter((lesson) => done.has(lesson.id)).length;
    const percent = lessons.length ? (count / lessons.length) * 100 : 0;

    const head = el('div', { className: 'dhr-lessons-head' }, [
      el('div', { className: 'dhr-lessons-head-row' }, [
        el('h2', {
          id: 'dhr-lessons-title',
          text: document.querySelector('#courseSidebar h2')?.innerText.trim()
            ?? 'Lessons',
        }),
        el('button', {
          className: 'dhr-close',
          onclick: () => dialog.close(),
          text: 'Close',
          type: 'button',
        }),
      ]),
      el('p', {
        className: 'dhr-progress-text',
        text: `${count} of ${lessons.length} done`,
      }),
      el('div', { 'aria-hidden': 'true', className: 'dhr-progress' }, [
        el('span', { style: `width: ${percent}%` }),
      ]),
    ]);
    dialog.append(head);

    let list;
    let lastSection;
    for (const lesson of lessons) {
      if (lesson.section !== lastSection) {
        lastSection = lesson.section;
        dialog.append(el('h3', { className: 'dhr-section', text: lesson.section }));
        list = el('ul', { className: 'dhr-list' });
        dialog.append(list);
      }
      const isDone = done.has(lesson.id);
      const link = el('a', { href: lesson.url }, [
        el('span', {
          className: isDone ? 'dhr-check is-done' : 'dhr-check',
        }),
        el('span', { className: 'dhr-name', text: toSentenceCase(lesson.name) }),
        el('span', { className: 'dhr-dur', text: lesson.duration }),
        el('span', {
          className: 'visually-hidden',
          text: isDone ? ', done' : '',
        }),
      ]);
      if (lesson.id === currentId) {
        link.setAttribute('aria-current', 'page');
      }
      list.append(el('li', {}, [link]));
    }

    // No confirm() here: a second tap within a few seconds does the reset.
    const reset = el('button', {
      className: 'dhr-reset',
      text: 'Reset my progress',
      type: 'button',
    });
    let armedTimer;
    reset.addEventListener('click', () => {
      if (reset.classList.contains('is-armed')) {
        writeDone(new Set());
        location.reload();
      } else {
        reset.classList.add('is-armed');
        reset.textContent = 'Tap again to clear all checks';
        armedTimer = setTimeout(() => {
          reset.classList.remove('is-armed');
          reset.textContent = 'Reset my progress';
        }, 4000);
      }
    });
    dialog.addEventListener('close', () => clearTimeout(armedTimer), {
      once: true,
    });
    dialog.append(reset);
  }

  function main() {
    const lessons = getLessons();
    const currentId = getLectureId();
    const index = lessons.findIndex((lesson) => lesson.id === currentId);
    if (index === -1) {
      return;
    }

    const lesson = lessons[index];
    const prev = lessons[index - 1];
    const next = lessons[index + 1];
    const done = readDone();

    document.documentElement.classList.add('dhr');
    // If Google Fonts can't be reached the titles fall back to Teachable's
    // Metropolis, which is already on the page.
    document.head.append(
      el('link', { href: FONT_URL, rel: 'stylesheet' }),
      el('style', { text: CSS }),
    );

    const dialog = el('dialog', {
      'aria-labelledby': 'dhr-lessons-title',
      className: 'dhr-lessons',
    });

    const top = el('nav', { 'aria-label': 'Lesson', className: 'dhr-top' }, [
      el('a', {
        className: 'dhr-back',
        href: document.querySelector('.nav-icon-back')?.getAttribute('href')
          ?? '/',
        text: 'Course',
      }),
      el('span', {
        className: 'dhr-position',
        text: `Lesson ${index + 1} of ${lessons.length}`,
      }),
      el('button', {
        'aria-haspopup': 'dialog',
        onclick: () => {
          fillLessonList(dialog, lessons, done, currentId);
          dialog.showModal();
        },
        text: 'Lessons',
        type: 'button',
      }),
    ]);

    const toggle = el('button', {
      'aria-pressed': String(done.has(currentId)),
      className: 'dhr-toggle',
      type: 'button',
    });
    function drawToggle() {
      const isDone = done.has(currentId);
      toggle.setAttribute('aria-pressed', String(isDone));
      toggle.textContent = isDone ? '✓ Done' : 'Mark done';
    }
    toggle.addEventListener('click', () => {
      if (done.has(currentId)) {
        done.delete(currentId);
      } else {
        done.add(currentId);
      }
      writeDone(done);
      drawToggle();
    });
    drawToggle();

    const head = el('div', { className: 'dhr-head' }, [
      el('p', { className: 'dhr-course', text: lesson.section }),
      el('h1', { className: 'dhr-title', text: lesson.name }),
      el('div', { className: 'dhr-meta' }, [
        el('span', { className: 'dhr-length', text: lesson.duration }),
        toggle,
      ]),
    ]);

    const nextLink = el('a', {
      className: next ? 'dhr-next dhr-fwd' : 'dhr-next',
      href: next?.url ?? '#',
      text: next ? 'Done, next' : 'Done',
    });
    nextLink.addEventListener('click', () => {
      done.add(currentId);
      writeDone(done);
    });
    const prevLink = el('a', {
      className: 'dhr-prev dhr-back',
      href: prev?.url ?? '#',
      text: 'Back',
    });
    if (!prev) {
      prevLink.setAttribute('aria-disabled', 'true');
    }
    const bottom = el('nav', { 'aria-label': 'Next and previous', className: 'dhr-bottom' }, [
      prevLink,
      nextLink,
    ]);

    // Teachable indents anything inside its own layout box, so the title goes
    // in front of that box rather than inside it.
    document.querySelector('section.lecture-page-layout').before(head);
    document.body.prepend(top);
    document.body.append(bottom, dialog);
  }

  main();
})();
