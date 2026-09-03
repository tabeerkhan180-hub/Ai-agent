import { Link } from 'wouter';
import { ArrowUpRight, Check, Clock3, Globe2, Mail, Radar, ShieldCheck, Target, TrendingUp } from 'lucide-react';
import { getGetActivityFeedQueryKey, getHealthCheckQueryKey, useGetActivityFeed, useGetDashboardSummary, useHealthCheck } from '@workspace/api-client-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState, ErrorState, PageHeader, SectionLabel, SkeletonBlock, StatCard } from '@/components/shell';

const money = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
const ago = (date: string) => { const m = Math.max(1, Math.round((Date.now() - new Date(date).getTime()) / 60000)); return m < 60 ? `${m}m ago` : `${Math.round(m / 60)}h ago`; };

export default function DashboardPage() {
  const summary = useGetDashboardSummary();
  const activity = useGetActivityFeed({ limit: 6 }, { query: { queryKey: getGetActivityFeedQueryKey({ limit: 6 }) } });
  const health = useHealthCheck({ query: { queryKey: getHealthCheckQueryKey() } });
  if (summary.isLoading) return <DashboardSkeleton />;
  if (summary.isError || !summary.data) return <ErrorState message="Dashboard summary is unavailable right now." retry={() => summary.refetch()} />;
  const d = summary.data?.leads && summary.data.pipeline && summary.data.outreach
    ? summary.data
    : {
        leads: { total: 0, qualified: 0, hot: 0, newThisWeek: 0 },
        pipeline: { value: 0, wonValue: 0, openDeals: 0 },
        outreach: { sent: 0, replies: 0, replyRate: 0, queued: 0 },
        integrations: [],
        funnel: [],
      };
  const activityItems = Array.isArray(activity.data) ? activity.data : [];
  return <div>
    <PageHeader eyebrow="Monday, 14 October 2024 · New York" title="Good morning, Avery." description="Your operating view of the opportunity surface. There are a few high-intent signals worth acting on.">
      <Button asChild className="h-10 rounded-lg bg-primary px-4 text-xs font-bold"><Link href="/leads" data-testid="link-dashboard-discover"><Radar className="h-4 w-4" />Discover businesses</Link></Button>
    </PageHeader>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard label="Total leads" value={d.leads.total} detail={`+${d.leads.newThisWeek} added this week`} accent="gold" icon={Target} />
      <StatCard label="Qualified" value={d.leads.qualified} detail={`${Math.round(d.leads.qualified / Math.max(d.leads.total, 1) * 100)}% of your universe`} accent="teal" icon={Check} />
      <StatCard label="Open pipeline" value={money(d.pipeline.value)} detail={`${d.pipeline.openDeals} active opportunities`} accent="navy" icon={TrendingUp} />
      <StatCard label="Reply rate" value={`${d.outreach.replyRate}%`} detail={`${d.outreach.replies} replies from ${d.outreach.sent} sends`} accent="coral" icon={Mail} />
    </div>
    <div className="mt-7 grid gap-6 xl:grid-cols-[1.45fr_1fr]">
      <Card className="animate-in-up delay-1 overflow-hidden">
        <CardHeader className="border-b border-border/70 px-5 py-5 md:px-6"><div className="flex items-center justify-between"><div><CardTitle className="font-display text-lg tracking-[-.02em]">Pipeline pulse</CardTitle><p className="mt-1 text-xs text-muted-foreground">How your discovered businesses are moving</p></div><span className="rounded-full bg-[#e8f3ed] px-2.5 py-1 font-mono-ui text-[10px] font-medium text-[#26735e]">LIVE VIEW</span></div></CardHeader>
        <CardContent className="px-5 py-6 md:px-6"><div className="flex h-[180px] items-end gap-2 border-b border-border/70 pb-0 sm:gap-3">{d.funnel.map((item, i) => <div key={item.stage} className="group flex h-full flex-1 flex-col items-center justify-end gap-2"><div className="relative w-full max-w-[88px] rounded-t-md bg-[#e8c466] transition-all duration-500 group-hover:bg-[#d8a936]" style={{ height: `${Math.max(item.percentage * 1.5, 8)}%` }}><span className="absolute -top-6 left-1/2 -translate-x-1/2 font-mono-ui text-[10px] text-muted-foreground">{item.count}</span></div><span className="mb-[-23px] whitespace-nowrap pt-7 text-[10px] font-medium text-muted-foreground">{item.stage}</span></div>)}</div><div className="mt-10 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground"><span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm bg-[#e8c466]" />Current funnel</span><span className="font-mono-ui text-[10px]">Values update as you qualify</span></div></CardContent>
      </Card>
      <Card className="animate-in-up delay-2">
        <CardHeader className="px-5 py-5 md:px-6"><div className="flex items-center justify-between"><div><CardTitle className="font-display text-lg tracking-[-.02em]">Integration readiness</CardTitle><p className="mt-1 text-xs text-muted-foreground">The trust layer behind your actions</p></div><ShieldCheck className="h-5 w-5 text-[#2f8a73]" /></div></CardHeader>
        <CardContent className="space-y-3 px-5 pb-6 md:px-6">{d.integrations.map((integration) => <div key={integration.key} className="flex items-center gap-3 rounded-lg border border-border/70 px-3 py-3"><div className={`grid h-8 w-8 place-items-center rounded-md ${integration.state === 'connected' ? 'bg-[#e5f2ed] text-[#2f8a73]' : 'bg-muted text-muted-foreground'}`}>{integration.key === 'maps' ? <Globe2 className="h-4 w-4" /> : integration.key === 'email' ? <Mail className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4" />}</div><div className="min-w-0 flex-1"><p className="text-xs font-bold">{integration.label}</p><p className="truncate text-[11px] text-muted-foreground">{integration.detail}</p></div><span className={`font-mono-ui text-[9px] uppercase ${integration.state === 'connected' ? 'text-[#2f8a73]' : 'text-muted-foreground'}`}>{integration.state}</span></div>)}</CardContent>
      </Card>
    </div>
    <div className="mt-7 grid gap-6 xl:grid-cols-[1.45fr_1fr]">
      <Card className="animate-in-up delay-2"><CardHeader className="flex-row items-center justify-between px-5 py-5 md:px-6"><div><CardTitle className="font-display text-lg tracking-[-.02em]">Recent activity</CardTitle><p className="mt-1 text-xs text-muted-foreground">The latest movement across your workspace</p></div><Link href="/reports" className="flex items-center gap-1 text-xs font-bold text-[#92701d] hover:underline" data-testid="link-dashboard-reports">View reports <ArrowUpRight className="h-3.5 w-3.5" /></Link></CardHeader><CardContent className="px-5 pb-4 md:px-6">{activity.isLoading ? <div className="space-y-3"><SkeletonBlock className="h-12" /><SkeletonBlock className="h-12" /><SkeletonBlock className="h-12" /></div> : activityItems.length ? <div>{activityItems.map((item) => <div key={item.id} className="flex gap-3 border-t border-border/60 py-3.5"><div className={`mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-full ${item.tone === 'positive' ? 'bg-[#e5f2ed] text-[#2f8a73]' : item.tone === 'warning' ? 'bg-[#fff2df] text-[#a56c14]' : 'bg-muted text-muted-foreground'}`}>{item.type === 'outreach' ? <Mail className="h-3.5 w-3.5" /> : item.type === 'audit' ? <Globe2 className="h-3.5 w-3.5" /> : <Target className="h-3.5 w-3.5" />}</div><div className="min-w-0 flex-1"><p className="text-xs font-bold">{item.title}</p><p className="mt-0.5 truncate text-xs text-muted-foreground">{item.detail}</p></div><span className="flex shrink-0 items-center gap-1 font-mono-ui text-[10px] text-muted-foreground"><Clock3 className="h-3 w-3" />{ago(item.createdAt)}</span></div>)}</div> : <EmptyState title="No movement yet" detail="Activity will appear here as you discover and qualify businesses." />}</CardContent></Card>
      <Card className="relative overflow-hidden bg-[#18263d] text-[#f7f0df]"><div className="absolute right-[-35px] top-[-38px] h-40 w-40 rounded-full border-[22px] border-[#e7b34c]/20" /><CardContent className="relative p-6 md:p-7"><p className="font-mono-ui text-[10px] uppercase tracking-[.18em] text-[#e7b34c]">Operator note</p><h3 className="mt-4 max-w-[290px] font-display text-2xl font-bold leading-tight tracking-[-.035em]">Keep the human in the loop.</h3><p className="mt-3 text-sm leading-6 text-[#f7f0df]/65">Automation can find the signal. Your judgment turns it into a good conversation.</p><Link href="/settings" className="mt-7 inline-flex items-center gap-2 text-xs font-bold text-[#e7b34c] hover:gap-3 transition-all" data-testid="link-dashboard-settings">Review workspace rules <ArrowUpRight className="h-3.5 w-3.5" /></Link></CardContent></Card>
    </div>
    <div className="mt-6 flex items-center gap-2 font-mono-ui text-[10px] text-muted-foreground"><span className={`h-1.5 w-1.5 rounded-full ${health.data?.status === 'ok' ? 'bg-emerald-500' : 'bg-amber-500'}`} />{health.data?.status === 'ok' ? 'API connected' : 'Checking API connection'} <span className="text-border">·</span> Demo data is safe to explore</div>
  </div>;
}

function DashboardSkeleton() { return <div><div className="mb-8"><SkeletonBlock className="h-3 w-36" /><SkeletonBlock className="mt-3 h-10 w-72" /><SkeletonBlock className="mt-3 h-4 w-96" /></div><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{[1,2,3,4].map(i => <SkeletonBlock key={i} className="h-32" />)}</div><div className="mt-7 grid gap-6 xl:grid-cols-[1.45fr_1fr]"><SkeletonBlock className="h-80" /><SkeletonBlock className="h-80" /></div></div>; }
