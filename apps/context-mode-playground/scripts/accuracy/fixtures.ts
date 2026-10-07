import fs from "node:fs";
import path from "node:path";

export type GroundTruth = {
  log: {
    lineCount: number;
    errorCount: number;
    warnCount: number;
    errorLines: string[];
    statusHistogram: Record<string, number>;
    uniquePaths: string[];
    failureModes: Record<string, number>;
    maxDurationMs: number;
    checkoutErrorIds: string[];
  };
  orders: {
    count: number;
    totalRevenueCents: number;
    paidCount: number;
    refundedCount: number;
    topSku: string;
    topSkuQty: number;
    customerEmails: string[];
    orderIdsOver100: string[];
  };
  docs: {
    facts: Array<{ id: string; query: string; mustContain: string[] }>;
  };
};

export function buildAccuracyFixtures(dir: string): GroundTruth {
  fs.mkdirSync(dir, { recursive: true });
  fs.mkdirSync(path.join(dir, "docs"), { recursive: true });

  const errorLines: string[] = [];
  const statusHistogram: Record<string, number> = {};
  const failureModes: Record<string, number> = {};
  const paths = new Set<string>();
  const checkoutErrorIds: string[] = [];
  let warnCount = 0;
  let maxDurationMs = 0;
  const logLines: string[] = [];

  const pathPool = ["/api/users", "/api/orders", "/api/checkout", "/api/cart", "/api/catalog", "/api/health"];
  const failPool = [
    "db timeout",
    "payment gateway unavailable",
    "upstream reset",
    "inventory lock contended",
    "card declined",
  ];

  for (let i = 0; i < 2500; i++) {
    const p = pathPool[i % pathPool.length]!;
    paths.add(p);
    let level = "INFO";
    let status = 200;
    let extra = "";
    const duration = 1 + (i * 7) % 240;
    maxDurationMs = Math.max(maxDurationMs, duration);

    if (i % 61 === 0) {
      level = "ERROR";
      status = i % 2 === 0 ? 500 : 502;
      const mode = failPool[i % failPool.length]!;
      failureModes[mode] = (failureModes[mode] || 0) + 1;
      extra = ` error="${mode}"`;
      const id = `req_${String(i).padStart(4, "0")}`;
      const line = `2026-10-07T14:${String(Math.floor(i / 60) % 60).padStart(2, "0")}:${String(i % 60).padStart(2, "0")}Z ERROR request id=${id} path=${p} status=${status} duration=${duration}ms${extra}`;
      errorLines.push(line);
      if (p === "/api/checkout") checkoutErrorIds.push(id);
      logLines.push(line);
    } else if (i % 37 === 0) {
      level = "WARN";
      status = 429;
      warnCount += 1;
      logLines.push(
        `2026-10-07T14:${String(Math.floor(i / 60) % 60).padStart(2, "0")}:${String(i % 60).padStart(2, "0")}Z WARN  request id=req_${String(i).padStart(4, "0")} path=${p} status=${status} duration=${duration}ms`,
      );
    } else {
      logLines.push(
        `2026-10-07T14:${String(Math.floor(i / 60) % 60).padStart(2, "0")}:${String(i % 60).padStart(2, "0")}Z INFO  request id=req_${String(i).padStart(4, "0")} path=${p} status=${status} duration=${duration}ms`,
      );
    }
    statusHistogram[String(status)] = (statusHistogram[String(status)] || 0) + 1;
  }

  fs.writeFileSync(path.join(dir, "access.log"), logLines.join("\n") + "\n");

  // Orders JSON with known aggregates
  const skus = ["SKU-ALPHA", "SKU-BETA", "SKU-GAMMA", "SKU-DELTA"];
  const skuQty: Record<string, number> = {};
  const emails: string[] = [];
  const orderIdsOver100: string[] = [];
  let totalRevenueCents = 0;
  let paidCount = 0;
  let refundedCount = 0;
  const orders = [];

  for (let i = 0; i < 400; i++) {
    const sku = skus[i % skus.length]!;
    const qty = 1 + (i % 5);
    const unitCents = 1299 + (i % 17) * 50;
    const total = qty * unitCents;
    const status = i % 23 === 0 ? "refunded" : "paid";
    const email = `user${i % 40}@example.com`;
    const id = `ord_${String(i).padStart(4, "0")}`;
    if (status === "paid") {
      paidCount += 1;
      totalRevenueCents += total;
      skuQty[sku] = (skuQty[sku] || 0) + qty;
    } else {
      refundedCount += 1;
    }
    if (!emails.includes(email)) emails.push(email);
    if (total > 10000) orderIdsOver100.push(id);
    orders.push({ id, sku, qty, unitCents, totalCents: total, status, email });
  }

  let topSku = skus[0]!;
  let topSkuQty = 0;
  for (const [sku, q] of Object.entries(skuQty)) {
    if (q > topSkuQty) {
      topSku = sku;
      topSkuQty = q;
    }
  }

  fs.writeFileSync(path.join(dir, "orders.json"), JSON.stringify({ orders }, null, 2));

  const docs = {
    facts: [
      {
        id: "sla",
        query: "checkout SLA latency budget",
        mustContain: ["p99 under 350ms", "checkout"],
      },
      {
        id: "retry",
        query: "payment gateway retry policy",
        mustContain: ["3 retries", "exponential backoff", "jitter"],
      },
      {
        id: "secret-code",
        query: "incident runbook codeword",
        mustContain: ["CODEWORD-ORCA-77"],
      },
      {
        id: "owner",
        query: "oncall primary owner payments",
        mustContain: ["Avery Chen", "payments-oncall"],
      },
    ],
  };

  fs.writeFileSync(
    path.join(dir, "docs", "checkout-sla.md"),
    `# Checkout SLA

The checkout path must keep **p99 under 350ms**.

Retries against the payment gateway use **3 retries** with **exponential backoff** and **jitter**.

Incident runbook codeword: **CODEWORD-ORCA-77**.

Primary oncall for payments: **Avery Chen** (\`payments-oncall\`).
`,
  );

  fs.writeFileSync(
    path.join(dir, "docs", "inventory.md"),
    `# Inventory

SKU-ALPHA is the highest volume SKU in Q3 fixtures.

Do not confuse with payments. Inventory locks use lease=12s.
`,
  );

  fs.writeFileSync(
    path.join(dir, "docs", "red-herring.md"),
    `# Unrelated

This document mentions timeouts in a vacuum cleaner firmware context.
It should not be the top hit for payment gateway questions.
`,
  );

  const truth: GroundTruth = {
    log: {
      lineCount: logLines.length,
      errorCount: errorLines.length,
      warnCount,
      errorLines,
      statusHistogram,
      uniquePaths: [...paths].sort(),
      failureModes,
      maxDurationMs,
      checkoutErrorIds,
    },
    orders: {
      count: orders.length,
      totalRevenueCents,
      paidCount,
      refundedCount,
      topSku,
      topSkuQty,
      customerEmails: emails.sort(),
      orderIdsOver100,
    },
    docs,
  };

  fs.writeFileSync(path.join(dir, "ground-truth.json"), JSON.stringify(truth, null, 2));
  return truth;
}
