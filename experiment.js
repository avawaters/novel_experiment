// Loads jsPsych
var jsPsych = initJsPsych({});

// Timeline that holds javascript variables (instructioins, stimuli) to appear in chronological order 
var timeline = [];

var test_stimuli = [version_X, version_Y, version_Z];

// Randomly chooses version the subject gets
var versionNum =  jsPsych.randomization.sampleWithoutReplacement([0, 1, 2], 1)[0];
console.log(versionNum);

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


// Initializes counter to run through each scenario
var i = 0;

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
                        prompt: jsPsych.timelineVariable("question"),
                        name: 'YesNo',
                        options: ['yes', 'no'],
                        required: true,
                    },
                    {
                        type: 'text',
                        prompt: "Explain your answer:\n",
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

// Debriefs the participant
var debrief = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: "Thank you for participating in the experiment!\n If you'd like to learn more about the purpose of this experiment and what we're measuring, press 'y'. Otherwise, feel free to exit the page.",
    choice: ["y"],
    /* on_start: function (data) {
        version: 
    }, */
};


timeline.push(debrief);

jsPsych.run(timeline);



