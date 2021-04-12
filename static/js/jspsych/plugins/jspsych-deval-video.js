jsPsych.plugins["video-keyboard-response"] = (function () {

  var plugin = {};

  jsPsych.pluginAPI.registerPreload('video-keyboard-response', 'stimulus', 'video');

  plugin.info = {
    name: 'video-keyboard-response',
    description: '',
    parameters: {
      sources: {
        type: jsPsych.plugins.parameterType.VIDEO,
        pretty_name: 'Video',
        default: undefined,
        description: 'The video file to play.'
      },
      choices: {
        type: jsPsych.plugins.parameterType.KEYCODE,
        pretty_name: 'Choices',
        array: true,
        default: jsPsych.ALL_KEYS,
        description: 'The keys the subject is allowed to press to respond to the stimulus.'
      },
      prompt: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Prompt',
        default: null,
        description: 'Any content here will be displayed below the stimulus.'
      },
      width: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Width',
        default: '',
        description: 'The width of the video in pixels.'
      },
      height: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Height',
        default: '',
        description: 'The height of the video display in pixels.'
      },
      autoplay: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Autoplay',
        default: true,
        description: 'If true, the video will begin playing as soon as it has loaded.'
      },
      controls: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Controls',
        default: false,
        description: 'If true, the subject will be able to pause the video or move the playback to any point in the video.'
      },
      start: {
        type: jsPsych.plugins.parameterType.FLOAT,
        pretty_name: 'Start',
        default: null,
        description: 'Time to start the clip.'
      },
      stop: {
        type: jsPsych.plugins.parameterType.FLOAT,
        pretty_name: 'Stop',
        default: null,
        description: 'Time to stop the clip.'
      },
      rate: {
        type: jsPsych.plugins.parameterType.FLOAT,
        pretty_name: 'Rate',
        default: 1,
        description: 'The playback rate of the video. 1 is normal, <1 is slower, >1 is faster.'
      },
      trial_ends_after_video: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'End trial after video finishes',
        default: false,
        description: 'If true, the trial will end immediately after the video finishes playing.'
      },
      trial_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Trial duration',
        default: null,
        description: 'How long to show trial before it ends.'
      },
      response_ends_trial: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Response ends trial',
        default: true,
        description: 'If true, the trial will end when subject makes a response.'
      },
      stage_name: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Stage Name',
        default: null,
        description: 'Specific name of the current stage.'
      },
    }
  }

  plugin.trial = function (display_element, trial) {

    // store responses, events
    var response = {
      trial_events: []
    };
    var timestamp_onload = jsPsych.totalTime();

    // setup stimulus
    var video_html = '<div>';

    video_html += '<video id="jspsych-video-keyboard-response-stimulus"';

    // apply options if set
    if (trial.width) {
      video_html += ' width="' + trial.width + '"';
    }
    if (trial.height) {
      video_html += ' height="' + trial.height + '"';
    }
    if (trial.autoplay) {
      video_html += " autoplay ";
    }
    if (!trial.audio) {
      video_html += " muted ";
    }
    if (trial.controls) {
      video_html += " controls ";
    }
    video_html += ">";

    var video_preload_blob = jsPsych.pluginAPI.getVideoBuffer(trial.sources[0]);
    if (!video_preload_blob) {
      for (var i = 0; i < trial.sources.length; i++) {
        var file_name = trial.sources[i];
        if (file_name.indexOf('?') > -1) {
          file_name = file_name.substring(0, file_name.indexOf('?'));
        }
        var type = file_name.substr(file_name.lastIndexOf('.') + 1);
        type = type.toLowerCase();
        video_html += '<source src="' + file_name + '" type="video/' + type + '">';
      }
    }
    video_html += "</video>";

    // save information "video started playing"
    response.trial_events.push({
      "event_type": 'video appears',
      "event_raw_details": counter_balancing[0].video,
      "event_converted_details": counter_balancing[0].video + '.mp4' + " video started playing",
      "timestamp": jsPsych.totalTime(),
      "time_elapsed": jsPsych.totalTime() - timestamp_onload
    });

    video_html += "</div>";

    // add prompt if there is one
    if (trial.prompt !== null) {
      video_html += trial.prompt;
    }

    video_html += '<div id="translation-listener">translate</div>';
    video_html += jsPsych.pluginAPI.getPopupHTML('translator-detected', popup_text_translator);

    // render
    display_element.innerHTML = video_html;

    if (video_preload_blob) {
      display_element.querySelector('#jspsych-video-keyboard-response-stimulus').src = video_preload_blob;
    }

    display_element.querySelector('#jspsych-video-keyboard-response-stimulus').onended = function () {
      if (trial.trial_ends_after_video) {
        end_trial();
      }
    }

    if (trial.start !== null) {
      display_element.querySelector('#jspsych-video-keyboard-response-stimulus').currentTime = trial.start;
    }

    if (trial.stop !== null) {
      display_element.querySelector('#jspsych-video-keyboard-response-stimulus').addEventListener('timeupdate', function (e) {
        var currenttime = display_element.querySelector('#jspsych-video-keyboard-response-stimulus').currentTime;
        if (currenttime >= trial.stop) {
          display_element.querySelector('#jspsych-video-keyboard-response-stimulus').pause();
        }
      })
    }

    display_element.querySelector('#jspsych-video-keyboard-response-stimulus').playbackRate = trial.rate;

    var promise = document.getElementById('jspsych-video-keyboard-response-stimulus').play();

    if (promise !== undefined) {
      promise.then(function () { }).catch(function (error) {
        console.log(error);
      });
    }

    function proccessDataBeforeSubmit() {
      return {
        "stage_name": JSON.stringify(trial.stage_name),
        "events": JSON.stringify(response.trial_events)
      };
    }

    const translatorTarget = document.getElementById('translation-listener')
    jsPsych.pluginAPI.initializeTranslatorDetector(translatorTarget, 'translate', response, timestamp_onload, proccessDataBeforeSubmit);

    // function to end trial when it is time
    function end_trial() {

      // kill any remaining setTimeout handlers
      jsPsych.pluginAPI.clearAllTimeouts();

      // kill keyboard listeners
      if (typeof keyboardListener !== 'undefined') {
        jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
        jsPsych.pluginAPI.cancelClickResponse(clickListener);
      }

      // gather the data to store for the trial
      var trial_data = proccessDataBeforeSubmit();

      // clear the display
      display_element.innerHTML = '';

      // move on to the next trial
      jsPsych.finishTrial(trial_data);
    };

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
      } else {
        response.trial_events.push({
          "event_type": "key release",
          "event_raw_details": info.key_release,
          "event_converted_details": jsPsych.pluginAPI.convertKeyCodeToKeyCharacter(info.key_release) + ' key released',
          "timestamp": jsPsych.totalTime(),
          "time_elapsed": jsPsych.totalTime() - timestamp_onload
        });
      }

      if (trial.response_ends_trial) {
        end_trial();
      }
    };

    // start the response listener
    if (trial.choices != jsPsych.NO_KEYS) {
      var keyboardListener = jsPsych.pluginAPI.getKeyboardResponse({
        callback_function: after_response,
        valid_responses: trial.choices,
        rt_method: 'performance',
        persist: false,
        allow_held_key: false,
      });

      var clickListener = jsPsych.pluginAPI.getMouseResponse({
        callback_function: after_response,
        valid_responses: trial.choices,
        rt_method: 'date',
        persist: true,
        allow_held_key: false
      });
    }

    var video_duration_real = trial.trial_duration;

    // end trial if time limit is set
    if (trial.trial_duration !== null) {
      jsPsych.pluginAPI.setTimeout(function () {
        end_trial();
      }, video_duration_real);
    }
  };

  return plugin;
})();