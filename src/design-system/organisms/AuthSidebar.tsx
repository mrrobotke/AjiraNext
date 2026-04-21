import React from "react";
import { Logo } from "@/design-system/atoms/Logo";

const features = [
  "Precision matching on every application",
  "Free Resume Health Check (ATS score + rewrite)",
  "AI-powered Interview Prep and Cover Letters",
  "Transparent salaries on every listing",
];

export const AuthSidebar: React.FC = () => (
  <aside className="hidden lg:flex bg-fg text-bg flex-col justify-between p-12 xl:p-16">
    <div>
      <Logo className="text-bg mb-8" />
      <h2 className="text-6xl font-black tracking-tight leading-squeeze mb-5">
        Your next role,{" "}
        <em className="not-italic text-primary">measured in days.</em>
      </h2>

      <ul className="flex flex-col gap-3.5">
        {features.map((f) => (
          <li
            key={f}
            className="flex gap-3 items-start text-sm leading-relaxed opacity-90"
          >
            <span className="text-primary font-black mt-0.5">✓</span>
            {f}
          </li>
        ))}
      </ul>

      {/* Testimonial */}
      <div className="bg-white/[0.06] rounded-2xl p-6 mt-8">
        <p className="text-sm leading-relaxed opacity-90">
          &quot;I got 4 interviews in my first week. Ajira Next is the only
          board where the matches actually match.&quot;
        </p>
        <div className="flex items-center gap-2.5 mt-3.5">
          <div className="w-9 h-9 rounded-full bg-white/[0.15] text-white flex items-center justify-center font-black text-xs">
            AO
          </div>
          <div className="text-xs">
            <b className="block">Amina Okafor</b>
            <span className="opacity-70 text-2xs">
              Product Strategist · Paystack
            </span>
          </div>
        </div>
      </div>
    </div>

    <div className="text-2xs opacity-60 mt-8">© 2026 Ajira Next · Nairobi</div>
  </aside>
);

AuthSidebar.displayName = "AuthSidebar";
