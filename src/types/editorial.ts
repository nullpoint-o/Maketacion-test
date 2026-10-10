export type EditorialBlockType =
  | 'chapter-opener'
  | 'section-heading'
  | 'paragraph'
  | 'pull-quote'
  | 'callout'
  | 'key-concept'
  | 'data-table'
  | 'infographic'
  | 'section-summary';

export interface MarginNote {
  id: string;
  referenceIndex: string;
  label: string;
  text: string;
}

export interface TableData {
  caption: string;
  source?: string;
  headers: string[];
  rows: string[][];
}

export interface InfographicNode {
  step: string;
  title: string;
  detail: string;
  metric?: string;
}

export interface InfographicData {
  kicker: string;
  title: string;
  visualSuggestion: string;
  nodes: InfographicNode[];
}

export interface EditorialBlock {
  id: string;
  type: EditorialBlockType;
  /** Roman or numeric chapter designation for chapter-opener, or section index */
  indexLabel?: string;
  /** Subtitle or kicker text */
  kicker?: string;
  /** Main text or title — preserves verbatim Word manuscript wording */
  content: string;
  /** Secondary body text for callouts, key-concepts, chapter openers, or summaries */
  secondaryContent?: string;
  /** Bullet items for section summaries or key concepts */
  bulletPoints?: string[];
  /** Whether paragraph should render an initial drop cap */
  dropCap?: boolean;
  /** Associated margin note aligned horizontally in the right 30% rail */
  marginNote?: MarginNote;
  /** Structured table data when type === 'data-table' */
  tableData?: TableData;
  /** Structured conceptual infographic when type === 'infographic' */
  infographicData?: InfographicData;
}

export interface EditorialDocument {
  title: string;
  subtitle: string;
  collectionName: string;
  editionMeta: string;
  blocks: EditorialBlock[];
}

export type PaletteId = 'oxford-gold' | 'Warm-terracotta' | 'slate-monograph';

export interface EditorialPalette {
  id: PaletteId;
  name: string;
  description: string;
  paperBg: string;
  secondarySurface: string;
  inkPrimary: string;
  inkSecondary: string;
  inkMuted: string;
  borderHairline: string;
  accentPrimary: string;
  accentSecondary: string;
  chapterPlateBg: string;
  chapterPlateText: string;
}
