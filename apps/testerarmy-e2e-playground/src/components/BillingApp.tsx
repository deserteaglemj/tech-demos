import { useState, type RefObject } from 'react'
import type { Plan } from '../lib/types'

type Props = {
  scrambleLabels: boolean
  rootRef: RefObject<HTMLDivElement | null>
}

export function BillingApp({ scrambleLabels, rootRef }: Props) {
  const [plan, setPlan] = useState<Plan>('free')
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [invoicePreview, setInvoicePreview] = useState<string | null>(null)

  const upgradeLabel = scrambleLabels ? 'Go Pro now' : 'Upgrade to Pro'
  const confirmLabel = scrambleLabels ? 'Lock it in' : 'Confirm upgrade'
  const cancelLabel = scrambleLabels ? 'Not yet' : 'Keep Free'

  function confirmUpgrade() {
    setPlan('pro')
    setShowUpgradeModal(false)
    setInvoicePreview('Invoice preview · $12.40 prorated for 18 days remaining')
  }

  return (
    <div
      className="billing"
      ref={rootRef}
      data-plan={plan}
      data-scrambled={scrambleLabels ? 'true' : 'false'}
    >
      <div className="billing__chrome">
        <span className="billing__dot" />
        <span className="billing__dot" />
        <span className="billing__dot" />
        <span className="billing__url">/settings/billing</span>
      </div>

      <div className="billing__body">
        <p className="billing__eyebrow">Workspace</p>
        <h2 className="billing__title">Billing</h2>
        <p className="billing__lede">
          Manage the plan for Northwind Labs. Agent steps target the controls
          below by role and accessible name.
        </p>

        <div className="billing__plan">
          <div>
            <p className="billing__plan-label">Current plan</p>
            <p className="billing__plan-name" data-name="plan">
              {plan === 'pro' ? 'Pro' : 'Free'}
            </p>
          </div>
          {plan === 'free' ? (
            <button
              type="button"
              className="billing__cta"
              data-name={upgradeLabel}
              onClick={() => setShowUpgradeModal(true)}
            >
              {upgradeLabel}
            </button>
          ) : (
            <span className="billing__badge">Active</span>
          )}
        </div>

        {showUpgradeModal ? (
          <div className="billing__modal" role="dialog" aria-label="Upgrade plan">
            <p className="billing__modal-title">Upgrade to Pro</p>
            <p className="billing__modal-copy">
              Pro unlocks parallel agents, cache replay reports, and mobile
              engines. You will be billed a prorated amount for the rest of the
              cycle.
            </p>
            <div className="billing__modal-actions">
              <button
                type="button"
                className="billing__ghost"
                data-name={cancelLabel}
                onClick={() => setShowUpgradeModal(false)}
              >
                {cancelLabel}
              </button>
              <button
                type="button"
                className="billing__cta"
                data-name={confirmLabel}
                onClick={confirmUpgrade}
              >
                {confirmLabel}
              </button>
            </div>
          </div>
        ) : null}

        {invoicePreview ? (
          <p className="billing__invoice" data-invoice>
            {invoicePreview}
          </p>
        ) : null}

        <p className="billing__status" role="status">
          {plan === 'pro' ? 'Pro' : 'Free'}
        </p>
      </div>
    </div>
  )
}
