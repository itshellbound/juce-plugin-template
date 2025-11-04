#pragma once

#include <juce_audio_processors/juce_audio_processors.h>
#include <juce_gui_basics/juce_gui_basics.h>
#include "PluginProcessor.h"

//==============================================================================
/**
 * Custom Plugin Editor
 *
 * This is the GUI/UI for your VST plugin.
 * Add sliders, buttons, and custom graphics here.
 */
class CustomPluginEditor : public juce::AudioProcessorEditor
{
public:
    CustomPluginEditor (CustomPluginProcessor&);
    ~CustomPluginEditor() override;

    //==============================================================================
    void paint (juce::Graphics&) override;
    void resized() override;

private:
    // Reference to the processor
    CustomPluginProcessor& audioProcessor;

    // UI Components
    juce::Slider inputGainSlider;
    juce::Label inputGainLabel;

    juce::Slider outputGainSlider;
    juce::Label outputGainLabel;

    // Parameter Attachments
    std::unique_ptr<juce::AudioProcessorValueTreeState::SliderAttachment> inputGainAttachment;
    std::unique_ptr<juce::AudioProcessorValueTreeState::SliderAttachment> outputGainAttachment;

    // Custom styling
    juce::Colour backgroundColour = juce::Colour(0xff2a2a2a);
    juce::Colour accentColour = juce::Colour(0xff4a9eff);

    //==============================================================================
    JUCE_DECLARE_NON_COPYABLE_WITH_LEAK_DETECTOR (CustomPluginEditor)
};
