#include "PluginProcessor.h"
#include "PluginEditor.h"

//==============================================================================
CustomPluginEditor::CustomPluginEditor (CustomPluginProcessor& p)
    : AudioProcessorEditor (&p), audioProcessor (p)
{
    // Set editor size
    setSize (400, 300);

    // Input Gain Slider
    inputGainSlider.setSliderStyle(juce::Slider::RotaryHorizontalVerticalDrag);
    inputGainSlider.setTextBoxStyle(juce::Slider::TextBoxBelow, false, 80, 20);
    inputGainSlider.setColour(juce::Slider::thumbColourId, accentColour);
    inputGainSlider.setColour(juce::Slider::rotarySliderFillColourId, accentColour);
    addAndMakeVisible(inputGainSlider);

    inputGainLabel.setText("Input Gain", juce::dontSendNotification);
    inputGainLabel.setJustificationType(juce::Justification::centred);
    inputGainLabel.attachToComponent(&inputGainSlider, false);
    addAndMakeVisible(inputGainLabel);

    inputGainAttachment = std::make_unique<juce::AudioProcessorValueTreeState::SliderAttachment>(
        audioProcessor.getAPVTS(), "inputGain", inputGainSlider
    );

    // Output Gain Slider
    outputGainSlider.setSliderStyle(juce::Slider::RotaryHorizontalVerticalDrag);
    outputGainSlider.setTextBoxStyle(juce::Slider::TextBoxBelow, false, 80, 20);
    outputGainSlider.setColour(juce::Slider::thumbColourId, accentColour);
    outputGainSlider.setColour(juce::Slider::rotarySliderFillColourId, accentColour);
    addAndMakeVisible(outputGainSlider);

    outputGainLabel.setText("Output Gain", juce::dontSendNotification);
    outputGainLabel.setJustificationType(juce::Justification::centred);
    outputGainLabel.attachToComponent(&outputGainSlider, false);
    addAndMakeVisible(outputGainLabel);

    outputGainAttachment = std::make_unique<juce::AudioProcessorValueTreeState::SliderAttachment>(
        audioProcessor.getAPVTS(), "outputGain", outputGainSlider
    );
}

CustomPluginEditor::~CustomPluginEditor()
{
}

//==============================================================================
void CustomPluginEditor::paint (juce::Graphics& g)
{
    // Fill background
    g.fillAll(backgroundColour);

    // Draw plugin title
    g.setColour(juce::Colours::white);
    g.setFont(juce::Font(24.0f, juce::Font::bold));
    g.drawText("Custom VST Plugin", getLocalBounds().removeFromTop(50),
               juce::Justification::centred, true);

    // Add custom graphics here
    /*
    g.setColour(accentColour);
    g.drawRoundedRectangle(10, 10, getWidth() - 20, getHeight() - 20, 5.0f, 2.0f);
    */
}

void CustomPluginEditor::resized()
{
    // Layout components
    auto bounds = getLocalBounds();
    bounds.removeFromTop(50); // Space for title

    auto sliderArea = bounds.reduced(20);
    auto sliderWidth = sliderArea.getWidth() / 2;

    // Position Input Gain
    auto inputGainArea = sliderArea.removeFromLeft(sliderWidth).reduced(10);
    inputGainArea.removeFromTop(20); // Space for label
    inputGainSlider.setBounds(inputGainArea);

    // Position Output Gain
    auto outputGainArea = sliderArea.reduced(10);
    outputGainArea.removeFromTop(20); // Space for label
    outputGainSlider.setBounds(outputGainArea);
}
