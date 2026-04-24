"use client";

import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Link } from "@/design-system/atoms/Link";
import { Button } from "@/design-system/atoms/Button";
import { IconButton } from "@/design-system/atoms/IconButton";

const links = [
  { label: "Home", href: "/" },
  { label: "Jobs", href: "/jobs" },
  { label: "Employers", href: "/for-employers" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Help", href: "/help" },
];

export interface MobileNavDrawerProps {
  open: boolean;
  onClose: () => void;
  user?: { email?: string } | null;
  dashboardHref?: string | null;
}

export const MobileNavDrawer: React.FC<MobileNavDrawerProps> = ({
  open,
  onClose,
  user,
  dashboardHref,
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const firstFocusableRef = useRef<HTMLButtonElement>(null);
  const lastFocusableRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      firstFocusableRef.current?.focus();
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (!open) return;

      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === "Tab") {
        const focusables = dialogRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button, [tabindex]:not([tabindex="-1"])',
        );
        if (!focusables || focusables.length === 0) return;

        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[300] md:hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Navigation menu"
      id="mobile-nav-drawer"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <div
        ref={dialogRef}
        className={cn(
          "absolute right-0 top-0 h-full w-72 max-w-[85vw]",
          "bg-card border-l border-border",
          "flex flex-col p-6 gap-6",
          "shadow-lg",
        )}
      >
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold uppercase tracking-wider text-fg">
            Menu
          </span>
          <IconButton
            ref={firstFocusableRef}
            icon="X"
            size="sm"
            variant="ghost"
            onClick={onClose}
            aria-label="Close menu"
          />
        </div>

        <nav className="flex flex-col gap-1">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="py-2 px-3 rounded-lg hover:bg-surface text-base"
              onClick={onClose}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="mt-auto flex flex-col gap-3 pt-6 border-t border-border">
          {user ? (
            <Button asChild size="md">
              <a
                ref={lastFocusableRef}
                href={dashboardHref ?? "/seeker"}
                onClick={onClose}
              >
                Dashboard
              </a>
            </Button>
          ) : (
            <>
              <Button asChild size="md" variant="secondary">
                <a
                  ref={lastFocusableRef}
                  href="/auth?mode=signin"
                  onClick={onClose}
                >
                  Sign in
                </a>
              </Button>
              <Button asChild size="md">
                <a href="/auth?mode=signup">Get Started</a>
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

MobileNavDrawer.displayName = "MobileNavDrawer";
