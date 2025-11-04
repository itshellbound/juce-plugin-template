# JUCE Plugin Development Kit - Setup Guide

Complete setup instructions for both the MCP server and JUCE template.

---

## Step 1: MCP Server Setup

The MCP server provides JUCE documentation and code generation tools in Claude Desktop.

### Install Dependencies

```bash
cd mcp-server
npm install
```

### Test the Server

```bash
node index.js
```

You should see: `JUCE MCP Server running on stdio`

Press `Ctrl+C` to stop.

### Configure Claude Desktop

1. Locate your Claude Desktop config file:
   ```bash
   open ~/Library/Application\ Support/Claude/
   ```

2. Edit or create `claude_desktop_config.json`:
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

   **Important**: Update the path if you moved the project!

3. Save the file

4. **Restart Claude Desktop** completely (quit and reopen)

### Verify MCP Server is Working

1. Open Claude Desktop
2. Look for an MCP icon or indicator
3. Try asking: "Search JUCE docs for AudioProcessor"
4. Or: "Generate a plugin processor class called MyPlugin"

---

## Step 2: JUCE Template Setup

### Prerequisites

1. **Download JUCE**: https://juce.com/get-juce/download
2. **Install IDE**:
   - macOS: Xcode (from App Store)
   - Windows: Visual Studio 2022 (Community Edition is free)
   - Linux: GCC/Clang

### Create Your First Plugin

#### Using Projucer (Recommended)

1. **Open Projucer** (comes with JUCE)

2. **Create New Project**:
   - Click "New Project"
   - Select "Audio Plug-In"
   - Name: "MyFirstPlugin"
   - Location: Choose a folder (NOT the juce-template folder)

3. **Configure Project**:
   - **Plugin Formats**: Enable VST3, AU (macOS), AAX (if you have Pro Tools SDK)
   - **Plugin Characteristics**:
     - Effect: ✓
     - MIDI Effect: ✗
     - MIDI Input: ✗
     - MIDI Output: ✗
     - Synth: ✗
   - **Plugin Channel Configurations**: {1, 1}, {2, 2} (mono and stereo)

4. **Replace Template Files**:
   ```bash
   # Copy template files to your new project
   cp /Users/hellbound/juce-mcp-project/juce-template/PluginProcessor.h /path/to/MyFirstPlugin/Source/
   cp /Users/hellbound/juce-mcp-project/juce-template/PluginProcessor.cpp /path/to/MyFirstPlugin/Source/
   cp /Users/hellbound/juce-mcp-project/juce-template/PluginEditor.h /path/to/MyFirstPlugin/Source/
   cp /Users/hellbound/juce-mcp-project/juce-template/PluginEditor.cpp /path/to/MyFirstPlugin/Source/
   ```

5. **Rename Classes in Files**:
   - Open each file in a text editor
   - Replace `CustomPluginProcessor` with `MyFirstPluginProcessor`
   - Replace `CustomPluginEditor` with `MyFirstPluginEditor`
   - Or use find/replace in your IDE

6. **Update Projucer Settings**:
   - Set your **Company Name**
   - Set a unique **Plugin Code** (4 characters, e.g., "Mfp1")
   - Set **Plugin Manufacturer Code** (4 characters, e.g., "YourInitials")

7. **Add Modules** (if not already added):
   - juce_audio_basics
   - juce_audio_devices
   - juce_audio_formats
   - juce_audio_plugin_client
   - juce_audio_processors
   - juce_audio_utils
   - juce_core
   - juce_data_structures
   - juce_dsp
   - juce_events
   - juce_graphics
   - juce_gui_basics
   - juce_gui_extra

8. **Save Projucer Project**

9. **Export to IDE**:
   - macOS: Click "Save Project and Open in IDE" → Xcode
   - Windows: Click "Save Project and Open in IDE" → Visual Studio

10. **Build in IDE**:
    - Xcode: Select scheme (VST3 or AU) → Product → Build
    - Visual Studio: Select configuration → Build → Build Solution

### Install Plugin for Testing

#### macOS

```bash
# VST3
cp -r ~/Library/Audio/Plug-Ins/VST3/MyFirstPlugin.vst3 ~/Library/Audio/Plug-Ins/VST3/

# AU (Audio Unit)
cp -r ~/Library/Audio/Plug-Ins/Components/MyFirstPlugin.component ~/Library/Audio/Plug-Ins/Components/
```

#### Windows

```bash
# VST3
copy "C:\Program Files\Common Files\VST3\MyFirstPlugin.vst3" "C:\Program Files\Common Files\VST3\"
```

### Test in DAW

1. Open your DAW (Ableton Live, Logic Pro, FL Studio, Reaper, etc.)
2. Rescan plugins if needed
3. Load "MyFirstPlugin" on a track
4. You should see:
   - Input Gain knob
   - Output Gain knob
   - Dark UI with title
5. Play audio and adjust knobs to verify it works

---

## Step 3: Development Workflow

### Using MCP Server During Development

In Claude Desktop, you can now:

```
"Generate a filter processor with cutoff and resonance parameters"
"Search JUCE docs for reverb examples"
"Explain how AudioProcessorValueTreeState works"
"Show me DSP chain setup for a compressor"
```

The MCP server will provide:
- Code snippets
- Documentation excerpts
- Parameter setup examples
- DSP configuration patterns

### Iterative Development

1. **Design** - Plan parameters and DSP chain
2. **Code** - Implement in PluginProcessor.cpp
3. **UI** - Create controls in PluginEditor.cpp
4. **Test** - Build and load in DAW
5. **Refine** - Adjust parameters and sound

### Quick Edit Cycle

```bash
# Edit code in IDE
# Build
# Plugin hot-reloads in some DAWs (or restart)
# Test changes
# Repeat
```

---

## Troubleshooting

### MCP Server Not Showing

- Check path in claude_desktop_config.json is correct
- Verify Node.js is installed: `node --version`
- Check file permissions: `ls -l mcp-server/index.js`
- Look for errors in Console.app (macOS) or Claude logs

### Build Errors

**"Cannot find JuceHeader.h"**
- Check JUCE modules are added in Projucer
- Verify JUCE path in Projucer preferences

**"Undefined symbols"**
- Ensure all JUCE modules are enabled
- Check linking settings in IDE

**"Plugin format not supported"**
- Enable desired formats in Projucer
- Install SDKs (VST3 SDK, AAX SDK if needed)

### Plugin Not Loading in DAW

**macOS**
```bash
# Validate AU plugin
auval -v aufx Mfp1 YourCode

# Check codesigning
codesign -dv --verbose=4 ~/Library/Audio/Plug-Ins/Components/MyFirstPlugin.component
```

**Windows**
- Check plugin architecture matches DAW (x64)
- Look for error messages in DAW
- Try Plugin Validator tool

### Runtime Errors

**Crash on load**
- Check prepareToPlay() initializes everything
- Verify no null pointers
- Look for exceptions in debugger

**No audio output**
- Check processBlock() is called
- Verify channels are not cleared accidentally
- Test with simple passthrough first

---

## Next Steps

1. **Customize Template**:
   - Add your DSP algorithm
   - Design custom UI
   - Add more parameters

2. **Learn JUCE**:
   - Read JUCE tutorials
   - Explore example projects
   - Join JUCE forum

3. **Optimize**:
   - Profile performance
   - Reduce allocations in audio thread
   - Test with stress tests

4. **Polish**:
   - Add presets
   - Create professional UI
   - Add tooltips and help

5. **Release**:
   - Code sign (macOS)
   - Create installer
   - Test on multiple systems
   - Distribute

---

## Resources

- **JUCE Docs**: https://docs.juce.com/master/index.html
- **JUCE Forum**: https://forum.juce.com/
- **JUCE GitHub**: https://github.com/juce-framework/JUCE
- **Audio Plugin Development Book**: Will Pirkle's "Designing Audio Effect Plugins in C++"
- **The Audio Programmer**: YouTube channel with JUCE tutorials

---

## Support

For issues with:
- **MCP Server**: Check mcp-server/README.md
- **JUCE Template**: Check juce-template/README.md
- **JUCE Framework**: Visit forum.juce.com

Happy plugin development! 🎵
