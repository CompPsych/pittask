jsPsych.plugins['ISI'] = (function () {
  var plugin = {};

  plugin.info = {
    name: 'ISI',
    stage_name: 'ISI',
    description: '',
    parameters: {
      questions: {
        type: jsPsych.plugins.parameterType.COMPLEX,
        array: true,
        pretty_name: 'Questions',
        nested: {
          prompt: {
            type: jsPsych.plugins.parameterType.STRING,
            pretty_name: 'Prompt',
            default: undefined,
            description: 'The strings that will be associated with a group of options.'
          },
          options: {
            type: jsPsych.plugins.parameterType.STRING,
            pretty_name: 'Options',
            array: true,
            default: undefined,
            description: 'Displays options for an individual question.'
          },
          required: {
            type: jsPsych.plugins.parameterType.BOOL,
            pretty_name: 'Required',
            default: false,
            description: 'Subject will be required to pick an option for each question.'
          },
          horizontal: {
            type: jsPsych.plugins.parameterType.BOOL,
            pretty_name: 'Horizontal',
            default: false,
            description: 'If true, then questions are centered and options are displayed horizontally.'
          },
          name: {
            type: jsPsych.plugins.parameterType.STRING,
            pretty_name: 'Question Name',
            default: '',
            description: 'Controls the name of data values associated with this question'
          }
        }
      },
      randomize_question_order: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Randomize Question Order',
        default: false,
        description: 'If true, the order of the questions will be randomized'
      },
      preamble: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Preamble',
        default: null,
        description: 'HTML formatted string to display at the top of the page above all the questions.'
      },
      button_label: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Button label',
        default: 'Continue',
        description: 'Label of the button.'
      },
      time_stamp: {
        type: jsPsych.plugins.parameterType.OBJECT,
        pretty_name: 'Timestamp',
        default: {},
        description: 'Object for collecting timestamp'
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
  plugin.trial = function (display_element, trial) {

    var plugin_id_name = "jspsych-survey-multi-choice-ISI";
    var html = "";

    // store responses, events
    var response = {
      trial_events: []
    };
    var timestamp_onload = jsPsych.totalTime();

    response.trial_events.push({
      "event_type": trial.event_type,
      "event_raw_details": trial.event_raw_details,
      "event_converted_details": trial.event_converted_details,
      "timestamp": jsPsych.totalTime(),
      "time_elapsed": jsPsych.totalTime() - timestamp_onload
    });

    html += '<div id="translation-listener">translate</div>';
    // inject CSS for trial
    html += '<style id="jspsych-survey-multi-choice-css">';
    html += ".jspsych-survey-multi-choice-question { text-align: left; }" +
      ".jspsych-survey-multi-choice-text span.required {color: darkred;}" +
      ".jspsych-survey-multi-choice-left-top { display: flex; justify-content: flex-end; align-items: center; }" +
      ".jspsych-survey-multi-choice-left-top p { margin: 0; }" +
      ".jspsych-survey-multi-choice-option { padding: 0; }" +
      ".jspsych-survey-multi-choice-contain { display: flex; padding-top: 4rem; }" +
      ".jspsych-survey-multi-choice-number { display: flex; height: 100%; padding-right: 1rem; text-align: center; justify-content: center; }" +
      ".jspsych-content { width: 1000px; min-width: 700px; }" +
      ".jspsych-btn { margin: 100px 0; }" +
      ".jspsych-content { margin-top: 130px;}" +
      ".jspsych-survey-multi-choice-left { width: 40%}" +
      ".jspsych-survey-multi-choice-right { width: 60%}" +
      ".jspsych-survey-multi-choice-option-left { width: 40%; border-right: 0; }" +
      "#jspsych-survey-multi-choice-0  .jspsych-survey-multi-choice-option-left { width: 100%; }" +
      ".jspsych-survey-multi-choice-option-right { width: 60%}" +
      ".jspsych-survey-highlight { cursor: pointer; width: 50px; height: 50px; border-radius: 50%; display: flex; justify-content: center; align-items: center; margin: .6rem; }" +
      ".jspsych-survey-multi-choice-right { width: 100%; display: flex; justify-content: space-around; }" +
      ".jspsych-survey-multi-choice-right-top { width: 60%; display: flex; justify-content: space-around; }" +
      ".jspsych-survey-multi-choice-right-top-main { width: 60%; display: flex; justify-content: space-around; border-bottom: 1px solid; }" +
      ".jspsych-survey-multi-choice-preamble { text-align: left; } .jspsych-survey-multi-choice-preamble h2 {text-align: center} .preamble-wrapper {display: flex;} .preamble-wrapper p {padding-left: 2rem;}" +
      "label.jspsych-survey-multi-choice-text input[type='radio'] {margin-right: 1em;}" +
      "@media (max-width: 700px) {" +
        ".jspsych-display-element { font-size: 13px;}" +
        ".jspsych-survey-multi-choice-option-left, .jspsych-survey-multi-choice-left  { width: 30%; }" +
        ".jspsych-survey-multi-choice-option-right, .jspsych-survey-multi-choice-right-top, .jspsych-survey-multi-choice-right-top-main { width: 70%; }" +
        ".jspsych-survey-multi-choice-instructions ul { width: 70%; }" +
        ".jspsych-survey-multi-choice-number { width: 25px; }" +
      "}";
    html += '</style>';

    // fixed heder
    html += 
      '<header>' +
      '<nav class="navbar navbar-inverse navbar-fixed-top">' +
      '<div class="container-fluid">' +
      '<div class="navbar-header">' +
      '<p class="navbar-text"><b>' + plugin.info.name + '</b></p>' +
      '</div>' +
      '</div>' +
      '</nav>' +
      '</header>';

    // show preamble text
    if (trial.preamble !== null) {
      html += '<div id="jspsych-survey-multi-choice-preamble" class="jspsych-survey-multi-choice-preamble">' + trial.preamble + '</div>';
    }

    // form element
    html += '<div id="' + plugin_id_name + '">';
    html += '<form id="jspsych-survey-multi-choice-form" novalidate>';

    // generate question order. this is randomized here as opposed to randomizing the order of trial.questions
    // so that the data are always associated with the same question regardless of order
    var question_order = [];
    for (var i = 0; i < trial.questions.length; i++) {
      question_order.push(i);
    }

    if (trial.randomize_question_order) {
      question_order = jsPsych.randomization.shuffle(question_order);
    }

    // add multiple-choice questions
    for (var i = 0; i < trial.questions.length; i++) {

      // get question based on question_order
      var question = trial.questions[question_order[i]];
      var question_id = question_order[i];

      // create question container
      var question_classes = ['jspsych-survey-multi-choice-question'];
      if (question.horizontal) {
        question_classes.push('jspsych-survey-multi-choice-horizontal');
      }

      
      if(i !== 0) {
          html += '<div id="jspsych-survey-multi-choice-' + question_id + '" class="jspsych-survey-multi-choice-contain"  data-name="' + question.name + '">';
      } else {
          html += '<div id="jspsych-survey-multi-choice-' + question_id + '" class="' + question_classes.join(' ') + '"  data-name="' + question.name + '">';
      }

      // add question text
      html += '<div class="jspsych-survey-multi-choice-option-left"><span class="jspsych-survey-multi-choice-number">'+ (i + 1) +'.</span><p class="jspsych-survey-multi-choice-text survey-multi-choice jspsych-survey-multi-choice-question">' + question.prompt
      // question.required
      html += '</p></div>';

      i !== 0 ? html += '<div class="jspsych-survey-multi-choice-option-right">': html += '<div>';

      html += '<div style="width: 100%; ">';
      for (var j = 0; j < question.options.length; j++) {
        if (question_id === 0) {
          if (j === 0) {
            html += '<div style="display: flex;"><div class="jspsych-survey-multi-choice-left"></div><div class="jspsych-survey-multi-choice-right-top-main">';
            for (var index = 0; index < question.title.length; index++) {
              html += '<div>' + question.title[index] + '</div>';
            }
            html += '</div>';
          }
        } 
        else {
          if (j === 0) {
            html += '<div style="display: flex;"><div style="width: 100%; display: flex; justify-content: space-around;">';
            for (var index = 0; index < question.title.length; index++) {
              html += '<div style="display: flex; justify-content: center; align-items: center; width: 100px; text-align: center;">' + question.title[index] + '</div>';
            }
            html += '</div>';
          }

        }
      }
      html += '</div>';
      html += '<div class="jspsych-survey-multi-choice-right">';

      for (var j = 0; j < question.options.length; j++) {
        if (question_id != 0) {
          var option_id_name = "jspsych-survey-multi-choice-option-" + question_id + "-" + j;
          var input_name = 'jspsych-survey-multi-choice-response-' + question_id;
          var input_id = 'jspsych-survey-multi-choice-response-' + question_id + '-' + j;

          // add radio button container
          html += '<div id="' + option_id_name + '" class="jspsych-survey-multi-choice-option jspsych-survey-question">';
          html += '<label class="jspsych-survey-multi-choice-text jspsych-survey-highlight" data-time-stamp="Q' + i + '" data-question-number="Q' + (i+1) +'A' + (j+1) +'" for="' + input_id + '">' + question.options[j] + '</label>';
          html += '<input hidden type="radio" name="' + input_name + '" id="' + input_id + '" data-time-stamp="Q' + i + '" data-question-number="Q' + (i+1) +'A' + (j+1) +'" value="' + question.options[j] + '"></input>';
          html += '</div>';
        }

      }
      
      html += '</div>';
      for (var j = 0; j < question.options.length; j++) {
        if (question_id === 0) {
          html += '<div style="display: flex;" id="jspsych-survey-multi-choice-1-' + j + '"><div class="jspsych-survey-multi-choice-left jspsych-survey-multi-choice-left-top jspsych-survey-multi-choice-question"><p>' + question.options[j].prompt + '</p></div>';
          html += '<div class="jspsych-survey-multi-choice-right-top">';
          for (var k = 0; k < question.options[j].options.length; k++) {
            var option_id_name = "jspsych-survey-multi-choice-option-" + question_id + "-" + j + '-' + k;
            var input_name = 'jspsych-survey-multi-choice-response-' + question_id + '-' + j;
            var input_id = 'jspsych-survey-multi-choice-response-' + question_id + '-' + j + '-' + k;

            html += '<div id="' + option_id_name + '" class="jspsych-survey-multi-choice-option">';
            html += '<label class="jspsych-survey-multi-choice-text jspsych-survey-highlight" data-time-stamp="Q' + (i+1) + 'S' + (j+1) + '" data-question-number="Q' + (i+1) + 'S' + (j+1) + 'A' + (k+1) +'" for="' + input_id + '">' + question.options[j].options[k] + '</label>';
            html += '<input hidden type="radio" name="' + input_name + '" id="' + input_id + '" data-time-stamp="Q' + i + '" data-question-number="Q' + (i+1) +'A' + (j+1) +'" value="' + question.options[j].options[k] + '"></input></div>';
          }
          html += '</div>'
          html += '</div>'
        }

      }
      html += '</div>';
      html += '</div>';
      html += '</div>';
    }

    // add submit button
    html += '<input type="submit" id="' + plugin_id_name + '-next" class="' + plugin_id_name + ' jspsych-btn"' + (trial.button_label ? ' value="' + trial.button_label + '"' : '') + '></input>';
    html += '</form>';

    // add modal
    html +=
      `<div class="modal micromodal-slide" id="modal-1" aria-hidden="true">
          <div class="modal__overlay" tabindex="-1" data-micromodal-close>
            <div class="modal__container" role="dialog" aria-modal="true" aria-labelledby="modal-1-title">
              <header class="modal__header">
                <button class="modal__close" aria-label="Close modal" data-micromodal-close></button>
              </header>
              <main class="modal__content" id="modal-1-content">
                <p>
                ${popup_text_WBF}
                </p>
              </main>
              <footer class="modal__footer">
                <button class="modal__btn" data-micromodal-close aria-label="Close this dialog window">Close</button>
              </footer>
            </div>
          </div>
      </div>`;

    html += jsPsych.pluginAPI.getPopupHTML('translator-detected', popup_text_translator);

    // render
    display_element.innerHTML = html;

    // function to handle responses by the subject
    var after_response = function (info) {

      if (info.key_release === undefined) {
        response.trial_events.push({
          "event_type": "key press",
          "event_raw_details": info.key,
          "event_converted_details": jsPsych.pluginAPI.convertKeyCodeToKeyCharacter(info.key) + ' key pressed',
          "timestamp": jsPsych.totalTime(),
          "time_elapsed": jsPsych.totalTime() - timestamp_onload
        });

        if(info.el) {
          if(info.el.dataset.timeStamp) {
            trial.time_stamp[info.el.dataset.timeStamp] = jsPsych.totalTime();
          }
          if(info.el.dataset.questionNumber) {
            response.trial_events.push({
              "event_type": "answer displayed",
              "event_raw_details": info.el.dataset.questionNumber,
              "event_converted_details": info.el.dataset.questionNumber + ' answer displayed',
              "timestamp": jsPsych.totalTime(),
              "time_elapsed": jsPsych.totalTime() - timestamp_onload
            });
          }
        }
      } else {
        response.trial_events.push({
          "event_type": "key release",
          "event_raw_details": info.key_release,
          "event_converted_details": jsPsych.pluginAPI.convertKeyCodeToKeyCharacter(info.key_release) + ' key released',
          "timestamp": jsPsych.totalTime(),
          "time_elapsed": jsPsych.totalTime() - timestamp_onload
        });
      }
    }

    $('.jspsych-survey-question').parent().css('border-top', '1px solid')

    // highlight input
    $('.jspsych-survey-highlight').click(function () {
      $(this).parent().parent().find('.jspsych-survey-highlight').removeClass('bg-primary');
      $(this).addClass('bg-primary');
    });

    // forced click event fix for some laptops touchpad
    $("label").on("click",function(){
      var labelID = $(this).attr('for');
      $("#" + labelID).prop('checked', true).trigger('click').trigger('change');
    });

    // save timestamp on input click
    $("input[type=radio]").on("click change touchstart",function(){
      var time_stamp_key = $(this).data('time-stamp'); 
      if(time_stamp_key) {
        trial.time_stamp[time_stamp_key] = jsPsych.totalTime();
      };
    });

    
    function proccessDataBeforeSubmit(validate = false) {
      // create object to hold responses
      var question_data = {};
      var timestamp_data = {};

      for (var i = 0; i < trial.questions.length; i++) {
        var match = display_element.querySelector('#jspsych-survey-multi-choice-' + i);
        var id = i + 1;
        var val = '';

        if (match.querySelector('input[type=radio]:checked') !== null) {
          val = match.querySelector('input[type=radio]:checked').value;

          $(match).find('.jspsych-survey-multi-choice-question-text').removeClass('survey-error-after');
          $(match).find('.jspsych-survey-multi-choice-number').removeClass('survey-error-text');
        } else if (validate) {
          val = '';

          $(match).find('.jspsych-survey-multi-choice-question-text').addClass('survey-error-after');
          $(match).find('.jspsych-survey-multi-choice-number').addClass('survey-error-text');
        }

        var obje = {};
        var name = id;

        if (match.attributes['data-name'].value !== '') {
          name = match.attributes['data-name'].value;
        }

        obje[name] = val;
        timestamp_data[name] = trial.time_stamp['Q' + id];
        Object.assign(question_data, obje);
      }

      for (var i = 0; i < trial.questions[0].options.length; i++) {
        var match = display_element.querySelector('#jspsych-survey-multi-choice-1-' + i);
        var match_first = display_element.querySelector('#jspsych-survey-multi-choice-0');
        var id_array = ['1 (falling)', '1 (staying)', '1 (waking)'];
        var id = id_array[i];
        var val = '';

        if (match.querySelector('input[type=radio]:checked') !== null) {
          val = match.querySelector('input[type=radio]:checked').value;

          $(match).find('.jspsych-survey-multi-choice-question').removeClass('survey-error-after');
          $(match_first).find('.jspsych-survey-multi-choice-number').removeClass('survey-error-text');
          $(match_first).find('.jspsych-survey-multi-choice-option-left .jspsych-survey-multi-choice-text').removeClass('survey-error-after');
        } else if (validate) {
          val = '';

          $(match).find('.jspsych-survey-multi-choice-question').addClass('survey-error-after');
          $(match).find('.jspsych-survey-multi-choice-number').addClass('survey-error-text');
          $(match_first).find('.jspsych-survey-multi-choice-number').addClass('survey-error-text');
          $(match_first).find('.jspsych-survey-multi-choice-option-left .jspsych-survey-multi-choice-text').addClass('survey-error-after');
        }

        if (validate && (display_element.querySelector('#jspsych-survey-multi-choice-1-' + 0).querySelector('input[type=radio]:checked') === null ||
          display_element.querySelector('#jspsych-survey-multi-choice-1-' + 1).querySelector('input[type=radio]:checked') === null)) {
          $(match_first).find('.jspsych-survey-multi-choice-option-left .jspsych-survey-multi-choice-text').addClass('survey-error-after');
          $(match_first).find('.jspsych-survey-multi-choice-number').addClass('survey-error-text');
        }

        var obje = {};
        var name = id;

        timestamp_data[id] = trial.time_stamp['Q1S' + (i + 1)];
        obje[name] = val;
        Object.assign(question_data, obje);
      }

      return {
        'stage_name': JSON.stringify(plugin.info.stage_name),
        'responses': JSON.stringify(question_data),
        'timestamp': JSON.stringify(timestamp_data),
        'time_stamp': JSON.stringify(trial.time_stamp),
        'question_order': JSON.stringify(question_order),
        'events': JSON.stringify(response.trial_events),
      };
    }

    const translatorTarget = document.getElementById('translation-listener')
    jsPsych.pluginAPI.initializeTranslatorDetector(translatorTarget, 'translate', response, timestamp_onload, proccessDataBeforeSubmit);

    document.querySelector('form').addEventListener('submit', function (event) {
      event.preventDefault();
      response.trial_events.push({
        "event_type": "button clicked",
        "event_raw_details": 'Submit',
        "event_converted_details": '"Submit" selected',
        "timestamp": jsPsych.totalTime(),
        "time_elapsed": jsPsych.totalTime() - timestamp_onload
      });

      var trial_data = proccessDataBeforeSubmit(true);

      if ($(".survey-error-after").length < 1) {
        // kill keyboard listeners
        if (typeof keyboardListener !== 'undefined') {
          jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
          jsPsych.pluginAPI.cancelClickResponse(clickListener);
        }

        // clear the display
        display_element.innerHTML = '';

        // next trial
        jsPsych.finishTrial(trial_data);
      } else {
        // show modal, register events
        MicroModal.show('modal-1', {
          onShow() {
            response.trial_events.push({
              "event_type": "error message",
              "event_raw_details": 'Error message',
              "event_converted_details": 'popup triggered by incomplete WBF question',
              "timestamp": jsPsych.totalTime(),
              "time_elapsed": jsPsych.totalTime() - timestamp_onload
            });
          },
          onClose() {
            response.trial_events.push({
              "event_type": "popup closed",
              "event_raw_details": 'Close',
              "event_converted_details": trial.event_converted_details,
              "timestamp": jsPsych.totalTime(),
              "time_elapsed": jsPsych.totalTime() - timestamp_onload
            });
          }
        });
      }


    });

    // start the response listener
    var keyboardListener = jsPsych.pluginAPI.getKeyboardResponse({
      callback_function: after_response,
      valid_responses: jsPsych.ALL_KEYS,
      rt_method: 'performance',
      persist: true,
      allow_held_key: false
    });
    var clickListener = jsPsych.pluginAPI.getMouseResponse({
      callback_function: after_response,
      valid_responses: jsPsych.ALL_KEYS,
      rt_method: 'performance',
      persist: true,
      allow_held_key: false
    });
  };

  return plugin;
})();