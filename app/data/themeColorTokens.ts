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
    light: '#ffffff',
    dark: '#212530',
    preview: 'shell',
  },
  {
    var: '--bg-primary',
    label: 'Primary surface',
    group: 'Surfaces',
    light: '#ffffff',
    dark: '#212530',
    preview: 'surface-primary',
  },
  {
    var: '--bg-secondary',
    label: 'Secondary surface',
    group: 'Surfaces',
    light: '#ffe9cf',
    dark: '#F1A06E',
    preview: 'surface-secondary',
  },
  {
    var: '--bg-tertiary',
    label: 'Tertiary surface',
    group: 'Surfaces',
    light: '#def7dc',
    dark: '#C3F27E',
    preview: 'surface-tertiary',
  },
  {
    var: '--surface-interactive',
    label: 'Interactive surface (pills, inputs)',
    group: 'Surfaces',
    light: '#cfeeff',
    dark: '#A5D9F7',
    preview: 'surface-interactive',
  },
  {
    var: '--fg-primary',
    label: 'Primary text (ink)',
    group: 'Text & chrome',
    light: '#15120f',
    dark: '#EEF2FF',
    preview: 'text-primary',
  },
  {
    var: '--fg-secondary',
    label: 'Secondary text',
    group: 'Text & chrome',
    light: '#6b645b',
    dark: '#AABCD8',
    preview: 'text-secondary',
  },
  {
    var: '--fg-muted',
    label: 'Muted text',
    group: 'Text & chrome',
    light: '#a69c8e',
    dark: '#7888A8',
    preview: 'text-muted',
  },
  {
    var: '--border',
    label: 'Hairline border',
    group: 'Text & chrome',
    light: '#15120f',
    dark: '#3E4A5E',
    preview: 'hairline-border',
  },
  {
    var: '--theme-toggle-knob-bg',
    label: 'Theme toggle knob',
    group: 'Text & chrome',
    light: '#ffffff',
    dark: '#EEF2FF',
    preview: 'theme-knob',
  },
  {
    var: '--theme-toggle-knob-fg',
    label: 'Theme toggle knob icon',
    group: 'Text & chrome',
    light: '#15120f',
    dark: '#212530',
    preview: 'text-primary',
  },
  {
    var: '--theme-toggle-rail-emphasis',
    label: 'Theme toggle rail (active icon)',
    group: 'Text & chrome',
    light: '#15120f',
    dark: '#EEF2FF',
    preview: 'text-secondary',
  },
  {
    var: '--theme-toggle-rail-muted',
    label: 'Theme toggle rail (inactive icon)',
    group: 'Text & chrome',
    light: '#6b645b',
    dark: '#AABCD8',
    preview: 'text-muted',
  },
  {
    var: '--signal',
    label: 'Signal (default sky; sections override)',
    group: 'Accent',
    light: '#d4522f',
    dark: '#F1A06E',
    preview: 'link-accent',
  },
  {
    var: '--accent',
    label: 'Accent (alias of signal)',
    group: 'Accent',
    light: '#d4522f',
    dark: '#F1A06E',
    preview: 'link-accent',
  },
  {
    var: '--accent-soft',
    label: 'Accent soft (hover / mix)',
    group: 'Accent',
    light: '#bc4a2b',
    dark: '#C07850',
    preview: 'link-accent-soft',
  },
  {
    var: '--on-accent',
    label: 'Text on accent',
    group: 'Accent',
    light: '#ffffff',
    dark: '#212530',
    preview: 'on-accent',
  },
  {
    var: '--on-accent-muted',
    label: 'Muted text on accent',
    group: 'Accent',
    light: '#ffffff',
    dark: '#181B24',
    preview: 'on-accent-muted',
  },
  {
    var: '--danger',
    label: 'Danger / error',
    group: 'Status',
    light: '#c44a34',
    dark: '#ef7b65',
    preview: 'danger-chip',
  },
  {
    var: '--btn-attention-bg',
    label: 'Attention button background',
    group: 'Buttons',
    light: '#ffe9cf',
    dark: '#F1A06E',
    preview: 'attention-button-bg',
  },
  {
    var: '--btn-attention-fg',
    label: 'Attention button text',
    group: 'Buttons',
    light: '#000000',
    dark: '#212530',
    preview: 'attention-button-fg',
  },
]
