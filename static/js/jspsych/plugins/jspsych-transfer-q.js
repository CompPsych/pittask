jsPsych.plugins['transfer-q'] = (function () {
  var plugin = {};

  plugin.info = {
    name: 'transfer-q',
    parameters: {
      stage_name: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Stage Name',
        default: null,
        description: 'Specific name of the current stage.'
      },
      vars: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Text variables',
        default: null,
        description: 'Text variables.'
      }
    }
  }

  plugin.trial = function (display_element, trial) {
    // store response
    var response = {
      trial_events: [],
      vas_response: 0,
      transfer_a_timestamp: 0
    };

    var timestamp_onload = jsPsych.totalTime();
    var machine_color = trial.color;
    var machine_color_name = trial.name;
    var left_text = trial.left_text;
    var right_text = trial.right_text;
    var transfer_q_text1 = trial.question_text1;
    var transfer_q_text2 = trial.question_text2;
    var item_id = trial.item_id;

    // add question
    var html =
      '<div id="jspsych-stimulus" class="container">' +
      '<div class="col-md-3 hide-left"></div>' +
      '<div class="col-md-6">' +
      '<p style="margin-bottom: 3rem; ">' + transfer_q_text1 + "</p>" +
      '<svg class="vending-machine" viewBox="0 0 253 459" x="10" fill="none" xmlns="http://www.w3.org/2000/svg">' +
      '<rect x="27" y="20" width="203" height="359" fill="' + machine_color + '"/>' +
      '<path fill-rule="evenodd" clip-rule="evenodd" d="M253 0V440.506H209.527V459H44.6212V440.506H0V0H253ZM222 279H32V363H222V279ZM59.957 282.531L133.253 309.209L118.546 349.616L45.2501 322.938L59.957 282.531ZM86 210H32V256H86V210ZM154 210H100V256H154V210ZM222 210H168V256H222V210ZM86 148H32V194H86V148ZM154 148H100V194H154V148ZM222 148H168V194H222V148ZM86 86H32V132H86V86ZM154 86H100V132H154V86ZM222 86H168V132H222V86ZM86 24H32V70H86V24ZM154 24H100V70H154V24ZM222 24H168V70H222V24Z" fill="white"/>' +
      "</svg>" +
      '<div class="votes-container-transfer">' +
      '<div class="description-transfer">' +
      '<div class="description--left">';

    if (item_id === 3) {
      // add rotated vending machine above the VAS
      html +=
        '<svg class="vending-machine-icon-left" viewBox="0 0 253 459" x="10" fill="none" xmlns="http://www.w3.org/2000/svg">' +
        '<rect x="27" y="20" width="203" height="359" fill="#000"/>' +
        '<path fill-rule="evenodd" clip-rule="evenodd" d="M253 0V440.506H209.527V459H44.6212V440.506H0V0H253ZM222 279H32V363H222V279ZM59.957 282.531L133.253 309.209L118.546 349.616L45.2501 322.938L59.957 282.531ZM86 210H32V256H86V210ZM154 210H100V256H154V210ZM222 210H168V256H222V210ZM86 148H32V194H86V148ZM154 148H100V194H154V148ZM222 148H168V194H222V148ZM86 86H32V132H86V86ZM154 86H100V132H154V86ZM222 86H168V132H222V86ZM86 24H32V70H86V24ZM154 24H100V70H154V24ZM222 24H168V70H222V24Z" fill="white"/>' +
        "</svg>";
    }

    html +=
      "<div><p>" + left_text + "</p></div>" +
      "</div>" +
      '<div class="description--right">';

    if (item_id === 3) {
      // add rotated vending machine above the VAS
      html +=
        '<svg class="vending-machine-icon-right" viewBox="0 0 253 459" x="10" fill="none" xmlns="http://www.w3.org/2000/svg">' +
        '<rect x="27" y="20" width="203" height="359" fill="#000"/>' +
        '<path fill-rule="evenodd" clip-rule="evenodd" d="M253 0V440.506H209.527V459H44.6212V440.506H0V0H253ZM222 279H32V363H222V279ZM59.957 282.531L133.253 309.209L118.546 349.616L45.2501 322.938L59.957 282.531ZM86 210H32V256H86V210ZM154 210H100V256H154V210ZM222 210H168V256H222V210ZM86 148H32V194H86V148ZM154 148H100V194H154V148ZM222 148H168V194H222V148ZM86 86H32V132H86V86ZM154 86H100V132H154V86ZM222 86H168V132H222V86ZM86 24H32V70H86V24ZM154 24H100V70H154V24ZM222 24H168V70H222V24Z" fill="white"/>' +
        "</svg>";
    }

    html +=
      "<div><p>" + right_text + "</p></div>" +
      "</div>" +
      "</div>" +
      '<div id="slider">' +
      '<span class="line"></span>' +
      "</div>" +
      '<div class="instructions-wrap hide-left">' +
      '<ul class="instructions">' +
      "<li>Please click anywhere on the line to answer the question</li>" +
      "</ul>" +
      "</div>" +
      "</div>" +
      "</div>";

    // add secondary question
    html +=
      '<div class="transfer-q-right-side col-md-6" style="display: none;">' +
      '<form id="jspsych-survey-multi-choice" class="transfer-q-form">' +
      '<p style="padding-bottom: 5rem;">' + transfer_q_text2 + "</p>" +
      '<textarea class="text_box" rows="8" cols="50" name="comment" placeholder="Please type here..." form="usrform"></textarea>' +
      '<div style="padding: 5rem 0;"><input type="submit" class="jspsych-btn" value="Submit answer"></div>' +
      "</form>" +
      '<ul class="instructions-transfer">' +
      "<li>Type your answer in the text box</li>" +
      "<li>Click 'Submit answer' when ready</li>" +
      "</ul>" +
      "</div>";

    // close wrapper
    html += "</div>";

    // add modal
    html += `<div class="modal micromodal-slide" id="modal-1" aria-hidden="true">
      <div class="modal__overlay" tabindex="-1">
      <div class="modal__container" role="dialog" aria-modal="true" aria-labelledby="modal-1-title">
      <header class="modal__header">
      <button class="modal__close" aria-label="Close modal" data-micromodal-close></button>
      </header>
      <main class="modal__content" id="modal-1-content">
      <p>${transfer_popup_text}</p>
      </main>
      <footer class="modal__footer">
      <button class="modal__btn" data-micromodal-close aria-label="Close this dialog window">Close</button>
      </footer>
      </div>
      </div>
      </div>`;

    html += '<div id="translation-listener">translate</div>';
    html += jsPsych.pluginAPI.getPopupHTML('translator-detected', popup_text_translator);

    // render
    display_element.innerHTML = html;

    response.trial_events.push({
      event_type: 'question appears',
      event_raw_details: 'question ' + item_id + '(a) ' + machine_color_name + ' appears',
      event_converted_details: 'transfer_q question-left belief strength text appears',
      timestamp: jsPsych.totalTime(),
      time_elapsed: jsPsych.totalTime() - timestamp_onload,
    });

    // init VAS slider
    $("#slider").slider({
      value: 5,
      min: 0,
      max: 10,
      step: 0.01,
      change: function (event, ui) {
        $(".ui-slider .ui-slider-handle").css("visibility", "visible");
        $("#slider").slider("disable");

        response.vas_response = ui.value.toFixed(2);
        response.trial_events.push({
          event_type: "VAS answer has been made",
          event_raw_details: ui.value.toFixed(2),
          event_converted_details: ui.value.toFixed(2) + " answer has been made",
          timestamp: jsPsych.totalTime(),
          time_elapsed: jsPsych.totalTime() - timestamp_onload,
        });

        // hide div left side of the transfer-a
        $(".hide-left ").css("display", "none");

        // show transfer-b question
        $(".transfer-q-right-side ").fadeIn("slow");

        // record when transfer-a response was made  
        response.transfer_a_timestamp = jsPsych.totalTime();

        response.trial_events.push({
          event_type: 'question appears',
          event_raw_details: 'question ' + item_id + '(b) ' + machine_color_name + ' appears',
          event_converted_details: 'transfer_q question-right rationale text appears',
          timestamp: jsPsych.totalTime(),
          time_elapsed: jsPsych.totalTime() - timestamp_onload,
        });

      },
    });

    // function to handle responses by the subject
    var after_response = function (info) {
      if (info.key_release === undefined) {
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
            jsPsych.pluginAPI.convertKeyCodeToKeyCharacter(info.key_release) +
            " key released",
          timestamp: jsPsych.totalTime(),
          time_elapsed: jsPsych.totalTime() - timestamp_onload,
        });
      }
    };

    function proccessDataBeforeSubmit() {
      var form_text_value = $(".text_box").val();
      return {
        stage_name: JSON.stringify(trial.stage_name),
        stimulus: JSON.stringify(machine_color_name),
        timestamp: response.transfer_a_timestamp,
        events: JSON.stringify(response.trial_events),
        item_id: JSON.stringify(item_id),
        strength_of_belief: JSON.stringify(response.vas_response),
        text: JSON.stringify(form_text_value),
      };
    }

    const translatorTarget = document.getElementById('translation-listener')
    jsPsych.pluginAPI.initializeTranslatorDetector(translatorTarget, 'translate', response, timestamp_onload, proccessDataBeforeSubmit);

    // form functionality
    document.querySelector("form").addEventListener("submit", function (event) {
      event.preventDefault();
      response.trial_events.push({
        event_type: "button clicked",
        event_raw_details: "Submit",
        event_converted_details: '"Submit" selected',
        timestamp: jsPsych.totalTime(),
        time_elapsed: jsPsych.totalTime() - timestamp_onload,
      });

      var trial_data = proccessDataBeforeSubmit();

      if (trial_data.text.length >= transfer_q_text_limit) {
        // kill keyboard listeners
        if (typeof keyboardListener !== "undefined") {
          jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
          jsPsych.pluginAPI.cancelClickResponse(clickListener);
        }

        // clear the display
        display_element.innerHTML = "";

        // next trial
        jsPsych.finishTrial(trial_data);
      } else {
        // show modal, register events
        MicroModal.show("modal-1", {
          onShow() {
            response.trial_events.push({
              event_type: "error message",
              event_raw_details: "Error message",
              event_converted_details: "popup triggered by incomplete transfer_q question",
              timestamp: jsPsych.totalTime(),
              time_elapsed: jsPsych.totalTime() - timestamp_onload,
            });
          },
          onClose() {
            response.trial_events.push({
              event_type: "popup closed",
              event_raw_details: "Close",
              event_converted_details: 'transfer_q question-right rationale text appears',
              timestamp: jsPsych.totalTime(),
              time_elapsed: jsPsych.totalTime() - timestamp_onload,
            });
          },
        });
      }
    });

    // start the response listener
    if (trial.choices !== jsPsych.NO_KEYS) {
      var keyboardListener = jsPsych.pluginAPI.getKeyboardResponse({
        callback_function: after_response,
        valid_responses: trial.choices,
        rt_method: "performance",
        persist: true,
        allow_held_key: false,
      });

      var clickListener = jsPsych.pluginAPI.getMouseResponse({
        callback_function: after_response,
        valid_responses: trial.choices,
        rt_method: "date",
        persist: false,
        allow_held_key: false,
      });
    }
  }

  return plugin;
})();