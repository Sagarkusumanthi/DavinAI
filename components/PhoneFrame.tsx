"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export const APP_SCREEN_ID = "app-screen";

/** The element dialogs/sheets portal into, so they open inside the phone screen. */
export function getAppScreen() {
  return typeof document === "undefined" ? undefined : document.getElementById(APP_SCREEN_ID) ?? undefined;
}

function StatusBar() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit", hour12: false }));
    tick();
    const id = setInterval(tick, 10_000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="phone-status-bar" aria-hidden>
      <span className="w-14 text-center text-[15px] font-semibold tabular-nums">{time}</span>
      <span className="phone-island" />
      <span className="flex w-14 items-center justify-center gap-1">
        <svg width="17" height="11" viewBox="0 0 17 11" fill="currentColor">
          <rect x="0" y="7" width="3" height="4" rx="1" />
          <rect x="4.5" y="5" width="3" height="6" rx="1" />
          <rect x="9" y="2.5" width="3" height="8.5" rx="1" />
          <rect x="13.5" y="0" width="3" height="11" rx="1" />
        </svg>
        <svg width="15" height="11" viewBox="0 0 15 11" fill="currentColor">
          <path d="M7.5 2.2c2 0 3.8.8 5.2 2l1.1-1.2A9.2 9.2 0 0 0 7.5.5 9.2 9.2 0 0 0 1.2 3l1.1 1.2a7.6 7.6 0 0 1 5.2-2Zm0 3.3c1.1 0 2.1.4 2.9 1.1l1.1-1.2a5.9 5.9 0 0 0-8 0l1.1 1.2c.8-.7 1.8-1.1 2.9-1.1Zm0 3.3c-.4 0-.8.2-1.1.4L7.5 10.5l1.1-1.3c-.3-.2-.7-.4-1.1-.4Z" />
        </svg>
        <span className="relative flex h-[11px] w-[22px] items-center rounded-[3px] border border-current p-[1px] opacity-90">
          <span className="h-full w-[75%] rounded-[1px] bg-current" />
          <span className="absolute -right-[3px] top-[3px] h-[3px] w-[1.5px] rounded-r bg-current" />
        </span>
      </span>
    </div>
  );
}

/**
 * Desktop/tablet: shows the app inside a phone mockup (bezel, island, status bar).
 * Real phones: the frame styles are disabled and the app fills the screen.
 */
export function PhoneFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  useEffect(() => {
    document.getElementById("app-scroll")?.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="phone-stage">
      <div className="phone-device">
        <div className="phone-screen">
          <StatusBar />
          <div id={APP_SCREEN_ID} className="phone-viewport">
            <div id="app-scroll" className="phone-scroll">
              {children}
            </div>
          </div>
          <div className="phone-home-bar" aria-hidden>
            <span className="phone-home-indicator" />
          </div>
        </div>
      </div>
    </div>
  );
}
