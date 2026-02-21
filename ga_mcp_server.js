const { Server } = require("@modelcontextprotocol/sdk/server/index.js");
const { StdioServerTransport } = require("@modelcontextprotocol/sdk/server/stdio.js");
const {
    CallToolRequestSchema,
    ListToolsRequestSchema,
} = require("@modelcontextprotocol/sdk/types.js");
const { BetaAnalyticsDataClient } = require('@google-analytics/data');
require('dotenv').config();

// Initialize the GA4 Client with the Service Account JSON key
const analyticsDataClient = new BetaAnalyticsDataClient({
    keyFilename: './saju-analytics-key.json',
});

// Hardcoded for saju-deep.com or prompt-passed
// The property ID. We can extract this if needed, but for now we'll accept it via the tool
const propertyId = process.env.GA4_PROPERTY_ID || '';

const server = new Server(
    {
        name: "google-analytics-mcp",
        version: "1.0.0",
    },
    {
        capabilities: {
            tools: {},
        },
    }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: [
            {
                name: "get_website_traffic",
                description: "Get website traffic (Active Users, New Users, Screen Page Views, and Total Revenue) from Google Analytics 4 for a given date range.",
                inputSchema: {
                    type: "object",
                    properties: {
                        propertyId: {
                            type: "string",
                            description: "The GA4 Property ID (e.g. '123456789'). If not provided, uses the environment variable GA4_PROPERTY_ID.",
                        },
                        startDate: {
                            type: "string",
                            description: "Start date in 'YYYY-MM-DD' format, or relative metrics like 'today', 'yesterday', or '7daysAgo'.",
                        },
                        endDate: {
                            type: "string",
                            description: "End date in 'YYYY-MM-DD' format, or relative metrics like 'today' or 'yesterday'.",
                        }
                    },
                    required: ["startDate", "endDate"],
                },
            }
        ],
    };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
    switch (request.params.name) {
        case "get_website_traffic": {
            const targetPropertyId = request.params.arguments?.propertyId || propertyId;
            const startDate = String(request.params.arguments?.startDate || 'today');
            const endDate = String(request.params.arguments?.endDate || 'today');

            if (!targetPropertyId) {
                throw new Error("A GA4 Property ID must be provided either as an argument or via the GA4_PROPERTY_ID environment variable.");
            }

            try {
                const [response] = await analyticsDataClient.runReport({
                    property: `properties/${targetPropertyId}`,
                    dateRanges: [
                        {
                            startDate: startDate,
                            endDate: endDate,
                        },
                    ],
                    metrics: [
                        { name: 'activeUsers' },
                        { name: 'newUsers' },
                        { name: 'screenPageViews' }
                    ],
                });

                if (response.rows && response.rows.length > 0) {
                    const metricValues = response.rows[0].metricValues;
                    return {
                        content: [{
                            type: "text",
                            text: `[GA4 Traffic Report for Property ${targetPropertyId} from ${startDate} to ${endDate}]\n- Active Users: ${metricValues[0].value}\n- New Users: ${metricValues[1].value}\n- Page Views: ${metricValues[2].value}`
                        }]
                    };
                } else {
                    return {
                        content: [{
                            type: "text",
                            text: `No data found for Property ${targetPropertyId} in the given date range (${startDate} to ${endDate}).`
                        }]
                    };
                }
            } catch (error) {
                return {
                    content: [{
                        type: "text",
                        text: `Error fetching Google Analytics data: ${error.message}`
                    }],
                    isError: true,
                };
            }
        }
        default:
            throw new Error(`Unknown tool: ${request.params.name}`);
    }
});

async function run() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Google Analytics MCP server running on stdio");
}

run().catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
});
