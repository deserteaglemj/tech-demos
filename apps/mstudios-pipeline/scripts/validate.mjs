import { chromium } from "playwright"
import path from "node:path"
import fs from "node:fs"

const outDir = "/opt/cursor/artifacts"
const shotDir = path.join(outDir, "screenshots")
const videoDir = path.join(outDir, "playwright-video")
fs.mkdirSync(shotDir, { recursive: true })
fs.mkdirSync(videoDir, { recursive: true })

const browser = await chromium.launch({ headless: true })
const context = await browser.newContext({
  viewport: { width: 1440, height: 960 },
  recordVideo: { dir: videoDir, size: { width: 1440, height: 960 } },
})
const page = await context.newPage()

try {
  await page.goto("http://127.0.0.1:5174/", { waitUntil: "networkidle" })
  await page.evaluate(() => localStorage.clear())
  await page.reload({ waitUntil: "networkidle" })
  await page.waitForSelector("text=Mstudios Pipeline")
  await page.waitForTimeout(500)

  // Ensure drawer closed
  if (await page.locator("aside").count()) {
    await page.keyboard.press("Escape")
    await page.getByLabel("Close drawer").click({ timeout: 2000 }).catch(() => {})
    await page.waitForTimeout(300)
  }

  await page.screenshot({
    path: path.join(shotDir, "mstudios-pipeline-command.png"),
    fullPage: true,
  })
  console.log("shot command")

  await page.getByRole("button", { name: "Board", exact: true }).click()
  await page.waitForTimeout(700)
  await page.screenshot({ path: path.join(shotDir, "mstudios-pipeline-board.png") })
  console.log("shot board")

  await page.getByRole("button", { name: "Command", exact: true }).click()
  await page.waitForTimeout(500)

  const austinPanel = page
    .locator("section")
    .filter({ hasText: "City gates" })
    .locator("div.rounded-lg.border")
    .filter({ hasText: "Austin" })
    .first()
  await austinPanel.locator('input[type="checkbox"]').nth(1).check()
  await page.waitForTimeout(500)
  await page.screenshot({ path: path.join(shotDir, "mstudios-pipeline-gates-open.png") })
  console.log("shot gates")

  await page.getByRole("button", { name: "Table", exact: true }).click()
  await page.waitForTimeout(400)
  await page.getByPlaceholder("Business, batch, phone…").fill("Demo Cuts")
  await page.waitForTimeout(400)
  await page.locator("tbody tr", { hasText: "Demo Cuts ATX" }).click()
  await page.waitForSelector("aside")

  async function clickAdvance() {
    const btn = page.locator("aside").getByRole("button", { name: /^Advance to/ })
    if ((await btn.count()) === 0) return false
    if (await btn.isDisabled()) {
      const title = await btn.getAttribute("title")
      console.log("advance disabled:", title)
      return false
    }
    const label = await btn.innerText()
    await btn.click()
    console.log("clicked", label)
    await page.waitForTimeout(600)
    return true
  }

  await clickAdvance() // -> Payment
  await clickAdvance() // -> Postcard
  await page.locator("aside label", { hasText: "Postcard print-ready" }).click()
  await page.waitForTimeout(400)
  await clickAdvance() // -> Mail
  await page
    .locator("aside label")
    .filter({ hasText: "Payment status" })
    .locator("select")
    .selectOption("paid")
  await page.waitForTimeout(500)
  await clickAdvance() // -> Won

  await page.screenshot({ path: path.join(shotDir, "mstudios-pipeline-demo-cuts-won.png") })
  console.log("shot won")

  await page.locator("aside").getByLabel("Close deal").click({ timeout: 5000 })
  await page.waitForTimeout(400)

  await page.getByPlaceholder("Business, batch, phone…").fill("Will")
  await page.waitForTimeout(400)
  await page.locator("tbody tr", { hasText: "Will's Lawn Care" }).click()
  await page.waitForSelector("aside")
  await page.locator("aside select").last().selectOption("stage4")
  await page.waitForTimeout(1000)
  await page.screenshot({ path: path.join(shotDir, "mstudios-pipeline-gate-block.png") })
  console.log("shot gate block")
} catch (err) {
  console.error("VALIDATION_ERROR", err)
  await page.screenshot({
    path: path.join(shotDir, "mstudios-pipeline-error.png"),
    fullPage: true,
  })
} finally {
  const videoPath = await page.video()?.path()
  await context.close()
  await browser.close()
  if (videoPath && fs.existsSync(videoPath)) {
    const dest = path.join(outDir, "mstudios_pipeline_demo.webm")
    fs.copyFileSync(videoPath, dest)
    console.log("VIDEO", dest)
  }
  for (const f of fs.readdirSync(shotDir).filter((n) => n.startsWith("mstudios-pipeline"))) {
    console.log("SHOT", path.join(shotDir, f))
  }
}
