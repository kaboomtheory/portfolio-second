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
  | 'surface-rule'
  | 'pastel-chip'
  | 'pastel-ink-contrast'
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
  paperSunk: string
  pastelPeach: string
  pastelInk: string
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
    var: '--paper',
    label: 'Base paper',
    group: 'Surfaces',
    light: '#ffffff',
    dark: '#212530',
    preview: 'surface-primary',
  },
  {
    var: '--paper-sunk',
    label: 'Sunk surface',
    group: 'Surfaces',
    light: '#f7f7f6',
    dark: '#181B24',
    preview: 'surface-rule',
  },
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
    light: '#ffd4b3',
    dark: '#f9c095',
    preview: 'surface-secondary',
  },
  {
    var: '--bg-tertiary',
    label: 'Tertiary surface',
    group: 'Surfaces',
    light: '#c5f0bd',
    dark: '#a8ec9c',
    preview: 'surface-tertiary',
  },
  {
    var: '--pastel-peach',
    label: 'Pastel peach tile',
    group: 'Surfaces',
    light: '#ffd4b3',
    dark: '#f9c095',
    preview: 'pastel-chip',
  },
  {
    var: '--pastel-mint',
    label: 'Pastel mint tile',
    group: 'Surfaces',
    light: '#c5f0bd',
    dark: '#a8ec9c',
    preview: 'pastel-chip',
  },
  {
    var: '--pastel-sky',
    label: 'Pastel sky tile',
    group: 'Surfaces',
    light: '#b0e6ff',
    dark: '#9edaf5',
    preview: 'pastel-chip',
  },
  {
    var: '--pastel-blush',
    label: 'Pastel blush tile',
    group: 'Surfaces',
    light: '#ffcaf3',
    dark: '#fbbcec',
    preview: 'pastel-chip',
  },
  {
    var: '--pastel-pink',
    label: 'Pastel pink alias',
    group: 'Surfaces',
    light: 'var(--pastel-blush)',
    dark: 'var(--pastel-blush)',
    preview: 'swatch-soft',
  },
  {
    var: '--pastel-ink',
    label: 'Ink on pastel tiles',
    group: 'Text & chrome',
    light: '#000000',
    dark: '#000000',
    preview: 'pastel-ink-contrast',
  },
  {
    var: '--pastel-ink-muted',
    label: 'Muted ink on pastels',
    group: 'Text & chrome',
    light: 'color-mix(in srgb, var(--pastel-ink) 62%, var(--paper))',
    dark: 'color-mix(in srgb, var(--pastel-ink) 62%, #ffffff)',
    preview: 'swatch-soft',
  },
  {
    var: '--surface-interactive',
    label: 'Interactive surface (pills, inputs)',
    group: 'Surfaces',
    light: '#b0e6ff',
    dark: '#9edaf5',
    preview: 'surface-interactive',
  },
  {
    var: '--ink',
    label: 'Base ink',
    group: 'Text & chrome',
    light: '#15120f',
    dark: '#EEF2FF',
    preview: 'text-primary',
  },
  {
    var: '--ink-mid',
    label: 'Mid ink',
    group: 'Text & chrome',
    light: '#6b645b',
    dark: '#AABCD8',
    preview: 'text-secondary',
  },
  {
    var: '--ink-muted',
    label: 'Muted ink',
    group: 'Text & chrome',
    light: '#a69c8e',
    dark: '#8092B3',
    preview: 'text-muted',
  },
  {
    var: '--fg-primary',
    label: 'Primary text (ink)',
    group: 'Text & chrome',
    light: 'var(--ink)',
    dark: 'var(--ink)',
    preview: 'text-primary',
  },
  {
    var: '--fg-secondary',
    label: 'Secondary text',
    group: 'Text & chrome',
    light: 'var(--ink-mid)',
    dark: 'var(--ink-mid)',
    preview: 'text-secondary',
  },
  {
    var: '--fg-muted',
    label: 'Muted text',
    group: 'Text & chrome',
    light: 'var(--ink-muted)',
    dark: 'var(--ink-muted)',
    preview: 'text-muted',
  },
  {
    var: '--rule-token',
    label: 'Canonical hairline token',
    group: 'Text & chrome',
    light: '#15120f',
    dark: 'color-mix(in srgb, var(--ink) 22%, var(--paper))',
    preview: 'hairline-border',
  },
  {
    var: '--border',
    label: 'Hairline border',
    group: 'Text & chrome',
    light: 'var(--rule-token)',
    dark: 'var(--rule-token)',
    preview: 'hairline-border',
  },
  {
    var: '--rule',
    label: 'Divider rule',
    group: 'Text & chrome',
    light: 'var(--rule-token)',
    dark: 'var(--rule-token)',
    preview: 'hairline-border',
  },
  {
    var: '--rule-soft',
    label: 'Soft divider rule',
    group: 'Text & chrome',
    light: 'color-mix(in srgb, var(--ink) 18%, var(--paper))',
    dark: 'color-mix(in srgb, var(--ink) 18%, var(--paper))',
    preview: 'swatch-soft',
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
    var: '--signal-ink',
    label: 'Text on signal surfaces',
    group: 'Accent',
    light: '#ffffff',
    dark: '#212530',
    preview: 'on-accent',
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
    light: 'var(--signal-ink)',
    dark: 'var(--signal-ink)',
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
    var: '--emphasis',
    label: 'Focus and emphasis',
    group: 'Accent',
    light: 'var(--signal)',
    dark: 'var(--signal)',
    preview: 'swatch-strong',
  },
  {
    var: '--emphasis-soft',
    label: 'Dark focus/emphasis soft',
    group: 'Accent',
    light: 'var(--accent-soft)',
    dark: 'var(--accent-soft)',
    preview: 'swatch-soft',
  },
  {
    var: '--status-available',
    label: 'Availability label',
    group: 'Status',
    light: '#6b645b',
    dark: '#AABCD8',
    preview: 'status-pill',
  },
  {
    var: '--status-online',
    label: 'Online status dot',
    group: 'Status',
    light: '#22c55e',
    dark: '#22c55e',
    preview: 'status-pill',
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
    var: '--btn-primary-bg',
    label: 'Primary button background',
    group: 'Buttons',
    light: '#d4522f',
    dark: '#F1A06E',
    preview: 'swatch-strong',
  },
  {
    var: '--btn-primary-fg',
    label: 'Primary button text',
    group: 'Buttons',
    light: '#ffffff',
    dark: '#212530',
    preview: 'on-accent',
  },
  {
    var: '--btn-attention-bg',
    label: 'Attention button background',
    group: 'Buttons',
    light: '#ffd4b3',
    dark: '#f9c095',
    preview: 'attention-button-bg',
  },
  {
    var: '--btn-attention-fg',
    label: 'Attention button text',
    group: 'Buttons',
    light: '#000000',
    dark: '#000000',
    preview: 'attention-button-fg',
  },
  {
    var: '--project-card-surface',
    label: 'Project card surface',
    group: 'Surfaces',
    light: '#ffd4b3',
    dark: '#f9c095',
    preview: 'surface-secondary',
  },
  {
    var: '--project-card-surface-hover',
    label: 'Project card hover surface',
    group: 'Surfaces',
    light: 'color-mix(in srgb, var(--pastel-peach) 92%, var(--pastel-ink))',
    dark: 'color-mix(in srgb, var(--pastel-peach) 92%, var(--pastel-ink))',
    preview: 'surface-secondary',
  },
  {
    var: '--project-card-border',
    label: 'Project card border',
    group: 'Text & chrome',
    light: 'color-mix(in srgb, var(--pastel-ink) 14%, var(--project-card-surface, var(--pastel-peach)))',
    dark: 'color-mix(in srgb, var(--pastel-ink) 14%, var(--project-card-surface, var(--pastel-peach)))',
    preview: 'hairline-border',
  },
]
