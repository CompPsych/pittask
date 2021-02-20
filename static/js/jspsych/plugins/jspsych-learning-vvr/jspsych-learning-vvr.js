jsPsych.plugins['survey-vvr'] = (function() {
  var plugin = {};

  plugin.info = {
    name: 'survey-vvr',
    parameters: {
      choices: {
        type: jsPsych.plugins.parameterType.KEYCODE,
        array: true,
        pretty_name: 'Choices',
        default: jsPsych.ALL_KEYS,
        description: 'The keys the subject is allowed to press to respond to the stimulus.'
      },
      trial_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Trial duration',
        default: null,
        description: 'How long to show trial before it ends.'
      },
      variables: {
        type: jsPsych.plugins.parameterType.Obj,
        pretty_name: 'Variables',
        default: null,
        description: 'Variables from parameters.js file.'
      },
      stage_name: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Stage Name',
        default: null,
        description: 'Specific name of the current stage.'
      }
    }
  }

  plugin.trial = function(display_element, trial) {
    // define variables
    var _trial$variables = trial.variables,
        VVR_INTERVAL_DURATION = _trial$variables.VVR_INTERVAL_DURATION,
        VVR_INTERVAL_NUM = _trial$variables.VVR_INTERVAL_NUM,
        VVR_OUTCOME_DURATION = _trial$variables.VVR_OUTCOME_DURATION,
        VVR_DEGRAD_PATTERN = _trial$variables.VVR_DEGRAD_PATTERN,
        VVR_PROB_VALUE = _trial$variables.VVR_PROB_VALUE;

    var interval_number_holder = 1;
    var interval_holder_key_press = {};
    item_id = 0;
    // src
    var OUTCOME = {
      MM:'/static/images/MM.png',
      TT:'/static/images/TT.png',
      BBQ:'/static/images/BBQ.png',
    };

    var degradation_pattern_condition = VVR_DEGRAD_PATTERN[degrad_pattern_loop_counter]; // Default condition degradation pattern
    var probability_value = VVR_PROB_VALUE[prob_value_loop_counter];
    var timerId;
    var condition_outcome = 'A0';
    var condition_outcome_handler = false;
    var timer
    var isStoppedTest = false;
    var popupConfig = {
      isShow: trial.popup_machine,
      duration: trial.popup_machine_duration * 1000,
      text: trial.popup_machine_text
    }

    // store responses, events
    var response = {
      trial_events: []
    };

    if (vvr_timer <= 0) {
      vvr_timer = jsPsych.totalTime();
    }

    var timestamp_onload = vvr_timer;

    // add vending machine with outcome container
    var new_html =
      '<div id="jspsych-stimulus" class="vvr_stage">' +
      '<svg class="vending-machine" viewBox="0 0 253 459" x="10" fill="none" xmlns="http://www.w3.org/2000/svg">' +
        '<rect x="27" y="20" width="203" height="359" fill="#000"/>' +
        '<path fill-rule="evenodd" clip-rule="evenodd" d="M253 0V440.506H209.527V459H44.6212V440.506H0V0H253ZM222 279H32V363H222V279ZM59.957 282.531L133.253 309.209L118.546 349.616L45.2501 322.938L59.957 282.531ZM86 210H32V256H86V210ZM154 210H100V256H154V210ZM222 210H168V256H222V210ZM86 148H32V194H86V148ZM154 148H100V194H154V148ZM222 148H168V194H222V148ZM86 86H32V132H86V86ZM154 86H100V132H154V86ZM222 86H168V132H222V86ZM86 24H32V70H86V24ZM154 24H100V70H154V24ZM222 24H168V70H222V24Z" fill="white"/>' +
      '</svg>' +
      '<div class="outcome-container"></div>' +
      '</div>';

    new_html +=
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

    display_element.innerHTML = new_html;

    response.trial_events.push({
      event_type: "image appears",
      event_raw_details: "blank vending machine",
      event_converted_details: "blank vending machine appears",
      timestamp: jsPsych.totalTime(),
      interval_number: 1,
      time_elapsed: jsPsych.totalTime() - timestamp_onload,
    });

    var $outcome_container = $('.outcome-container');

    // outcome presentation logic
    (function() {
      var x = 0;
      var random_boolean = Math.random() < probability_value;
      var outcome_present = DEGRAD_PATTERN[condition_outcome][degradation_pattern_condition];
      var duration = VVR_INTERVAL_DURATION;

      timerId = jsPsych.pluginAPI.setTimeout(function request() {
        if (isStoppedTest) {
          clearTimeout(timerId);
          timerId = jsPsych.pluginAPI.setTimeout(request, duration);
          return
        }

        if (x !== 0) {
          random_boolean = Math.random() < probability_value;
          outcome_present = DEGRAD_PATTERN[condition_outcome][degradation_pattern_condition];
        }

        if (condition_outcome === 'A0') {
          response.trial_events.push({
            timestamp: jsPsych.totalTime(),
            time_elapsed: "NA",
            event_type: "no action",
            interval_number: interval_number_holder,
            event_raw_details: "no action",
            event_converted_details: "no action",
          });
        }

        // increment counter
        x += 1;
        
        if (random_boolean && outcome_present) {
          $outcome_container.html('<img class="outcome" src="'+ OUTCOME[counter_balancing[0][outcome_present]] +'"/>');

          response.trial_events.push({
            timestamp: jsPsych.totalTime(),
            time_elapsed: jsPsych.totalTime() - timestamp_onload,
            event_type: "image appears",
            interval_number: interval_number_holder,
            event_raw_details: OUTCOME[counter_balancing[0][outcome_present]],
            event_converted_details: counter_balancing[0][outcome_present] + " image appears",
          });

          if (x === VVR_INTERVAL_NUM) {
            jsPsych.pluginAPI.setTimeout(function() {
              clearTimeout(timerId);
              end_trial();
            }, VVR_OUTCOME_DURATION);
          }

          jsPsych.pluginAPI.setTimeout(function() {
            $outcome_container.html('');
          }, VVR_OUTCOME_DURATION);

          duration = VVR_OUTCOME_DURATION + VVR_INTERVAL_DURATION;
        } else {
          response.trial_events.push({
            timestamp: jsPsych.totalTime(),
            time_elapsed: "NA",
            event_type: "no outcome",
            interval_number: interval_number_holder,
            event_raw_details: "no outcome",
            event_converted_details: "no outcome",
          });
          if (x === VVR_INTERVAL_NUM) {
            clearTimeout(timerId);
            end_trial();
          };
          duration = VVR_INTERVAL_DURATION;
        }

        if (x < VVR_INTERVAL_NUM) {
          timerId = jsPsych.pluginAPI.setTimeout(request, duration);
        }

        if (interval_number_holder < VVR_INTERVAL_NUM) {
          interval_number_holder += 1;
        }

         // reset degrad pattern
         condition_outcome = 'A0';
         condition_outcome_handler = false;
      }, VVR_INTERVAL_DURATION);
    }());

    setModalShowTimer()

    // function to handle responses by the subject
    var after_response = function(info) {
      if (!isStoppedTest) {
        setModalShowTimer();
      }

      function machine_tilt() {
        if (info.key === left_tilt) {
          $(".vending-machine").css({
            transform:  "rotate(" + shake_left_rotate + "deg) translateX(" + shake_left_translateX + "%)",
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
            interval_number: interval_number_holder,
            timestamp: jsPsych.totalTime(),
            time_elapsed: jsPsych.totalTime() - timestamp_onload,
        });

        condition_outcome = 'A1';
        condition_outcome_handler = true;

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
              interval_number: interval_number_holder,
              timestamp: jsPsych.totalTime(),
              time_elapsed: jsPsych.totalTime() - timestamp_onload,
          });

          condition_outcome = 'A2';
          condition_outcome_handler = true;
          } else {
            if (!condition_outcome_handler) {
              condition_outcome = 'A0';
            }
          }
      }

      if (info.key_release === undefined) {
        interval_holder_key_press[info.key] = interval_number_holder;
        response.trial_events.push({
          event_type: "key press",
          event_raw_details: info.key,
          event_converted_details: jsPsych.pluginAPI.convertKeyCodeToKeyCharacter(info.key) + " key pressed",
          timestamp: jsPsych.totalTime(),
          interval_number: interval_number_holder,
          time_elapsed: jsPsych.totalTime() - timestamp_onload,
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
          interval_number: interval_holder_key_press[info.key_release],
          time_elapsed: jsPsych.totalTime() - timestamp_onload,
        });
      }
    }

    // function to end trial when it is time
    var end_trial = function() {
      // clear popup timer
      clearTimeout(timer)

      // increase counter
      loop_node_counter_vvr++;
      loop_node_counter_vvr_determination++;

      if ((VVR_DEGRAD_PATTERN.length - 1) === degrad_pattern_loop_counter) {
          degrad_pattern_loop_counter = 0;
      } else {
          degrad_pattern_loop_counter++;
      }

      if ((VVR_PROB_VALUE.length - 1) === prob_value_loop_counter) {
        prob_value_loop_counter = 0;
      } else {
        prob_value_loop_counter++;
      }

      // kill any remaining setTimeout handlers
      jsPsych.pluginAPI.clearAllTimeouts();
      // kill all setTimeouts
      while (timerId--) {
        window.clearTimeout(timerId); // will do nothing if no timeout with id is present
      }

      // kill keyboard listeners
      if (typeof keyboardListener !== 'undefined') {
          jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
          jsPsych.pluginAPI.cancelClickResponse(clickListener);
      }

      // gather the data to store for the trial
      var trial_data = {
        stage_name: trial.stage_name,
        stimulus: trial.stimulus,
        block_number: loop_node_counter_vvr,
        events: JSON.stringify(response.trial_events),
      };

      // clear the display
      display_element.innerHTML = '';

      // move on to the next trial
      jsPsych.finishTrial(trial_data);
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
        persist: false,
        allow_held_key: false
      });
    }

     // end trial if trial_duration is set
    if (trial.trial_duration !== null) {
      jsPsych.pluginAPI.setTimeout(function() {
        end_trial();
      }, trial.trial_duration);
    }

    var microModalConfig = {
      onShow: function() {
        response.trial_events.push({
          "event_type": 'error message',
          "event_raw_details": 'Error message',
          "event_converted_details": 'popup triggered popup_duration_machine',
          "timestamp": jsPsych.totalTime(),
          "time_elapsed": jsPsych.totalTime() - timestamp_onload
        });
      },
      onClose: function() {
        response.trial_events.push({
          "event_type": 'popup closed',
          "event_raw_details": 'Close',
          "event_converted_details": 'blank vending machine appears',
          "timestamp": jsPsych.totalTime(),
          "time_elapsed": jsPsych.totalTime() - timestamp_onload
        });

        isStoppedTest = false;
        setModalShowTimer();
      },
    };

    /**
     * Set timer to show modal window.
     * The modal should appear if the user hasn't clicked anything.
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
  }

  return plugin;
})();
