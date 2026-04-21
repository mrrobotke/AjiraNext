# AjiraNext Component Inventory

Decomposition of every UI element found in the mockup using Atomic Design methodology.

## Atoms (Indivisible Building Blocks)

### Text

- **Heading** (`H1`–`H6`) — Typographic headings with size/weight variants
- **Paragraph** — Body text element
- **Label** — Form labels, uppercase, small, tracking-wide
- **Caption** — Small helper/error text
- **Overline** / **Eyebrow** — Uppercase tags with wide letter-spacing

### Interactive

- **Button** — Variants: primary, secondary, ghost, danger, outline; sizes: sm, md, lg
- **IconButton** — Circular button wrapping an icon
- **Link** — Text link with hover states
- **Chip** / **Badge** — Status tags: accent, green, muted, red, blue, yellow
- **Toggle** — Switch control

### Inputs

- **TextInput** — Text field with focus ring
- **TextArea** — Multi-line text input
- **Select** — Dropdown selection
- **Checkbox** — Binary checkbox
- **Radio** — Single-select radio

### Media

- **Avatar** — Circular user image/initials; sizes: sm, md, lg
- **Logo** — Ajira Next wordmark
- **Icon** — SVG icon wrapper (lucide-react)

### Feedback

- **Spinner** — Loading indicator
- **SkeletonLine** — Loading placeholder
- **Divider** — Horizontal rule
- **ProgressBar** — Progress indicator bar

## Molecules (Composed of 2+ Atoms)

- **SearchBar** — TextInput atom (with leadingIcon) + IconButton atom
- **FormField** — Label atom + TextInput/TextArea/Select atom + optional Caption atom
- **JobMeta** — Chip/Badge atom + Icon atom + Caption atom (e.g., "Remote • Full-time")
- **NavItem** — Icon atom + Link atom
- **UserProfileSnippet** — Avatar atom + Caption atom (name) + Caption atom (role)
- **StatCard** — Caption atom (label) + Heading atom (value) + Icon atom
- **DropdownMenu** — Button atom + list of Link atoms
- **MarketPill** — Icon atom + text + chevron

## Organisms (Complex Sections)

- **Header / Navbar** — Logo atom + multiple NavItem molecules + Button atom + MarketPill molecule + ThemeToggle IconButton
- **HeroSection** — H1 atom + Paragraph atom + Button atoms + SearchBar molecule + TrustStats molecules
- **JobCard** — Avatar atom (company logo) + Heading atom (title) + JobMeta molecule + Badge atom + Button atom
- **FilterPanel** — multiple FormField molecules + Button atom (Apply)
- **Footer** — Logo atom + multiple Link atoms + IconButton atoms (social)
- **JobDetailHeader** — H2 atom + Badge atom + Button atom + JobMeta molecule
- **DashboardSidebar** — multiple NavItem molecules + Divider atom + UserProfileSnippet molecule
- **SmartMatchSection** — Scoreboard with JobCard-like rows + detail panel
- **StatsRow** — multiple StatCard molecules
- **KanbanBoard** — columns of cards (used in seeker dashboard)
- **ApplicationCard** — Job info + status badge + progress
- **Modal** — Backdrop + card container + close button + title slot
- **Toast** — Fixed-position notification pill
- **Tabs** — Horizontal tab navigation
- **Table** — Data table with sortable columns
- **Marquee** — Infinite scrolling text banner

## Templates (Page-Level Wireframes)

- **MarketingPageTemplate** — Header organism + `<main>` slot + Footer organism
- **JobSeekerDashboardTemplate** — DashboardSidebar organism + Header organism + content area
- **JobListingTemplate** — Header organism + FilterPanel organism + grid of JobCard organisms + Footer organism
- **AuthForm** — Stateful authentication form organism (mode switching, social login, role picker)
- **AuthSidebar** — Marketing sidebar for auth page (features + testimonial)
- **AuthPageTemplate** — Two-column layout template accepting sidebar + form children
- **AdminDashboardTemplate** — DashboardSidebar organism + top bar + data tables/stats
- **EmployerDashboardTemplate** — DashboardSidebar organism + top bar + job management content
