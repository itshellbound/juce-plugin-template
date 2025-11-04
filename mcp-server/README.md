# JUCE Documentation MCP Server

Model Context Protocol server providing JUCE framework documentation and code generation tools.

## Features

### Resources
- JUCE getting started guide
- AudioProcessor fundamentals
- DSP module documentation
- Parameter management guide
- Plugin template structure

### Tools
- **search_juce_docs** - Search documentation by keyword
- **generate_plugin_code** - Generate boilerplate for processor, editor, parameters, or DSP chains
- **explain_juce_concept** - Get detailed explanations of JUCE concepts

## Installation

```bash
npm install
```

## Usage

### Standalone Testing

```bash
node index.js
```

### With Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "juce-docs": {
      "command": "node",
      "args": ["/absolute/path/to/mcp-server/index.js"]
    }
  }
}
```

Restart Claude Desktop.

## Example Queries

In Claude Code with MCP server running:

- "Search JUCE docs for filter examples"
- "Generate a plugin processor class called MyReverb"
- "Explain the AudioBuffer concept"
- "Show me how to set up DSP chain"

## Development

The server uses the official MCP SDK for Node.js. All documentation is embedded in the `juceResources` object.

To add new resources:

1. Add entry to `juceResources` object
2. Include uri, name, description, mimeType, and content
3. Restart server

To add new tools:

1. Add tool definition in `ListToolsRequestSchema` handler
2. Implement tool logic in `CallToolRequestSchema` handler
3. Restart server
