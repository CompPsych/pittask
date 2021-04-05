jsPsych.plugins["food-and-hunger-questions"] = (function() {

    var plugin = {};
  
    plugin.info = {
      name: 'food-and-hunger-questions',
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
  
        var html = "";

        // defines image path, text
        var IMAGE_SRC = trial.stimulus;
        var h3 =  trial.questions.top;
        var bottom_txt =  trial.questions.bottom;
        var vas_holder = 0;

        // store responses, events
        var response = {
          trial_events: []
        };

        if(FHR_timestamp <= 0) {
          FHR_timestamp = jsPsych.totalTime();
        };

        var timestamp_onload = FHR_timestamp;

        response.trial_events.push({
            "event_type": trial.event_type,
            "event_raw_details": trial.event_raw_details,
            "event_converted_details": trial.event_converted_details,
            "timestamp": jsPsych.totalTime(),
            "time_elapsed": jsPsych.totalTime() - timestamp_onload
        });
        

        // inject CSS for trial
        html += '<style id="key-testing">' +
                'img { width: 300px; margin: 20px 0; }' +
                '.votes-container { margin-top: 8rem; }' +
                '.key-testing-text { padding-bottom: 4rem; }' +
                '</style>';

        html += '<div id="jspsych-stimulus"><h3 class="key-testing-text">' + h3 + '</h3>';

        // all FHQ (exception Hunger) contain stimuli images
        if(trial.stimulus !== 'hunger') {
          html += '<img src='+ IMAGE_SRC +'/>';
          html += '<p>' + bottom_txt + '</p>';
        }

        // range slider container along with the description
        html += '<div class="votes-container">' +
                '<div class="description">';
        if(trial.stimulus === 'hunger') {  
          html += '<div class="description--left">' + FHQ_VAS_left_hungry + '</div>' +
                  '<div class="description--right">' + FHQ_VAS_right_hungry + '</div>';
        } else {
          html += '<div class="description--left">' + FHQ_VAS_left + '</div>' + 
                  '<div class="description--center">' + FHQ_VAS_center + '</div>' +
                  '<div class="description--right">' + FHQ_VAS_right + '</div>';
        }
        html += '</div>';
        html += '<div id="slider"><span class="line"></span></div>';
        html += '<div class="instructions-wrap"><ul class="instructions">' + FHQ_VAS_instruct + '</ul></div>';
        html += '</div>';
    
        html += '<div id="translation-listener">translate</div>';
        html += jsPsych.pluginAPI.getPopupHTML('translator-detected', popup_text_translator);
        // render
        display_element.innerHTML = html;

        // init range slider
        $("#slider").slider({
            value: 5,
            min: 0,
            max: 10,
            step: 0.01,
            change: function(event, ui) {
                $(".ui-slider .ui-slider-handle").css('visibility', 'visible');
                $("#slider").slider("disable");      
                vas_holder = ui.value.toFixed(2);
                response.trial_events.push({
                    "event_type": 'VAS answer has been made',
                    "event_raw_details": ui.value.toFixed(2),
                    "event_converted_details": ui.value.toFixed(2) + ' answer has been made',
                    "timestamp": jsPsych.totalTime(),
                    "time_elapsed": jsPsych.totalTime() - timestamp_onload
                });
                setTimeout(function() {
                  end_trial();
                }, 500);
            }
        });

        function proccessDataBeforeSubmit() {
          return {
            "stage_name": JSON.stringify(trial.stage_name),
            "events": JSON.stringify(response.trial_events),
            "timestamp": JSON.stringify(jsPsych.totalTime()),
            "rating_status": JSON.stringify(trial.rating_status),
            "rating": JSON.stringify(vas_holder),
            "food_item": JSON.stringify(trial.food_item)
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
            
            // reset timestamp variable for post-FHQ
            if(trial.stimulus === 'hunger') {
              FHR_timestamp = 0;
            }
            // move on to the next trial
            jsPsych.finishTrial(trial_data);
        };
  
        // function to handle responses by the subject
        var after_response = function(info) {
              
            if(info.key_release === undefined) {
              response.trial_events.push({
                "event_type": "key press",
                "event_raw_details": info.key,
                "event_converted_details": jsPsych.pluginAPI.convertKeyCodeToKeyCharacter(info.key) + ' key pressed',
                "timestamp": jsPsych.totalTime(),
                "time_elapsed": jsPsych.totalTime() - timestamp_onload
              });
            } else {
              response.trial_events.push({
                "event_type": "key release",
                "event_raw_details": info.key_release,
                "event_converted_details": jsPsych.pluginAPI.convertKeyCodeToKeyCharacter(info.key_release) + ' key released',
                "timestamp": jsPsych.totalTime(),
                "time_elapsed": jsPsych.totalTime() - timestamp_onload
              });
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
            display_element.querySelector('#jspsych-html-keyboard-response-stimulus').style.visibility = 'hidden';
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
  