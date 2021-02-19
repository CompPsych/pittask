jsPsych.plugins['survey-vvr-questions-right'] = (function() {

    var plugin = {};

    plugin.info = {
        name: 'survey-vvr-questions-right',
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
            },
            details: {
                a: {
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
                },
                b: {
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
        }
    }

    plugin.trial = function(display_element, trial){

        // outcome src
        var outcome_collection = {
            MM:'/static/images/MM.png',
            TT:'/static/images/TT.png',
            BBQ:'/static/images/BBQ.png',
        };

        // assign right outcome
        var OUTCOME = outcome_collection[counter_balancing[0].right];
        var isMachineTilted = false;
        var vas_holder = 0;

        // question
        var new_html = 
            `<div id="jspsych-stimulus" class='vvr-question-container vvr-question-right'>
                <div class='vvr-question-a'>
                    <p>${trial.vars.VVR_q_text_a1}</p>
                    <div class="outcome-container-learning"><img src='${OUTCOME}'/></div>
                    <p class="answer_latency" style='padding:2rem 0'>${trial.vars.VVR_q_text_a2}</p>
                    <svg class="vending-machine" viewBox="0 0 253 459" x="10" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="27" y="20" width="203" height="359" fill="#000"/>
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M253 0V440.506H209.527V459H44.6212V440.506H0V0H253ZM222 279H32V363H222V279ZM59.957 282.531L133.253 309.209L118.546 349.616L45.2501 322.938L59.957 282.531ZM86 210H32V256H86V210ZM154 210H100V256H154V210ZM222 210H168V256H222V210ZM86 148H32V194H86V148ZM154 148H100V194H154V148ZM222 148H168V194H222V148ZM86 86H32V132H86V86ZM154 86H100V132H154V86ZM222 86H168V132H222V86ZM86 24H32V70H86V24ZM154 24H100V70H154V24ZM222 24H168V70H222V24Z" fill="white"/>
                    </svg>
                </div>
                <div class='vvr-question-b' style='display: none'>
                    <div>
                        <p style="padding-bottom: 5rem;">${trial.vars.VVR_q_text_b1}</p>
                        <div class="votes-container">
                            <div class="description">
                                <div class="description--left">${trial.vars.VVR_q_text_b2}</div>
                                <div class="description--center"></div>
                                <div class="description--right">${trial.vars.VVR_q_text_b3}</div>
                            </div>
                            <div id="slider">
                                <span class="line"></span>
                            </div>
                        </div>
                    </div>
                    <div>
                        <button class="jspsych-btn" style="margin-bottom: 3rem;">Submit answer</button>
                        <div class="instructions-wrap">
                            <ul class="instructions">${trial.vars.VVR_q_text_b4}</ul>
                        </div>
                    </div>
                </div>
            </div>`;

        // store responses, events
        var response = {
            trial_events: []
        };
        var timestamp_onload = vvr_timer;
        var question_number = item_id + 1;

        response.trial_events.push({
            "event_type": trial.details.a.event_type,
            "event_raw_details": "question " + question_number + "(a) appears",
            "event_converted_details": "question " + question_number + "(a) appears; " +  counter_balancing[0].right + " image appears",
            "timestamp": jsPsych.totalTime(),
            "time_elapsed": jsPsych.totalTime() - timestamp_onload
        });
        
        // render
        display_element.innerHTML = new_html;

        // init slider
        $("#slider").slider({
            value: 5,
            min: 0,
            max: 10,
            step: 0.01,
            change: function(event, ui) {
                $(".ui-slider .ui-slider-handle").css('visibility', 'visible');
                $('.jspsych-btn').prop('disabled', false);
                vas_holder = ui.value.toFixed(2);
                response.trial_events.push({
                    "event_type": 'VAS answer has been made',
                    "event_raw_details": ui.value.toFixed(2),
                    "event_converted_details": ui.value.toFixed(2) + ' answer has been made',
                    "timestamp": jsPsych.totalTime(),
                    "time_elapsed": jsPsych.totalTime() - timestamp_onload
                });
            }
        });

        $('.jspsych-btn').prop('disabled', true);
        $('.jspsych-btn').on('click', function() {
            response.trial_events.push({
                "event_type": "button clicked",
                "event_raw_details": 'Submit',
                "event_converted_details": '"Submit" selected',
                "timestamp": jsPsych.totalTime(),
                "time_elapsed": jsPsych.totalTime() - timestamp_onload
            });
            end_trial();
        });

         // countdown instruction for preventing random response
        if(item_id === 0 && answer_latency_countdown) {
            $('.answer_latency').text(answer_latency_text);
            setTimeout(function() {
                $('.answer_latency').text(trial.vars.VVR_q_text_a2);
            }, answer_latency);
        };

        // show a second part of the question with VAS
        function showNextQuestion() {
            $('.vvr-question-b').fadeIn('slow');   
            response.trial_events.push({
                "event_type": trial.details.b.event_type,
                "event_raw_details": "question " + question_number + "(b) appears",
                "event_converted_details": "question " + question_number + "(b) appears",
                "timestamp": jsPsych.totalTime(),
                "time_elapsed": jsPsych.totalTime() - timestamp_onload
            });
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

            // tilt vending machine and freeze
            if(info.key === left_tilt && !isMachineTilted) {
                $(".vending-machine").css({
                    "transform":  "rotate(" + shake_left_rotate + "deg) translateX(" + shake_left_translateX + "%)",
                    "transition": "all " + shake_transition + "s cubic-bezier(0.65, 0.05, 0.36, 1)"
                });
                vvrIsCorrect = false;
                isMachineTilted = true;
                ++loop_node_counter_max_num_incorrect;
                if(loop_node_counter_max_num_correct !== trial.vars.max_num_correct_consecutive_questions || loop_node_counter_max_num_correct < trial.vars.max_num_correct_consecutive_questions) {
                    loop_node_counter_max_num_correct = 0;
                };
                showNextQuestion();
            } else if (info.key === right_tilt && !isMachineTilted) {
                $(".vending-machine").css({
                    "transform":  "rotate(" + shake_right_rotate + "deg) translateX(" + shake_right_translateX + "%)",
                    "transition": "all " + shake_transition + "s cubic-bezier(0.65, 0.05, 0.36, 1)"
                });
                vvrIsCorrect = true;
                isMachineTilted = true;
                ++loop_node_counter_max_num_correct;
                showNextQuestion();
            }
        };


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
            var trial_data = {
                "stage_name": JSON.stringify(trial.stage_name),
                "stimulus": trial.stimulus,
                "timestamp": jsPsych.totalTime(),
                "block_number": loop_node_counter_vvr,
                "item_id": ++item_id,
                "food_item": OUTCOME.slice(15),
                "correct": vvrIsCorrect ? 'y':'n',
                "strength_of_belief": vas_holder,
                "events": JSON.stringify(response.trial_events)
            };

            // add VVR stage name if plugin was called by VVR stage
            // make exception for Recall stage
            if(trial.vvr_stage !== null) {
                trial_data.vvr_stage = JSON.stringify(trial.vvr_stage);
            } else {
                // required for Recall stage
                trial_data.block_number = trial.stage_type;
            }

            // clear the display
            display_element.innerHTML = '';

            // move on to the next trial
            jsPsych.finishTrial(trial_data);
        };

        // start the response listener
        if (trial.choices != jsPsych.NO_KEYS) {
            var keyboardListener;
            if(item_id === 0) {
                setTimeout( function() {
                    keyboardListener = jsPsych.pluginAPI.getKeyboardResponse({
                        callback_function: after_response,
                        valid_responses: trial.choices,
                        rt_method: 'performance',
                        persist: true,
                        allow_held_key: false
                    });
                }, answer_latency);
            } else {
                keyboardListener = jsPsych.pluginAPI.getKeyboardResponse({
                    callback_function: after_response,
                    valid_responses: trial.choices,
                    rt_method: 'performance',
                    persist: true,
                    allow_held_key: false
                });
            };

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
    }

    return plugin;
})();
