jsPsych.plugins['SDS'] = (function () {
    var plugin = {};
  
    plugin.info = {
      name: 'SDS',
      stage_name: 'SDS',
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
      var plugin_id_name = "jspsych-survey-multi-choice-SDS";
  
      var html = "";
      var timestamp_onload = jsPsych.totalTime();
  
      // store responses, events
      var response = {
        trial_events: []
      };
  
      response.trial_events.push({
        "event_type": trial.event_type,
        "event_raw_details": trial.event_raw_details,
        "event_converted_details": trial.event_converted_details,
        "timestamp": jsPsych.totalTime(),
        "time_elapsed": jsPsych.totalTime() - timestamp_onload
      });
  
      // inject CSS for trial
      html += '<style id="jspsych-survey-multi-choice-css">';
      html += ".jspsych-survey-multi-choice-question { text-align: center; outline: 1px solid #fff; padding: 2rem; margin: 2rem 0; }" +
        ".jspsych-content-wrapper { width: 1000px}" +
        ".jspsych-survey-multi-choice-text span.required {color: darkred;}" +
        ".jspsych-survey-multi-choice-horizontal .jspsych-survey-multi-choice-text {  text-align: center;}" +
        ".jspsych-survey-multi-choice-preamble { text-align: left; padding: 3rem 0; }" +
        ".jspsych-survey-multi-choice-horizontal .jspsych-survey-multi-choice-option {  width: 100%; border-left: 1px solid; text-align: center; padding: 0 1rem; }" +
        ".jspsych-survey-multi-choice-option  { position: relative; }" +
        ".jspsych-survey-multi-choice-option:first-of-type::after  { content: '◀'; position: absolute; right: -14px; top: 21px; }" +
        ".jspsych-survey-multi-choice-option:last-of-type::after  { content: '▶'; position: absolute; left: -14px; top: 21px; }" +
        ".jspsych-survey-multi-choice-horizontal .jspsych-survey-multi-choice-option:first-child  {background-color: red;}" +
        ".jspsych-content { width: 1000px}" +
        ".jspsych-btn { margin: 140px 0; }" +
        ".question-title-heading { text-transform: uppercase; font-weight: bold; }" +
        ".jspsych-content { margin-top: 130px;}" +
        ".square { display: flex; justify-content: space-around; }" +
        ".square span { width: 85px; height: 60px; border: 1px solid #fff; }" +
        "ul {list-style: none}" +
        "#jspsych-survey-multi-choice-3 { padding-bottom: 3rem; }" +
        ".form-radio { top: 3px; }" +
        "select { background-color: #000; width: 100px; margin: 0 1rem;}" +
        ".circle-line { width: 90%; position: absolute; border-bottom: 1px solid; z-index: -1; }" +
        "label.jspsych-survey-multi-choice-text input[type='radio'] {margin-left: 1em;}" +
        ".jspsych-survey-highlight { width: 50px; height: 50px; border-radius: 50%; border: 2px solid #fff; z-index: 1; background-color: #000; box-shadow: 0 0 2px 0px white inset, 0 0 2px 0px white; justify-content: center; display: flex; align-items: center; }" +
        ".bg-primary { border: 2px solid #428bca; box-shadow: 0 0 2px 0px #428bca inset, 0 0 2px 0px #428bca; background-color: #428bca; }" +
        "p { margin: 0 0 0px;}"
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
  
      // form element
      html += '<div id="' + plugin_id_name + '">';
      html += '<form id="jspsych-survey-multi-choice-form" class="jspsych-survey-multi-choice-form">';

      // show preamble text
      if (trial.preamble !== null) {
        html += '<div class="jspsych-survey-multi-choice-content"><div id="jspsych-survey-multi-choice-preamble" class="jspsych-survey-multi-choice-preamble">' + trial.preamble + '</div>';
      }
   
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
      for (var i = 0; i < 3; i++) {
  
        // get question based on question_order
        var question = trial.questions[question_order[i]];
        var question_id = question_order[i];
        var question_name = question.name;
  
        // create question container
        var question_classes = ['jspsych-survey-multi-choice-question'];
        if (question.horizontal) {
          question_classes.push('jspsych-survey-multi-choice-horizontal');
        }
  
        html += '<div id="jspsych-survey-multi-choice-' + question_id + '" class="' + question_classes.join(' ') + '"  data-name="' + question_name + '">';
  
        // add question text
        html += '<div>' + question.prompt
        
        // question.required
        html += '</div>';

        // titles
        html += `
          <div>
            <ul style="display: flex; position: relative; justify-content: center; padding-inline-start: 0;">
              <li style="position: absolute; top: 1rem; left: 0;">
                Not at all
              </li>
              <li style="position: absolute; top: 1rem; left: 12rem;">
                Mildly
                <div class="square">
                  <span></span>
                  <span></span>
                </div>
              </li>
              <li style="position: absolute; top: 1rem; left: 37rem;">
                Moderately
                <div class="square">
                  <span></span>
                  <span></span>
                </div>
              </li>
              <li style="position: absolute; top: 1rem; right: 12rem;">
                Markedly
                <div class="square">
                  <span></span>
                  <span></span>
                </div>
              </li>
              <li style="position: absolute; top: 1rem; right: 0;">
                Extremely
              </li>
            </ul>
           
          </div>
        `;
        html += '<div style="display: flex; justify-content: space-around; align-items: center; position: relative; padding-top: 5rem; ">';
        html += '<span class="circle-line"></span>';
        // create option radio buttons
        for (var j = 0; j < question.options.length; j++) {
          // add label and question text
          var option_id_name = "jspsych-survey-multi-choice-option-" + question_id + "-" + j;
          var input_name = 'jspsych-survey-multi-choice-response-' + question_id;
          var input_id = 'jspsych-survey-multi-choice-response-' + question_id + '-' + j;
  
          var required_attr = question.required ? 'required' : '';
  
          // add radio button container
          html += '<div id="' + option_id_name + '" class="jspsych-survey-multi-choice-option">';
          html += '<input type="radio" name="' + input_name + '" id="' + input_id + '" class="form-radio hidden" value="' + question.options[j] + '" ' + required_attr + '></input>';
          html += '<label class="jspsych-survey-multi-choice-text jspsych-survey-highlight" data-time-stamp="Q' + (i+1) + '" data-question-number="Q' + (i+1) +'A' + (j+1) +'" for="' + input_id + '">' + question.options[j] + '</label>';
          html += '</div>';
        }
  
        html += '</div>';
        if(i === 0) {
          html += '<div style="display: flex; padding: 2rem 0 2rem 2rem;">' +
          '<div class="input-not-working"><input type="radio" data-time-stamp="Q1S1" data-question-number="Q1S1" name="" class="form-radio" value="Checkbox question.: I have not worked/studied at all during the past week..."></input></div>' +
          '<div style="text-align: left; padding-left: 2rem;"><p>I have not worked / studied at all during the past week for reasons unrelated to the disorder.</p>' +
          '<p>* Work includes paid, unpaid volunteer work or training</p></div></div>';
        }
        html += '</div>';
        
      }


      // add multiple-choice questions
      for (var i = 3; i < trial.questions.length; i++) {

          // get question based on question_order
          var question = trial.questions[question_order[i]];
          var question_id = question_order[i];
          var question_name = question.name;

          // create question container
          var question_classes = ['jspsych-survey-multi-choice-question-input'];
          if (question.horizontal) {
            question_classes.push('jspsych-survey-multi-choice-horizontal');
          }

          html += '<div id="jspsych-survey-multi-choice-' + question_id + '" class="' + question_classes.join(' ') + '"  data-name="' + question_name + '">';

          // add question text
          html += '<div style="text-align: left;"><h3 class="question-title">' + question.title + '</h3><p style="position: relative;">' + question.prompt ;

          // create option radio buttons
          html += '<span style="position: absolute; right: 0;">';
          html += '<label for="' + question_name + '">Select answer:</label>';
          html += '<select id="' + question_name + '" class="select-days-' + i + '"><option value="None">-</option>';
          
          for (var j = 0; j < question.options.length; j++) {
            // add label and question text
            var option_id_name = "jspsych-survey-multi-choice-option-" + question_id + "-" + j;
            var input_name = 'jspsych-survey-multi-choice-response-' + question_id;
            var input_id = 'jspsych-survey-multi-choice-response-' + question_id + '-' + j;
            html += '<option type="select" data-time-stamp="Q' + (i+1) + '" data-question-number="Q' + (i+1) +'A' + (j+1) +'" name="' + input_name + '" id="' + input_id + '" value="' + question.options[j] + '" ' + required_attr + '>' + question.options[j] + '</option>';
          }
          html += '</select>';
          html += '</p></span>';
          html += '</div></div>';
      }

      
      html += '</div>';

      // add submit button
      html += '<p><input type="submit" id="' + plugin_id_name + '-next" class="' + plugin_id_name + ' jspsych-btn"' + (trial.button_label ? ' value="' + trial.button_label + '"' : '') + '></input></p>';
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
  
      html += '<div id="translation-listener">translate</div>';
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
          };
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
  
      // highlight input
      $('.jspsych-survey-highlight').click(function () {
        $(this).parent().parent().find(".jspsych-survey-highlight").removeClass('bg-primary'); // remove previous bg-primary items 
        $(this).addClass('bg-primary');
        $(this).next('input').prop("checked", true);
      })

      // handle select inputs
      $("select").change(function() {
        var questionNumber = $(this)[0].selectedOptions[0].getAttribute('data-question-number');
        var questionTimestamp = $(this)[0].selectedOptions[0].getAttribute('data-time-stamp');
        trial.time_stamp[questionTimestamp] = jsPsych.totalTime();
        response.trial_events.push({
          "event_type": "answer displayed",
          "event_raw_details": questionNumber,
          "event_converted_details": questionNumber + ' answer displayed',
          "timestamp": jsPsych.totalTime(),
          "time_elapsed": jsPsych.totalTime() - timestamp_onload
        });
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
        var val = '';

        for (var i = 0; i < 3; i++) {
          var match = display_element.querySelector('#jspsych-survey-multi-choice-' + i);
          var id = i + 1;
          var val_not_working;

          if (match.querySelector('.jspsych-survey-multi-choice-option input[type=radio]:checked') !== null) {
            val = match.querySelector('.jspsych-survey-multi-choice-option input[type=radio]:checked').value;

            $(match).find('.question-title').removeClass('survey-error-after');
          } else if (validate) {
            val = '';

            $(match).find('.question-title').addClass('survey-error-after');
          }

          var obje = {};
          var name = id;

          if (match.attributes['data-name'].value !== '') {
            name = match.attributes['data-name'].value;
          }

          obje[name] = val;
          timestamp_data[name] = trial.time_stamp['Q' + id];

          if (i === 0) {
            if (match.querySelector('.input-not-working input[type=radio]:checked') !== null) {
              val_not_working = {
                'Not worked/studied': 'checked'
              };

              timestamp_data['Not worked/studied'] = trial.time_stamp['Q1S1'];
              $('#jspsych-survey-multi-choice-0').find('.question-title').removeClass('survey-error-after');

              var active_item = $('#jspsych-survey-multi-choice-0').find('.bg-primary');

              $(active_item).removeClass('bg-primary');
              obje[name] = 'NA';
              timestamp_data[name] = 'NA';
            } else {
              val_not_working = {
                'Not worked/studied': 'not checked'
              };
              timestamp_data['Not worked/studied'] = 'NA';
            }
          }

          Object.assign(question_data, obje, val_not_working);
        }

        for (var i = 3; i < trial.questions.length; i++) {
          var match = display_element.querySelector('#jspsych-survey-multi-choice-' + i);
          var id = i + 1;
          var val = '';

          if (match.querySelector('option:checked').value !== 'None') {
            val = match.querySelector('option:checked').value;

            $(match).find('.question-title').removeClass('survey-error-after');

          } else if (validate) {
            val = '';
            $(match).find('.question-title').addClass('survey-error-after');
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

      // from functionality
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