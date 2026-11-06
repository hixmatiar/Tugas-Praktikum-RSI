import type { ReactNode } from 'react';
import { MessageSquareText, Star, Store, UtensilsCrossed } from 'lucide-react';

const features = [
  {
    icon: Store,
    title: 'Temukan warung',
    description: 'Lihat menu, lokasi, dan suasana tiap warung dalam satu tempat.',
    tile: 'col-span-2 bg-sky',
  },
  {
    icon: Star,
    title: 'Pilih dari review',
    description: 'Bandingkan penilaian nyata sebelum memutuskan makan di mana.',
    tile: 'bg-accent-soft',
  },
  {
    icon: MessageSquareText,
    title: 'Kelola kontribusimu',
    description: 'Ubah review sendiri dan ikut menjaga kualitas informasi kantin.',
    tile: 'bg-accent-soft',
  },
];

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto grid max-w-5xl gap-3 sm:gap-4 lg:grid-cols-[1.05fr_0.95fr]">
      {/* Tile merek ringkas untuk layar kecil */}
      <div className="flex items-center gap-3 rounded-card bg-primary p-4 text-white shadow-card lg:hidden">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-control bg-white/15">
          <UtensilsCrossed className="size-5" aria-hidden="true" />
        </span>
        <span>
          <span className="block font-heading text-base font-extrabold leading-none">
            Dahar Lurr
          </span>
          <span className="mt-1 block text-xs text-white/70">Makan enak, pilih lebih yakin.</span>
        </span>
      </div>

      {/* Kolom tile informasi (desktop) */}
      <aside className="hidden grid-cols-2 gap-4 lg:grid lg:grid-rows-[1fr_auto_auto]">
        <div className="relative isolate col-span-2 flex flex-col justify-between overflow-hidden rounded-card bg-primary p-8 text-white shadow-card">
          <div
            className="pointer-events-none absolute -right-16 -top-20 size-64 rounded-full bg-accent/40 blur-3xl"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -bottom-20 -left-12 size-56 rounded-full bg-sky/10 blur-3xl"
            aria-hidden="true"
          />

          <div className="relative z-10 flex items-center gap-2.5">
            <span className="flex size-10 items-center justify-center rounded-control bg-white/15">
              <UtensilsCrossed className="size-5" aria-hidden="true" />
            </span>
            <span>
              <span className="block font-heading text-lg font-extrabold leading-none">
                Dahar Lurr
              </span>
              <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.16em] text-white/70">
                Hixmatiar Web Review
              </span>
            </span>
          </div>

          <div className="relative z-10 mt-14">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-sky">
              Kantin kampus, tanpa ribet
            </p>
            <h2 className="mt-3 max-w-sm font-heading text-3xl font-extrabold leading-tight">
              Makan enak, pilih lebih yakin.
            </h2>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/75">
              Dahar Lurr menghubungkan pelanggan, pemilik warung, dan admin dalam satu
              ruang yang sederhana.
            </p>
          </div>
        </div>

        {features.map(({ icon: Icon, title, description, tile }) => (
          <div
            key={title}
            className={`rounded-card border border-border p-5 shadow-card ${tile}`}
          >
            <span className="flex size-9 items-center justify-center rounded-full bg-primary text-white">
              <Icon className="size-4" aria-hidden="true" />
            </span>
            <strong className="mt-3 block text-sm font-bold text-primary-dark">{title}</strong>
            <span className="mt-1 block text-xs leading-relaxed text-text-muted">
              {description}
            </span>
          </div>
        ))}
      </aside>

      <section className="tile p-5 sm:p-8 lg:p-10">{children}</section>
    </div>
  );
}