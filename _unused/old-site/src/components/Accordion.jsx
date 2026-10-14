import { useState } from 'react';
import './Accordion.css';

function AccordionItem({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={`gmi-accordion-item${open ? ' is-open' : ''}`}>
      <button
        type="button"
        className="gmi-accordion-trigger"
        aria-expanded={open}
        onClick={() => setOpen(o => !o)}
      >
        <span className="gmi-accordion-title">{title}</span>
        <span className="gmi-accordion-indicator" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </span>
      </button>
      {/* Use CSS grid-template-rows trick: 0fr → 1fr — no JS measurement needed, no ref-in-render */}
      <div className="gmi-accordion-panel" aria-hidden={!open}>
        <div className="gmi-accordion-body">{children}</div>
      </div>
    </div>
  );
}

export default function Accordion({ items }) {
  return (
    <div className="gmi-accordion" role="list">
      {items.map((item, i) => (
        <AccordionItem key={i} title={item.title} defaultOpen={item.defaultOpen}>
          {item.content}
        </AccordionItem>
      ))}
    </div>
  );
}
