import { useCallback, useEffect, useState } from 'react';
import {
  ArrowDown,
  MessageSquare,
  RefreshCw,
  Search,
  Star,
  Store,
  UtensilsCrossed,
} from 'lucide-react';
import { StallCard } from '../components/StallCard.tsx';
import {
  Alert,
  Button,
  EmptyState,
  LoadingPanel,
  PageHeader,
  Spinner,
  inputClass,
} from '../components/ui.tsx';
import { stallsApi } from '../lib/api.ts';
import { buttonClass } from '../lib/buttonClass.ts';
import { getApiErrorMessage } from '../lib/http.ts';
import type { Stall } from '../types/api.ts';

export function HomePage() {
  const [stalls, setStalls] = useState<Stall[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await stallsApi.list({
        search: search.trim() || undefined,
        category: category.trim() || undefined,
      });
      setStalls(result);
    } catch (loadError) {
      setError(getApiErrorMessage(loadError));
    } finally {
      setIsLoading(false);
    }
  }, [category, search]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void load();
    }, 250);

    return () => window.clearTimeout(timer);
  }, [load]);

  const average =
    stalls.length === 0
      ? 0
      : stalls.reduce((total, stall) => total + stall.avgRating, 0) / stalls.length;
  const totalReviews = stalls.reduce((total, stall) => total + stall.reviewCount, 0);
  const hasLoadError = !isLoading && error !== null && stalls.length === 0;
  const hasFilter = search.trim() !== '' || category.trim() !== '';

  function resetFilters(): void {
    setSearch('');
    setCategory('');
  }

  return (
    <div>
      <section className="mb-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {/* Tile utama */}
        <div className="tile col-span-2 flex flex-col justify-between p-6 sm:p-8 lg:row-span-2">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent">
              Kantin kampus, tanpa ribet
            </p>
            <h1 className="mt-2 max-w-2xl font-heading text-3xl font-extrabold leading-tight tracking-tight text-primary-dark sm:text-4xl">
              Mau makan apa hari ini?
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-text-muted sm:text-base">
              Temukan warung favorit, bandingkan menu dan rating, lalu pilih tempat
              makan dari review pelanggan lain.
            </p>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a href="#daftar-warung" className={buttonClass('primary')}>
              Jelajahi warung
              <ArrowDown className="size-4" aria-hidden="true" />
            </a>
            <span className="inline-flex h-10 items-center gap-2 rounded-control bg-accent-soft px-3.5 text-xs font-semibold text-primary-dark">
              <MessageSquare className="size-4 text-accent" aria-hidden="true" />
              {totalReviews} review terkumpul
            </span>
          </div>
        </div>

        {/* Tile rating rata-rata */}
        <div className="relative col-span-2 flex items-center justify-between gap-4 overflow-hidden rounded-card bg-primary p-6 text-white shadow-card">
          <div
            className="pointer-events-none absolute -right-10 -top-14 size-44 rounded-full bg-accent/40 blur-3xl"
            aria-hidden="true"
          />
          <div className="relative">
            <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.16em] text-sky">
              Ringkasan kantin
            </p>
            <p className="mb-0 font-heading text-4xl font-extrabold leading-none">
              {average.toFixed(1)}
              <span className="ml-1 text-base font-semibold text-white/60">/ 5</span>
            </p>
            <p className="mb-0 mt-2 max-w-48 text-xs leading-relaxed text-white/70">
              Rata-rata rating dari hasil pencarian yang sedang kamu lihat.
            </p>
          </div>
          <span className="relative flex size-14 shrink-0 items-center justify-center rounded-full bg-white/10">
            <Star className="size-7 fill-star text-star" aria-hidden="true" />
          </span>
        </div>

        {/* Tile jumlah warung */}
        <div className="rounded-card border border-border bg-sky p-5 shadow-card">
          <span className="flex size-9 items-center justify-center rounded-full bg-primary text-white">
            <Store className="size-4" aria-hidden="true" />
          </span>
          <p className="mb-0 mt-4 font-heading text-3xl font-extrabold text-primary-dark">
            {stalls.length}
          </p>
          <p className="mb-0 text-xs font-semibold text-text-muted">Warung</p>
        </div>

        {/* Tile jumlah review */}
        <div className="rounded-card border border-border bg-sky p-5 shadow-card">
          <span className="flex size-9 items-center justify-center rounded-full bg-primary text-white">
            <UtensilsCrossed className="size-4" aria-hidden="true" />
          </span>
          <p className="mb-0 mt-4 font-heading text-3xl font-extrabold text-primary-dark">
            {totalReviews}
          </p>
          <p className="mb-0 text-xs font-semibold text-text-muted">Review</p>
        </div>
      </section>

      <div id="daftar-warung" className="scroll-mt-24">
        <PageHeader
          eyebrow="Direktori"
          title="Daftar Warung"
          description="Cari berdasarkan nama warung atau kategori, lalu buka detail untuk melihat menu dan review."
          actions={
            <Button variant="secondary" onClick={() => void load()} disabled={isLoading}>
              {isLoading ? <Spinner /> : <RefreshCw className="size-4" aria-hidden="true" />}
              Muat Ulang
            </Button>
          }
        />

        <div className="tile mb-4 flex flex-col gap-3 p-3 sm:flex-row sm:p-4">
          <label className="relative block flex-1">
            <span className="sr-only">Cari warung</span>
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-muted"
              aria-hidden="true"
            />
            <input
              className={`${inputClass} pl-9`}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Cari nama warung..."
            />
          </label>
          <label className="block sm:w-56">
            <span className="sr-only">Filter kategori</span>
            <input
              className={inputClass}
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              placeholder="Filter kategori..."
            />
          </label>
          {hasFilter ? (
            <Button variant="ghost" onClick={resetFilters} className="sm:shrink-0">
              Reset
            </Button>
          ) : null}
        </div>

        {error && !hasLoadError ? (
          <div className="mb-4">
            <Alert tone="error">{error}</Alert>
          </div>
        ) : null}

        <div aria-busy={isLoading}>
          {isLoading && stalls.length === 0 ? (
            <LoadingPanel message="Memuat daftar warung..." />
          ) : hasLoadError ? (
            <EmptyState
              icon={Store}
              title="Daftar warung belum bisa dimuat"
              message={error ?? 'Periksa koneksimu lalu coba lagi.'}
              action={
                <Button variant="secondary" onClick={() => void load()}>
                  <RefreshCw className="size-4" aria-hidden="true" />
                  Coba Lagi
                </Button>
              }
            />
          ) : stalls.length === 0 ? (
            <EmptyState
              icon={Store}
              title="Warung tidak ditemukan"
              message={
                hasFilter
                  ? 'Coba ubah kata kunci atau kosongkan filter.'
                  : 'Belum ada warung yang terdaftar.'
              }
              action={
                hasFilter ? (
                  <Button variant="secondary" onClick={resetFilters}>
                    Reset Filter
                  </Button>
                ) : undefined
              }
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {stalls.map((stall) => (
                <StallCard key={stall.id} stall={stall} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}