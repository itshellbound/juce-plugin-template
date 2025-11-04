# JUCE VST Plugin Template

Production-ready template for creating VST/AU plugins with JUCE.

## Quick Start

1. Open Projucer
2. Create new "Audio Plug-In" project
3. Copy these template files to your project's `Source/` folder
4. Configure plugin settings in Projucer
5. Export to your IDE and build

## Template Files

- `PluginProcessor.h/cpp` - Audio processing logic
- `PluginEditor.h/cpp` - GUI/UI implementation

## Included Features

- Input/Output gain controls with sliders
- AudioProcessorValueTreeState for parameter management
- DSP processing chain setup
- State save/load functionality
- Modern JUCE architecture patterns

## Customization

### Rename Plugin

1. Replace all `CustomPlugin` with your plugin name
2. Update in both .h and .cpp files
3. Use find/replace in your IDE

### Add New Parameter

```cpp
// In createParameterLayout()
params.push_back(std::make_unique<juce::AudioParameterFloat>(
    "myParam",
    "My Parameter",
    juce::NormalisableRange<float>(0.0f, 1.0f),
    0.5f
));
```

### Add UI Control

```cpp
// In PluginEditor.h
juce::Slider mySlider;
std::unique_ptr<juce::AudioProcessorValueTreeState::SliderAttachment> myAttachment;

// In PluginEditor.cpp constructor
addAndMakeVisible(mySlider);
myAttachment = std::make_unique<SliderAttachment>(
    audioProcessor.getAPVTS(), "myParam", mySlider
);
```

### Add DSP Effect

```cpp
// In PluginProcessor.h
juce::dsp::Reverb reverb;

// In prepareToPlay()
reverb.prepare(spec);

// In processBlock()
reverb.process(context);
```

## JUCE Modules Required

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

## Building

### Projucer Settings

1. **Plugin Formats**: Enable VST3, AU, or AAX
2. **Plugin Characteristics**: Set as Effect, Stereo
3. **Plugin Code**: Set unique 4-character ID
4. **Company**: Set your company name

### Export Targets

- **macOS**: Xcode
- **Windows**: Visual Studio
- **Linux**: Makefile

## Testing

Copy built plugin to:

- **macOS VST3**: `~/Library/Audio/Plug-Ins/VST3/`
- **macOS AU**: `~/Library/Audio/Plug-Ins/Components/`
- **Windows VST3**: `C:\Program Files\Common Files\VST3\`

Test in your DAW (Ableton, Logic, FL Studio, Reaper, etc.)

## Architecture

```
User Input → Editor → APVTS → Processor → DSP Chain → Audio Output
                                      ↓
                                State Save/Load
```

## Next Steps

1. Implement your audio processing algorithm in `processBlock()`
2. Add DSP effects (filters, reverb, compression, etc.)
3. Design custom UI in `PluginEditor`
4. Add presets and additional parameters
5. Optimize performance
6. Test in multiple DAWs
7. Create installer

## Resources

- [JUCE Docs](https://docs.juce.com/master/index.html)
- [JUCE Tutorials](https://juce.com/learn/tutorials)
- [JUCE Forum](https://forum.juce.com/)
