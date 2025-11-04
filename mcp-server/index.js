#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

// JUCE framework knowledge base
const juceResources = {
  'getting-started': {
    uri: 'juce://docs/getting-started',
    name: 'JUCE Getting Started Guide',
    description: 'Introduction to JUCE framework and plugin development',
    mimeType: 'text/plain',
    content: `# JUCE Framework - Getting Started

JUCE is a comprehensive C++ framework for building cross-platform audio applications and plugins.

## Essential Modules for Audio Plugin Development

1. **juce_audio_basics** - Audio buffer manipulation, MIDI handling, synthesis
2. **juce_audio_processors** - VST, AU, AAX plugin loading and processing
3. **juce_audio_plugin_client** - Plugin format support (VST3, AU, AAX, LV2)
4. **juce_dsp** - Digital signal processing, filtering, oversampling
5. **juce_gui_basics** - User interface components
6. **juce_audio_devices** - Audio and MIDI I/O device management

## Basic Setup Steps

1. Download JUCE from juce.com
2. Use Projucer to create a new Audio Plugin project
3. Configure plugin formats (VST3, AU, etc.)
4. Implement AudioProcessor for audio processing logic
5. Create AudioProcessorEditor for GUI
6. Build and test your plugin

## Documentation: https://docs.juce.com/master/index.html`
  },
  'audio-processor-basics': {
    uri: 'juce://docs/audio-processor-basics',
    name: 'AudioProcessor Class Fundamentals',
    description: 'Core concepts for implementing audio processing in JUCE',
    mimeType: 'text/plain',
    content: `# AudioProcessor Class - Core Concepts

The AudioProcessor is the heart of any JUCE plugin. Key methods to implement:

## Essential Virtual Methods

### processBlock()
\`\`\`cpp
void processBlock(AudioBuffer<float>& buffer, MidiBuffer& midiMessages) override
{
    // Your audio processing code here
    for (int channel = 0; channel < buffer.getNumChannels(); ++channel)
    {
        auto* channelData = buffer.getWritePointer(channel);
        for (int sample = 0; sample < buffer.getNumSamples(); ++sample)
        {
            // Process each sample
            channelData[sample] *= gain;
        }
    }
}
\`\`\`

### prepareToPlay()
Called before playback starts. Initialize your DSP here:
\`\`\`cpp
void prepareToPlay(double sampleRate, int samplesPerBlock) override
{
    // Initialize filters, oscillators, etc.
    this->sampleRate = sampleRate;
}
\`\`\`

### releaseResources()
Clean up resources when playback stops.

### getStateInformation() / setStateInformation()
Save and restore plugin state (parameters, presets).

## Parameter Management

Use AudioProcessorValueTreeState for automatic parameter management:
\`\`\`cpp
AudioProcessorValueTreeState parameters;
\`\`\``
  },
  'plugin-template-basic': {
    uri: 'juce://templates/basic-plugin',
    name: 'Basic VST Plugin Template',
    description: 'Minimal working VST plugin template structure',
    mimeType: 'text/plain',
    content: `# Basic JUCE VST Plugin Template Structure

## Project Structure
\`\`\`
MyPlugin/
├── Source/
│   ├── PluginProcessor.h
│   ├── PluginProcessor.cpp
│   ├── PluginEditor.h
│   └── PluginEditor.cpp
└── MyPlugin.jucer
\`\`\`

## Key Classes

### PluginProcessor (Audio Logic)
- Extends juce::AudioProcessor
- Handles audio/MIDI processing
- Manages parameters
- Implements state save/load

### PluginEditor (GUI)
- Extends juce::AudioProcessorEditor
- Creates user interface
- Binds UI controls to parameters
- Handles user interaction

## Minimum Implementation

Your processor must implement:
- Constructor/destructor
- prepareToPlay()
- releaseResources()
- processBlock()
- createEditor()
- Parameter creation
- State management

Your editor must implement:
- Constructor linking to processor
- paint() for custom drawing
- resized() for component layout`
  },
  'dsp-basics': {
    uri: 'juce://docs/dsp-basics',
    name: 'JUCE DSP Module Basics',
    description: 'Digital signal processing with juce_dsp module',
    mimeType: 'text/plain',
    content: `# JUCE DSP Module

The juce_dsp module provides high-performance audio processing tools.

## Key Classes

### ProcessSpec
Defines the processing context:
\`\`\`cpp
dsp::ProcessSpec spec;
spec.sampleRate = 44100.0;
spec.maximumBlockSize = 512;
spec.numChannels = 2;
\`\`\`

### Common DSP Processors

1. **Filters**
   - IIR::Filter (Infinite Impulse Response)
   - FIR::Filter (Finite Impulse Response)
   - StateVariableFilter

2. **Effects**
   - Reverb
   - Chorus
   - Phaser
   - Compressor
   - Limiter

3. **Oscillators**
   - Oscillator<T>
   - WaveShaping

4. **Utilities**
   - Gain
   - Panner
   - DryWetMixer
   - Oversampling

## Usage Pattern

\`\`\`cpp
// In your processor class
dsp::Gain<float> gain;
dsp::Reverb reverb;

// In prepareToPlay()
dsp::ProcessSpec spec;
spec.sampleRate = sampleRate;
spec.maximumBlockSize = samplesPerBlock;
spec.numChannels = getTotalNumOutputChannels();

gain.prepare(spec);
reverb.prepare(spec);

// In processBlock()
dsp::AudioBlock<float> block(buffer);
dsp::ProcessContextReplacing<float> context(block);
gain.process(context);
reverb.process(context);
\`\`\``
  },
  'parameter-management': {
    uri: 'juce://docs/parameters',
    name: 'Plugin Parameter Management',
    description: 'Managing plugin parameters with AudioProcessorValueTreeState',
    mimeType: 'text/plain',
    content: `# Parameter Management in JUCE

## AudioProcessorValueTreeState (APVTS)

The recommended way to manage parameters:

\`\`\`cpp
// In PluginProcessor.h
class MyPluginProcessor : public juce::AudioProcessor
{
public:
    AudioProcessorValueTreeState apvts;

private:
    AudioProcessorValueTreeState::ParameterLayout createParameterLayout();
};

// In PluginProcessor.cpp
MyPluginProcessor::MyPluginProcessor()
    : apvts(*this, nullptr, "Parameters", createParameterLayout())
{
}

AudioProcessorValueTreeState::ParameterLayout
MyPluginProcessor::createParameterLayout()
{
    std::vector<std::unique_ptr<RangedAudioParameter>> params;

    params.push_back(std::make_unique<AudioParameterFloat>(
        "gain",                    // parameterID
        "Gain",                    // parameter name
        NormalisableRange<float>(0.0f, 1.0f),
        0.5f                       // default value
    ));

    params.push_back(std::make_unique<AudioParameterChoice>(
        "filterType",
        "Filter Type",
        StringArray("Lowpass", "Highpass", "Bandpass"),
        0
    ));

    return { params.begin(), params.end() };
}
\`\`\`

## Accessing Parameters

\`\`\`cpp
// In processBlock()
float gainValue = *apvts.getRawParameterValue("gain");
int filterType = apvts.getRawParameterValue("filterType")->load();
\`\`\`

## Connecting to UI

\`\`\`cpp
// In PluginEditor
class MyPluginEditor : public juce::AudioProcessorEditor
{
public:
    Slider gainSlider;
    std::unique_ptr<AudioProcessorValueTreeState::SliderAttachment> gainAttachment;

    MyPluginEditor(MyPluginProcessor& p)
        : AudioProcessorEditor(&p), processor(p)
    {
        gainAttachment = std::make_unique<SliderAttachment>(
            processor.apvts, "gain", gainSlider
        );
    }
};
\`\`\``
  }
};

// Create server instance
const server = new Server(
  {
    name: 'juce-docs-mcp-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      resources: {},
      tools: {},
    },
  }
);

// List available resources
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: Object.entries(juceResources).map(([key, resource]) => ({
      uri: resource.uri,
      name: resource.name,
      description: resource.description,
      mimeType: resource.mimeType,
    })),
  };
});

// Read resource content
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const uri = request.params.uri;
  const resource = Object.values(juceResources).find(r => r.uri === uri);

  if (!resource) {
    throw new Error(`Resource not found: ${uri}`);
  }

  return {
    contents: [{
      uri: resource.uri,
      mimeType: resource.mimeType,
      text: resource.content,
    }],
  };
});

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'search_juce_docs',
        description: 'Search JUCE documentation for specific topics',
        inputSchema: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'Search query for JUCE documentation',
            },
          },
          required: ['query'],
        },
      },
      {
        name: 'generate_plugin_code',
        description: 'Generate boilerplate code for JUCE plugin components',
        inputSchema: {
          type: 'object',
          properties: {
            component: {
              type: 'string',
              enum: ['processor', 'editor', 'parameter', 'dsp-chain'],
              description: 'Type of component to generate',
            },
            className: {
              type: 'string',
              description: 'Name for the class',
            },
          },
          required: ['component', 'className'],
        },
      },
      {
        name: 'explain_juce_concept',
        description: 'Get detailed explanation of JUCE framework concepts',
        inputSchema: {
          type: 'object',
          properties: {
            concept: {
              type: 'string',
              enum: ['AudioProcessor', 'AudioBuffer', 'MidiBuffer', 'DSP', 'Parameters', 'GUI'],
              description: 'JUCE concept to explain',
            },
          },
          required: ['concept'],
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    case 'search_juce_docs': {
      const query = args.query.toLowerCase();
      const results = Object.entries(juceResources)
        .filter(([key, resource]) =>
          resource.name.toLowerCase().includes(query) ||
          resource.description.toLowerCase().includes(query) ||
          resource.content.toLowerCase().includes(query)
        )
        .map(([key, resource]) => ({
          name: resource.name,
          uri: resource.uri,
          description: resource.description,
        }));

      return {
        content: [{
          type: 'text',
          text: results.length > 0
            ? `Found ${results.length} results:\n\n` +
              results.map(r => `- ${r.name}: ${r.description}\n  URI: ${r.uri}`).join('\n\n')
            : 'No results found for: ' + query,
        }],
      };
    }

    case 'generate_plugin_code': {
      const { component, className } = args;
      let code = '';

      switch (component) {
        case 'processor':
          code = `// ${className}.h
#pragma once
#include <JuceHeader.h>

class ${className} : public juce::AudioProcessor
{
public:
    ${className}();
    ~${className}() override;

    void prepareToPlay(double sampleRate, int samplesPerBlock) override;
    void releaseResources() override;
    void processBlock(juce::AudioBuffer<float>&, juce::MidiBuffer&) override;

    juce::AudioProcessorEditor* createEditor() override;
    bool hasEditor() const override { return true; }

    const juce::String getName() const override { return "${className}"; }
    bool acceptsMidi() const override { return false; }
    bool producesMidi() const override { return false; }
    double getTailLengthSeconds() const override { return 0.0; }

    int getNumPrograms() override { return 1; }
    int getCurrentProgram() override { return 0; }
    void setCurrentProgram(int) override {}
    const juce::String getProgramName(int) override { return {}; }
    void changeProgramName(int, const juce::String&) override {}

    void getStateInformation(juce::MemoryBlock& destData) override;
    void setStateInformation(const void* data, int sizeInBytes) override;

private:
    JUCE_DECLARE_NON_COPYABLE_WITH_LEAK_DETECTOR(${className})
};`;
          break;

        case 'editor':
          code = `// ${className}.h
#pragma once
#include <JuceHeader.h>

class ${className} : public juce::AudioProcessorEditor
{
public:
    ${className}(juce::AudioProcessor&);
    ~${className}() override;

    void paint(juce::Graphics&) override;
    void resized() override;

private:
    juce::AudioProcessor& processor;

    JUCE_DECLARE_NON_COPYABLE_WITH_LEAK_DETECTOR(${className})
};`;
          break;

        case 'parameter':
          code = `// Parameter Layout
AudioProcessorValueTreeState::ParameterLayout createParameterLayout()
{
    std::vector<std::unique_ptr<RangedAudioParameter>> params;

    params.push_back(std::make_unique<AudioParameterFloat>(
        "param_id",
        "Parameter Name",
        NormalisableRange<float>(0.0f, 1.0f),
        0.5f
    ));

    return { params.begin(), params.end() };
}`;
          break;

        case 'dsp-chain':
          code = `// DSP Processing Chain
dsp::ProcessorChain<dsp::Gain<float>, dsp::IIR::Filter<float>, dsp::Reverb> processorChain;

// In prepareToPlay()
dsp::ProcessSpec spec;
spec.sampleRate = sampleRate;
spec.maximumBlockSize = samplesPerBlock;
spec.numChannels = getTotalNumOutputChannels();
processorChain.prepare(spec);

// In processBlock()
dsp::AudioBlock<float> block(buffer);
dsp::ProcessContextReplacing<float> context(block);
processorChain.process(context);`;
          break;
      }

      return {
        content: [{
          type: 'text',
          text: code,
        }],
      };
    }

    case 'explain_juce_concept': {
      const { concept } = args;
      const explanations = {
        'AudioProcessor': juceResources['audio-processor-basics'].content,
        'DSP': juceResources['dsp-basics'].content,
        'Parameters': juceResources['parameter-management'].content,
        'AudioBuffer': 'AudioBuffer holds audio sample data for processing. Access samples via getWritePointer() or getReadPointer().',
        'MidiBuffer': 'MidiBuffer stores MIDI events. Iterate through events and process them in processBlock().',
        'GUI': 'JUCE GUI uses Component-based architecture. Create UI in AudioProcessorEditor using sliders, buttons, and custom graphics.',
      };

      return {
        content: [{
          type: 'text',
          text: explanations[concept] || 'No explanation available for: ' + concept,
        }],
      };
    }

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('JUCE MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});
