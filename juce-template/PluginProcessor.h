#pragma once

#include <juce_audio_processors/juce_audio_processors.h>
#include <juce_dsp/juce_dsp.h>

//==============================================================================
/**
 * Custom VST Plugin Processor
 *
 * This is the main audio processing class for your VST plugin.
 * All audio/MIDI processing happens here.
 */
class CustomPluginProcessor : public juce::AudioProcessor
{
public:
    //==============================================================================
    CustomPluginProcessor();
    ~CustomPluginProcessor() override;

    //==============================================================================
    // Audio Processing
    void prepareToPlay (double sampleRate, int samplesPerBlock) override;
    void releaseResources() override;

   #ifndef JucePlugin_PreferredChannelConfigurations
    bool isBusesLayoutSupported (const BusesLayout& layouts) const override;
   #endif

    void processBlock (juce::AudioBuffer<float>&, juce::MidiBuffer&) override;

    //==============================================================================
    // Editor
    juce::AudioProcessorEditor* createEditor() override;
    bool hasEditor() const override;

    //==============================================================================
    // Plugin Info
    const juce::String getName() const override;

    bool acceptsMidi() const override;
    bool producesMidi() const override;
    bool isMidiEffect() const override;
    double getTailLengthSeconds() const override;

    //==============================================================================
    // Programs
    int getNumPrograms() override;
    int getCurrentProgram() override;
    void setCurrentProgram (int index) override;
    const juce::String getProgramName (int index) override;
    void changeProgramName (int index, const juce::String& newName) override;

    //==============================================================================
    // State Save/Load
    void getStateInformation (juce::MemoryBlock& destData) override;
    void setStateInformation (const void* data, int sizeInBytes) override;

    //==============================================================================
    // Parameter Management
    juce::AudioProcessorValueTreeState& getAPVTS() { return apvts; }

private:
    //==============================================================================
    // Parameter Layout
    juce::AudioProcessorValueTreeState::ParameterLayout createParameterLayout();

    // Audio Parameter Value Tree State
    juce::AudioProcessorValueTreeState apvts;

    // DSP Components
    juce::dsp::Gain<float> inputGain;
    juce::dsp::Gain<float> outputGain;

    // Add your DSP processors here:
    // juce::dsp::StateVariableTPTFilter<float> filter;
    // juce::dsp::Reverb reverb;
    // juce::dsp::Compressor<float> compressor;

    //==============================================================================
    JUCE_DECLARE_NON_COPYABLE_WITH_LEAK_DETECTOR (CustomPluginProcessor)
};
