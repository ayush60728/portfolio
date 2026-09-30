import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
const transport = new StdioClientTransport({
  command: "npx",
  args: ["-y", "mcp-remote", "https://stitch.googleapis.com/mcp", "--header", `X-Goog-Api-Key: ${process.env.STITCH_API_KEY}`]
});
const client = new Client({ name: "test-client", version: "1.0.0" }, { capabilities: {} });
async function main() {
  await client.connect(transport);
  const screens = await client.callTool({ name: "list_screens", arguments: { parent: "projects/960050270387734660" }});
  console.log("SCREENS:");
  console.log(JSON.stringify(screens, null, 2));
  process.exit(0);
}
main().catch(console.error);
