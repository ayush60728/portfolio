import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const transport = new StdioClientTransport({
  command: "npx",
  args: ["-y", "mcp-remote", "https://stitch.googleapis.com/mcp", "--header", `X-Goog-Api-Key: ${process.env.STITCH_API_KEY}`]
});

const client = new Client({ name: "test-client", version: "1.0.0" }, { capabilities: {} });

async function main() {
  await client.connect(transport);
  const tools = await client.listTools();
  console.log("TOOLS:");
  console.log(JSON.stringify(tools, null, 2));
  process.exit(0);
}
main().catch(console.error);
