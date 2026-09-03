import { Link, useLocation } from 'wouter';
import { Activity, ArrowUpRight, BarChart3, Bell, Building2, ChevronRight, CircleHelp, LayoutDashboard, Mail, Menu, Search, Settings, Sparkles, Target, X } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { Button } from '@/components/ui/button';

const nav = [
  { href: '/', label: 'Overview', icon: LayoutDashboard },
  { href: '/leads', label: 'Lead workspace', icon: Target },
  { href: '/outreach', label: 'Outreach', icon: Mail },
  { href: '/reports', label: 'Reports', icon: BarChart3 },
];

export function Shell({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <div className="grain min-h-[100dvh] bg-background text-foreground">
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-[252px] flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-transform duration-300 md:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-[82px] items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-3" data-testid="link-brand">
            <span className="grid h-9 w-9 place-items-center rounded-[10px] bg-sidebar-primary text-sidebar-primary-foreground"><Sparkles className="h-4 w-4" /></span>
            <span><span className="block font-display text-[17px] font-bold tracking-[-.02em]">AI Sales OS</span><span className="font-mono-ui text-[9px] uppercase tracking-[.17em] text-sidebar-foreground/50">Operator workspace</span></span>
          </Link>
          <button onClick={() => setMobileOpen(false)} className="md:hidden" data-testid="button-close-menu"><X className="h-5 w-5" /></button>
        </div>
        <div className="mx-5 mb-5 rounded-xl border border-sidebar-border bg-sidebar-accent/70 px-3 py-3">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[.13em] text-sidebar-foreground/55"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />Demo workspace</div>
          <p className="mt-2 text-xs leading-5 text-sidebar-foreground/75">One operator, a sharper pipeline.</p>
        </div>
        <nav className="flex-1 space-y-1 px-3">
          <p className="px-3 pb-2 pt-1 font-mono-ui text-[10px] uppercase tracking-[.18em] text-sidebar-foreground/35">Workspace</p>
          {nav.map((item) => {
            const active = item.href === '/' ? location === '/' : location.startsWith(item.href);
            const Icon = item.icon;
            return <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)} className={`group flex h-11 items-center gap-3 rounded-lg px-3 text-sm transition-all ${active ? 'bg-sidebar-primary text-sidebar-primary-foreground font-semibold shadow-sm' : 'text-sidebar-foreground/65 hover:bg-sidebar-accent hover:text-sidebar-foreground'}`} data-testid={`link-nav-${item.label.toLowerCase().replaceAll(' ', '-')}`}><Icon className="h-[17px] w-[17px]" /><span className="flex-1">{item.label}</span>{active && <ChevronRight className="h-3.5 w-3.5" />}</Link>;
          })}
          <p className="px-3 pb-2 pt-8 font-mono-ui text-[10px] uppercase tracking-[.18em] text-sidebar-foreground/35">System</p>
          <Link href="/settings" onClick={() => setMobileOpen(false)} className={`flex h-11 items-center gap-3 rounded-lg px-3 text-sm transition-all ${location.startsWith('/settings') ? 'bg-sidebar-accent text-sidebar-foreground font-semibold' : 'text-sidebar-foreground/65 hover:bg-sidebar-accent hover:text-sidebar-foreground'}`} data-testid="link-nav-settings"><Settings className="h-[17px] w-[17px]" /><span>Settings</span></Link>
        </nav>
        <div className="border-t border-sidebar-border p-5">
          <div className="flex items-center gap-3"><div className="grid h-8 w-8 place-items-center rounded-full bg-[#e7b34c] font-display text-xs font-bold text-[#182338]">AM</div><div className="min-w-0 flex-1"><p className="truncate text-xs font-semibold">Avery Morgan</p><p className="truncate font-mono-ui text-[10px] text-sidebar-foreground/45">growth operator</p></div><button className="text-sidebar-foreground/45 hover:text-sidebar-foreground" data-testid="button-profile-menu"><ArrowUpRight className="h-3.5 w-3.5" /></button></div>
        </div>
      </aside>
      {mobileOpen && <button className="fixed inset-0 z-30 bg-[#101b2c]/40 md:hidden" onClick={() => setMobileOpen(false)} data-testid="button-close-overlay" />}
      <div className="md:pl-[252px]">
        <header className="sticky top-0 z-20 flex h-[70px] items-center justify-between border-b border-border/70 bg-background/90 px-5 backdrop-blur-md md:px-9">
          <div className="flex items-center gap-3"><button className="md:hidden" onClick={() => setMobileOpen(true)} data-testid="button-open-menu"><Menu className="h-5 w-5" /></button><div className="hidden items-center gap-2 text-xs text-muted-foreground sm:flex"><Activity className="h-3.5 w-3.5 text-emerald-600" /><span>System healthy</span><span className="font-mono-ui text-[10px] text-muted-foreground/70">/ synced just now</span></div></div>
          <div className="flex items-center gap-2.5"><Link href="/leads" className="hidden h-9 items-center gap-2 rounded-lg border border-border bg-card px-3 text-xs font-semibold text-foreground transition hover:border-primary/40 hover:bg-muted sm:flex" data-testid="link-quick-discover"><Search className="h-3.5 w-3.5 text-muted-foreground" />Find leads</Link><button className="relative grid h-9 w-9 place-items-center rounded-lg border border-border bg-card text-muted-foreground transition hover:text-foreground" data-testid="button-notifications"><Bell className="h-4 w-4" /><span className="absolute right-2 top-1.5 h-1.5 w-1.5 rounded-full bg-[#e7b34c]" /></button><Link href="/settings" className="grid h-9 w-9 place-items-center rounded-lg border border-border bg-card text-muted-foreground transition hover:text-foreground" data-testid="link-header-settings"><Settings className="h-4 w-4" /></Link></div>
        </header>
        <main className="mx-auto max-w-[1440px] px-5 py-7 md:px-9 md:py-9">{children}</main>
      </div>
    </div>
  );
}

export function PageHeader({ eyebrow, title, description, children }: { eyebrow: string; title: string; description?: string; children?: ReactNode }) {
  return <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end"><div className="animate-in-up"><p className="mb-2 font-mono-ui text-[10px] font-medium uppercase tracking-[.2em] text-muted-foreground">{eyebrow}</p><h1 className="font-display text-3xl font-bold tracking-[-.04em] text-foreground md:text-[38px]">{title}</h1>{description && <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{description}</p>}</div>{children && <div className="animate-in-up delay-1">{children}</div>}</div>;
}

export function SectionLabel({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return <div className="mb-3 flex items-center justify-between"><h2 className="font-mono-ui text-[10px] font-medium uppercase tracking-[.18em] text-muted-foreground">{children}</h2>{action}</div>;
}

export function StatCard({ label, value, detail, accent = 'gold', icon: Icon }: { label: string; value: string | number; detail: string; accent?: 'gold' | 'teal' | 'coral' | 'navy'; icon?: typeof Activity }) {
  const colors = { gold: 'bg-[#f5c65d]', teal: 'bg-[#6db8a8]', coral: 'bg-[#ed8a73]', navy: 'bg-[#233553]' };
  return <div className="group relative overflow-hidden rounded-xl border border-border bg-card p-5 shadow-[0_4px_18px_hsl(218_43%_15%/.04)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_28px_hsl(218_43%_15%/.09)]"><div className={`absolute left-0 top-0 h-1 w-full ${colors[accent]}`} /><div className="flex items-start justify-between"><p className="font-mono-ui text-[10px] uppercase tracking-[.15em] text-muted-foreground">{label}</p>{Icon && <Icon className="h-4 w-4 text-muted-foreground/60" />}</div><p className="mt-4 font-display text-3xl font-bold tracking-[-.04em]" data-testid={`text-stat-${label.toLowerCase().replaceAll(' ', '-')}`}>{value}</p><p className="mt-1 text-xs text-muted-foreground">{detail}</p></div>;
}

export function SkeletonBlock({ className = '' }: { className?: string }) { return <div className={`animate-pulse rounded-lg bg-muted ${className}`} />; }
export function ErrorState({ message = 'Could not load this workspace view.', retry }: { message?: string; retry?: () => void }) { return <div className="rounded-xl border border-[#ed8a73]/30 bg-[#fff2ed] p-8 text-center"><p className="font-display text-lg font-bold text-[#9b3d2e]">The signal dropped.</p><p className="mt-1 text-sm text-[#9b3d2e]/75">{message}</p>{retry && <Button onClick={retry} variant="outline" className="mt-4 border-[#ed8a73]/50" data-testid="button-retry">Try again</Button>}</div>; }
export function EmptyState({ title, detail, action }: { title: string; detail: string; action?: ReactNode }) { return <div className="rounded-xl border border-dashed border-border bg-card/60 p-10 text-center"><div className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-muted"><CircleHelp className="h-5 w-5 text-muted-foreground" /></div><p className="mt-4 font-display text-lg font-bold">{title}</p><p className="mx-auto mt-1 max-w-sm text-sm leading-6 text-muted-foreground">{detail}</p>{action && <div className="mt-5">{action}</div>}</div>; }