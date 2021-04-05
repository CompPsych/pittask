jsPsych.plugins['survey-pav-multi-choice'] = (function() {
  var plugin = {};

  plugin.info = {
    name: 'survey-multi-choice',
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
      }
    }
  }
  plugin.trial = function(display_element, trial) {

    // store responses, events
    var response = {
        trial_events: []
    };
    var timestamp_onload = pav_con_timer;

    var plugin_id_name = "jspsych-survey-multi-choice";

    var html = "";

    // inject CSS for trial
    html += '<style id="jspsych-survey-multi-choice-css">';
    html += ".jspsych-survey-multi-choice-question { margin-top: 2em; margin-bottom: 2em; text-align: left; }" +
        ".jspsych-survey-multi-choice-text span.required {color: darkred;}" +
        ".jspsych-survey-multi-choice-text {font-size: 2rem;}" +
        ".vending-machine { margin-bottom: 1.6rem;}" +
        "input[type=radio] { margin: 0;}" +
        ".form-radio { top: 0; }" +
        "label.jspsych-survey-multi-choice-text { font-size: 18px; font-weight: 100; margin-bottom: 0; }" +
        ".jspsych-survey-multi-choice-option { display: flex; margin: 1.5rem 3rem; justify-content: flex-start; padding: 0; align-items: baseline;  }" +
        "#jspsych-survey-multi-choice-form { width: 100%; text-align: center;}" +
        ".jspsych-survey-multi-choice-horizontal .jspsych-survey-multi-choice-text {  text-align: center;}" +
        ".jspsych-survey-multi-choice-horizontal .jspsych-survey-multi-choice-option {  display: inline-block;  margin-left: 1em;  margin-right: 1em;  vertical-align: top;}" +
        "label.jspsych-survey-multi-choice-text input[type='radio'] {margin-right: 1em;}" +
        ".jspsych-survey-multi-choice-question:last-of-type { border-bottom: none; display: flex; width: 100%; justify-content: center; flex-wrap: wrap; }" +
        ".jspsych-survey-multi-choice-preamble {  text-align: center; margin: 0 auto;}" +
        "img.select-img {width: 115px;}" +
        "#jspsych-html-keyboard-response-stimulus { margin: 0 auto; text-align: center;}" +
        ".jspsych-content {width: 100%;}" +
        "#jspsych-survey-multi-choice-form.pavlovian-conditioning-form {width: 100%;}" +
        ".jspsych-content-wrapper: {flex: none}";
    html += '</style>';

    // show preamble text
    if(trial.preamble !== null){
      html += '<div id="jspsych-survey-multi-choice-preamble" class="jspsych-survey-multi-choice-preamble">'+trial.preamble+'</div>';
    }

    // if 4 answers has been made, get next 4 questions in random order
    if(pav_multi_choice_counter === 4) {
      pav_multi_choice_counter = 0;
      pav_multi_choice_array = jsPsych.randomization.shuffle(pav_multi_choice_array);
    }

    // add vending machine
    html +=
        '<div id="jspsych-survey-multi-choice-img" class="jspsych-survey-multi-choice-preamble">' +
        '<svg class="vending-machine" viewBox="0 0 253 459" fill="none" xmlns="http://www.w3.org/2000/svg">' +
        '<rect x="27" y="20" width="203" height="359" fill="#000"/>' +
        '<path fill-rule="evenodd" clip-rule="evenodd" d="M253 0V440.506H209.527V459H44.6212V440.506H0V0H253ZM222 279H32V363H222V279ZM59.957 282.531L133.253 309.209L118.546 349.616L45.2501 322.938L59.957 282.531ZM86 210H32V256H86V210ZM154 210H100V256H154V210ZM222 210H168V256H222V210ZM86 148H32V194H86V148ZM154 148H100V194H154V148ZM222 148H168V194H222V148ZM86 86H32V132H86V86ZM154 86H100V132H154V86ZM222 86H168V132H222V86ZM86 24H32V70H86V24ZM154 24H100V70H154V24ZM222 24H168V70H222V24Z" fill="white"/>' +
        "</svg>" +
        "</div>";

    // form element
    html += '<form id="jspsych-survey-multi-choice-form" class="pavlovian-conditioning-form">';
    
    // generate question order. this is randomized here as opposed to randomizing the order of trial.questions
    // so that the data are always associated with the same question regardless of order
    var question_order = [];
    for(var i=0; i<trial.questions.length; i++){
      question_order.push(i);
    }
    if(trial.randomize_question_order){
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

      // add question text
      html += '<p class="jspsych-survey-multi-choice-text survey-multi-choice">' + question.prompt + '</p>';
      html += '<div id="jspsych-survey-multi-choice-'+question_id+'" class="'+question_classes.join(' ')+'"  data-name="'+question.name+'">';

      if(question.required){
        html += "<span class='required'>*</span>";
      }

      // create option radio buttons
      for (var j = 0; j < question.options.length; j++) {
        // add label and question text
        var option_id_name = "jspsych-survey-multi-choice-option-"+question_id+"-"+j;
        var input_name = 'jspsych-survey-multi-choice-response-'+question_id;
        var input_id = 'jspsych-survey-multi-choice-response-'+question_id+'-'+j;

        var required_attr = question.required ? 'required' : '';

        // add radio button container
        html += '<div id="'+option_id_name+'" class="jspsych-survey-multi-choice-option">';
        html += '<input type="radio" name="'+input_name+'" id="'+input_id+'" class="form-radio" value="'+question.options[j].value+'" '+required_attr+' data-response="'+question.options[j].response+'"></input>';
        html += '<label class="jspsych-survey-multi-choice-text" for="'+input_id+'">';
        if (question.options[j].img) {
          html += '<img class="select-img" src="' + question.options[j].img + '" alt="' + question.options[j].name + '" data-response="'+question.options[j].response+'">'
        }
        html += '</label>';
        html += '</div>';
      }

      html += '</div>';
    }
    
    // add submit button
    html += '<input type="submit" id="'+plugin_id_name+'-next" class="'+plugin_id_name+' jspsych-btn"' + (trial.button_label ? ' value="'+trial.button_label + '"': '') + '></input>';
    html += '</form>';

    // add modal
    html +=
    '<div class="modal micromodal-slide" id="modal-1" aria-hidden="true">' +
      '<div class="modal__overlay" tabindex="-1">' +
      '<div class="modal__container" role="dialog" aria-modal="true" aria-labelledby="modal-1-title">' +
        '<header class="modal__header">' +
        '<button class="modal__close" aria-label="Close modal" data-micromodal-close></button>' +
        '</header>' +
        '<main class="modal__content" id="modal-1-content">' +
        '<p>' + popup_text_WBF + '</p>' +
        '</main>' +
        '<footer class="modal__footer">' +
        '<button class="modal__btn" data-micromodal-close aria-label="Close this dialog window">Close</button>' +
        '</footer>' +
      '</div>' +
      '</div>' +
    '</div>';

    html += '<div id="translation-listener">translate</div>';
    html += jsPsych.pluginAPI.getPopupHTML('translator-detected', popup_text_translator);
        
    // render
    display_element.innerHTML = html;

    var color = pav_multi_choice_array[pav_multi_choice_counter].color;
    var color_name = pav_multi_choice_array[pav_multi_choice_counter].color_name;
    $('.vending-machine rect').css({ fill: color });
    $('.vending-machine').addClass(color_name);

    response.trial_events.push({
        event_type: "question appears",
        event_raw_details: color_name + " vending machine question",
        event_converted_details: "question with " + color_name + " vending machine appears",
        timestamp: jsPsych.totalTime(),
        time_elapsed: jsPsych.totalTime() - timestamp_onload,
    });

    // function to handle responses by the subject
    var after_response = function (info) {

        if(info.key_release === undefined) {
            response.trial_events.push({
              "event_type": "key press",
              "event_raw_details": info.key,
              "event_converted_details": jsPsych.pluginAPI.convertKeyCodeToKeyCharacter(info.key) + ' key pressed',
              "timestamp": jsPsych.totalTime(),
              "time_elapsed": jsPsych.totalTime() - timestamp_onload
            });
            if(info.el) {
              if(info.el.dataset.response) {
                response.trial_events.push({
                  "event_type": "answer made",
                  "event_raw_details": info.el.dataset.response,
                  "event_converted_details": 'answer ' + info.el.dataset.response + ' has been made',
                  "timestamp": jsPsych.totalTime(),
                  "time_elapsed": jsPsych.totalTime() - timestamp_onload
                });
              } else if (info.el.type === 'submit') {
                response.trial_events.push({
                  "event_type": "button clicked",
                  "event_raw_details": 'Submit',
                  "event_converted_details": '"Submit" selected',
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
          };
    };

    function proccessDataBeforeSubmit(validate) {

      var color_value = pav_multi_choice_array[pav_multi_choice_counter].value;
      var color_response_submitted = pav_multi_choice_array[pav_multi_choice_counter].response;

      // create object to hold responses
      var question_data = {};
      var val = '';
      for (var i = 0; i < trial.questions.length; i++) {
        var match = display_element.querySelector('#jspsych-survey-multi-choice-' + i);
        var id = "Q" + i;
        if (match.querySelector("input[type=radio]:checked") !== null) {
          val = match.querySelector("input[type=radio]:checked").value;
          if (color_value === val) {
            pav_is_correct = true;
            pav_correct_holder++;
          } else {
            pav_incorrect_holder++;
            pav_correct_holder = 0;
          }
        } else {
          val = "";
          pav_incorrect_holder++;
          pav_correct_holder = 0;
        }

        var obje = {};
        var name = id;
        if (match.attributes['data-name'].value !== '') {
          name = match.attributes['data-name'].value;
        }
        obje[name] = val;
        Object.assign(question_data, obje);
      };

      if (validate && !val) {
        return {
          val: val
        };
      }

      var trial_data = {
        stage_name: JSON.stringify(trial.stage_name),
        stage_type: JSON.stringify(trial.stage_type),
        response: JSON.stringify(color_value),
        response_submitted: JSON.stringify(color_response_submitted),
        timestamp: JSON.stringify(jsPsych.totalTime()),
        responses: JSON.stringify(question_data),
        question_order: JSON.stringify(question_order),
        correct: pav_is_correct ? "y" : "n",
        events: JSON.stringify(response.trial_events),
      };


      if (trial.stage_name === "recall") {
        trial_data.block_number = trial.stage_type
      }

      return trial_data;
    }
    
    const translatorTarget = document.getElementById('translation-listener')
    jsPsych.pluginAPI.initializeTranslatorDetector(translatorTarget, 'translate', response, timestamp_onload, proccessDataBeforeSubmit);

    // form functionality
    document.querySelector('form').addEventListener('submit', function(event) {
      event.preventDefault();
      
      var trial_data = proccessDataBeforeSubmit();

      if(trial_data.val === '') {
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
              "event_converted_details": "question with " + color_name + " vending machine appears",
              "timestamp": jsPsych.totalTime(),
              "time_elapsed": jsPsych.totalTime() - timestamp_onload
            });
          }
        });
      } else {
               
        // clear the display
        display_element.innerHTML = '';

        // kill keyboard listeners
        if (typeof keyboardListener !== 'undefined') {
          jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
          jsPsych.pluginAPI.cancelClickResponse(clickListener);
        }

        // next trial
        jsPsych.finishTrial(trial_data);
      }
    });

    // start the response listener
    var keyboardListener = jsPsych.pluginAPI.getKeyboardResponse({
        callback_function: after_response,
        valid_responses: trial.choices,
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