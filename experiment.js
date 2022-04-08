// Loads jsPsych
var jsPsych = initJsPsych({});

// Timeline that holds javascript variables (instructioins, stimuli) to appear in chronological order 
var timeline = [];

var test_stimuli = [version_x, version_y, version_z];

// Randomly chooses version the subject gets and saves the data
var versionNum = jsPsych.randomization.sampleWithoutReplacement([0, 1, 2], 1)[0];

jsPsych.data.addProperties({
    version: versionNum,
});

// RUNNING THE EXPERIMENT
// Welcome message
var welcome = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: "<p>Welcome to the experiment!</p>",
    choice: "NO_KEYS",
    trial_duration: 3000,
  };
  
timeline.push(welcome);
  
// Instructions
var instructions1 = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: "You will be presented with 9 scenarios, followed by 2 comprehension questions.\nPlease read each scenario carefully.\n\nHit the space bar to continue.",
    choice: [" "],
};

var instructions2 = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: "After reading each scenario, you will be asked to answer a yes/no question and a short open answer question.\nYou will have to do these steps until all scenarios and questions have been completed.\n\nTo start the experiment, hit the space bar.",
    choice: [" "],
};

var instructions = {
    timeline: [instructions1, instructions2],
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
    stimulus: "Thank you for participating in the experiment!\n If you'd like to learn more about the purpose of this experiment and what we're measuring, press 'y'. Otherwise, press 'n'.",
};

var full_debrief = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: "The main question being asked in this study is how the amount of privileged information provided in one perspective (level of embeddedness) affects projecting information to uninformed (other) perspectives. With each scenario, participants were shown one out of three levels of embeddedness: least embedded, somewhat embedded, and most embedded.\nThe main dependent variable being measured, which will be compared between each level of embeddedness, is the frequency with which participants overproject the privileged knowledge of one character by attributing it to another character. This will be measured by the participants' answers to yes/no questions, which will be consistent with either the privileged knowledge of one character or the limited knowledge of the other.",
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



