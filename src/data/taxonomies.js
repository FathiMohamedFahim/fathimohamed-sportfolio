// Shared reference lists for tools and project categories — imported by
// both the public site (ToolsMarquee) and the admin panel (ProjectsEditor's
// dropdowns/chip pickers), so there's one place to add a tool or category
// rather than several hand-copied lists that can silently drift apart.
//
// PROJECT_CATEGORIES (slugs, used for filtering/matching) and
// PROJECT_CATEGORY_LABELS (display text) are deliberately two separate
// lists, not a 1:1 mapping — real project data shows the same category
// slug legitimately needs different display labels depending on context
// (e.g. "branding" covers both "Branding & Logo Design" and "Branding &
// Social Media" projects), so auto-deriving one from the other would be
// incorrect, not just redundant.

export const TOOLS = [
  'Photoshop',
  'Illustrator',
  'InDesign',
  'Lightroom',
  'Premiere Pro',
  'After Effects',
  'Canva',
  'Figma',
  'CorelDRAW',
]

export const PROJECT_CATEGORIES = ['branding', 'social', 'book-cover']

export const PROJECT_CATEGORY_LABELS = [
  'Branding & Logo Design',
  'Branding & Social Media',
  'Social Media Design',
  'Book Cover',
]
