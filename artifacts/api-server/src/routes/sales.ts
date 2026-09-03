import { randomUUID } from "node:crypto";
import { Router, type IRouter } from "express";
import {
  AuditLeadParams,
  AuditLeadResponse,
  DiscoverLeadsBody,
  DiscoverLeadsResponse,
  GetActivityFeedQueryParams,
  GetActivityFeedResponse,
  GetDashboardSummaryResponse,
  GetLeadParams,
  GetLeadResponse,
  GetSettingsResponse,
  ListLeadsQueryParams,
  ListLeadsResponse,
  ListOutreachQueryParams,
  ListOutreachResponse,
  QualifyLeadParams,
  QualifyLeadResponse,
  QueueOutreachBody,
  QueueOutreachResponse,
  SendOutreachParams,
  SendOutreachResponse,
  UpdateLeadBody,
  UpdateLeadParams,
  UpdateLeadResponse,
  UpdateSettingsBody,
  UpdateSettingsResponse,
} from "@workspace/api-zod";

type Lead = {
  id: string;
  businessName: string;
  category: string;
  city: string;
  country: string;
  website: string;
  websiteStatus: string;
  publicEmail?: string;
  source: string;
  status: string;
  tier: string;
  leadScore: number;
  opportunityScore: number;
  estValue: number;
  lastActivity: string | null;
  createdAt: string;
};

type Audit = {
  score: number;
  reachable: boolean;
  https: boolean;
  mobileViewport: boolean;
  perfScore: number | null;
  seoScore: number;
  a11yScore: number;
  opportunities: { title: string; rationale: string }[];
  evidence: { label: string; observed: string }[];
  analyzedAt: string;
};

type Message = {
  id: string;
  leadId: string;
  leadName: string;
  toAddress: string;
  subject: string;
  body: string;
  state: string;
  sequenceStep: number;
  queuedAt: string;
  sentAt: string | null;
};

type Activity = {
  id: string;
  type: string;
  title: string;
  detail: string;
  createdAt: string;
  leadId?: string | null;
  tone?: string;
};

const daysAgo = (days: number) =>
  new Date(Date.now() - days * 86_400_000).toISOString();

const leads: Lead[] = [
  {
    id: "lead-cais-dental",
    businessName: "Cais Dental Studio",
    category: "Dental clinic",
    city: "Porto",
    country: "Portugal",
    website: "caisdental.pt",
    websiteStatus: "LIVE",
    publicEmail: "hello@caisdental.pt",
    source: "demo",
    status: "QUALIFIED",
    tier: "HOT",
    leadScore: 91,
    opportunityScore: 88,
    estValue: 4200,
    lastActivity: daysAgo(0),
    createdAt: daysAgo(1),
  },
  {
    id: "lead-matosinhos-pilates",
    businessName: "Matosinhos Pilates",
    category: "Wellness studio",
    city: "Matosinhos",
    country: "Portugal",
    website: "matosinhospilates.pt",
    websiteStatus: "BROKEN",
    publicEmail: "studio@matosinhospilates.pt",
    source: "demo",
    status: "AUDITED",
    tier: "WARM",
    leadScore: 78,
    opportunityScore: 84,
    estValue: 2800,
    lastActivity: daysAgo(1),
    createdAt: daysAgo(2),
  },
  {
    id: "lead-casa-norte",
    businessName: "Casa Norte Interiors",
    category: "Interior design",
    city: "Braga",
    country: "Portugal",
    website: "casanorte.co",
    websiteStatus: "LIVE",
    publicEmail: "team@casanorte.co",
    source: "demo",
    status: "CONTACTED",
    tier: "WARM",
    leadScore: 74,
    opportunityScore: 76,
    estValue: 3600,
    lastActivity: daysAgo(2),
    createdAt: daysAgo(4),
  },
  {
    id: "lead-bloom-legal",
    businessName: "Bloom Legal",
    category: "Law firm",
    city: "Lisbon",
    country: "Portugal",
    website: "bloomlegal.pt",
    websiteStatus: "PARKED",
    publicEmail: "contact@bloomlegal.pt",
    source: "demo",
    status: "DISCOVERED",
    tier: "HOT",
    leadScore: 86,
    opportunityScore: 93,
    estValue: 5200,
    lastActivity: daysAgo(3),
    createdAt: daysAgo(5),
  },
  {
    id: "lead-lume-ceramics",
    businessName: "Lume Ceramics",
    category: "Ceramics studio",
    city: "Porto",
    country: "Portugal",
    website: "lumeceramics.com",
    websiteStatus: "SOCIAL_ONLY",
    publicEmail: "studio@lumeceramics.com",
    source: "demo",
    status: "QUALIFIED",
    tier: "WARM",
    leadScore: 79,
    opportunityScore: 81,
    estValue: 2400,
    lastActivity: daysAgo(4),
    createdAt: daysAgo(6),
  },
  {
    id: "lead-ribeira-physio",
    businessName: "Ribeira Physio",
    category: "Physiotherapy",
    city: "Porto",
    country: "Portugal",
    website: "ribeiraphysio.pt",
    websiteStatus: "LIVE",
    publicEmail: "hello@ribeiraphysio.pt",
    source: "demo",
    status: "REPLIED",
    tier: "HOT",
    leadScore: 94,
    opportunityScore: 90,
    estValue: 4800,
    lastActivity: daysAgo(0),
    createdAt: daysAgo(8),
  },
  {
    id: "lead-noma-studio",
    businessName: "Noma Studio",
    category: "Architecture studio",
    city: "Lisbon",
    country: "Portugal",
    website: "noma-studio.pt",
    websiteStatus: "LIVE",
    publicEmail: "office@noma-studio.pt",
    source: "demo",
    status: "PROPOSAL",
    tier: "HOT",
    leadScore: 88,
    opportunityScore: 87,
    estValue: 6500,
    lastActivity: daysAgo(2),
    createdAt: daysAgo(10),
  },
  {
    id: "lead-fado-coffee",
    businessName: "Fado Coffee Roasters",
    category: "Coffee roaster",
    city: "Coimbra",
    country: "Portugal",
    website: "fadocoffee.pt",
    websiteStatus: "UNKNOWN",
    publicEmail: "hello@fadocoffee.pt",
    source: "demo",
    status: "DISCOVERED",
    tier: "NURTURE",
    leadScore: 63,
    opportunityScore: 69,
    estValue: 1800,
    lastActivity: daysAgo(6),
    createdAt: daysAgo(12),
  },
];

const audits = new Map<string, Audit>([
  [
    "lead-cais-dental",
    {
      score: 42,
      reachable: true,
      https: true,
      mobileViewport: false,
      perfScore: 58,
      seoScore: 39,
      a11yScore: 44,
      opportunities: [
        {
          title: "Make appointment intent visible",
          rationale: "The primary booking action is below the first viewport.",
        },
        {
          title: "Improve mobile layout",
          rationale: "The page does not declare a mobile viewport.",
        },
        {
          title: "Strengthen local discovery",
          rationale: "The page is missing a descriptive meta description.",
        },
      ],
      evidence: [
        { label: "Mobile viewport", observed: "Not detected" },
        { label: "Page title", observed: "Cais Dental Studio" },
        { label: "Meta description", observed: "Not detected" },
        { label: "Contact path", observed: "Booking link found" },
      ],
      analyzedAt: daysAgo(0),
    },
  ],
]);

const messages: Message[] = [
  {
    id: "msg-ribeira-1",
    leadId: "lead-ribeira-physio",
    leadName: "Ribeira Physio",
    toAddress: "hello@ribeiraphysio.pt",
    subject: "A quick idea for Ribeira Physio",
    body: "Hi Ribeira team,\n\nI noticed two easy wins on your current site that could make new-patient bookings feel much simpler. I put the observations together in a short audit — happy to share if useful.\n\nBest,\nAlex",
    state: "SENT",
    sequenceStep: 0,
    queuedAt: daysAgo(2),
    sentAt: daysAgo(2),
  },
  {
    id: "msg-casa-1",
    leadId: "lead-casa-norte",
    leadName: "Casa Norte Interiors",
    toAddress: "team@casanorte.co",
    subject: "A small idea for Casa Norte",
    body: "Hi Casa Norte team,\n\nYour work is beautiful. I noticed a small opportunity to turn more of that first impression into qualified enquiries. Would it be useful if I sent over three specific observations?\n\nBest,\nAlex",
    state: "SENT",
    sequenceStep: 0,
    queuedAt: daysAgo(3),
    sentAt: daysAgo(3),
  },
  {
    id: "msg-bloom-1",
    leadId: "lead-bloom-legal",
    leadName: "Bloom Legal",
    toAddress: "contact@bloomlegal.pt",
    subject: "Bloom Legal — website opportunity",
    body: "Hi Bloom Legal team,\n\nI found your firm while researching Lisbon practices and noticed your website is currently pointing to a parked page. I can share a short, no-pressure recovery plan if helpful.\n\nBest,\nAlex",
    state: "QUEUED",
    sequenceStep: 0,
    queuedAt: daysAgo(0),
    sentAt: null,
  },
];

const activities: Activity[] = [
  {
    id: "activity-1",
    type: "reply",
    title: "Ribeira Physio replied",
    detail: "Asked what a booking flow refresh could look like.",
    createdAt: daysAgo(0),
    leadId: "lead-ribeira-physio",
    tone: "positive",
  },
  {
    id: "activity-2",
    type: "audit",
    title: "Cais Dental audit completed",
    detail: "42/100 — three clear opportunities found.",
    createdAt: daysAgo(0),
    leadId: "lead-cais-dental",
    tone: "warning",
  },
  {
    id: "activity-3",
    type: "proposal",
    title: "Noma Studio proposal ready",
    detail: "Awaiting your approval before it can be sent.",
    createdAt: daysAgo(1),
    leadId: "lead-noma-studio",
    tone: "accent",
  },
  {
    id: "activity-4",
    type: "discovery",
    title: "6 new leads discovered",
    detail: "Dentists in Porto, Portugal.",
    createdAt: daysAgo(1),
    tone: "neutral",
  },
  {
    id: "activity-5",
    type: "sequence",
    title: "Follow-up paused",
    detail: "Automated sequence stopped after a positive reply.",
    createdAt: daysAgo(2),
    leadId: "lead-ribeira-physio",
    tone: "positive",
  },
];

let settings = {
  runMode: "DEMO",
  approvalMode: true,
  dailySendLimit: 40,
  perDomainDaily: 1,
  sendWindow: "09:00–17:00 UTC",
  targetNiches: ["Dental", "Wellness", "Professional services"],
  targetCities: ["Porto", "Lisbon", "Braga"],
  currency: "EUR",
};

const integrationStatuses = [
  {
    key: "google_places",
    label: "Google Places",
    state: "NOT_CONNECTED",
    detail: "Connect to discover live businesses.",
  },
  {
    key: "pagespeed",
    label: "PageSpeed Insights",
    state: "NOT_CONNECTED",
    detail: "Connect to enrich performance scores.",
  },
  {
    key: "llm",
    label: "AI analysis",
    state: "CONNECTED",
    detail: "Demo reasoning is available.",
  },
  {
    key: "smtp",
    label: "Email sending",
    state: "NOT_CONNECTED",
    detail: "Demo mode prevents real sends.",
  },
];

function publicLead(lead: Lead) {
  return lead;
}

function detailFor(lead: Lead) {
  return {
    ...lead,
    audit: audits.get(lead.id) ?? null,
    messages: messages.filter((message) => message.leadId === lead.id),
    activities: activities.filter((activity) => activity.leadId === lead.id),
  };
}

const router: IRouter = Router();

router.get("/dashboard/summary", (_req, res) => {
  const total = leads.length;
  const qualified = leads.filter((lead) =>
    ["QUALIFIED", "CONTACTED", "REPLIED", "INTERESTED", "PROPOSAL", "NEGOTIATION"].includes(lead.status),
  ).length;
  const hot = leads.filter((lead) => lead.tier === "HOT").length;
  const openDeals = leads.filter((lead) => ["PROPOSAL", "NEGOTIATION"].includes(lead.status)).length;
  const sent = messages.filter((message) => message.state === "SENT").length;
  const replies = leads.filter((lead) => lead.status === "REPLIED" || lead.status === "INTERESTED").length;
  const funnelStages: [string, number][] = [
    ["Discovered", leads.filter((lead) => lead.status === "DISCOVERED").length],
    ["Audited", leads.filter((lead) => lead.status === "AUDITED").length],
    ["Qualified", qualified],
    ["Contacted", leads.filter((lead) => ["CONTACTED", "REPLIED", "INTERESTED", "PROPOSAL", "NEGOTIATION"].includes(lead.status)).length],
    ["Replied", replies],
    ["Proposal", leads.filter((lead) => lead.status === "PROPOSAL").length],
    ["Won", leads.filter((lead) => lead.status === "WON").length],
  ];
  const data = {
    leads: {
      total,
      qualified,
      hot,
      newThisWeek: leads.filter((lead) => new Date(lead.createdAt).getTime() > Date.now() - 7 * 86_400_000).length,
    },
    pipeline: {
      value: leads.filter((lead) => ["PROPOSAL", "NEGOTIATION"].includes(lead.status)).reduce((sum, lead) => sum + lead.estValue, 0),
      wonValue: leads.filter((lead) => lead.status === "WON").reduce((sum, lead) => sum + lead.estValue, 0),
      openDeals,
    },
    outreach: {
      sent,
      replies,
      replyRate: sent ? Math.round((replies / sent) * 100) : 0,
      queued: messages.filter((message) => message.state === "QUEUED").length,
    },
    integrations: integrationStatuses,
    funnel: funnelStages.map(([stage, count]) => ({
      stage,
      count,
      percentage: total ? Math.round((count / total) * 100) : 0,
    })),
  };
  res.json(GetDashboardSummaryResponse.parse(data));
});

router.get("/dashboard/activity", (req, res) => {
  const { limit } = GetActivityFeedQueryParams.parse(req.query);
  res.json(GetActivityFeedResponse.parse(activities.slice(0, limit)));
});

router.get("/leads", (req, res) => {
  const { status, tier, search, limit } = ListLeadsQueryParams.parse(req.query);
  const normalizedSearch = search?.toLowerCase();
  const result = leads
    .filter((lead) => !status || lead.status === status)
    .filter((lead) => !tier || lead.tier === tier)
    .filter((lead) =>
      !normalizedSearch ||
      `${lead.businessName} ${lead.category} ${lead.city}`.toLowerCase().includes(normalizedSearch),
    )
    .sort((a, b) => b.leadScore - a.leadScore)
    .slice(0, limit)
    .map(publicLead);
  res.json(ListLeadsResponse.parse(result));
});

router.post("/leads", (req, res) => {
  const input = DiscoverLeadsBody.parse(req.body);
  const limit = input.limit ?? 6;
  const slug = `${input.niche}-${input.city}`.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const results: Lead[] = [];
  let duplicates = 0;
  for (let index = 0; index < limit; index += 1) {
    const name = `${input.niche.replace(/\b\w/g, (letter) => letter.toUpperCase())} ${input.city} ${index + 1}`;
    const dedupe = `${slug}-${index + 1}`;
    if (leads.some((lead) => lead.id === dedupe)) {
      duplicates += 1;
      continue;
    }
    const now = new Date().toISOString();
    const lead: Lead = {
      id: dedupe,
      businessName: name,
      category: input.niche,
      city: input.city,
      country: input.country,
      website: `${slug}-${index + 1}.example`,
      websiteStatus: index % 3 === 0 ? "BROKEN" : "LIVE",
      publicEmail: `hello@${slug}-${index + 1}.example`,
      source: "demo",
      status: "DISCOVERED",
      tier: "UNSCORED",
      leadScore: 54 + ((index * 7) % 30),
      opportunityScore: 68 + ((index * 5) % 25),
      estValue: 1800 + index * 450,
      lastActivity: now,
      createdAt: now,
    };
    leads.push(lead);
    results.push(lead);
  }
  activities.unshift({
    id: randomUUID(),
    type: "discovery",
    title: `${results.length} new leads discovered`,
    detail: `${input.niche} in ${input.city}, ${input.country}.`,
    createdAt: new Date().toISOString(),
    tone: "neutral",
  });
  res.status(201).json(DiscoverLeadsResponse.parse({ created: results.length, duplicates, leads: results }));
});

router.get("/leads/:leadId", (req, res) => {
  const { leadId } = GetLeadParams.parse(req.params);
  const lead = leads.find((candidate) => candidate.id === leadId);
  if (!lead) {
    res.status(404).json({ error: "Lead not found" });
    return;
  }
  res.json(GetLeadResponse.parse(detailFor(lead)));
});

router.patch("/leads/:leadId", (req, res) => {
  const { leadId } = UpdateLeadParams.parse(req.params);
  const input = UpdateLeadBody.parse(req.body);
  const lead = leads.find((candidate) => candidate.id === leadId);
  if (!lead) {
    res.status(404).json({ error: "Lead not found" });
    return;
  }
  if (input.status) lead.status = input.status;
  if (input.tier) lead.tier = input.tier;
  lead.lastActivity = new Date().toISOString();
  res.json(UpdateLeadResponse.parse(publicLead(lead)));
});

router.post("/leads/:leadId/audit", (req, res) => {
  const { leadId } = AuditLeadParams.parse(req.params);
  const lead = leads.find((candidate) => candidate.id === leadId);
  if (!lead) {
    res.status(404).json({ error: "Lead not found" });
    return;
  }
  const audit: Audit = {
    score: lead.websiteStatus === "BROKEN" ? 24 : lead.websiteStatus === "PARKED" ? 12 : 55,
    reachable: lead.websiteStatus !== "BROKEN" && lead.websiteStatus !== "PARKED",
    https: lead.websiteStatus !== "PARKED",
    mobileViewport: lead.websiteStatus === "LIVE",
    perfScore: lead.websiteStatus === "LIVE" ? 64 : null,
    seoScore: lead.websiteStatus === "LIVE" ? 58 : 28,
    a11yScore: lead.websiteStatus === "LIVE" ? 62 : 35,
    opportunities: [
      { title: "Clarify the next step", rationale: "A clearer primary action would reduce enquiry friction." },
      { title: "Build trust above the fold", rationale: "Proof points are not visible early in the experience." },
      { title: "Improve local discovery", rationale: "The page could make its location and service focus more explicit." },
    ],
    evidence: [
      { label: "Website status", observed: lead.websiteStatus.replace("_", " ").toLowerCase() },
      { label: "Mobile viewport", observed: lead.websiteStatus === "LIVE" ? "Detected" : "Not detected" },
      { label: "HTTPS", observed: lead.websiteStatus === "PARKED" ? "Not observed" : "Detected" },
    ],
    analyzedAt: new Date().toISOString(),
  };
  audits.set(lead.id, audit);
  lead.status = "AUDITED";
  lead.lastActivity = audit.analyzedAt;
  activities.unshift({
    id: randomUUID(),
    type: "audit",
    title: `${lead.businessName} audit completed`,
    detail: `${audit.score}/100 — three clear opportunities found.`,
    createdAt: audit.analyzedAt,
    leadId: lead.id,
    tone: "warning",
  });
  res.json(AuditLeadResponse.parse(audit));
});

router.post("/leads/:leadId/qualify", (req, res) => {
  const { leadId } = QualifyLeadParams.parse(req.params);
  const lead = leads.find((candidate) => candidate.id === leadId);
  if (!lead) {
    res.status(404).json({ error: "Lead not found" });
    return;
  }
  const auditScore = audits.get(lead.id)?.score ?? 50;
  lead.tier = lead.leadScore >= 85 ? "HOT" : lead.leadScore >= 70 ? "WARM" : "NURTURE";
  lead.opportunityScore = Math.min(100, Math.round((lead.opportunityScore + (100 - auditScore)) / 2));
  lead.status = "QUALIFIED";
  lead.lastActivity = new Date().toISOString();
  res.json(QualifyLeadResponse.parse(publicLead(lead)));
});

router.get("/outreach", (req, res) => {
  const { state, limit } = ListOutreachQueryParams.parse(req.query);
  const result = messages
    .filter((message) => !state || message.state === state)
    .slice(0, limit);
  res.json(ListOutreachResponse.parse(result));
});

router.post("/outreach", (req, res) => {
  const input = QueueOutreachBody.parse(req.body);
  const lead = leads.find((candidate) => candidate.id === input.leadId);
  if (!lead) {
    res.status(404).json({ error: "Lead not found" });
    return;
  }
  const existing = messages.find(
    (message) => message.leadId === lead.id && message.sequenceStep === 0 && message.state !== "CANCELLED",
  );
  if (existing) {
    res.status(409).json({ error: "A first-touch message already exists for this lead." });
    return;
  }
  const queuedAt = new Date().toISOString();
  const message: Message = {
    id: randomUUID(),
    leadId: lead.id,
    leadName: lead.businessName,
    toAddress: lead.publicEmail ?? `hello@${lead.website}`,
    subject: input.subject ?? `A quick idea for ${lead.businessName}`,
    body: input.body ?? `Hi ${lead.businessName} team,\n\nI noticed a few opportunities that could make your website work harder for the business. Would it be useful if I shared a short audit?\n\nBest,\nAlex`,
    state: "QUEUED",
    sequenceStep: 0,
    queuedAt,
    sentAt: null,
  };
  messages.unshift(message);
  lead.status = "QUEUED";
  lead.lastActivity = queuedAt;
  res.status(201).json(QueueOutreachResponse.parse(message));
});

router.post("/outreach/:messageId/send", (req, res) => {
  const { messageId } = SendOutreachParams.parse(req.params);
  const message = messages.find((candidate) => candidate.id === messageId);
  if (!message) {
    res.status(404).json({ error: "Message not found" });
    return;
  }
  message.state = "SENT";
  message.sentAt = new Date().toISOString();
  const lead = leads.find((candidate) => candidate.id === message.leadId);
  if (lead) {
    lead.status = "CONTACTED";
    lead.lastActivity = message.sentAt;
  }
  res.json(SendOutreachResponse.parse(message));
});

router.get("/settings", (_req, res) => {
  res.json(GetSettingsResponse.parse({ ...settings, integrations: integrationStatuses }));
});

router.patch("/settings", (req, res) => {
  const input = UpdateSettingsBody.parse(req.body);
  settings = { ...settings, ...input };
  res.json(UpdateSettingsResponse.parse({ ...settings, integrations: integrationStatuses }));
});

export default router;