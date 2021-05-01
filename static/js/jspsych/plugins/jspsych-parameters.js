jsPsych.plugins['parameters'] = (function () {

    var plugin = {};

    plugin.info = {
        name: 'Parameters',
        stage_name: {
            type: jsPsych.plugins.parameterType.STRING,
            pretty_name: 'Stage Name',
            default: null,
            description: 'Specific name of the current stage.'
        },
        parameters: {
            variables: {
                type: jsPsych.plugins.parameterType.Obj,
                pretty_name: 'Variables',
                default: null,
                description: 'Variables from parameters.js file.'
            }
        }
    }

    // plugin for saving parameters from parameters.js
    plugin.trial = function (display_element, trial) {
        var parameters = {
            re_captcha: re_captcha,
            re_captcha_duration: re_captcha_duration,
            full_screen_mode: full_screen_mode,
            open_instruct_latency: open_instruct_latency,
            close_instruct_latency: close_instruct_latency,
            outcome_duration: outcome_duration,
            stim_duration: stim_duration,
            ITI_duration: ITI_duration,
            interval_duration: interval_duration,
            interval_num: interval_num,
            answer_latency_countdown: answer_latency_countdown,
            answer_latency: answer_latency,
            answer_latency_text: answer_latency_text,
            correct_text: correct_text,
            incorrect_text: incorrect_text,
            feedback_duration: feedback_duration,
            popup_text_behav: popup_text_behav,
            popup_text_WBF: popup_text_WBF,
            popup_translator: popup_translator,
            popup_text_translator: popup_text_translator,
            translator_detected_notif: translator_detected_notif,
            translator_detected_nofit_text: translator_detected_nofit_text,

            shake_right_rotate: shake_right_rotate,
            shake_right_translateX: shake_right_translateX,
            shake_left_rotate: shake_left_rotate,
            shake_left_translateX: shake_left_translateX,
            shake_return_time: shake_return_time,
            shake_transition: shake_transition,
            left_tilt: left_tilt,
            right_tilt: right_tilt,

            stim1_colour: stim1_colour,
            stim2_colour: stim2_colour,
            stim3_colour: stim3_colour,
            stim4_colour: stim4_colour,

            open_instruct_text_key_testing: open_instruct_text_key_testing,
            close_instruct_text_key_testing: close_instruct_text_key_testing,

            open_instruct_WBF: open_instruct_WBF,
            close_instruct_WBF: close_instruct_WBF,
            open_instruct_text_WBF: open_instruct_text_WBF,
            close_instruct_text_WBF: close_instruct_text_WBF,

            open_instruct_demographics: open_instruct_demographics,
            close_instruct_demographics: close_instruct_demographics,
            open_instruct_text_demographics: open_instruct_text_demographics,
            close_instruct_text_demographics: close_instruct_text_demographics,
            open_instruct_inventory: open_instruct_inventory,
            close_instruct_inventory: close_instruct_inventory,
            open_instruct_text_inventory: open_instruct_text_inventory,
            close_instruct_text_inventory: close_instruct_text_inventory,

            open_instruct_SDS: open_instruct_SDS,
            close_instruct_SDS: close_instruct_SDS,
            open_instruct_text_SDS: open_instruct_text_SDS,
            close_instruct_text_SDS: close_instruct_text_SDS,

            open_instruct_ICAR: open_instruct_ICAR,
            close_instruct_ICAR: close_instruct_ICAR,
            open_instruct_text_ICAR: open_instruct_text_ICAR,
            close_instruct_text_ICAR: close_instruct_text_ICAR,

            inventory_rand: inventory_rand,
            symptom_inventory: "",
            video_duration: video_duration,
            video_sound: video_sound,
            open_instruct_video: open_instruct_video,
            open_instruct_text_video: open_instruct_text_video,
            close_instruct_video: close_instruct_video,
            close_instruct_text_video: close_instruct_text_video,

            open_instruct_FHQ_pre_rating: open_instruct_FHQ_pre_rating,
            close_instruct_FHQ_pre_rating: close_instruct_FHQ_pre_rating,
            open_instruct_text_FHQ_pre_rating: open_instruct_text_FHQ_pre_rating,
            close_instruct_text_FHQ_pre_rating: close_instruct_text_FHQ_pre_rating,
            open_instruct_FHQ_post_rating: open_instruct_FHQ_post_rating,
            close_instruct_FHQ_post_rating: close_instruct_FHQ_post_rating,
            open_instruct_text_FHQ_post_rating: open_instruct_text_FHQ_post_rating,
            close_instruct_text_FHQ_post_rating: close_instruct_text_FHQ_post_rating,

            FHQ_1: FHQ_1,
            FHQ_2: FHQ_2,
            FHQ_3: FHQ_3,
            FHQ_4: FHQ_4,
            FHQ_1_bottom_text: FHQ_1_bottom_text,
            FHQ_2_bottom_text: FHQ_2_bottom_text,
            FHQ_3_bottom_text: FHQ_3_bottom_text,
            FHQ_VAS_left: FHQ_VAS_left,
            FHQ_VAS_center: FHQ_VAS_center,
            FHQ_VAS_right: FHQ_VAS_right,
            FHQ_VAS_left_hungry: FHQ_VAS_left_hungry,
            FHQ_VAS_right_hungry: FHQ_VAS_right_hungry,
            FHQ_VAS_instruct: FHQ_VAS_instruct,

            VVR_q_text_a1: VVR_q_text_a1,
            VVR_q_text_a2: VVR_q_text_a2,
            VVR_q_text_b1: VVR_q_text_b1,
            VVR_q_text_b2: VVR_q_text_b2,
            VVR_q_text_b3: VVR_q_text_b3,
            VVR_q_text_b4: VVR_q_text_b4,

            open_instruct_VVR1: open_instruct_VVR1,
            close_instruct_VVR1: close_instruct_VVR1,
            open_instruct_text_VVR1: open_instruct_text_VVR1,
            close_instruct_text_VVR1: close_instruct_text_VVR1,
            degrad_pattern_VVR1: "",
            prob_value_VVR1: "",
            min_blocks_num_VVR1: min_blocks_num_VVR1,
            min_num_correct_VVR1: min_num_correct_VVR1,
            max_num_incorrect_VVR1: max_num_incorrect_VVR1,

            open_instruct_VVR2: open_instruct_VVR2,
            close_instruct_VVR2: close_instruct_VVR2,
            open_instruct_text_VVR2: open_instruct_text_VVR2,
            close_instruct_text_VVR2: close_instruct_text_VVR2,
            degrad_pattern_VVR2: "",
            prob_value_VVR2: "",
            min_blocks_num_VVR2: min_blocks_num_VVR2,
            min_num_correct_VVR2: min_num_correct_VVR2,
            max_num_incorrect_VVR2: max_num_incorrect_VVR2,

            open_instruct_VVR3: open_instruct_VVR3,
            close_instruct_VVR3: close_instruct_VVR3,
            open_instruct_text_VVR3: open_instruct_text_VVR3,
            close_instruct_text_VVR3: close_instruct_text_VVR3,
            degrad_pattern_VVR3: "",
            prob_value_VVR3: "",
            min_blocks_num_VVR3: min_blocks_num_VVR3,
            min_num_correct_VVR3: min_num_correct_VVR3,
            max_num_incorrect_VVR3: max_num_incorrect_VVR3,

            open_instruct_pav: open_instruct_pav,
            close_instruct_pav: close_instruct_pav,
            open_instruct_text_pav: open_instruct_text_pav,

            min_num_correct_pav: min_num_correct_pav,
            max_num_incorrect_pav: max_num_incorrect_pav,
            close_instruct_text_pav: close_instruct_text_pav,

            open_instruct_transfer_test: open_instruct_transfer_test,
            close_instruct_transfer_test: close_instruct_transfer_test,
            open_instruct_text_transfer_test: open_instruct_text_transfer_test,
            close_instruct_text_transfer_test: close_instruct_text_transfer_test,
            block_num_transfer_test: block_num_transfer_test,
            close_instruct_text_thanks: close_instruct_text_thanks,
            transfer_test1: transfer_test1,
            transfer_test2: transfer_test2,
            transfer_test3: transfer_test3,

            open_instruct_deval_test: open_instruct_deval_test,
            close_instruct_deval_test: close_instruct_deval_test,
            open_instruct_text_deval_test: open_instruct_text_deval_test,
            close_instruct_text_deval_test: close_instruct_text_deval_test,
            deval_test_duration: deval_test_duration,

            open_instruct_recall: open_instruct_recall,
            close_instruct_recall: close_instruct_recall,
            open_instruct_text_recall: open_instruct_text_recall,
            close_instruct_text_recall: close_instruct_text_recall,

            open_instruct_transfer_q: open_instruct_transfer_q,
            close_instruct_transfer_q: close_instruct_transfer_q,
            open_instruct_text_transfer_q: open_instruct_text_transfer_q,
            transfer_q_q1_stim1_colour: transfer_q_q1_stim1_colour,
            transfer_q_q2_stim1_colour: transfer_q_q2_stim1_colour,
            transfer_q_q3_stim1_colour: transfer_q_q3_stim1_colour,
            transfer_q_q1_stim2_colour: transfer_q_q1_stim2_colour,
            transfer_q_q2_stim2_colour: transfer_q_q2_stim2_colour,
            transfer_q_q3_stim2_colour: transfer_q_q3_stim2_colour,
            transfer_q_q1_stim3_colour: transfer_q_q1_stim3_colour,
            transfer_q_q2_stim3_colour: transfer_q_q2_stim3_colour,
            transfer_q_q3_stim3_colour: transfer_q_q3_stim3_colour,
            transfer_q_q1_stim4_colour: transfer_q_q1_stim4_colour,
            transfer_q_q2_stim4_colour: transfer_q_q2_stim4_colour,
            transfer_q_q3_stim4_colour: transfer_q_q3_stim4_colour,
            transfer_q_1a_questiontext: transfer_q_1a_questiontext,
            transfer_q_1b_questiontext: transfer_q_1b_questiontext,
            transfer_q_1a_lvas: transfer_q_1a_lvas,
            transfer_q_1a_rvas: transfer_q_1a_rvas,
            transfer_q_2a_questiontext: transfer_q_2a_questiontext,
            transfer_q_2b_questiontext: transfer_q_2b_questiontext,
            transfer_q_2a_lvas: transfer_q_2a_lvas,
            transfer_q_2a_rvas: transfer_q_2a_rvas,
            transfer_q_3a_questiontext: transfer_q_3a_questiontext,
            transfer_q_3b_questiontext: transfer_q_3b_questiontext,
            transfer_q_3a_lvas: transfer_q_3a_lvas,
            transfer_q_3a_rvas: transfer_q_3a_rvas,
            transfer_q_text_limit: transfer_q_text_limit,
            transfer_popup_text: transfer_popup_text,

            close_instruct_text_close_HIT_q: close_instruct_text_close_HIT_q,

            // popups
            popup_machine_VVR1: popup_machine_VVR1,
            popup_duration_machine_VVR1: popup_duration_machine_VVR1,
            popup_text_machine_VVR1: popup_text_machine_VVR1,

            popup_machine_VVR2: popup_machine_VVR2,
            popup_duration_machine_VVR2: popup_duration_machine_VVR2,
            popup_text_machine_VVR2: popup_text_machine_VVR2,

            popup_machine_VVR3: popup_machine_VVR3,
            popup_duration_machine_VVR3: popup_duration_machine_VVR3,
            popup_text_machine_VVR3: popup_text_machine_VVR3,

            popup_machine_transfer1: popup_machine_transfer1,
            popup_duration_machine_transfer1: popup_duration_machine_transfer1,
            popup_text_machine_transfer1: popup_text_machine_transfer1,

            popup_machine_deval_test: popup_machine_deval_test,
            popup_duration_machine_deval_test: popup_duration_machine_deval_test,
            popup_text_machine_deval_test: popup_text_machine_deval_test,
        };

        // copy symptom inventory array
        symptom_inventory.forEach(function (element, index) {
            if (element.type) {
                index === 0 ? parameters['symptom_inventory'] += element.type : parameters['symptom_inventory'] += ', ' + element.type;
            } else if (element.timeline) {
                parameters['symptom_inventory'] += ', SMOKING STATUS';
            }
        });

        function array_extraction(arr, str) {
            arr.forEach(function (element, index) {
                index === 0 ? parameters[str] += element : parameters[str] += ', ' + element;
            });
        };

        array_extraction(degrad_pattern_VVR1, 'degrad_pattern_VVR1');
        array_extraction(degrad_pattern_VVR2, 'degrad_pattern_VVR2');
        array_extraction(degrad_pattern_VVR3, 'degrad_pattern_VVR3');

        array_extraction(prob_value_VVR1, 'prob_value_VVR1');
        array_extraction(prob_value_VVR2, 'prob_value_VVR2');
        array_extraction(prob_value_VVR3, 'prob_value_VVR3');

        // browser version, screen size, platform, OS version info for specs.csv 
        var version = platform.os.version === null ? '' : ' (' + platform.os.version + ')';
        var specs = {
            platform:
                platform.os.family + " " + platform.os.architecture + version,
            browser: platform.name + " (" + platform.version + ")",
            device: device.type,
            screen_resolution:
                window.screen.availHeight + "x" + window.screen.availWidth,
            viewport_size: $(window).height() + "x" + $(window).width(),
        };

        // gather the data to store for the trial
        var trial_data = {
            stage_name: "Parameters",
            "counter-balancing version": counter_balancing[0]["game_version"],
            commit: git_commit,
            parameters: JSON.stringify(parameters),
            specs: JSON.stringify(specs),
        };

        plugin.trial.variables = parameters;

        jsPsych.finishTrial(trial_data);
    }

    return plugin;

})();
