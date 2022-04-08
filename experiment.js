// Loads jsPsych
var jsPsych = initJsPsych({});

// Timeline that holds javascript variables (instructioins, stimuli) to appear in chronological order 
var timeline = [];

// capturing info from Prolific
var subject_id = jsPsych.data.getURLVariable('PROLIFIC_PID');
var study_id = jsPsych.data.getURLVariable('STUDY_ID');
var session_id = jsPsych.data.getURLVariable('SESSION_ID');

jsPsych.data.addProperties({
    subject_id: subject_id,
    study_id: study_id,
    session_id: session_id
});

var test_stimuli = [version_x, version_y, version_z];

// Randomly chooses version the subject gets and saves the data
var versionNum = jsPsych.randomization.sampleWithoutReplacement([0, 1, 2], 1)[0];

jsPsych.data.addProperties({
    version: versionNum,
});

// RUNNING THE EXPERIMENT
// Welcome message
/*var welcome = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: "<p>Welcome to the experiment!</p>",
    choice: "NO_KEYS",
    trial_duration: 3000,
  };
  
timeline.push(welcome);*/
  
// Instructions
var instructions = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: "<p>In this experiment, you will be presented with 9 scenarios, which you must read carefully.</p><p>After reading each scenario, you will be prompted two comprehension questions: a multiple choice question and a brief open answer question. You will be required to answer both questions for every scenario, meaning 18 questions in total.</p><p>To begin the experiment, hit the space bar.</p>",
    choice: [" "],
};

timeline.push(instructions);

// Displays each scenario and associated questions
var trial_loop = {
    timeline: [
        {
            type: jsPsychSurvey,
            pages: [
                [
                    {
                        type: 'html',
                        prompt: jsPsych.timelineVariable("scenario"),
                    },
                    {
                        type: 'multi-choice',
                        prompt: jsPsych.timelineVariable("mc_question"),
                        name: 'multiQuestion',
                        options: ["sincere", "sarcastic"],
                        required: true,
                    },
                    {
                        type: 'text',
                        prompt: "Explain your answer:",
                        name: 'Explanation',
                        required: true,
                    }
                ]
            ],
        }
    ]
};

var experiment = {
    timeline: [trial_loop],
    timeline_variables: test_stimuli[versionNum]
};

timeline.push(experiment);

// Saves data
var save_server_data = {
    type: jsPsychCallFunction,
    func: function () {
      var data = jsPsych.data.get().json();
      var xhr = new XMLHttpRequest();
      xhr.open('POST', 'php/save_json.php');
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(JSON.stringify({ filedata: data }));
    },
    post_trial_gap: 1000
  }

timeline.push(save_server_data);


// Debriefs the participant
var debrief = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: "Thank you for participating in the experiment!\n If you'd like to learn more about the purpose of this experiment and what we're measuring, press 'y'.<p>Otherwise, <a href='https://app.prolific.co/submissions/complete?cc=8A3B5E88'>click here to return to Prolific and complete the study</a>.</p>",
};

var full_debrief = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: "The main question being asked in this study is how the amount of privileged information provided in one perspective (level of embeddedness) affects projecting information to uninformed (other) perspectives. With each scenario, participants were shown one out of three levels of embeddedness: least embedded, somewhat embedded, and most embedded.\nThe main dependent variable being measured, which will be compared between each level of embeddedness, is the frequency with which participants overproject the privileged knowledge of one character by attributing it to another character. This will be measured by the participants' answers to yes/no questions, which will be consistent with either the privileged knowledge of one character or the limited knowledge of the other.<p><a href='https://app.prolific.co/submissions/complete?cc=8A3B5E88'>Click here to return to Prolific and complete the study</a>.</p>",
    choices: "NO_KEYS",
}

var if_full_debrief = {
    timeline: [full_debrief],
    conditional_function: function () {
        // Checks which key was pressed
        var key = jsPsych.data.get().last(1).values()[0];
        if (jsPsych.pluginAPI.compareKeys(key.response, 'y')) {
            return true;
        }
        else {
            return false;
        }
    }
}

var goodbye = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: "Thanks for participating!"
}


timeline.push(debrief, if_full_debrief, goodbye);

jsPsych.run(timeline);



