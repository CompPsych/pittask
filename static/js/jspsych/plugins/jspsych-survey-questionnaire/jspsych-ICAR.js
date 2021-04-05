jsPsych.plugins['ICAR'] = (function () {
    var plugin = {};
  
    plugin.info = {
      name: 'ICAR',
      stage_name: 'ICAR',
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
      
      var plugin_id_name = "jspsych-survey-multi-choice-ICAR";
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
  
      // inject CSS for trial
      html += '<style id="jspsych-survey-multi-choice-css">';
      html += 
        ".jspsych-survey-multi-choice-question {  }" +
        ".verbal-reasoning, .letter-number-series { width: 600px; }" +
        ".matrix-reasoning-wrap { display: flex; position: relative; }" +
        ".matrix-reasoning-wrap ul { position: absolute; display: flex; justify-content: center; height: 113px; margin-bottom: 3rem; padding-left: 0; bottom: 0; left: 0; right: 0; }" +
        ".matrix-reasoning-wrap ul li { width: 92px; opacity: .5; }" +
        ".matrix-reasoning-wrap ul label { width: 100%; height: 100%;}" +
        ".matrix-reasoning-wrap ul li.active { background-color: rgb(240, 228, 66); }" +
        "img { width: 100%; height: 475px; }" +
        ".three-dimensional-rotate-wrap { display: flex; position: relative; width: 1000px; }" +
        ".three-dimensional-rotate-wrap ul { position: absolute; display: flex; flex-wrap: wrap; justify-content: center; height: 100%; width: 73%; padding-left: 0; margin-bottom: 0; bottom: 0; right: 0; }" +
        ".three-dimensional-rotate-wrap ul label { width: 100%; height: 100%;}" +
        ".three-dimensional-rotate-wrap ul li { width: 25%; height: 50%; opacity: .5; }" +
        ".three-dimensional-rotate-wrap ul li.active { background-color: rgb(240, 228, 66); }" +

        ".jspsych-survey-multi-choice-text span.required {color: darkred;}" +
        ".jspsych-survey-multi-choice-horizontal .jspsych-survey-multi-choice-text {  text-align: center;}" +
        ".jspsych-survey-multi-choice-option { display: flex; line-height: 2; flex-direction: row-reverse; justify-content: flex-end; }" +
        ".jspsych-survey-multi-choice-horizontal .jspsych-survey-multi-choice-option {  display: flex;  margin-left: 1em;  margin-right: 1em;  vertical-align: top;}" +
        ".jspsych-survey-multi-choice-content { border-bottom: 1px solid;}" +
        ".jspsych-survey-highlight { cursor: pointer; padding-left: 2rem; padding-top: .5rem; }" +
        ".jspsych-survey-multi-choice-form { max-width: 1000px }" +
        "ul {list-style: none}" +
        "label { margin-bottom: 0; }" +
        ".form-radio { top: 0; }" +
        ".jspsych-btn { margin: 100px 0; }" +
        ".jspsych-content { margin-top: 130px;}" +
        ".jspsych-survey-multi-choice-preamble { text-align: left; border-top: 1px solid #fff;}" +
        ".jspsych-survey-multi-choice-information { display: flex; justify-content: space-between }" +
        ".jspsych-survey-multi-choice-information div { width: 40%; text-align: left; padding: 2rem 0; }" +
        ".jspsych-survey-multi-choice-information ul { display: flex; width: 50%; justify-content: space-around; padding-inline-start: 0; }" +
        ".jspsych-survey-multi-choice-information li { width: 100px; display: flex; align-items: center; }" +
        "label.jspsych-survey-multi-choice-text input[type='radio'] {margin-right: 1em;}";
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
      html += '<div id="' + plugin_id_name + '">'
      html += '<form id="jspsych-survey-multi-choice-form" class="jspsych-survey-multi-choice-form">';
  
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
  
        if(question.name === 'letter_number_series') {
          html += '<div class="letter-number-series" id="jspsych-survey-multi-choice-' + question_id + '" class="' + question_classes.join(' ') + '" style="display: none;"  data-name="' + question.number + '">';
    
          // add question text
          html += '<div><p class="jspsych-survey-multi-choice-question survey-multi-choice" style="padding-top: 3px; text-align: left;">' + question.prompt + '</p>';
          
          html += '<p style="font-weight: bold; font-size: 2rem;">' + question.sequence + '</p></div>';
          html += '<div class="jspsych-survey-container-radio">';
    
          // create option radio buttons
          for (var j = 0; j < question.options.length; j++) {
            // add label and question text
            var option_id_name = "jspsych-survey-multi-choice-option-" + question_id + "-" + j;
            var input_name = 'jspsych-survey-multi-choice-response-' + question_id;
            var input_id = 'jspsych-survey-multi-choice-response-' + question_id + '-' + j;
    
            var required_attr = question.required ? 'required' : '';
    
            // add radio button container
            html += '<div id="' + option_id_name + '" class="jspsych-survey-multi-choice-option">';
            html += '<label class="jspsych-survey-multi-choice-text jspsych-survey-highlight" data-time-stamp="Q' + i + '" data-question-number="Q' + (i+1) +'A' + (j+1) +'" for="' + input_id + '">' + question.options[j] + '</label>';
            html += '<input type="radio" name="' + input_name + '" data-time-stamp="Q' + i + '" data-response-id="' + (j+1) + '" data-question-number="Q' + (i+1) +'A' + (j+1) +'" id="' + input_id + '" class="form-radio" value="' + question.options[j] + '" ' + required_attr + '></input>';
            html += '</div>';
          }
    
          html += '</div></div>';
        }
        // Verbal Reasoning
        else if(question.name === 'verbal_reasoning') {
          html += '<div class="verbal-reasoning" id="jspsych-survey-multi-choice-' + question_id + '" class="' + question_classes.join(' ') + '" style="display: none;"  data-name="' + question.number + '">';
    
          // add question text
          html += '<div><p class="jspsych-survey-multi-choice-question survey-multi-choice" style="padding-top: 3px; text-align: left;">' + question.prompt + '</p></div>';
          html += '<div class="jspsych-survey-container-radio">';
    
          // create option radio buttons
          for (var j = 0; j < question.options.length; j++) {
            // add label and question text
            var option_id_name = "jspsych-survey-multi-choice-option-" + question_id + "-" + j;
            var input_name = 'jspsych-survey-multi-choice-response-' + question_id;
            var input_id = 'jspsych-survey-multi-choice-response-' + question_id + '-' + j;
    
            var required_attr = question.required ? 'required' : '';
    
            // add radio button container
            html += '<div id="' + option_id_name + '" class="jspsych-survey-multi-choice-option">';
            html += '<label class="jspsych-survey-multi-choice-text jspsych-survey-highlight" data-time-stamp="Q' + i + '" data-question-number="Q' + (i+1) +'A' + (j+1) +'" for="' + input_id + '">' + question.options[j] + '</label>';
            html += '<input type="radio" name="' + input_name + '" data-time-stamp="Q' + i + '" data-response-id="' + (j+1) + '" data-question-number="Q' + (i+1) +'A' + (j+1) +'" id="' + input_id + '" class="form-radio" value="' + question.options[j] + '" ' + required_attr + '></input>';
            html += '</div>';
          }
    
          html += '</div></div>';
        }
        // Matrix reasoning
        else if(question.name === 'matrix_reasoning') {
          html += '<div id="jspsych-survey-multi-choice-' + question_id + '" class="' + question_classes.join(' ') + '" style="display: none;"  data-name="' + question.number + '">';
    
          html += '<p class="jspsych-survey-multi-choice-question survey-multi-choice" style="padding-top: 3px; text-align: left;">' + question.prompt + '</p>';
          // add question image
          html += '<div class="matrix-reasoning-wrap"><img class="matrix-reasoning" src="/static/images/ICAR/matrix_reasoning/' + question.img + '">';
          html += '<ul class="jspsych-survey-container-radio">';
    
          // create option radio buttons
          for (var j = 0; j < question.options.length; j++) {
            // add label and question text
            var option_id_name = "jspsych-survey-multi-choice-option-" + question_id + "-" + j;
            var input_name = 'jspsych-survey-multi-choice-response-' + question_id;
            var input_id = 'jspsych-survey-multi-choice-response-' + question_id + '-' + j;
    
            var required_attr = question.required ? 'required' : '';
    
            // add radio button container
            html += '<li id="' + option_id_name + '">';
            html += '<label class="jspsych-survey-multi-choice-text jspsych-survey-highlight" data-time-stamp="Q' + i + '" data-question-number="Q' + (i+1) +'A' + (j+1) +'" for="' + input_id + '"></label>';
            html += '<input type="radio" class="hidden" name="' + input_name + '" data-time-stamp="Q' + i + '" data-response-id="' + question.options[j] + '" data-matrix-reasoning="matrix-reasoning-'+ question_id + '-' + j + '" data-time-stamp="Q' + i + '" data-question-number="Q' + (i+1) +'A' + (j+1) +'" id="' + input_id + '" class="form-radio" value="NA" ' + required_attr + '></input>';
            html += '</li>';
          }
          html += '</ul>';
          html += '</div></div>';
        }

        // Three Dimensional Rotate
        else if(question.name === 'three_dimensional_rotate') {
          html += '<div id="jspsych-survey-multi-choice-' + question_id + '" class="' + question_classes.join(' ') + '"  style="display: none;" data-name="' + question.number + '">';
    
          // add question image
          html += '<p class="jspsych-survey-multi-choice-question survey-multi-choice" style="padding-top: 3px; text-align: left;">' + question.prompt + '</p>';
          html += '<div class="three-dimensional-rotate-wrap"><img class="three-dimensional-rotate" src="/static/images/ICAR/three-dimensional_rotate/' + question.img + '">';
          html += '<ul class="jspsych-survey-container-radio">';
    
          // create option radio buttons
          for (var j = 0; j < question.options.length; j++) {
            // add label and question text
            var option_id_name = "jspsych-survey-multi-choice-option-" + question_id + "-" + j;
            var input_name = 'jspsych-survey-multi-choice-response-' + question_id;
            var input_id = 'jspsych-survey-multi-choice-response-' + question_id + '-' + j;
    
            var required_attr = question.required ? 'required' : '';
    
            // add radio button container
            html += '<li id="' + option_id_name + '">';
            html += '<label class="jspsych-survey-multi-choice-text jspsych-survey-highlight" data-time-stamp="Q' + i + '" data-question-number="Q' + (i+1) +'A' + (j+1) +'" for="' + input_id + '"></label>';
            html += '<input type="radio" class="hidden" name="' + input_name + '" data-time-stamp="Q' + i + '" data-response-id="' + question.options[j] + '" data-three-dimensional-rotate="three-dimensional-rotate-'+ question_id + '-' + j + '" data-time-stamp="Q' + i + '" data-question-number="Q' + (i+1) +'A' + (j+1) +'" id="' + input_id + '" class="form-radio" value="NA" ' + required_attr + '></input>';
            html += '</li>';
          }
          html += '</ul>';
          html += '</div></div>';
        }
      }
  
      // add submit button
      html += '<p><input type="submit" id="' + plugin_id_name + '-next" class="hidden ' + plugin_id_name + ' jspsych-btn"' + (trial.button_label ? ' value="' + trial.button_label + '"' : '') + '></input></p>';
  
      html += '</form>';
      html += '</div>';
      html += '<p><button class="jspsych-btn next-question">submit answer</button></p>';
  
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

      // Display first question on page load
      $('#jspsych-survey-multi-choice-0').show();

      // Next button functionality
      var next_counter = 1;
      $('.next-question').on('click', function() {
          var radio_number = $('#jspsych-survey-multi-choice-' + (next_counter - 1) + ' .jspsych-survey-container-radio').children();
          var isChecked = false;
          for (var index = 0; index < radio_number.length; index++) {
            var element = radio_number[index];
            if($(element).find('input').is(":checked") === true) {
              isChecked = true;
            }
          };

          if(next_counter < 16 && isChecked) {
            $('#jspsych-survey-multi-choice-' + (next_counter - 1)).fadeOut();
            $('.next-question').prop('disabled', true);
            $('.jspsych-survey-multi-choice-question').removeClass('survey-error');
            setTimeout(function() {
              $('#jspsych-survey-multi-choice-' + next_counter++).fadeIn();
              $('.next-question').prop('disabled', false);
            }, 400);
            if(next_counter === 15) {
              $('.jspsych-survey-multi-choice-ICAR').removeClass('hidden');
              $('.next-question').hide();
            };
            response.trial_events.push({
              "event_type": "button clicked",
              "event_raw_details": 'Submit',
              "event_converted_details": '"Submit" selected',
              "timestamp": jsPsych.totalTime(),
              "time_elapsed": jsPsych.totalTime() - timestamp_onload
            });
          } else {
            $('.jspsych-survey-multi-choice-question').addClass('survey-error');
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
          };
      });
      
      // add active class on click for images overlay
      $( "input" ).on( "click", function() {
        if($(this)[0].dataset.matrixReasoning) {
          $( ".matrix-reasoning-wrap ul li" ).removeClass( "active" )
          $(this).parent('li').addClass('active');
        } else if($(this)[0].dataset.threeDimensionalRotate) {
          $( ".three-dimensional-rotate-wrap ul li" ).removeClass( "active" )
          $(this).parent('li').addClass('active');
        }
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
      var response_id = {};

      for (var i = 0; i < trial.questions.length; i++) {
        var match = display_element.querySelector('#jspsych-survey-multi-choice-' + i);
        var id = i;
        var val = '';

        if (match.querySelector('input[type=radio]:checked') !== null) {
          val = match.querySelector('input[type=radio]:checked').value;

          $(match).find('.jspsych-survey-multi-choice-question').removeClass('survey-error');
          var val_id = match.querySelector('input[type=radio]:checked').attributes['data-response-id'].value;
        } else if (validate) {
          $(match).find('.jspsych-survey-multi-choice-question').addClass('survey-error');
          val = '';
        }

        var obje = {};
        var obj = {}
        var name = id;

        if (match.attributes['data-name'].value !== '') {
          name = match.attributes['data-name'].value;
        }

        obje[name] = val;
        obj[name] = val_id;
        timestamp_data[name] = trial.time_stamp['Q' + i];
        Object.assign(question_data, obje);
        Object.assign(response_id, obj);
      }

      return {
        'stage_name': JSON.stringify(plugin.info.stage_name),
        'responses': JSON.stringify(question_data),
        'timestamp': JSON.stringify(timestamp_data),
        'responseId': JSON.stringify(response_id),
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

        if ($(".survey-error").length < 1) {
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