"use client";

import Link from "next/link";
import { useState } from "react";

type NavItem = { label: string; href: string };
type NavGroup = { item: NavItem; children: NavItem[] };

export default function MobileNav({ navGroups }: { navGroups: NavGroup[] }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className="ms-burger"
        aria-label="Menu"
        onClick={() => setOpen(true)}
        style={{ marginLeft: "auto" }}
      >
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      {open && (
        <div
          className="ms-mobile-nav"
          style={{ display: "block" }}
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
        >
          <div className="ms-mobile-nav-panel">
            <button className="ms-mobile-close" onClick={() => setOpen(false)}>
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            <div className="ms-mobile-links">
              {navGroups.map((g) => (
                <span key={g.item.href}>
                  <Link
                    href={g.item.href}
                    className="ms-mobile-link"
                    onClick={() => setOpen(false)}
                  >
                    {g.item.label}
                  </Link>
                  {g.children.map((c) => (
                    <Link
                      key={c.href}
                      href={c.href}
                      className="ms-mobile-link-sub"
                      onClick={() => setOpen(false)}
                    >
                      {c.label}
                    </Link>
                  ))}
                </span>
              ))}
              <Link href="/contact" className="ms-mobile-cta" onClick={() => setOpen(false)}>
                Nous contacter
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
