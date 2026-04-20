/**
 * Canonical palette tokens mirrored from `app/assets/css/main.css`
 * (`:root` / `:root.dark`). Keep defaults in sync when editing global CSS.
 */
export type ThemeColorGroup =
  | 'Surfaces'
  | 'Text & chrome'
  | 'Accent'
  | 'Status'
  | 'Buttons'

/** Mini UI pattern shown beside each picker in Theme lab */
export type ThemePreviewKind =
  | 'shell'
  | 'surface-primary'
  | 'surface-secondary'
  | 'surface-tertiary'
  | 'surface-interactive'
  | 'text-primary'
  | 'text-secondary'
  | 'text-muted'
  | 'hairline-border'
  | 'theme-knob'
  | 'link-accent'
  | 'link-accent-soft'
  | 'swatch-strong'
  | 'swatch-soft'
  | 'on-accent'
  | 'on-accent-muted'
  | 'neon-dot'
  | 'status-pill'
  | 'danger-chip'
  | 'attention-button-bg'
  | 'attention-button-fg'

export interface ThemePreviewContext {
  shell: string
  bgPrimary: string
  bgSecondary: string
  bgTertiary: string
  surfaceInteractive: string
  fgPrimary: string
  accent: string
  border: string
  attentionBg: string
  attentionFg: string
}

export interface ThemeColorToken {
  var: string
  label: string
  group: ThemeColorGroup
  light: string
  dark: string
  preview: ThemePreviewKind
}

export const THEME_COLOR_TOKENS: ThemeColorToken[] = [
  {
    var: '--shell-ui-bg',
    label: 'Shell / html background',
    group: 'Surfaces',
    light: '#f4efe4',
    dark: '#0b0a08',
    preview: 'shell',
  },
  {
    var: '--bg-primary',
    label: 'Primary surface',
    group: 'Surfaces',
    light: '#f4efe4',
    dark: '#0b0a08',
    preview: 'surface-primary',
  },
  {
    var: '--bg-secondary',
    label: 'Secondary surface',
    group: 'Surfaces',
    light: '#ece5d5',
    dark: '#14120f',
    preview: 'surface-secondary',
  },
  {
    var: '--bg-tertiary',
    label: 'Tertiary surface',
    group: 'Surfaces',
    light: '#e0d8c4',
    dark: '#1d1a16',
    preview: 'surface-tertiary',
  },
  {
    var: '--surface-interactive',
    label: 'Interactive surface (pills, inputs)',
    group: 'Surfaces',
    light: '#ece5d5',
    dark: '#1d1a16',
    preview: 'surface-interactive',
  },
  {
    var: '--fg-primary',
    label: 'Primary text (ink)',
    group: 'Text & chrome',
    light: '#15120f',
    dark: '#ece4d4',
    preview: 'text-primary',
  },
  {
    var: '--fg-secondary',
    label: 'Secondary text',
    group: 'Text & chrome',
    light: '#6b645b',
    dark: '#a89f8e',
    preview: 'text-secondary',
  },
  {
    var: '--fg-muted',
    label: 'Muted text',
    group: 'Text & chrome',
    light: '#a69c8e',
    dark: '#6b645b',
    preview: 'text-muted',
  },
  {
    var: '--border',
    label: 'Hairline border',
    group: 'Text & chrome',
    light: '#15120f',
    dark: '#ece4d4',
    preview: 'hairline-border',
  },
  {
    var: '--theme-toggle-knob-bg',
    label: 'Theme toggle knob',
    group: 'Text & chrome',
    light: '#f4efe4',
    dark: '#ece4d4',
    preview: 'theme-knob',
  },
  {
    var: '--theme-toggle-knob-fg',
    label: 'Theme toggle knob icon',
    group: 'Text & chrome',
    light: '#15120f',
    dark: '#0b0a08',
    preview: 'text-primary',
  },
  {
    var: '--theme-toggle-rail-emphasis',
    label: 'Theme toggle rail (active icon)',
    group: 'Text & chrome',
    light: '#15120f',
    dark: '#ece4d4',
    preview: 'text-secondary',
  },
  {
    var: '--theme-toggle-rail-muted',
    label: 'Theme toggle rail (inactive icon)',
    group: 'Text & chrome',
    light: '#6b645b',
    dark: '#6b645b',
    preview: 'text-muted',
  },
  {
    var: '--signal',
    label: 'Signal (terracotta)',
    group: 'Accent',
    light: '#c5583b',
    dark: '#e87a5b',
    preview: 'link-accent',
  },
  {
    var: '--accent',
    label: 'Accent (alias of signal)',
    group: 'Accent',
    light: '#c5583b',
    dark: '#e87a5b',
    preview: 'link-accent',
  },
  {
    var: '--accent-soft',
    label: 'Accent soft (hover / mix)',
    group: 'Accent',
    light: '#b84d32',
    dark: '#ef9374',
    preview: 'link-accent-soft',
  },
  {
    var: '--on-accent',
    label: 'Text on accent',
    group: 'Accent',
    light: '#ffffff',
    dark: '#0b0a08',
    preview: 'on-accent',
  },
  {
    var: '--on-accent-muted',
    label: 'Muted text on accent',
    group: 'Accent',
    light: '#f4efe4',
    dark: '#14120f',
    preview: 'on-accent-muted',
  },
  {
    var: '--danger',
    label: 'Danger / error',
    group: 'Status',
    light: '#b04836',
    dark: '#e5836f',
    preview: 'danger-chip',
  },
  {
    var: '--btn-attention-bg',
    label: 'Attention button background',
    group: 'Buttons',
    light: '#c5583b',
    dark: '#e87a5b',
    preview: 'attention-button-bg',
  },
  {
    var: '--btn-attention-fg',
    label: 'Attention button text',
    group: 'Buttons',
    light: '#ffffff',
    dark: '#0b0a08',
    preview: 'attention-button-fg',
  },
]
