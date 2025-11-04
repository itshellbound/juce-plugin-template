# JUCE Plugin Development - Quick Start

## 1. Setup MCP Server (5 minutes)

```bash
cd ~/juce-mcp-project/mcp-server
npm install
```

Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

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

Restart Claude Desktop.

---

## 2. Create Plugin with Template (10 minutes)

### In Projucer:

1. New Project → Audio Plug-In → Name it
2. Enable VST3/AU formats
3. Save project

### Copy Template:

```bash
cp ~/juce-mcp-project/juce-template/*.{h,cpp} /path/to/YourPlugin/Source/
```

### Rename in Files:

- `CustomPluginProcessor` → `YourPluginProcessor`
- `CustomPluginEditor` → `YourPluginEditor`

### In Projucer:

1. Set Company Name
2. Set Plugin Code (4 chars)
3. Save and Open in IDE

### Build:

- **Xcode**: ⌘B
- **Visual Studio**: Ctrl+Shift+B

---

## 3. Test Plugin

### macOS:

```bash
# Find built plugin
open ~/Library/Audio/Plug-Ins/VST3/
```

### Open in DAW:

1. Launch DAW
2. Rescan plugins
3. Load your plugin
4. Test audio!

---

## Using MCP Server in Claude

**Ask Claude:**
- "Generate a reverb processor class"
- "Search JUCE docs for filter examples"
- "Explain AudioBuffer concept"
- "Show DSP chain setup"

---

## Common Edits

### Add Parameter:

**PluginProcessor.cpp** → `createParameterLayout()`:

```cpp
params.push_back(std::make_unique<AudioParameterFloat>(
    "cutoff", "Cutoff",
    NormalisableRange<float>(20.0f, 20000.0f), 1000.0f
));
```

### Add Slider:

**PluginEditor.h**:

```cpp
Slider cutoffSlider;
std::unique_ptr<SliderAttachment> cutoffAttachment;
```

**PluginEditor.cpp** constructor:

```cpp
addAndMakeVisible(cutoffSlider);
cutoffAttachment = std::make_unique<SliderAttachment>(
    audioProcessor.getAPVTS(), "cutoff", cutoffSlider
);
```

### Add DSP Effect:

**PluginProcessor.h**:

```cpp
dsp::StateVariableTPTFilter<float> filter;
```

**prepareToPlay()**:

```cpp
filter.prepare(spec);
filter.setType(dsp::StateVariableTPTFilterType::lowpass);
```

**processBlock()**:

```cpp
filter.setCutoffFrequency(*apvts.getRawParameterValue("cutoff"));
filter.process(context);
```

---

## File Structure

```
YourPlugin/
├── Source/
│   ├── PluginProcessor.h
│   ├── PluginProcessor.cpp
│   ├── PluginEditor.h
│   └── PluginEditor.cpp
└── YourPlugin.jucer
```

---

## Development Cycle

1. **Edit** code in IDE
2. **Build** (⌘B / Ctrl+Shift+B)
3. **Reload** in DAW
4. **Test** audio
5. **Repeat**

---

## Key JUCE Classes

- `AudioProcessor` - Audio processing logic
- `AudioProcessorEditor` - GUI
- `AudioProcessorValueTreeState` - Parameters
- `AudioBuffer` - Audio data
- `dsp::ProcessorChain` - Effects chain
- `dsp::Gain` - Gain control
- `dsp::Filter` - Filters
- `dsp::Reverb` - Reverb effect

---

## Resources

- Full setup: `SETUP.md`
- Documentation: `README.md`
- JUCE docs: https://docs.juce.com
- Forum: https://forum.juce.com

---

**Need help?** Ask the MCP server in Claude Desktop!
