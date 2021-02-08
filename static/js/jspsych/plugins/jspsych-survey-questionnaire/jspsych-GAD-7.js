jsPsych.plugins['GAD-7'] = (function() {
  var plugin = {};

  plugin.info = {
    name: 'GAD-7',
    stage_name: 'GAD-7',
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
        default:  'Continue',
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
  };

  plugin.trial = function(display_element, trial) {
    var plugin_id_name = "jspsych-survey-multi-choice-GAD-7";
    var html = "";
    // store response
    var response = {
      trial_events: []
    };
    var timestamp_onload = jsPsych.totalTime();

    // timer module init
    if (jsPsych.pluginAPI.isNeedToStartTimerModuleInitialization(trial.type, 'GAD-7')) {
      timerModule = jsPsych.pluginAPI.initializeTimerModule(response, timestamp_onload, '');
    }

    response.trial_events.push({
      "event_type": trial.event_type,
      "event_raw_details": trial.event_raw_details,
      "event_converted_details": trial.event_converted_details,
      "timestamp": jsPsych.totalTime(),
      "time_elapsed": jsPsych.totalTime() - timestamp_onload
    });

    $('body').prepend(
      `<header>
          <nav class="navbar navbar-inverse navbar-fixed-top">
            <div class="container-fluid">
              <div class="navbar-header">
              <p class="navbar-text">${plugin.info.name}</p>
              </div>
            </div>
          </nav>
    </header>`);

    // inject CSS for trial
    html += '<style id="jspsych-survey-multi-choice-css">';
    html += ".jspsych-survey-multi-choice-question { display: flex; text-align: left; }"+
      ".jspsych-survey-multi-choice-text span.required {color: darkred;}"+
      ".jspsych-survey-multi-choice-horizontal .jspsych-survey-multi-choice-text {  text-align: center;}"+
      ".jspsych-survey-multi-choice-horizontal { border-bottom: 1px solid #fff; }"+
      ".jspsych-survey-multi-choice-option { line-height: 2; border-right: 1px solid #fff; }"+
      ".jspsych-survey-multi-choice-option:last-child { border-right: none; }"+
      "#jspsych-survey-multi-choice-6 { border-bottom: none; }"+
      "#jspsych-survey-multi-choice-6 .jspsych-survey-multi-choice-question { border-bottom: none; }"+
      ".jspsych-survey-multi-choice-horizontal .jspsych-survey-multi-choice-option {  display: flex; width: 100%; justify-content: center; align-items: center; padding: 1rem 0;  }"+
      ".jspsych-survey-multi-choice-number { display: flex; height: 100%; width: 45px; text-align: center; justify-content: center; }" +
      ".jspsych-survey-highlight { cursor: pointer; width: 50px; height: 50px; border-radius: 50%; display: flex; justify-content: center; align-items: center; }" +
      ".jspsych-survey-multi-choice-form { max-width: 1000px }" +
      ".jspsych-btn { margin: 100px 0; }" +
      ".jspsych-content { margin-top: 130px;}" +
      "ul {list-style: none}" +
      ".jspsych-survey-multi-choice-option-left { display: flex; width: 40%; text-align: left; border-right: 3px solid #fff; padding-right: .3rem; }" +
      ".jspsych-survey-multi-choice-option-right { display: flex; width: 60%; justify-content: space-around; }" +
      ".jspsych-survey-multi-choice-instructions { display: flex; justify-content: space-between; border-bottom: 3px solid #fff; }" +
      ".jspsych-survey-multi-choice-instructions div { width: 40%; text-align: left; padding: 2rem 0; }" +
      ".jspsych-survey-multi-choice-instructions ul { display: flex; width: 60%; justify-content: space-around; padding-inline-start: 0; margin-bottom: 0; }" +
      ".jspsych-survey-multi-choice-instructions li { width: 100%; display: flex; justify-content: center; align-items: center; border-right: 1px solid #fff; padding: 3rem 0; }" +
      ".jspsych-survey-multi-choice-instructions li:last-child { border-right: none; }" +
      "label.jspsych-survey-multi-choice-text input[type='radio'] {margin-right: 1em;}" +
      ".jspsych-survey-highlight { width: 50px; height: 50px; border-radius: 50%; display: flex; justify-content: center; align-items: center; }" +
      "@media (max-width: 700px) {" +
        ".jspsych-display-element { font-size: 14px;}" +
        ".jspsych-survey-multi-choice-option-left, .jspsych-survey-multi-choice-instructions div { width: 30%; }" +
        ".jspsych-survey-multi-choice-option-right { width: 70%; }" +
        ".jspsych-survey-multi-choice-instructions ul { width: 70%; }" +
        ".jspsych-survey-multi-choice-number { width: 25px; padding-right: 1rem; }" +
      "}"
    html += '</style>';

    // form element
    html += '<div id="' + plugin_id_name + '">'

    html += '<form id="jspsych-survey-multi-choice-form" class="jspsych-survey-multi-choice-form">';

    // show preamble text
    if (trial.preamble !== null) {
      html += '<div class="jspsych-survey-multi-choice-content"><div class="jspsych-survey-multi-choice-preamble">' + trial.preamble + '</div>';
    }

    html +=
    `<div class="jspsych-survey-multi-choice-instructions">
        <div class="jspsych-survey-multi-choice-option-left"></div>
        <ul>
          <li>Not at all</li>
          <li>Several days</li>
          <li>More than half the days</li>
          <li>Nearly every day</li>
        </ul>
    </div>`;

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

      html += '<div id="jspsych-survey-multi-choice-'+question_id+'" class="'+question_classes.join(' ')+'"  data-name="'+question.name+'">';

      // add question text
      html += '<div class="jspsych-survey-multi-choice-option-left jspsych-survey-multi-choice-question"><span class="jspsych-survey-multi-choice-number">' + (i+1) + '.</span><p class=" survey-multi-choice">' + question.prompt
      // question.required
      html += '</p></div>';
      html += '<div class="jspsych-survey-multi-choice-option-right">';

      // create option radio buttons
      for (var j = 0; j < question.options.length; j++) {
        // add label and question text
        var option_id_name = "jspsych-survey-multi-choice-option-"+question_id+"-"+j;
        var input_name = 'jspsych-survey-multi-choice-response-'+question_id;
        var input_id = 'jspsych-survey-multi-choice-response-'+question_id+'-'+j;

        var required_attr = question.required ? 'required' : '';

        // add radio button container
        html += '<div id="'+option_id_name+'" class="jspsych-survey-multi-choice-option">';
        html += '<label class="jspsych-survey-multi-choice-text jspsych-survey-highlight" data-time-stamp="Q' + (i+1) + '" data-question-number="Q' + (i+1) +'A' + (j+1) +'" for="'+input_id+'">' +question.options[j]+'</label>';
        html += '<input hidden type="radio" name="'+input_name+'" id="'+input_id+'" data-time-stamp="Q' + (i+1) + '" data-question-number="Q' + (i+1) +'A' + (j+1) +'" value="'+question.options[j]+'" '+required_attr+'></input>';
        html += '</div>';
      }

      html += '</div></div>';
    }

    html += '</div>';

    var checkbox_order = [];

    for (var i = 0; i < trial.checkboxes.length; i++) {
      checkbox_order.push(i);
    }

    for (var i = 0; i < trial.checkboxes.length; i++) {
      var checkbox = trial.checkboxes[checkbox_order[i]];
      var checkbox_id = checkbox_order[i];

      html += '<div id="jspsych-survey-multi-choice-checkbox"   data-name="'+checkbox.name+'">';

      // add question text
      html += '<p class="jspsych-survey-multi-choice-text survey-multi-choice" style="padding: 4rem 0; text-align: left">' + checkbox.prompt + '</p>'

      html += '<div style="display: flex; justify-content: space-around; height: 150px; align-items: baseline; font-size: 18px;">';

      for (var j = 0; j < checkbox.options.length; j++) {
        // add label and question text
        var checkbox_id_name = "jspsych-survey-multi-choice-option-"+checkbox_id+"-"+j;
        var input_name = 'jspsych-survey-multi-choice-response-checkbox-'+checkbox_id;
        var input_id = 'jspsych-survey-multi-choice-response-checkbox-'+checkbox_id+'-'+j;

        var required_attr = checkbox.required ? 'required' : '';

        // add radio button container
        html += '<div id="'+checkbox_id_name+'" class="jspsych-survey-multi-choice-option-checkbox" style="width: 116px">';
        html += '<label class="jspsych-survey-multi-choice-text" data-time-stamp="Q8" for="'+input_id+'">' +checkbox.options[j]+'</label>';
        html += '<input type="radio" name="'+input_name+'" class="form-radio" data-time-stamp="Q8" data-question-number="Q8A' + (j+1) +'" id="'+input_id+'" value="'+checkbox.options[j]+'" '+required_attr+'></input>';
        html += '</div>';
      }

      html += '</div>';
      html += '</div>';
    }

    // add submit button
    html += '<p><input type="submit" id="'+plugin_id_name+'-next" class="'+plugin_id_name+' jspsych-btn"' + (trial.button_label ? ' value="'+trial.button_label + '"': '') + '></input></p>';

    html += '</form>';

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

    // popup of timer module
    if (timerModule) {
      html += timerModule.getPopupHTML();
    }

    // render
    display_element.innerHTML = html;

    // function to handle key press responses
    var after_response = function(info) {
      if (info.key_release === undefined) {
        response.trial_events.push({
          "event_type": "key press",
          "event_raw_details": info.key,
          "event_converted_details": jsPsych.pluginAPI.convertKeyCodeToKeyCharacter(info.key) + ' key pressed',
          "timestamp": jsPsych.totalTime(),
          "time_elapsed": jsPsych.totalTime() - timestamp_onload
        });

        if (info.el) {
          if (info.el.dataset.timeStamp) {
            trial.time_stamp[info.el.dataset.timeStamp] = jsPsych.totalTime();
          }

          if (info.el.dataset.questionNumber) {
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

    // highlight input
    $('.jspsych-survey-highlight').on('click touchstart', function() {
      var time_stamp_key;
      var isSuccess = timerModule ? timerModule.check() : true;

      if (isSuccess) {
        $(this).parent().parent().find('.jspsych-survey-highlight').removeClass('bg-primary');
        $(this).addClass('bg-primary');

        // save timestamp on input click
        time_stamp_key = $(this).parent().find('input[type=radio]');

        if (time_stamp_key) {
          trial.time_stamp[time_stamp_key] = jsPsych.totalTime();
        }
      }

      return isSuccess;
    });

    $(".modal__btn, .modal__close").on("click touchstart", function() {
      response.trial_events.push({
        "event_type": "popup closed",
        "event_raw_details": 'Close',
        "event_converted_details": trial.event_converted_details,
        "timestamp": jsPsych.totalTime(),
        "time_elapsed": jsPsych.totalTime() - timestamp_onload
      });
    });

    document.querySelector('form').addEventListener('submit', function(event) {
      event.preventDefault();
      // measure response time
      var endTime = performance.now();
      var response_time = endTime - startTime;

      response.trial_events.push({
        "event_type": "button clicked",
        "event_raw_details": 'Submit',
        "event_converted_details": '"Submit" selected',
        "timestamp": jsPsych.totalTime(),
        "time_elapsed": jsPsych.totalTime() - timestamp_onload
      });

      // create object to hold responses
      var question_data = {};
      var timestamp_data = {};

      for (var i = 0; i < trial.questions.length; i++) {
        var match = display_element.querySelector('#jspsych-survey-multi-choice-'+i);
        var id = i + 1;

        if (match.querySelector("input[type=radio]:checked") !== null) {
          var val = match.querySelector("input[type=radio]:checked").value;

          $(match).find('.jspsych-survey-multi-choice-question').removeClass('survey-error');
        } else {
          var val = "";

          $(match).find('.jspsych-survey-multi-choice-question').addClass('survey-error');
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

      (function() {
        var match = display_element.querySelector('#jspsych-survey-multi-choice-checkbox');
        var id = "last";
        var val;

        if(match.querySelector("input[type=radio]:checked") !== null){
          val = match.querySelector("input[type=radio]:checked").value;
          timestamp_data[id] = trial.time_stamp['Q8'];
        } else {
          val = "NA";
          timestamp_data[id] = 0;
        }

        var name = id;
        obje[name] = val;

        Object.assign(question_data, obje);
      }());

      if ($(".survey-error").length < 1) {
        // kill keyboard listeners
        if (typeof keyboardListener !== 'undefined') {
          jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
          jsPsych.pluginAPI.cancelClickResponse(clickListener);

          // destroy timer module
          if (timerModule) {
            timerModule.stopTimerModule();
            timerModule = null;
          }
        }

        // save data
        var trial_data = {
          "stage_name": JSON.stringify(plugin.info.stage_name),
          "responses": JSON.stringify(question_data),
          "timestamp": JSON.stringify(timestamp_data),
          "time_stamp": JSON.stringify(trial.time_stamp),
          "question_order": JSON.stringify(question_order),
          "events": JSON.stringify(response.trial_events)
        };

        display_element.innerHTML = '';
        $('.navbar').remove();

        // next trial
        jsPsych.finishTrial(trial_data);
      } else {
        MicroModal.show('modal-1');
        response.trial_events.push({
          "event_type": "error message",
          "event_raw_details": 'Error message',
          "event_converted_details": popup_text_WBF,
          "timestamp": jsPsych.totalTime(),
          "time_elapsed": jsPsych.totalTime() - timestamp_onload
        });
      }
    });

    var startTime = performance.now();

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
