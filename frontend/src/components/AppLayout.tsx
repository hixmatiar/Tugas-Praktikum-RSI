import { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  LogOut,
  MessageSquareText,
  ShieldCheck,
  Store,
  UserRound,
  UtensilsCrossed,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { buttonClass } from '../lib/buttonClass.ts';
import { formatRole, initials } from '../lib/format.ts';
import type { UserRole } from '../types/api.ts';
import { Spinner } from './ui.tsx';

function navClass({ isActive }: { isActive: boolean }): string {
  return `inline-flex h-9 shrink-0 items-center gap-3 rounded-xl px-3.5 text-sm font-semibold transition ${
    isActive
      ? 'bg-primary text-white shadow-sm'
      : 'text-text-muted hover:bg-accent-soft hover:text-primary-dark'
  }`;
}

function PrimaryNav({
  role,
  className,
  label = 'Navigasi utama',
}: {
  role?: UserRole;
  className: string;
  label?: string;
}) {
  return (
    <nav className={className} aria-label={label}>
      <NavLink to="/" end className={navClass}>
        <Store className="size-4" aria-hidden="true" />
        Warung
      </NavLink>

      {role === 'customer' ? (
        <NavLink to="/reviews" className={navClass}>
          <MessageSquareText className="size-4" aria-hidden="true" />
          Review Saya
        </NavLink>
      ) : null}

      {role === 'owner' ? (
        <NavLink to="/owner" className={navClass}>
          <LayoutDashboard className="size-4" aria-hidden="true" />
          Dashboard Warung
        </NavLink>
      ) : null}

      {role === 'admin' ? (
        <NavLink to="/admin" className={navClass}>
          <ShieldCheck className="size-4" aria-hidden="true" />
          Panel Admin
        </NavLink>
      ) : null}
    </nav>
  );
}

export function AppLayout() {
  const { user, isReady, logout } = useAuth();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout(): Promise<void> {
    setIsLoggingOut(true);
    try {
      await logout();
      navigate('/');
    } finally {
      setIsLoggingOut(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-page text-text">
      <header className="sticky top-0 z-40 px-3 pt-3 sm:px-6 lg:px-8">
        <div className="tile mx-auto w-full max-w-7xl bg-surface/90 px-3 backdrop-blur sm:px-4">
          <div className="flex min-h-16 items-center gap-8 py-2">
            <Link to="/" className="mr-1 flex shrink-0 items-center gap-4">
              <img src="/ghazy.svg" alt="Logo Dahar Lurr" className='size-10'/>
              {/* <span className="flex size-10 items-center justify-center rounded-control bg-primary text-white shadow-sm">
                <UtensilsCrossed className="size-5" aria-hidden="true" />
              </span> */}
              <span>
                <span className="block font-heading text-base font-extrabold leading-none text-primary-dark">
                  Dahar Lurr
                </span>
                <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.14em] text-text-muted">
                  Review Kantin
                </span>
              </span>
            </Link>

            <PrimaryNav
              role={user?.role}
              className="hidden flex-1 items-center gap-1 md:flex"
            />

            <div className="ml-auto flex shrink-0 items-center gap-3">
              {!isReady ? (
                <span
                  className="block h-9 w-24 animate-pulse rounded-full bg-surface-muted"
                  role="status"
                  aria-label="Memeriksa sesi login"
                />
              ) : user ? (
                <>
                  <Link
                    to="/profile"
                    className="flex items-center gap-4 rounded-full py-1 pl-1 pr-1 transition hover:bg-accent-soft sm:pr-3"
                  >
                    <span className="flex size-8 items-center justify-center rounded-full bg-accent-soft text-xs font-bold text-primary-dark">
                      {initials(user.name)}
                    </span>
                    <span className="hidden sm:block">
                      <span className="block max-w-36 truncate text-xs font-bold leading-tight">
                        {user.name}
                      </span>
                      <span className="block text-[10px] font-semibold text-text-muted">
                        {formatRole(user.role)}
                      </span>
                    </span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => void handleLogout()}
                    disabled={isLoggingOut}
                    className="flex size-9 items-center justify-center rounded-full text-text-muted transition hover:bg-danger-bg hover:text-danger disabled:opacity-50"
                    aria-label="Keluar dari akun"
                    title="Keluar"
                  >
                    {isLoggingOut ? <Spinner /> : <LogOut className="size-4" aria-hidden="true" />}
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className={buttonClass('secondary', 'h-9 rounded-full')}>
                    Masuk
                  </Link>
                  <Link to="/register" className={buttonClass('primary', 'h-9 rounded-full')}>
                    Daftar
                  </Link>
                </>
              )}
            </div>
          </div>

          <PrimaryNav
            role={user?.role}
            className="flex gap-4 overflow-x-auto pb-2 md:hidden"
            label="Navigasi utama seluler"
          />
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1 px-3 py-5 sm:px-6 sm:py-6 lg:px-8">
        <Outlet />
      </main>

      <footer className="px-3 pb-4 sm:px-6 lg:px-8">
        <div className="tile mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-3 text-xs text-text-muted sm:px-5">
          <span className='text-primary'>Dahar Lurr ~ Praktikum RSI 2026</span>
          <span className="inline-flex items-center gap-4 text-primary">
            <UserRound className="size-3.5 text-primary" aria-hidden="true" />
            {user ? `Masuk sebagai ${formatRole(user.role)}` : 'Belum masuk'}
          </span>
        </div>
      </footer>
    </div>
  );
}