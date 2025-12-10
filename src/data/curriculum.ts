import { Module, Topic } from '../types';

// Generate unique IDs
const generateId = () => crypto.randomUUID();

// Module 0
const module0Id = generateId();
const module0Topics: Omit<Topic, 'id'>[] = [
  { module_id: module0Id, title: 'North Star Metric (NSM) & One Funnel', subtitle: 'Keeps you laser-focused on impact', order_index: 1 },
  { module_id: module0Id, title: 'Value Equation', subtitle: 'Dream outcome × Likelihood – Time – Effort – Cost — Design offers that people can\'t ignore', order_index: 2 },
  { module_id: module0Id, title: 'Fermi Estimates for Market & CAC/LTV', subtitle: 'Quick maths prevents costly fantasies', order_index: 3 },
  { module_id: module0Id, title: 'User Journey Map', subtitle: 'Aware→Consider→Convert→Retain→Refer — See exactly where to intervene', order_index: 4 },
  { module_id: module0Id, title: 'One-Metric Dashboards (GA4/Sheet)', subtitle: 'Measure what matters, not everything', order_index: 5 },
  { module_id: module0Id, title: 'UTM Hygiene', subtitle: 'Source/medium/campaign — Attribution starts with clean tags', order_index: 6 },
  { module_id: module0Id, title: 'Ethics, Privacy, and Spam-Safe Mindset', subtitle: 'Grow fast without burning trust', order_index: 7 },
  { module_id: module0Id, title: 'Musk-Mode Mini-Challenge', subtitle: 'In 20 minutes, define your NSM, LTV ballpark, and top bottleneck stage', order_index: 8, challenge: 'In 20 minutes, define your NSM, LTV ballpark, and top bottleneck stage.' },
];

// Module 1
const module1Id = generateId();
const module1Topics: Omit<Topic, 'id'>[] = [
  { module_id: module1Id, title: 'ICP (Ideal Customer Profile) in One Paragraph', subtitle: 'Clarity saves months of trial-and-error', order_index: 1 },
  { module_id: module1Id, title: 'Jobs-To-Be-Done Interview Script', subtitle: 'Hear the real hiring criteria for your product', order_index: 2 },
  { module_id: module1Id, title: 'Pain > Desire > Outcome Ladder', subtitle: 'Write benefits that hit like a train', order_index: 3 },
  { module_id: module1Id, title: 'Category & Competitors Map', subtitle: 'Position to be the obvious choice', order_index: 4 },
  { module_id: module1Id, title: 'Unique Mechanism', subtitle: 'What\'s different? — Differentiation boosts CTR and trust', order_index: 5 },
  { module_id: module1Id, title: 'One-Line Value Proposition', subtitle: 'If it\'s not clear, it won\'t convert', order_index: 6 },
  { module_id: module1Id, title: 'Objection Bank (with Counters)', subtitle: 'Pre-answer doubts, lift conversions fast', order_index: 7 },
  { module_id: module1Id, title: 'Mini-Challenge', subtitle: 'Write a 15-word value prop and 5 objections with crisp counters', order_index: 8, challenge: 'Write a 15-word value prop and 5 objections with crisp counters.' },
];

// Module 2
const module2Id = generateId();
const module2Topics: Omit<Topic, 'id'>[] = [
  { module_id: module2Id, title: 'Core Offer + 2 Bonuses + Risk-Reversal', subtitle: 'Stacked value outsells features', order_index: 1 },
  { module_id: module2Id, title: 'Hero Hook', subtitle: 'Problem → Promise → Proof → Prompt — First 5 seconds decide fate', order_index: 2 },
  { module_id: module2Id, title: 'Proof Assets', subtitle: 'Testimonials, numbers, demos — Proof turns curiosity into belief', order_index: 3 },
  { module_id: module2Id, title: 'Landing Structure (AIDA + FAQs + CTA)', subtitle: 'A clean flow prints conversions', order_index: 4 },
  { module_id: module2Id, title: 'Mobile Speed', subtitle: 'Pagespeed, image compression — Fast pages = cheaper traffic', order_index: 5 },
  { module_id: module2Id, title: 'Form Design & Micro-Copy', subtitle: 'Fewer fields, more leads', order_index: 6 },
  { module_id: module2Id, title: 'Single KPI Per Page', subtitle: 'No distractions, better signal', order_index: 7 },
  { module_id: module2Id, title: 'Mini-Challenge', subtitle: 'Draft a wireframe on paper; write 3 hero hooks; pick one', order_index: 8, challenge: 'Draft a wireframe on paper; write 3 hero hooks; pick one.' },
];

// Module 3
const module3Id = generateId();
const module3Topics: Omit<Topic, 'id'>[] = [
  { module_id: module3Id, title: 'Keyword Intent', subtitle: 'Informational vs Transactional — Match intent, win rankings', order_index: 1 },
  { module_id: module3Id, title: 'Content Pillars & Topic Clusters', subtitle: 'Organised content = compounding traffic', order_index: 2 },
  { module_id: module3Id, title: 'On-Page Basics', subtitle: 'Title, H1, alt, schema — Free SEO wins in an hour', order_index: 3 },
  { module_id: module3Id, title: 'Helpful Content Outline (E-E-A-T)', subtitle: 'Trustworthy guides outrank fluff', order_index: 4 },
  { module_id: module3Id, title: 'Internal Linking & Pillar Hub', subtitle: 'Pass authority like a pro', order_index: 5 },
  { module_id: module3Id, title: 'Simple Content Calendar', subtitle: '2 posts/week — Consistency beats bursts', order_index: 6 },
  { module_id: module3Id, title: 'ASO Basics (if app)', subtitle: 'Store pages are your new homepage', order_index: 7 },
  { module_id: module3Id, title: 'Mini-Challenge', subtitle: 'Ship one "pain-to-promise" blog targeting a transactional keyword this week', order_index: 8, challenge: 'Ship one "pain-to-promise" blog targeting a transactional keyword this week.' },
];

// Module 4
const module4Id = generateId();
const module4Topics: Omit<Topic, 'id'>[] = [
  { module_id: module4Id, title: 'Choose Two Channels', subtitle: 'Home + experimental — Focus multiplies output', order_index: 1 },
  { module_id: module4Id, title: 'Format Stack', subtitle: 'Shorts, carousels, threads — Native formats travel further', order_index: 2 },
  { module_id: module4Id, title: 'Hook Library', subtitle: 'First 2 seconds rule — Win the scroll war early', order_index: 3 },
  { module_id: module4Id, title: 'Content Repurposing Workflow', subtitle: 'One idea → many assets saves time', order_index: 4 },
  { module_id: module4Id, title: 'Community Replies & DMs', subtitle: 'Conversations convert better than posts', order_index: 5 },
  { module_id: module4Id, title: 'Creator/Influencer Short-List', subtitle: 'Borrow audiences, accelerate trust', order_index: 6 },
  { module_id: module4Id, title: 'Posting Cadence & Weekly Review', subtitle: 'Rhythm creates reach', order_index: 7 },
  { module_id: module4Id, title: 'Mini-Challenge', subtitle: 'Repurpose one blog into 5 social assets; post across two channels', order_index: 8, challenge: 'Repurpose one blog into 5 social assets; post across two channels.' },
];

// Module 5
const module5Id = generateId();
const module5Topics: Omit<Topic, 'id'>[] = [
  { module_id: module5Id, title: 'Pixels & Conversions (GA4/Ads Manager)', subtitle: 'Without signals, money burns', order_index: 1 },
  { module_id: module5Id, title: 'Offer-Creative-Audience Triangle', subtitle: 'Creatives usually move the needle most', order_index: 2 },
  { module_id: module5Id, title: 'Google Search Basics', subtitle: 'Exact, phrase, negatives — Buy high-intent clicks first', order_index: 3 },
  { module_id: module5Id, title: 'Meta Ads Basics', subtitle: 'Creative testing pods — Test messages fast and cheap', order_index: 4 },
  { module_id: module5Id, title: 'Account Structure for Learning', subtitle: 'Fewer, cleaner campaigns = stable scaling', order_index: 5 },
  { module_id: module5Id, title: 'Bidding & Budgets', subtitle: 'Start small, ramp with MER — Protect cash, learn fast', order_index: 6 },
  { module_id: module5Id, title: 'Ad Compliance & Landing Congruence', subtitle: 'Relevance score lowers CPC', order_index: 7 },
  { module_id: module5Id, title: 'Mini-Challenge', subtitle: 'Launch 1 Google exact-match ad group + 3-creative Meta test with clear UTMs', order_index: 8, challenge: 'Launch 1 Google exact-match ad group + 3-creative Meta test with clear UTMs.' },
];

// Module 6
const module6Id = generateId();
const module6Topics: Omit<Topic, 'id'>[] = [
  { module_id: module6Id, title: 'Lead Magnets That Truly Help', subtitle: 'Give value, earn permission', order_index: 1 },
  { module_id: module6Id, title: 'Welcome/Onboarding Email (3-Step)', subtitle: 'Great first run = higher LTV', order_index: 2 },
  { module_id: module6Id, title: 'Nurture Cadence', subtitle: 'Teach → Case → Ask — Trust builds with rhythm', order_index: 3 },
  { module_id: module6Id, title: 'RFM Segmentation', subtitle: 'Recent, freq, monetary — Talk differently to different users', order_index: 4 },
  { module_id: module6Id, title: 'WhatsApp/SMS Use-Cases (India-Friendly)', subtitle: 'Timely nudges, not spam', order_index: 5 },
  { module_id: module6Id, title: 'Cart/Browse Abandonment Flows', subtitle: 'Recover easy revenue 24×7', order_index: 6 },
  { module_id: module6Id, title: 'Review/Referral Request Automation', subtitle: 'Happy users become your sales team', order_index: 7 },
  { module_id: module6Id, title: 'Mini-Challenge', subtitle: 'Set a 3-email welcome flow and a cart-abandon reminder in one day', order_index: 8, challenge: 'Set a 3-email welcome flow and a cart-abandon reminder in one day.' },
];

// Module 7
const module7Id = generateId();
const module7Topics: Omit<Topic, 'id'>[] = [
  { module_id: module7Id, title: 'Heuristic Audit', subtitle: 'Clarity, friction, anxiety — Spot fixes without waiting for data', order_index: 1 },
  { module_id: module7Id, title: 'A/B Testing Basics', subtitle: 'One hypothesis rule — Science, not vibes', order_index: 2 },
  { module_id: module7Id, title: 'Social Proof & Risk-Reversal Placement', subtitle: 'Trust near CTAs lifts clicks', order_index: 3 },
  { module_id: module7Id, title: 'Speed, UX, and Accessibility Checks', subtitle: 'Bad UX silently kills ROAS', order_index: 4 },
  { module_id: module7Id, title: 'Cohort Metrics', subtitle: 'CAC payback, LTV curves — Decide scale vs. sustain', order_index: 5 },
  { module_id: module7Id, title: 'Attribution Sanity', subtitle: 'Last vs data-driven — Don\'t credit the wrong channel', order_index: 6 },
  { module_id: module7Id, title: 'North-Star Review & Next Biggest Constraint', subtitle: 'Always attack the bottleneck', order_index: 7 },
  { module_id: module7Id, title: 'Mini-Challenge', subtitle: 'Run one A/B test on your most-visited page this week', order_index: 8, challenge: 'Run one A/B test on your most-visited page this week.' },
];

// Module 8
const module8Id = generateId();
const module8Topics: Omit<Topic, 'id'>[] = [
  { module_id: module8Id, title: 'Referral Loop', subtitle: 'Incentives & triggers — Users bring users, CAC drops', order_index: 1 },
  { module_id: module8Id, title: 'Partnerships & Affiliates', subtitle: 'Borrow trust at scale', order_index: 2 },
  { module_id: module8Id, title: 'PR/Launch Moments & Narratives', subtitle: 'Attention spikes feed the funnel', order_index: 3 },
  { module_id: module8Id, title: 'Community & UGC Flywheel', subtitle: 'Content you don\'t have to write', order_index: 4 },
  { module_id: module8Id, title: 'Product-Led Growth', subtitle: 'Aha, habit, hooks — Feature moments that sell themselves', order_index: 5 },
  { module_id: module8Id, title: 'Retention Levers', subtitle: 'Feature, habit, value — LTV growth compounds everything', order_index: 6 },
  { module_id: module8Id, title: 'Learning Cadence', subtitle: 'Weekly post-mortem — Sharpen the axe every 7 days', order_index: 7 },
];

// Combine all modules
export const curriculumData: Omit<Module, 'id'>[] = [
  {
    module_number: 0,
    title: 'Grounding & First Principles',
    description: 'Build a solid foundation with metrics, value equations, and ethical growth mindset',
    topics: module0Topics.map(t => ({ ...t, id: generateId() })) as Topic[],
  },
  {
    module_number: 1,
    title: 'Customer, Problem, Positioning',
    description: 'Define your ideal customer, understand their jobs-to-be-done, and position your offer',
    topics: module1Topics.map(t => ({ ...t, id: generateId() })) as Topic[],
  },
  {
    module_number: 2,
    title: 'Offers, Copy, and Landing Pages',
    description: 'Create irresistible offers and high-converting landing pages',
    topics: module2Topics.map(t => ({ ...t, id: generateId() })) as Topic[],
  },
  {
    module_number: 3,
    title: 'Organic Foundations (SEO + Content)',
    description: 'Build sustainable organic traffic through SEO and content strategy',
    topics: module3Topics.map(t => ({ ...t, id: generateId() })) as Topic[],
  },
  {
    module_number: 4,
    title: 'Social & Distribution',
    description: 'Master social media channels and content distribution',
    topics: module4Topics.map(t => ({ ...t, id: generateId() })) as Topic[],
  },
  {
    module_number: 5,
    title: 'Paid Acquisition (Essentials)',
    description: 'Learn the fundamentals of Google and Meta ads without the guru nonsense',
    topics: module5Topics.map(t => ({ ...t, id: generateId() })) as Topic[],
  },
  {
    module_number: 6,
    title: 'Lifecycle, CRM & Automation',
    description: 'Nurture leads and retain customers with smart automation',
    topics: module6Topics.map(t => ({ ...t, id: generateId() })) as Topic[],
  },
  {
    module_number: 7,
    title: 'CRO, Experiments & Unit Economics',
    description: 'Optimize conversions through testing and understand your numbers',
    topics: module7Topics.map(t => ({ ...t, id: generateId() })) as Topic[],
  },
  {
    module_number: 8,
    title: 'Growth Loops & Moats',
    description: 'Build sustainable growth engines and competitive advantages',
    topics: module8Topics.map(t => ({ ...t, id: generateId() })) as Topic[],
  },
];

// Generate modules with IDs
export const modules: Module[] = curriculumData.map((m, index) => ({
  ...m,
  id: [module0Id, module1Id, module2Id, module3Id, module4Id, module5Id, module6Id, module7Id, module8Id][index],
}));
