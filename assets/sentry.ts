import type { Event, EventHint } from '@sentry/browser'
import * as Sentry from '@sentry/browser'
import { Severity } from '@sentry/browser'
import { Integrations } from '@sentry/tracing'

const isDebug = process.env.NODE_ENV === 'development'
Sentry.init({
  dsn: 'https://76cf789b5653401dabc7b0349586fedf@sentry.io/1867616',
  release: process.env.APP_VERSION,
  integrations: [new Integrations.BrowserTracing()],
  tracesSampleRate: 0.3,
  // @ts-ignore
  org: 'gamesh',
  project: 'dimauta',
  dryRun: isDebug,
  debug: isDebug,
  beforeSend(event: Event, hint?: EventHint): PromiseLike<Event | null> | Event | null {
    typeof ga === 'function' && ga('send', 'exception', {
      'exDescription': event.message,
      'exFatal': event.level === Severity.Fatal
    })
    return event
  },
})
