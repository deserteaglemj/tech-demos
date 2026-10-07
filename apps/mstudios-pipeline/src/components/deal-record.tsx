import { format } from "date-fns"
import { XIcon } from "lucide-react"

import { Badge } from "@/components/reui/badge"
import { Button } from "@/components/ui/button"
import {
  FitBadge,
  OwnerAvatar,
  StageBadge,
  VerticalTag,
  WebsiteStatusBadge,
} from "@/components/deal-chrome"
import type { Deal } from "@/data/deals"

export function DealRecord({
  deal,
  onClose,
}: {
  deal: Deal
  onClose: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40">
      <button
        type="button"
        className="flex-1"
        aria-label="Close record"
        onClick={onClose}
      />
      <aside className="bg-background flex h-full w-full max-w-lg flex-col border-l shadow-xl">
        <header className="flex items-start justify-between gap-3 border-b px-5 py-4">
          <div className="min-w-0 space-y-2">
            <h2 className="text-lg font-semibold">{deal.businessName}</h2>
            <div className="flex flex-wrap items-center gap-2">
              <StageBadge stage={deal.stage} />
              <WebsiteStatusBadge status={deal.websiteStatus} />
              <FitBadge fit={deal.fit} score={deal.fitScore} />
            </div>
            <p className="text-muted-foreground text-sm">
              {deal.city}
              {deal.phone ? ` · ${deal.phone}` : ""}
            </p>
          </div>
          <Button variant="outline" size="icon-sm" onClick={onClose} aria-label="Close">
            <XIcon />
          </Button>
        </header>

        <div className="flex-1 space-y-5 overflow-y-auto px-5 py-4">
          <section className="space-y-2">
            <h3 className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
              SEO note
            </h3>
            <p className="text-sm leading-relaxed">{deal.seo}</p>
          </section>

          <section className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <div className="text-muted-foreground text-xs">Their website</div>
              {deal.listedWebsite ? (
                <a
                  className="text-primary break-all underline-offset-2 hover:underline"
                  href={deal.listedWebsite}
                  target="_blank"
                  rel="noreferrer"
                >
                  {deal.listedWebsite.replace(/^https?:\/\//, "")}
                </a>
              ) : (
                <div>None listed</div>
              )}
            </div>
            <div>
              <div className="text-muted-foreground text-xs">Mstudios preview</div>
              {deal.previewUrl ? (
                <a
                  className="text-primary underline-offset-2 hover:underline"
                  href={deal.previewUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open preview
                </a>
              ) : (
                <div>Not published</div>
              )}
            </div>
            <div>
              <div className="text-muted-foreground text-xs">Payment status</div>
              <div>None</div>
            </div>
            <div>
              <div className="text-muted-foreground text-xs">Last payment</div>
              <div>{deal.lastPayment ?? "—"}</div>
            </div>
            <div className="col-span-2">
              <div className="text-muted-foreground text-xs">Contract</div>
              {deal.contractUrl ? (
                <a className="text-primary underline" href={deal.contractUrl}>
                  Open contract
                </a>
              ) : (
                <div>No signed contract on file</div>
              )}
            </div>
          </section>

          <section className="flex flex-wrap items-center gap-3 text-sm">
            <OwnerAvatar owner={deal.owner} showName />
            <VerticalTag vertical={deal.vertical} />
            <Badge variant="secondary">{deal.findBatch}</Badge>
            {deal.rating != null && (
              <span className="text-muted-foreground">
                {deal.rating} · {deal.reviews ?? 0} reviews
              </span>
            )}
          </section>

          {deal.address && (
            <p className="text-muted-foreground text-sm">{deal.address}</p>
          )}
          {deal.hours && (
            <p className="text-muted-foreground text-sm">Hours: {deal.hours}</p>
          )}

          <section className="flex flex-wrap gap-3 text-sm">
            {deal.recordUrl && (
              <a
                className="text-primary underline-offset-2 hover:underline"
                href={deal.recordUrl}
                target="_blank"
                rel="noreferrer"
              >
                Notion record
              </a>
            )}
            {deal.sourceUrl && (
              <a
                className="text-primary underline-offset-2 hover:underline"
                href={deal.sourceUrl}
                target="_blank"
                rel="noreferrer"
              >
                Source listing
              </a>
            )}
          </section>

          <section>
            <h3 className="text-muted-foreground mb-2 text-xs font-semibold tracking-wide uppercase">
              Relationship history
            </h3>
            <ol className="space-y-2">
              {deal.history.map((event) => (
                <li key={`${event.at}-${event.kind}`} className="rounded-lg border px-3 py-2">
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="font-semibold">{event.kind}</span>
                    <span className="text-muted-foreground">
                      {format(new Date(event.at), "MMM d, yyyy")}
                    </span>
                  </div>
                  <p className="mt-1 text-sm">{event.detail}</p>
                </li>
              ))}
            </ol>
          </section>
        </div>
      </aside>
    </div>
  )
}
