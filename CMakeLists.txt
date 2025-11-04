cmake_minimum_required(VERSION 3.15)

project(TestPlugin VERSION 1.0.0)

# Add JUCE
add_subdirectory(/Users/hellbound/JUCE ${CMAKE_BINARY_DIR}/JUCE)

# Create the plugin target
juce_add_plugin(TestPlugin
    COMPANY_NAME "Raveyard Sounds"
    BUNDLE_ID "com.RaveyardSounds.TestPlugin"
    PLUGIN_MANUFACTURER_CODE Manu
    PLUGIN_CODE Tplg
    FORMATS VST3
    PRODUCT_NAME "Test Plugin"
    IS_SYNTH FALSE
    NEEDS_MIDI_INPUT FALSE
    NEEDS_MIDI_OUTPUT FALSE
    IS_MIDI_EFFECT FALSE
    EDITOR_WANTS_KEYBOARD_FOCUS FALSE
    COPY_PLUGIN_AFTER_BUILD TRUE
    VST3_COPY_DIR /Library/Audio/Plug-Ins/VST3
)

# Add source files
target_sources(TestPlugin
    PRIVATE
        Source/PluginProcessor.cpp
        Source/PluginEditor.cpp
)

# Link JUCE modules
target_link_libraries(TestPlugin
    PRIVATE
        juce::juce_audio_utils
        juce::juce_audio_processors
        juce::juce_dsp
    PUBLIC
        juce::juce_recommended_config_flags
        juce::juce_recommended_lto_flags
        juce::juce_recommended_warning_flags
)

# Compile definitions
target_compile_definitions(TestPlugin
    PUBLIC
        JUCE_WEB_BROWSER=0
        JUCE_USE_CURL=0
        JUCE_VST3_CAN_REPLACE_VST2=0
)
