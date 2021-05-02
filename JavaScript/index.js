
// Reference variables for declared html elements
var header = document.getElementById("header");
var contentContainer = document.getElementById("content-container");
var footer = document.getElementById("footer");
var welcome = document.getElementById("welcome");
var thankyou = document.getElementById("thank-you");
var message = document.getElementById("message");
var childIds = [];

// Main function definition
function populate() {
    childIds = getChildElementIds();
    fetch("payload.json").then(function (response) { return response.json(); })
      .then(function (data) {
        generateQuestions(data.questions);
        if(getLastViewed() && getLastViewed() != 'thank-you') {
            setDisplayValue(getLastViewed());
        } else {
            setDisplayValue('welcome');
            updateLastViewed('welcome');
        }
        if(!getAnswers()) {
            updateAnswers({q1: '', q2: '', q3: '', q4: ''});
        } else {
            setLastSelectedOptions();
        }
        showHideElements();
      })
      .catch(function (err) { console.log(err); });
      
    /*  
    ---------------------------------------------------------
    USED FOR FETCHING PAYLOAD FROM SERVER WHEN NODE JS SERVER 
    IS HOSTED IN LOCALHOST:3000
    ---------------------------------------------------------
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if(this.readyState == 4 && this.status == 200) {
            header.innerText = "FreshFruits";
            welcome.innerHTML = getWelcomeInnerHtml();
            footer.innerHTML = getFooterInnerHtml();
            thankyou.innerHTML = getFinishInnerHtml();
            message.innerText = '';
            var response = JSON.parse(xmlhttp.response);
            generateQuestions(response.questions);
            if(getLastViewed() && getLastViewed() != 'thank-you') {
                setDisplayValue(getLastViewed());
            } else {
                setDisplayValue('welcome');
                updateLastViewed('welcome');
            }
            if(!getAnswers()) {
                updateAnswers({q1: '', q2: '', q3: '', q4: ''});
            } else {
                setLastSelectedOptions();
            }
            showHideElements();
        }
    }
    xmlhttp.open('GET', 'http://localhost:3000/getQuestions');
    xmlhttp.send(); */
}


// Method to generate questions and options fetched from JSON
function generateQuestions(questions) {
    questions.forEach((data,index) => {
        var questionContainer = document.getElementById("q"+ (index + 1));
        var options = '';
        questionContainer.innerHTML = '<div>' + data.question + '</div>';
        if(data.type == 'text') {
            questionContainer.innerHTML+= '<textarea id="comments" placeholder="Add your comments here (Default: No Comments)" '+
                'oninput="onCommentsInput(\'q'+  (index + 1)+'\',id)"></textarea>' 
        } else if(data.type == 'boolean') {
            data.options.forEach((option, pos) => {
                options += '<div><span><input type="radio" name="q' + (index + 1)  +'option" id="option' + pos + 
                    '" value="'+ option.text + '"onclick="onRadioSelect(\'q' + (index + 1) + '\', id,  value)"' +
                    '></span><label for="option'  + pos + '">' + option.text +'</label></div>';
            });
            questionContainer.innerHTML+='<div>' + options + '<div>';
            document.getElementById("option0").checked = true;
        } else {
            data.options.forEach((option, pos) => {
                options += '<div onclick="onOptionSelect(\'q' + (index + 1) + '\',\'' + option.text + 
                    '\')"' + ( pos == 0 ? 'data-selected = true >' : 'data-selected = false >' ) + option.text + '</div>';
            });
            questionContainer.innerHTML+='<div>' + options + '<div>';
        }
    });
    header.innerText = "FreshFruits";
    welcome.innerHTML = getWelcomeInnerHtml();
    footer.innerHTML = getFooterInnerHtml();
    thankyou.innerHTML = getFinishInnerHtml();
    message.innerText = '';
}

// Method to get the child elements of content container
function getChildElementIds() {
    let childIds = [];
    for(let child of contentContainer.children) {
        childIds.push(child.id);
    }
    return childIds;
}

// Method to get html code for welcome page
function getWelcomeInnerHtml() {
    let hiElement = '<div><span>Hi!</span><img src="./assets/wave.png"></div>';
    let description = '<div>Help us get some insights into the quality of our products</div>';
    let proceedElement = '<div><button onclick="onProceedClick()">Proceed &#8594;</button></div>';
    return hiElement + description + proceedElement;
}

//Method to get html code for footer
function getFooterInnerHtml() {
    let backElement = '<button onclick="onBackClick()">&#8592; Back</button>';
    let nextElement = '<button onclick="onNextClick()">Next &#8594;</button>';
    return '<div>'+backElement+nextElement+'</div>'
}

//Method to get html code for thank you page
function getFinishInnerHtml() {
    let img = '<div><img src="./assets/tick.png"></div>';
    let text = '<div>Thank you!</div>';
    let description = '<div>Thanks for helping us improve!</div>'
    return img + text + description;
}

// invoked on proceed button click
function onProceedClick() {
    setDisplayValue('q1');
    updateLastViewed('q1');
    showHideElements();
}

// invoked on next button click
function onNextClick() {
    let answers = getAnswers();
    if(answers[getLastViewed()] != '') {
        message.style.display = 'none';
        let elementToBeDisplayed = childIds[childIds.indexOf(getLastViewed()) + 1];
        setDisplayValue(elementToBeDisplayed);
        updateLastViewed(elementToBeDisplayed);
        showHideElements();
        if(elementToBeDisplayed == 'thank-you') {
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.open('POST','http://localhost:3000/saveSurveyDetails');
            xmlhttp.setRequestHeader('Content-Type',"application/json");
            xmlhttp.send(JSON.stringify(getAnswers()));
            updateAnswers({q1: '', q2: '', q3: '', q4: ''});
        }
    } else {
        message.style.display = 'block';
        message.innerText = "**Default Value is Selected. Select/Enter a new Value to Change or Click Next to Proceed";
        setDefaultValue(getLastViewed(), answers);
    }
}

// invoked on back button click
function onBackClick() {
    let elementToBeDisplayed = childIds[childIds.indexOf(getLastViewed()) - 1];
    setDisplayValue(elementToBeDisplayed);
    updateLastViewed(elementToBeDisplayed);
    showHideElements();
}

// Method to show or hide a particular element
function showHideElement(element, display) {
    document.getElementById(element).style.display = display == 'show' ? 'block' : 'none';
}

// Method to hide other elements except the parameter value
function setDisplayValue(exceptionalValue) {
    for(let child of childIds) {
        child != exceptionalValue ? showHideElement(child,'hide') : showHideElement(child,'show')
    }
}

// Method to update last viewed element in sessionStorage
function updateLastViewed(element) {
    sessionStorage.setItem('lastviewed', element);
}

// Method to get last viewed element from sessionStorage
function getLastViewed() {
    return sessionStorage.getItem('lastviewed');
}

//Method to show or hide elements
function showHideElements() {
    if(getLastViewed() == 'welcome' || getLastViewed() =='thank-you') {
        showHideElement('footer', 'hide');
        contentContainer.style.alignSelf = "center";
        contentContainer.style.justifyContent = "center";
        contentContainer.style.marginTop = "0vh";
    } else {
        showHideElement('footer', 'show');
        contentContainer.style.alignSelf = "flex-start";
        contentContainer.style.justifyContent = "flex-start";
        contentContainer.style.marginTop = "15vh";
    }
    footer.children[0].lastChild.innerHTML = getLastViewed() == 'q4' ?  'Submit &#8594': 'Next &#8594;';
}

//Method to update answers to sessionStorage
function updateAnswers(answers) {
    sessionStorage.setItem('answers',JSON.stringify(answers));
}

//Method to get answers from sessionStorage
function getAnswers() {
    return JSON.parse(sessionStorage.getItem('answers'));
}

//Invoked on option select
function onOptionSelect(quesNo, option) {
    let answers = getAnswers();
    message.style.display = 'none';
    setSelectedOption(quesNo, option);
    answers[quesNo] = option;
    updateAnswers(answers);
}

//Invoked on radio button select
function onRadioSelect(quesNo,id,option) {
    let answers = getAnswers();
    answers[quesNo] = option;
    message.style.display = 'none';
    document.getElementById(id).checked = true;
    id == 'option0' ? document.getElementById('option1').checked = false:
        document.getElementById('option0').checked = false;
    updateAnswers(answers);
}

//Invoked on textarea change
function onCommentsInput(quesNo,id) {
    let answers = getAnswers();
    message.style.display = 'none';
    answers[quesNo] = document.getElementById(id).value;
    updateAnswers(answers);
}

//Method to set previously selected options on refresh
function setLastSelectedOptions() {
    let answers = getAnswers();
    if(answers["q1"] != '') {
        setSelectedOption("q1", answers["q1"]);
    }
    if(answers["q2"] != '') {
        setSelectedOption("q2", answers["q2"]);
    }
    if(answers["q3"] != '') {
        for(let option of document.getElementsByName("q3option")) {
            if(option.defaultValue == answers["q3"]) {
                document.getElementById(option.id).checked = true;
                option.id == 'option0' ? document.getElementById('option1').checked = false:
                    document.getElementById('option0').checked = false;
                break;
            }
        }
    }
    if(answers["q4"] != '') {
        document.getElementById("comments").value = answers["q4"];
    }
}

//Method to set selected options for q1 & q2
function setSelectedOption(quesNo, answer) {
    let options = document.getElementById(quesNo).lastChild.children;
    for(let opt of options) {
        opt.dataset.selected = opt.innerText != answer ? "false" : "true";
    }
}

//Method to set Default value
function setDefaultValue(question, answers) {
    switch(question) {
        case 'q1': 
        case 'q2':
            answers[question] = 'Great';
            break;
        case 'q3':
            answers[question] = 'Yes, Definitely';
            break;
        case 'q4':
            answers[question] = 'No comments';
            break;
    }
    updateAnswers(answers);
}


// Main function call
populate();