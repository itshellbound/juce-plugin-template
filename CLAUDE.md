# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a JUCE VST Plugin Development Kit combining:
1. **MCP Server** - Provides JUCE documentation and code generation tools via Model Context Protocol
2. **JUCE Template** - Production-ready VST/AU plugin template with modern JUCE architecture

## Key Commands

### MCP Server

```bash
# Install dependencies
cd mcp-server && npm install

# Test server locally
cd mcp-server && node index.js

# Start server (used in Claude Desktop config)
node /path/to/juce-mcp-project/mcp-server/index.js
```

### JUCE Plugin Development

Building plugins uses CMake (no Projucer or Xcode GUI required).

**Typical workflow:**
1. Copy template files from `juce-template/` to project's `Source/` directory
2. Rename classes from `CustomPlugin*` to match plugin name: `sed 's/CustomPlugin/YourPlugin/g' juce-template/*.* > Source/`
3. Update `CMakeLists.txt` with plugin settings (name, company, codes, etc.)
4. Build: `cd build && cmake .. && cmake --build . --config Release`
5. Plugin auto-copies to `/Library/Audio/Plug-Ins/VST3/` - rescan DAW to test

**Default build settings:**
- Format: VST3 only (no AU or Standalone unless specified)
- Company: Raveyard Sounds
- Output: `/Library/Audio/Plug-Ins/VST3/`

## Architecture

### MCP Server (`mcp-server/index.js`)

- Implements Model Context Protocol for JUCE documentation access
- Provides resources: `juce://docs/*` and `juce://templates/*`
- Provides tools: `search_juce_docs`, `generate_plugin_code`, `explain_juce_concept`
- Runs on stdio for integration with Claude Desktop

**Integration**: Add to `~/Library/Application Support/Claude/claude_desktop_config.json`

### JUCE Template Architecture

The template follows JUCE's modern pattern with clear separation of concerns:

#### PluginProcessor (Audio Thread)
- `CustomPluginProcessor` extends `juce::AudioProcessor`
- `apvts` (AudioProcessorValueTreeState) manages all parameters automatically
- `createParameterLayout()` defines all plugin parameters
- `prepareToPlay()` initializes DSP components with sample rate/block size
- `processBlock()` performs actual audio processing using DSP chain
- DSP components: `juce::dsp::Gain` for input/output (add filters, reverbs, etc.)

#### PluginEditor (GUI Thread)
- `CustomPluginEditor` extends `juce::AudioProcessorEditor`
- Uses `SliderAttachment` to connect UI sliders to APVTS parameters
- `paint()` handles custom graphics
- `resized()` handles component layout
- Never accesses audio buffers directly - all communication through APVTS

#### Parameter Management
- APVTS handles thread-safety between audio and GUI threads automatically
- Parameters defined in `createParameterLayout()` are automatically saved/loaded
- Attachments keep UI synchronized with parameter values
- Use `*apvts.getRawParameterValue("paramID")` in audio thread

## Development Patterns

### Adding New Parameters

1. Add to `createParameterLayout()` in PluginProcessor.cpp:
```cpp
params.push_back(std::make_unique<juce::AudioParameterFloat>(
    "paramID", "Display Name",
    juce::NormalisableRange<float>(min, max, step, skew),
    defaultValue, "unit"
));
```

2. Add slider in PluginEditor.h:
```cpp
juce::Slider paramSlider;
std::unique_ptr<juce::AudioProcessorValueTreeState::SliderAttachment> paramAttachment;
```

3. Initialize in PluginEditor.cpp constructor:
```cpp
addAndMakeVisible(paramSlider);
paramAttachment = std::make_unique<SliderAttachment>(
    audioProcessor.getAPVTS(), "paramID", paramSlider
);
```

### Adding DSP Processors

1. Declare in PluginProcessor.h private section
2. Initialize in `prepareToPlay()` with `juce::dsp::ProcessSpec`
3. Process audio in `processBlock()` using `juce::dsp::AudioBlock` and `ProcessContextReplacing`

Common DSP modules:
- `juce::dsp::StateVariableTPTFilter` - Filters
- `juce::dsp::Reverb` - Reverb
- `juce::dsp::Compressor` - Dynamics
- `juce::dsp::Gain` - Gain staging
- `juce::dsp::ProcessorChain` - Chain multiple processors

## Important Notes

### Thread Safety
- Audio thread (processBlock) and GUI thread run concurrently
- Never allocate memory in processBlock
- Never access GUI components from audio thread
- Use APVTS for communication between threads

### Class Naming
When using the template, rename all occurrences:
- `CustomPluginProcessor` → `YourPluginNameProcessor`
- `CustomPluginEditor` → `YourPluginNameEditor`
- Update `#include` statements accordingly

### Plugin Configuration
Set in `CMakeLists.txt` before building:
- Plugin Code: 4-character unique ID (e.g., "Tplg")
- Manufacturer Code: 4-character company ID (e.g., "Manu")
- BUNDLE_ID: Reverse domain format (e.g., "com.RaveyardSounds.PluginName")
- COMPANY_NAME: "Raveyard Sounds"
- FORMATS: VST3 (add AU, Standalone if needed)
- VST3_COPY_DIR: `/Library/Audio/Plug-Ins/VST3` (system-wide on macOS)

## Project Structure

```
juce-mcp-project/
├── CMakeLists.txt           # CMake build configuration
├── mcp-server/              # MCP server for Claude Desktop
│   ├── index.js            # Server implementation
│   └── package.json        # Node.js dependencies
├── juce-template/           # JUCE plugin template files (CMake-ready)
│   ├── PluginProcessor.h   # Audio processor header
│   ├── PluginProcessor.cpp # Audio processing implementation
│   ├── PluginEditor.h      # GUI header
│   └── PluginEditor.cpp    # GUI implementation
├── Source/                  # Current working plugin source
│   └── (same files as template, with renamed classes)
└── build/                   # CMake build directory
    └── TestPlugin_artefacts/
        └── VST3/            # Built VST3 plugins
```

Template files use modern CMake includes (`#include <juce_audio_processors/...>`) and are ready to copy into new projects.

## Testing Plugins

**macOS:**
- VST3: `/Library/Audio/Plug-Ins/VST3/` (system-wide, used by default)
- AU: `~/Library/Audio/Plug-Ins/Components/` (user-specific, not built by default)
- Validate AU: `auval -v aufx CODE MFGR`

**Windows:**
- VST3: `C:\Program Files\Common Files\VST3\`

Plugins auto-copy after build. Rescan in DAW to load new version.

## CMake Quick Reference

```bash
# Initial setup
cd juce-mcp-project
mkdir -p build && cd build
cmake ..

# Build (run from build/ directory)
cmake --build . --config Release

# Clean rebuild
cd build && rm -rf * && cmake .. && cmake --build . --config Release
```
- anytime you need to access JUCE info, first refer to @mcp-server/index.js and do not search the internet.