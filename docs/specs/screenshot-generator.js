const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function takeScreenshot(htmlPath, outputPath, viewport = { width: 1440, height: 900 }) {
    const browser = await chromium.launch();
    const context = await browser.newContext({ viewport });
    const page = await context.newPage();

    const absolutePath = path.resolve(htmlPath);
    await page.goto(`file://${absolutePath}`, { waitUntil: 'networkidle' });

    // Wait a bit for fonts to load
    await page.waitForTimeout(500);

    await page.screenshot({
        path: outputPath,
        fullPage: true
    });

    await browser.close();
    console.log(`Screenshot saved to: ${outputPath}`);
}

async function main() {
    const specs = [
        { html: 'home-search/mockup-home.html', output: 'home-search/mockup-home.png' },
        { html: 'vehicle-listings/mockup-listings.html', output: 'vehicle-listings/mockup-listings.png' },
        { html: 'vehicle-details/mockup-details.html', output: 'vehicle-details/mockup-details.png' },
        { html: 'financing/mockup-financing.html', output: 'financing/mockup-financing.png' },
        { html: 'customer-account/mockup-account.html', output: 'customer-account/mockup-account.png' },
        { html: 'checkout-purchase/mockup-checkout.html', output: 'checkout-purchase/mockup-checkout.png' },
        { html: 'trade-in/mockup-tradein.html', output: 'trade-in/mockup-tradein.png' },
        { html: 'delivery/mockup-delivery.html', output: 'delivery/mockup-delivery.png' },
        { html: 'test-ownership/mockup-testownership.html', output: 'test-ownership/mockup-testownership.png' },
        { html: 'warranty/mockup-warranty.html', output: 'warranty/mockup-warranty.png' },
    ];

    const baseDir = __dirname;

    for (const spec of specs) {
        const htmlPath = path.join(baseDir, spec.html);
        const outputPath = path.join(baseDir, spec.output);

        if (fs.existsSync(htmlPath)) {
            try {
                await takeScreenshot(htmlPath, outputPath);
            } catch (err) {
                console.error(`Error processing ${spec.html}:`, err.message);
            }
        } else {
            console.log(`Skipping ${spec.html} - file not found`);
        }
    }
}

main().catch(console.error);
