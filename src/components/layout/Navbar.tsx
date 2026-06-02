"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ActaDigitalLogo } from "@/components/brand/ActaDigitalLogo";
import { APP_ROUTES } from "@/lib/navigation";

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="navbar" aria-label="Navegación principal">
      <div className="container-main navbar__inner">
        <Link href="/voto" className="border-0 bg-transparent p-0">
          <ActaDigitalLogo />
        </Link>
        <div className="navbar__links" role="tablist">
          {APP_ROUTES.map((route) => (
            <Link
              key={route.id}
              href={route.path}
              role="tab"
              aria-selected={pathname === route.path}
              className={`nav-link ${pathname === route.path ? "nav-link--active" : ""}`}
            >
              {route.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
