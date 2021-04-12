jsPsych.plugins["survey-feedback"] = (function() {

  var plugin = {};

  plugin.info = {
    name: 'survey-feedback',
    description: '',
    parameters: {
      stimulus: {
        type: jsPsych.plugins.parameterType.HTML_STRING,
        pretty_name: 'Stimulus',
        default: undefined,
        description: 'The HTML string to be displayed'
      },
      choices: {
        type: jsPsych.plugins.parameterType.KEYCODE,
        array: true,
        pretty_name: 'Choices',
        default: jsPsych.ALL_KEYS,
        description: 'The keys the subject is allowed to press to respond to the stimulus.'
      },
      prompt: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Prompt',
        default: null,
        description: 'Any content here will be displayed below the stimulus.'
      },
      stimulus_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Stimulus duration',
        default: null,
        description: 'How long to hide the stimulus.'
      },
      trial_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Trial duration',
        default: null,
        description: 'How long to show trial before it ends.'
      },
      trial_latency: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Trial latency',
        default: null,
        description: 'How long to show trial before key press it ends.'
      },
      response_ends_trial: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Response ends trial',
        default: false,
        description: 'If true, trial will end when subject makes a response.'
      },
      stage_name: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Stage Name',
        default: null,
        description: 'Specific name of the current stage.'
      },
      event_type: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Event type',
        default: null,
        description: 'Event type'
      },
      event_raw_details: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Event raw details',
        default: null,
        description: 'Event raw details'
      },
      event_converted_details: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Event converted details',
        default: null,
        description: 'Event converted details'
      }

    }
  }

  plugin.trial = function(display_element, trial) {

    // store responses, events
    var response = {
      trial_events: []
    };
    
    var timestamp_onload = jsPsych.totalTime();
    
    // used for VVR stages in correct/incorrect response
    // for simulating continuous timer
    if(trial.vvr_timer) {
      timestamp_onload = vvr_timer;
    };

    var new_html = '<div id="jspsych-survey-feedback" class="jspsych-survey-feedback">'+trial.stimulus+'</div>';

    if(trial.id) {
      new_html = '<div id="jspsych-survey-feedback" class="' + trial.id  +'">'+trial.stimulus+'</div>';
    }

    new_html += '<div id="translation-listener">translate</div>';
    new_html += jsPsych.pluginAPI.getPopupHTML('translator-detected', popup_text_translator)

    response.trial_events.push({
        event_type: trial.event_type,
        event_raw_details: trial.event_raw_details,
        event_converted_details: trial.event_converted_details,
        timestamp: jsPsych.totalTime(),
        time_elapsed: jsPsych.totalTime() - timestamp_onload,
    });

    // render
    display_element.innerHTML = new_html;
    
    function proccessDataBeforeSubmit() {
      return {
        "stage_name": JSON.stringify(trial.stage_name),
        "events": JSON.stringify(response.trial_events),
      };
    }
    
    const translatorTarget = document.getElementById('translation-listener')
    jsPsych.pluginAPI.initializeTranslatorDetector(translatorTarget, 'translate', response, timestamp_onload, proccessDataBeforeSubmit);

    // function to end trial when it is time
    var end_trial = function() {

      // kill any remaining setTimeout handlers
      jsPsych.pluginAPI.clearAllTimeouts();

      // kill keyboard listeners
      if (typeof keyboardListener !== 'undefined') {
        jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
        jsPsych.pluginAPI.cancelClickResponse(clickListener);
      }

      // gather the data to store for the trial
      var trial_data = proccessDataBeforeSubmit();

      // clear the display
      display_element.innerHTML = '';

      // move on to the next trial
      jsPsych.finishTrial(trial_data);
    };

    // function to handle responses by the subject
    var after_response = function(info) {
      if(info.key_release === undefined) {
        response.trial_events.push({
            event_type: "key press",
            event_raw_details: info.key,
            event_converted_details:
                jsPsych.pluginAPI.convertKeyCodeToKeyCharacter(info.key) +
                " key pressed",
            timestamp: jsPsych.totalTime(),
            time_elapsed: jsPsych.totalTime() - timestamp_onload,
        });
      } else {
          response.trial_events.push({
              event_type: "key release",
              event_raw_details: info.key_release,
              event_converted_details:
                  jsPsych.pluginAPI.convertKeyCodeToKeyCharacter(
                      info.key_release
                  ) + " key released",
              timestamp: jsPsych.totalTime(),
              time_elapsed: jsPsych.totalTime() - timestamp_onload,
          });
          if (trial.response_ends_trial) {
            end_trial();
          }
      }
    };

    // start the response listener
    if (trial.choices != jsPsych.NO_KEYS) {
        var keyboardListener = jsPsych.pluginAPI.getKeyboardResponse({
          callback_function: after_response,
          valid_responses: trial.choices,
          rt_method: 'performance',
          persist: true,
          allow_held_key: false
        });
        var clickListener = jsPsych.pluginAPI.getMouseResponse({
          callback_function: after_response,
          valid_responses: trial.choices,
          rt_method: 'date',
          persist: true,
          allow_held_key: false
        });
    }

    // hide stimulus if stimulus_duration is set
    if (trial.stimulus_duration !== null) {
      jsPsych.pluginAPI.setTimeout(function() {
        display_element.querySelector('#jspsych-survey-feedback').style.visibility = 'hidden';
      }, trial.stimulus_duration);
    }

    // end trial if trial_duration is set
    if (trial.trial_duration !== null) {
      jsPsych.pluginAPI.setTimeout(function() {
        end_trial();
      }, trial.trial_duration);
    }

    // end trial if trial_duration is set
    if (trial.trial_latency !== null) {
      jsPsych.pluginAPI.setTimeout(function() {
        trial.response_ends_trial = true;
      }, trial.trial_latency);
    }

  };

  return plugin;
})();
