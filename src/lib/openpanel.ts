import { OpenPanel } from "@openpanel/web"

const clientId = process.env.NEXT_PUBLIC_OPENPANEL_CLIENT_ID
const enabled = Boolean(clientId) && process.env.NODE_ENV === "production"

/**
 * A blocked `/track` call is retried four times and then logged with
 * `console.error` from inside the SDK, which there is no option to quiet. That
 * is every local run, where no client id is configured, so `filter` keeps the
 * request from being made at all rather than letting it fail noisily.
 */
export const op = new OpenPanel({
  clientId: clientId ?? "",
  trackScreenViews: enabled,
  filter: () => enabled,
})
