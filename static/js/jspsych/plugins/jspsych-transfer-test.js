jsPsych.plugins["transfer-test"] = (function() {
  var plugin = {};

  plugin.info = {
    name: 'transfer-test',
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

    // plugin used for transfer_test and deva_test stages
    var html = "";
    var timer
    var isStoppedTest = false;
    var popupConfig = {
      isShow: trial.popup_machine,
      duration: trial.popup_machine_duration * 1000,
      text: trial.popup_machine_text
    }
    var devalTestDuration = 0
    var devalTestLoop

    // store responses, events
    var response = {
      trial_events: []
    };

    // number of repeats
    var reps_counter = 0;
    var timestamp_onload = jsPsych.totalTime();
    var latestSavedColor = 'blank'

    // render blank vending machine 
    html += '<div id="jspsych-stimulus">' +
      '<svg class="vending-machine" viewBox="0 0 253 459" x="10" fill="none" xmlns="http://www.w3.org/2000/svg">' +
      '<rect x="27" y="20" width="203" height="359" fill="#000"/>' +
      '<path fill-rule="evenodd" clip-rule="evenodd" d="M253 0V440.506H209.527V459H44.6212V440.506H0V0H253ZM222 279H32V363H222V279ZM59.957 282.531L133.253 309.209L118.546 349.616L45.2501 322.938L59.957 282.531ZM86 210H32V256H86V210ZM154 210H100V256H154V210ZM222 210H168V256H222V210ZM86 148H32V194H86V148ZM154 148H100V194H154V148ZM222 148H168V194H222V148ZM86 86H32V132H86V86ZM154 86H100V132H154V86ZM222 86H168V132H222V86ZM86 24H32V70H86V24ZM154 24H100V70H154V24ZM222 24H168V70H222V24Z" fill="white"/>' +
      '</svg>' +
      '<div id="transfer-test" class="outcome-container"></div>' +
      '</div>';

    html +=
      `<div class="modal micromodal-slide" id="modal-1" aria-hidden="true">
              <div class="modal__overlay" tabindex="-1">
                <div class="modal__container" role="dialog" aria-modal="true" aria-labelledby="modal-1-title">
                  <header class="modal__header">
                    <button class="modal__close" aria-label="Close modal" data-micromodal-close></button>
                  </header>
                  <main class="modal__content" id="modal-1-content">
                    <p>
                      ${ popupConfig.text }
                    </p>
                  </main>
                  <footer class="modal__footer">
                    <button class="modal__btn" data-micromodal-close aria-label="Close this dialog window">Close</button>
                  </footer>
                </div>
              </div>
          </div>`;

    // render
    display_element.innerHTML = html;

    function change_colors(notes) {
      notes = [];
      
      // creating an array with random colors sequence
      var sequence = jsPsych.randomization.shuffle([
        {
          color: stim1_colour,
          color_name: 'stim1_colour',
        },
        {
          color: stim2_colour,
          color_name: 'stim2_colour',
        },
        {
          color: stim3_colour,
          color_name: 'stim3_colour',
        },
        {
          color: stim4_colour,
          color_name: 'stim4_colour',
        },
      ]);

      // each color should be separated with blank vending machine
      sequence.forEach(function (element) {
        notes.push({
          color: '#000',
          color_name: 'blank',
        });

        notes.push(element);
      });

      // add to the end of array blank vending machine
      if(reps_counter === trial.sequence_reps - 1) {
        notes.push({
          color: '#000',
          color_name: 'blank',
        });
      }

      var i = 0;

      update_color();

      function update_color() {
        if (isStoppedTest) {
          setTimeout(update_color, trial.transfer_test_color_duration);
          return
        }

        if (i < notes.length) {
          var color = notes[i].color;
          var color_name = notes[i].color_name;
          var duration = 0;

          latestSavedColor = notes[i].color_name;

          $('.vending-machine rect').css({fill: color});

          duration = trial.transfer_test_color_duration;

          response.trial_events.push({
            event_type: "image appears",
            event_raw_details: color_name + " vending machine",
            event_converted_details: color_name + " vending machine appears",
            timestamp: jsPsych.totalTime(),
            time_elapsed: jsPsych.totalTime() - timestamp_onload,
          });

          i++;

          setTimeout(update_color, duration);
        } else {
          reps_counter++;

          if (trial.sequence_reps !== reps_counter) {
            change_colors();
          } else {
            end_trial();
          }
        }
      }
    }

    // used to determine relevantly stage
    if(trial.stage_name !== 'deval_test') {
      change_colors();
    } else if (trial.stage_name === 'deval_test') {
      devalTestDuration = trial.trial_duration
      response.trial_events.push({
        event_type: "image appears",
        event_raw_details: "blank vending machine",
        event_converted_details: "blank vending machine appears",
        timestamp: jsPsych.totalTime(),
        time_elapsed: jsPsych.totalTime() - timestamp_onload,
      });
    }

    setModalShowTimer()

    // function to end trial when it is time
    var end_trial = function() {
      // clear popup timer
      clearTimeout(timer)
      // kill any remaining setTimeout handlers
      jsPsych.pluginAPI.clearAllTimeouts();

      // kill keyboard listeners
      if (typeof keyboardListener !== 'undefined') {
        jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
        jsPsych.pluginAPI.cancelClickResponse(clickListener);
      }

      // gather the data to store for the trial
      var trial_data = {
        stage_name: JSON.stringify(trial.stage_name),
        events: JSON.stringify(response.trial_events),
      };

      // clear the display
      display_element.innerHTML = '';

      // move on to the next trial
      jsPsych.finishTrial(trial_data);
    };

    // function to handle responses by the subject
    var after_response = function(info) {
      if (!isStoppedTest) {
        setModalShowTimer();
      }

      // function to handle vending machine animation (tilting left/right)
      function machine_tilt() {
          if(info.key === left_tilt) {
              $(".vending-machine").css({
                transform: "rotate(" + shake_left_rotate + "deg) translateX(" + shake_left_translateX + "%)",
                transition: "all " + shake_transition + "s cubic-bezier(0.65, 0.05, 0.36, 1)"
              });
    
              jsPsych.pluginAPI.setTimeout(function(){ $(".vending-machine").css({
                transform:  "rotate(0deg) translateX(0%)",
                transition: "all " + shake_transition + "s cubic-bezier(0.65, 0.05, 0.36, 1)"
              }); }, shake_return_time);
              
              response.trial_events.push({
                event_type: "left tilt",
                event_raw_details: shake_left_translateX + "%, " + shake_left_rotate + "deg",
                event_converted_details: "vending machine was tilted left " + shake_left_translateX + "%, " + shake_left_rotate + "deg",
                timestamp: jsPsych.totalTime(),
                time_elapsed: jsPsych.totalTime() - timestamp_onload
              });
          } else if (info.key === right_tilt) {
              $(".vending-machine").css({
                transform:  "rotate(" + shake_right_rotate + "deg) translateX(" + shake_right_translateX + "%)",
                transition: "all " + shake_transition + "s cubic-bezier(0.65, 0.05, 0.36, 1)"
              });
    
              jsPsych.pluginAPI.setTimeout(function(){ $(".vending-machine").css({
                transform: "rotate(0deg) translateX(0%)",
                transition: "all " + shake_transition + "s cubic-bezier(0.65, 0.05, 0.36, 1)"
              }); }, shake_return_time);
              
              response.trial_events.push({
                event_type: "right tilt",
                event_raw_details: shake_right_translateX + "%, " + shake_right_rotate + "deg",
                event_converted_details: "vending machine was tilted right " + shake_right_translateX + "%, " + shake_right_rotate + "deg",
                timestamp: jsPsych.totalTime(),
                time_elapsed: jsPsych.totalTime() - timestamp_onload
              });
          }
      }
  
      // save interaction event
      if(info.key_release === undefined) {
        response.trial_events.push({
          event_type: "key press",
          event_raw_details: info.key,
          event_converted_details: jsPsych.pluginAPI.convertKeyCodeToKeyCharacter(info.key) + " key pressed",
          timestamp: jsPsych.totalTime(),
          time_elapsed: jsPsych.totalTime() - timestamp_onload
        });

        if (!isStoppedTest) {
          machine_tilt();
        }
      } else {
          response.trial_events.push({
            event_type: "key release",
            event_raw_details: info.key_release,
            event_converted_details: jsPsych.pluginAPI.convertKeyCodeToKeyCharacter(info.key_release) + " key released",
            timestamp: jsPsych.totalTime(),
            time_elapsed: jsPsych.totalTime() - timestamp_onload
          });
          if (trial.response_ends_trial) {
            end_trial();
          }
      }
    };

    // start the response listener
    if (trial.choices !== jsPsych.NO_KEYS) {
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
        display_element
          .querySelector('#jspsych-html-keyboard-response-stimulus')
          .style.visibility = 'hidden';
      }, trial.stimulus_duration);
    }

    // end trial if trial_duration is set
    if (trial.trial_duration !== null) {
      devalTestLoop = setInterval(function() {
        if (!isStoppedTest) {
          devalTestDuration -= 1000

          if (devalTestDuration <= 0) {
            clearInterval(devalTestLoop)
            end_trial()
          }
        }
      }, 1000)

      // jsPsych.pluginAPI.setTimeout(function() {
      //   end_trial();
      // }, trial.trial_duration);
    }

    // end trial if trial_duration is set
    if (trial.trial_latency !== null) {
      jsPsych.pluginAPI.setTimeout(function() {
        trial.response_ends_trial = true;
      }, trial.trial_latency);
    }

    var microModalConfig = {
      onShow: function() {
        response.trial_events.push({
          "event_type": 'error message',
          "event_raw_details": 'Error message',
          "event_converted": 'popup triggered popup_duration_machine',
          "timestamp": jsPsych.totalTime(),
          "time_elapsed": jsPsych.totalTime() - timestamp_onload
        });
      },
      onClose: function() {
        response.trial_events.push({
          "event_type": 'popup closed',
          "event_raw_details": 'Close',
          "event_converted_details": latestSavedColor +  ' vending machine appears',
          "timestamp": jsPsych.totalTime(),
          "time_elapsed": jsPsych.totalTime() - timestamp_onload
        });

        isStoppedTest = false;
        setModalShowTimer();
      },
    };

    /**
     * Set timer to show popup.
     * The popup should appear if the user hasn't clicked anything.
     */
    function setModalShowTimer() {
      if (popupConfig.isShow === false) {
        return
      }

      clearTimeout(timer)

      timer = setTimeout(() => {
        isStoppedTest = true
        MicroModal.show('modal-1', microModalConfig);
      }, popupConfig.duration);
    }
  };

  return plugin;
})();
