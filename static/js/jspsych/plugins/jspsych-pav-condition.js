/**
 * jsPsych plugin for showing animations and recording keyboard responses
 * Josh de Leeuw
 *
 * documentation: docs.jspsych.org
 */

jsPsych.plugins.animation = (function () {

    var plugin = {};

    jsPsych.pluginAPI.registerPreload('animation', 'stimuli', 'image');

    plugin.info = {
        name: 'animation',
        description: '',
        parameters: {
            stimuli: {
                type: jsPsych.plugins.parameterType.STRING,
                pretty_name: 'Stimuli',
                default: [],
                array: true,
                description: 'The images to be displayed.'
            },
            frame_time: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'Frame time',
                default: 250,
                description: 'Duration to display each image.'
            },
            frame_isi: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'Frame gap',
                default: 0,
                description: 'Length of gap to be shown between each image.'
            },
            sequence_reps: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'Sequence repetitions',
                default: 1,
                description: 'Number of times to show entire sequence.'
            },
            choices: {
                type: jsPsych.plugins.parameterType.KEYCODE,
                pretty_name: 'Choices',
                default: jsPsych.ALL_KEYS,
                array: true,
                description: 'Keys subject uses to respond to stimuli.'
            },
            prompt: {
                type: jsPsych.plugins.parameterType.STRING,
                pretty_name: 'Prompt',
                default: null,
                description: 'Any content here will be displayed below stimulus.'
            }
        }
    }

    plugin.trial = function (display_element, trial) {

        // store responses, events
        var response = {
            trial_events: []
        };

        if(pav_con_timer <= 0) {
            pav_con_timer = jsPsych.totalTime();
        };

        var timestamp_onload = pav_con_timer;

        trial.stimuli = [];

        // shuffle array on page loading
        var pav_stimuli_arr = jsPsych.randomization.shuffle(pav_stimuli);
        pav_stimuli_arr.forEach(function (element) {
            trial.stimuli.push(element.stimuli);
        });

        var interval_time = trial.frame_time + trial.frame_isi;
        var animate_frame = -1;
        // storing the sequence animation of vending machines
        var animation_sequence = [];

        var html = 
            '<style class="pav-conditioning">.outcome_container { height: 340px;}</style>' +
            '<svg class="vending-machine"  viewBox="0 0 253 459" fill="none" xmlns="http://www.w3.org/2000/svg">' +
            '<rect x="27" y="20" width="203" height="359" fill="#000"/>' +
            '<path fill-rule="evenodd" clip-rule="evenodd" d="M253 0V440.506H209.527V459H44.6212V440.506H0V0H253ZM222 279H32V363H222V279ZM59.957 282.531L133.253 309.209L118.546 349.616L45.2501 322.938L59.957 282.531ZM86 210H32V256H86V210ZM154 210H100V256H154V210ZM222 210H168V256H222V210ZM86 148H32V194H86V148ZM154 148H100V194H154V148ZM222 148H168V194H222V148ZM86 86H32V132H86V86ZM154 86H100V132H154V86ZM222 86H168V132H222V86ZM86 24H32V70H86V24ZM154 24H100V70H154V24ZM222 24H168V70H222V24Z" fill="white"/>' +
            '</svg>' +
            '<div class="outcome_container"></div>';
        
        
        html += '<div id="translation-listener">translate</div>';
        html += jsPsych.pluginAPI.getPopupHTML('translator-detected', popup_text_translator);

        // render a blank vending machine
        display_element.innerHTML = html
            
       
        animation_sequence.push({
            stimulus: "blank",
            time: jsPsych.totalTime() - timestamp_onload,
        });
        
        response.trial_events.push({
            event_type: "image appears",
            event_raw_details: "blank vending machine",
            event_converted_details: "blank vending machine appears",
            timestamp: jsPsych.totalTime(),
            time_elapsed: jsPsych.totalTime() - timestamp_onload,
        });

        jsPsych.pluginAPI.setTimeout(function () {
            animate_frame++;
            show_next_frame();
        }, ITI_duration);

        // sequence animation
        var animate_interval = jsPsych.pluginAPI.setTimeout(function request() {

            var isShowColor = true;
            animate_frame++;
            
            if (animate_frame === trial.stimuli.length) {
                isShowColor = false;
                // show blank machine at the end of the stage
                jsPsych.pluginAPI.setTimeout(function() {
                  window.clearTimeout(animate_interval);
                  endTrial();
                }, ITI_duration);
            }

            // reset machine color, hide outcome
            $('.vending-machine rect').css({ fill: "#000" });
            $('.outcome').addClass('hidden');
            animation_sequence.push({
                stimulus: "blank",
                time: jsPsych.totalTime() - timestamp_onload,
            });

            response.trial_events.push({
                event_type: "image appears",
                event_raw_details: "blank vending machine",
                event_converted_details: "blank vending machine appears",
                timestamp: jsPsych.totalTime(),
                time_elapsed: jsPsych.totalTime() - timestamp_onload,
            });

            // show next color machine
            if (isShowColor) {
                jsPsych.pluginAPI.setTimeout(function() {
                    show_next_frame();
                }, ITI_duration);
            }
            animate_interval = jsPsych.pluginAPI.setTimeout(request, interval_time);
        }, interval_time);


        function show_next_frame() {
            
            // show image
            $('.outcome_container').html('<img class="outcome hidden" src="' + trial.stimuli[animate_frame] + '" id="jspsych-animation-image" style="margin-top: 4rem;">');
            var outcome_presentation = stim_duration - outcome_duration;
            
            jsPsych.pluginAPI.setTimeout(function () {
                $('.outcome').removeClass('hidden');
                response.trial_events.push({
                  event_type: "image appears",
                  event_raw_details: "outcome image appears",
                  event_converted_details: trial.stimuli[animate_frame] + " image appears",
                  timestamp: jsPsych.totalTime(),
                  time_elapsed: jsPsych.totalTime() - timestamp_onload
                });
                // record when image was shown
                animation_sequence.push({
                  stimulus: trial.stimuli[animate_frame],
                  time: jsPsych.totalTime() - timestamp_onload,
                });
            }, outcome_presentation);

            // show next color vending machine
            var color = pav_stimuli_arr[animate_frame].color;
            var color_name = pav_stimuli_arr[animate_frame].color_name;
            $('.vending-machine rect').css({ fill: color });
            response.trial_events.push({
              event_type: "image appears",
              event_raw_details: color_name + " vending machine",
              event_converted_details: color_name + " vending machine appears",
              timestamp: jsPsych.totalTime(),
              time_elapsed: jsPsych.totalTime() - timestamp_onload,
            });
        }

        // function to handle responses by the subject
        var after_response = function (info) {

            if(info.key_release === undefined) {
                response.trial_events.push({
                  event_type: "key press",
                  event_raw_details: info.key,
                  event_converted_details: jsPsych.pluginAPI.convertKeyCodeToKeyCharacter(info.key) + " key pressed",
                  timestamp: jsPsych.totalTime(),
                  time_elapsed: jsPsych.totalTime() - timestamp_onload,
                });
              } else {
                response.trial_events.push({
                  event_type: "key release",
                  event_raw_details: info.key_release,
                  event_converted_details: jsPsych.pluginAPI.convertKeyCodeToKeyCharacter(info.key_release) + " key released",
                  timestamp: jsPsych.totalTime(),
                  time_elapsed: jsPsych.totalTime() - timestamp_onload,
                });
            }
        };


        function proccessDataBeforeSubmit() {
            return {
                stage_name: JSON.stringify(trial.stage_name),
                animation_sequence: JSON.stringify(animation_sequence),
                events: JSON.stringify(response.trial_events),
            };
        }
          
        const translatorTarget = document.getElementById('translation-listener')
        jsPsych.pluginAPI.initializeTranslatorDetector(translatorTarget, 'translate', response, timestamp_onload, proccessDataBeforeSubmit);
        
        // hold the jspsych response listener object in memory
        // so that we can turn off the response collection when
        // the trial ends

        function endTrial() {

            // kill keyboard listeners
            if (typeof keyboardListener !== "undefined") {
                jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
                jsPsych.pluginAPI.cancelClickResponse(clickListener);
            }

            // gather the data to store for the trial
            var trial_data = proccessDataBeforeSubmit();

            // clear all timeouts
            while (animate_interval--) {
              window.clearTimeout(animate_interval);
            }

            // move on to the next trial
            jsPsych.finishTrial(trial_data);
        }

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


        // Patches setInterval, clearInterval, setTimeout and clearTimeout to avoid browser throttling these functions when tab is inactive.
        (function () {
            var $momentum;
        
            function createWorker() {
                var containerFunction = function () {
                    var idMap = {};
        
                    self.onmessage = function (e) {
                        if (e.data.type === 'setInterval') {
                            idMap[e.data.id] = setInterval(function () {
                                self.postMessage({
                                    type: 'fire',
                                    id: e.data.id
                                });
                            }, e.data.delay);
                        } else if (e.data.type === 'clearInterval') {
                            clearInterval(idMap[e.data.id]);
                            delete idMap[e.data.id];
                        } else if (e.data.type === 'setTimeout') {
                            idMap[e.data.id] = setTimeout(function () {
                                self.postMessage({
                                    type: 'fire',
                                    id: e.data.id
                                });
                                // remove reference to this timeout after is finished
                                delete idMap[e.data.id];
                            }, e.data.delay);
                        } else if (e.data.type === 'clearCallback') {
                            clearTimeout(idMap[e.data.id]);
                            delete idMap[e.data.id];
                        }
                    };
                };
        
                return new Worker(URL.createObjectURL(new Blob([
                    '(',
                    containerFunction.toString(),
                    ')();'
                ], {type: 'application/javascript'})));
            }
        
            $momentum = {
                worker: createWorker(),
                idToCallback: {},
                currentId: 0
            };
        
            function generateId() {
                return $momentum.currentId++;
            }
        
            function patchedSetTimeout(callback, delay) {
                var intervalId = generateId();
        
                $momentum.idToCallback[intervalId] = function () {
                    callback();
                    delete $momentum.idToCallback[intervalId];
                };
        
                $momentum.worker.postMessage({
                    type: 'setTimeout',
                    delay: delay,
                    id: intervalId
                });
                return intervalId;
            }
        
            function patchedClearTimeout(intervalId) {
                $momentum.worker.postMessage({
                    type: 'clearInterval',
                    id: intervalId
                });
        
                delete $momentum.idToCallback[intervalId];
            }
        
            $momentum.worker.onmessage = function (e) {
                if (e.data.type === 'fire') {
                    $momentum.idToCallback[e.data.id]();
                }
            };
        
            window.$momentum = $momentum;
            window.setTimeout = patchedSetTimeout;
            window.clearTimeout = patchedClearTimeout;
        })();
    };

    return plugin;
})();