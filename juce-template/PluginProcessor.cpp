#include "PluginProcessor.h"
#include "PluginEditor.h"

//==============================================================================
CustomPluginProcessor::CustomPluginProcessor()
#ifndef JucePlugin_PreferredChannelConfigurations
     : AudioProcessor (BusesProperties()
                     #if ! JucePlugin_IsMidiEffect
                      #if ! JucePlugin_IsSynth
                       .withInput  ("Input",  juce::AudioChannelSet::stereo(), true)
                      #endif
                       .withOutput ("Output", juce::AudioChannelSet::stereo(), true)
                     #endif
                       ),
#endif
    apvts(*this, nullptr, "Parameters", createParameterLayout())
{
}

CustomPluginProcessor::~CustomPluginProcessor()
{
}

//==============================================================================
juce::AudioProcessorValueTreeState::ParameterLayout CustomPluginProcessor::createParameterLayout()
{
    std::vector<std::unique_ptr<juce::RangedAudioParameter>> params;

    // Input Gain Parameter
    params.push_back(std::make_unique<juce::AudioParameterFloat>(
        "inputGain",
        "Input Gain",
        juce::NormalisableRange<float>(-24.0f, 24.0f, 0.1f),
        0.0f,
        "dB"
    ));

    // Output Gain Parameter
    params.push_back(std::make_unique<juce::AudioParameterFloat>(
        "outputGain",
        "Output Gain",
        juce::NormalisableRange<float>(-24.0f, 24.0f, 0.1f),
        0.0f,
        "dB"
    ));

    // Add more parameters here:
    /*
    params.push_back(std::make_unique<juce::AudioParameterFloat>(
        "cutoff",
        "Cutoff Frequency",
        juce::NormalisableRange<float>(20.0f, 20000.0f, 1.0f, 0.3f),
        1000.0f,
        "Hz"
    ));

    params.push_back(std::make_unique<juce::AudioParameterChoice>(
        "filterType",
        "Filter Type",
        juce::StringArray("Lowpass", "Highpass", "Bandpass"),
        0
    ));
    */

    return { params.begin(), params.end() };
}

//==============================================================================
const juce::String CustomPluginProcessor::getName() const
{
    return JucePlugin_Name;
}

bool CustomPluginProcessor::acceptsMidi() const
{
   #if JucePlugin_WantsMidiInput
    return true;
   #else
    return false;
   #endif
}

bool CustomPluginProcessor::producesMidi() const
{
   #if JucePlugin_ProducesMidiOutput
    return true;
   #else
    return false;
   #endif
}

bool CustomPluginProcessor::isMidiEffect() const
{
   #if JucePlugin_IsMidiEffect
    return true;
   #else
    return false;
   #endif
}

double CustomPluginProcessor::getTailLengthSeconds() const
{
    return 0.0;
}

int CustomPluginProcessor::getNumPrograms()
{
    return 1;
}

int CustomPluginProcessor::getCurrentProgram()
{
    return 0;
}

void CustomPluginProcessor::setCurrentProgram (int index)
{
    juce::ignoreUnused(index);
}

const juce::String CustomPluginProcessor::getProgramName (int index)
{
    juce::ignoreUnused(index);
    return {};
}

void CustomPluginProcessor::changeProgramName (int index, const juce::String& newName)
{
    juce::ignoreUnused(index, newName);
}

//==============================================================================
void CustomPluginProcessor::prepareToPlay (double sampleRate, int samplesPerBlock)
{
    // Initialize DSP processors
    juce::dsp::ProcessSpec spec;
    spec.sampleRate = sampleRate;
    spec.maximumBlockSize = static_cast<juce::uint32>(samplesPerBlock);
    spec.numChannels = static_cast<juce::uint32>(getTotalNumOutputChannels());

    inputGain.prepare(spec);
    outputGain.prepare(spec);

    inputGain.setRampDurationSeconds(0.05);
    outputGain.setRampDurationSeconds(0.05);

    // Initialize your DSP components here:
    // filter.prepare(spec);
    // reverb.prepare(spec);
}

void CustomPluginProcessor::releaseResources()
{
    // Release any resources when playback stops
}

#ifndef JucePlugin_PreferredChannelConfigurations
bool CustomPluginProcessor::isBusesLayoutSupported (const BusesLayout& layouts) const
{
  #if JucePlugin_IsMidiEffect
    juce::ignoreUnused (layouts);
    return true;
  #else
    // Support stereo and mono
    if (layouts.getMainOutputChannelSet() != juce::AudioChannelSet::mono()
     && layouts.getMainOutputChannelSet() != juce::AudioChannelSet::stereo())
        return false;

   #if ! JucePlugin_IsSynth
    if (layouts.getMainOutputChannelSet() != layouts.getMainInputChannelSet())
        return false;
   #endif

    return true;
  #endif
}
#endif

void CustomPluginProcessor::processBlock (juce::AudioBuffer<float>& buffer, juce::MidiBuffer& midiMessages)
{
    juce::ignoreUnused(midiMessages);
    juce::ScopedNoDenormals noDenormals;

    auto totalNumInputChannels  = getTotalNumInputChannels();
    auto totalNumOutputChannels = getTotalNumOutputChannels();

    // Clear unused output channels
    for (auto i = totalNumInputChannels; i < totalNumOutputChannels; ++i)
        buffer.clear (i, 0, buffer.getNumSamples());

    // Update parameters
    float inputGainDB = apvts.getRawParameterValue("inputGain")->load();
    float outputGainDB = apvts.getRawParameterValue("outputGain")->load();

    inputGain.setGainDecibels(inputGainDB);
    outputGain.setGainDecibels(outputGainDB);

    // Process audio using DSP chain
    juce::dsp::AudioBlock<float> block(buffer);
    juce::dsp::ProcessContextReplacing<float> context(block);

    inputGain.process(context);

    // Add your audio processing here:
    // filter.process(context);
    // reverb.process(context);

    outputGain.process(context);
}

//==============================================================================
bool CustomPluginProcessor::hasEditor() const
{
    return true;
}

juce::AudioProcessorEditor* CustomPluginProcessor::createEditor()
{
    return new CustomPluginEditor (*this);

    // For a generic editor with sliders for all parameters, uncomment:
    // return new juce::GenericAudioProcessorEditor(*this);
}

//==============================================================================
void CustomPluginProcessor::getStateInformation (juce::MemoryBlock& destData)
{
    // Save plugin state
    auto state = apvts.copyState();
    std::unique_ptr<juce::XmlElement> xml(state.createXml());
    copyXmlToBinary(*xml, destData);
}

void CustomPluginProcessor::setStateInformation (const void* data, int sizeInBytes)
{
    // Restore plugin state
    std::unique_ptr<juce::XmlElement> xmlState(getXmlFromBinary(data, sizeInBytes));

    if (xmlState.get() != nullptr)
        if (xmlState->hasTagName(apvts.state.getType()))
            apvts.replaceState(juce::ValueTree::fromXml(*xmlState));
}

//==============================================================================
// This creates new instances of the plugin
juce::AudioProcessor* JUCE_CALLTYPE createPluginFilter()
{
    return new CustomPluginProcessor();
}
