const { BetaAnalyticsDataClient } = require('@google-analytics/data');
require('dotenv').config();
const client = new BetaAnalyticsDataClient({ keyFilename: './saju-analytics-key.json' });
async function run() {
    try {
        const [response] = await client.runReport({
            property: `properties/${process.env.GA4_PROPERTY_ID}`,
            dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
            metrics: [{ name: 'activeUsers' }, { name: 'newUsers' }, { name: 'screenPageViews' }],
        });
        console.log("=== GA4 Traffic Report (Last 30 Days) ===");
        console.log(`Active Users: ${response.rows[0]?.metricValues[0].value || 0}`);
        console.log(`New Users: ${response.rows[0]?.metricValues[1].value || 0}`);
        console.log(`Page Views: ${response.rows[0]?.metricValues[2].value || 0}`);
    } catch (e) { console.error(e); }
}
run();
