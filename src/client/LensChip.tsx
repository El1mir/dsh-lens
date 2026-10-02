import { useState } from 'react'
import {
  IconChevronDownOutline14,
  Menu,
  StateDot,
  Tooltip,
} from '@deepseek-ai/dsh-client-ui-primitives'
import { chipLabel, statusDot } from './counts.js'
import css from './LensChip.module.css'
import { translate, type Translate } from './locales.js'
import { buildLensMenuItems, resolveMenuTarget } from './menu-items.js'
import { openPath } from './counts.js'
import { readLensStatus } from './status-view.js'

interface ChipProps {
  useProjection?: (key: string) => unknown
  openFile?: (path: string, line?: number) => void
  t?: Translate
}

export function LensChip({ useProjection, openFile, t = translate }: ChipProps) {
  const status = readLensStatus(useProjection)
  const [open, setOpen] = useState(false)
  if (!status || !status.visible) return null

  const label = chipLabel(status, t)
  const items = buildLensMenuItems(status, t)

  return (
    <div className={css.root}>
      <Menu
        open={open}
        onClose={() => setOpen(false)}
        items={items}
        onSelect={(id) => {
          const target = resolveMenuTarget(status, id)
          if (target) openPath(openFile, target.path, target.line)
          setOpen(false)
        }}
        portal
        compact
        align="start"
        side="bottom"
        anchor={(
          <Tooltip label={label} side="bottom" delayMs={400}>
            <button
              type="button"
              className={css.trigger}
              aria-expanded={open}
              aria-label={t('menu.aria')}
              onClick={() => setOpen(current => !current)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <circle cx="10.5" cy="10.5" r="6.5" />
                <path d="m16 16 5 5M7.5 10.5h6M10.5 7.5v6" />
              </svg>
              <span>Lens</span>
              {status.enabled && statusDot(status) === 'done' ? (
                <svg className={css.success} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="m5 12 4 4L19 6" />
                </svg>
              ) : <StateDot state={statusDot(status)} className={css.triggerDot} />}
              {(status.errors > 0 || status.warnings > 0 || !status.enabled) && <span className={css.count}>{label}</span>}
              <span className={css.srOnly} role="status" aria-atomic="true">{label}</span>
              <IconChevronDownOutline14 className={open ? css.triggerOpen : undefined} />
            </button>
          </Tooltip>
        )}
      />
    </div>
  )
}
