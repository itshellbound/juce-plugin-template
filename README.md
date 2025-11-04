# JUCE VST Plugin Development Kit

Complete setup for VST plugin development with JUCE framework, including an MCP server for documentation access.

## Contents

1. **mcp-server/** - Model Context Protocol server for JUCE documentation
2. **juce-template/** - Ready-to-use JUCE plugin template

---

## Part 1: MCP Server for JUCE Documentation

The MCP server provides access to JUCE documentation and code generation tools directly in Claude Code.

### Setup MCP Server

```bash
cd mcp-server
npm install
```

### Configure Claude Desktop

Add to your Claude Desktop config (`~/Library/Application Support/Claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "juce-docs": {
      "command": "node",
      "args": ["/Users/hellbound/juce-mcp-project/mcp-server/index.js"]
    }
  }
}
```

### Available Resources

- `juce://docs/getting-started` - JUCE framework introduction
- `juce://docs/audio-processor-basics` - AudioProcessor fundamentals
- `juce://docs/dsp-basics` - DSP module guide
- `juce://docs/parameters` - Parameter management
- `juce://templates/basic-plugin` - Plugin template structure

### Available Tools

- **search_juce_docs** - Search JUCE documentation
- **generate_plugin_code** - Generate boilerplate code (processor, editor, parameters, dsp-chain)
- **explain_juce_concept** - Get detailed explanations of JUCE concepts

---

## Part 2: JUCE Plugin Template

A complete, production-ready VST plugin template with modern JUCE architecture.

### Features

- ✅ AudioProcessor with DSP chain
- ✅ AudioProcessorValueTreeState for parameter management
- ✅ Custom AudioProcessorEditor with GUI
- ✅ Input/Output gain controls
- ✅ State save/load functionality
- ✅ Stereo/Mono support
- ✅ Clean, commented code

### Project Structure

```
juce-template/
├── PluginProcessor.h      # Audio processing header
├── PluginProcessor.cpp    # Audio processing implementation
├── PluginEditor.h         # GUI header
└── PluginEditor.cpp       # GUI implementation
```

### Using the Template

#### Option 1: Create New Projucer Project

1. Open **Projucer**
2. Create new **Audio Plug-In** project
3. Replace `PluginProcessor.h/cpp` and `PluginEditor.h/cpp` with template files
4. Configure plugin formats (VST3, AU, AAX)
5. Save and open in your IDE

#### Option 2: Add to Existing Project

1. Copy template files to your project's `Source/` directory
2. Rename classes from `CustomPlugin*` to your plugin name
3. Update `#include` statements
4. Add to Projucer and save

### Key Components

#### AudioProcessor (PluginProcessor.cpp)

- **prepareToPlay()** - Initialize DSP with sample rate and buffer size
- **processBlock()** - Main audio processing loop
- **createParameterLayout()** - Define plugin parameters
- **getStateInformation()** - Save plugin state
- **setStateInformation()** - Restore plugin state

#### AudioProcessorEditor (PluginEditor.cpp)

- **Constructor** - Create and configure UI components
- **paint()** - Custom graphics and styling
- **resized()** - Layout UI components

### Customization Guide

#### Adding Parameters

In `PluginProcessor.cpp`, add to `createParameterLayout()`:

```cpp
params.push_back(std::make_unique<juce::AudioParameterFloat>(
    "cutoff",
    "Cutoff Frequency",
    juce::NormalisableRange<float>(20.0f, 20000.0f, 1.0f, 0.3f),
    1000.0f,
    "Hz"
));
```

#### Adding DSP Processors

In `PluginProcessor.h`:

```cpp
private:
    juce::dsp::StateVariableTPTFilter<float> filter;
    juce::dsp::Reverb reverb;
```

In `prepareToPlay()`:

```cpp
filter.prepare(spec);
reverb.prepare(spec);
```

In `processBlock()`:

```cpp
filter.process(context);
reverb.process(context);
```

#### Adding UI Controls

In `PluginEditor.h`:

```cpp
private:
    juce::Slider cutoffSlider;
    juce::Label cutoffLabel;
    std::unique_ptr<juce::AudioProcessorValueTreeState::SliderAttachment> cutoffAttachment;
```

In `PluginEditor.cpp` constructor:

```cpp
cutoffSlider.setSliderStyle(juce::Slider::RotaryHorizontalVerticalDrag);
addAndMakeVisible(cutoffSlider);

cutoffAttachment = std::make_unique<juce::AudioProcessorValueTreeState::SliderAttachment>(
    audioProcessor.getAPVTS(), "cutoff", cutoffSlider
);
```

### Building Your Plugin

1. Open project in Projucer
2. Set plugin formats (VST3, AU, AAX)
3. Configure company name and plugin ID
4. Export to IDE (Xcode, Visual Studio, etc.)
5. Build in your IDE

### Plugin Formats

The template supports:

- **VST3** - Cross-platform (Windows, macOS, Linux)
- **AU** (Audio Unit) - macOS only
- **AAX** - Pro Tools (requires AAX SDK)
- **Standalone** - Desktop application

---

## Development Workflow

### With MCP Server

1. Start Claude Desktop with MCP server configured
2. Use `search_juce_docs` tool to find documentation
3. Use `generate_plugin_code` to create components
4. Use `explain_juce_concept` for detailed explanations

### Testing

1. Build plugin in your IDE
2. Copy to plugin folder:
   - macOS VST3: `~/Library/Audio/Plug-Ins/VST3/`
   - macOS AU: `~/Library/Audio/Plug-Ins/Components/`
   - Windows VST3: `C:\Program Files\Common Files\VST3\`
3. Open in DAW (Ableton, Logic, Reaper, etc.)
4. Test audio processing and UI

---

## Resources

- [JUCE Documentation](https://docs.juce.com/master/index.html)
- [JUCE Forum](https://forum.juce.com/)
- [JUCE GitHub](https://github.com/juce-framework/JUCE)
- [JUCE Tutorials](https://juce.com/learn/tutorials)

---

## Troubleshooting

### MCP Server Issues

- Ensure Node.js is installed: `node --version`
- Check Claude Desktop config path is correct
- Restart Claude Desktop after config changes
- Check logs in Claude Desktop for errors

### Build Issues

- Verify JUCE path in Projucer
- Check C++ standard is C++17 or higher
- Ensure all modules are enabled (juce_audio_processors, juce_dsp, etc.)
- Update JUCE to latest version

### Plugin Not Appearing in DAW

- Check plugin was copied to correct directory
- Rescan plugins in DAW
- Check plugin validation (macOS: `auval -a`, Windows: Plugin validation in DAW)
- Ensure architecture matches DAW (x86_64 vs arm64)

---

## License

Template code is provided as-is for educational and commercial use.

JUCE framework has its own licensing terms - check juce.com for details.
