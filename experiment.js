// Loads jsPsych
var jsPsych = init.jsPsych({});

// Timeline that holds javascript variables (instructioins, stimuli) to appear in chronological order 
var timeline = [];

var test_stimuli = [version_X, version_Y, version_Z];

// Randomly chooses version the subject gets
var versionNum = getRandomInt(3);
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



// Initializes counter to run through each scenario
var i = 0;

var trial = {
    type: jsPsychSurvey,
    pages: [
        [
            {
                type: 'html',
                prompt: "<scenario>",
            },
            {
                type: 'multi-choice',
                prompt: "<question>",
                name: YesNo,
                options: ['yes', 'no'],
                required: true,
            },
            {
                type: 'text',
                prompt: "Explain your answer:",
                name: Explanation,
                required: true,
            }
        ]
    ],
};

var experiment = {
    timeline: [trial],
    timeline_variables: test_stimuli[versionNum]

};





