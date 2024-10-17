let questionCount=0;
let userScore=0;
let NCEAtotal=0;
let CIE_total=0;
let rand; // generates a random number to mix up quiz order
let record=[];
let isActive=0;

function $(id){
    return document.getElementById(id);
}

let quiz=$("quiz");
let quizSet=$("quizSet");
let question=$("question");
let option1=$("option1");
let option2=$("option2");
let option3=$("option3");
let option4=$("option4");
let submit=$("submit");
let progress=$("progress");
let retake=$("retake");
let button1=$("btn1");
let button2=$("btn2");
let button3=$("btn3");
let button4=$("btn4");

let result=$("result");
let resultBox=$("resultBox");


let tracker;
let countDown;
let secsInput=20;
let seconds=secsInput;
let t;

function setQuestion(qCount, rand){
    let ques= questions[rand];
    question.textContent=(qCount+1)+". "+ ques.question;
    option1.textContent=ques.option1;
    option2.textContent=ques.option2;
    option3.textContent=ques.option3;
    option4.textContent=ques.option4;
}

function changeProgressBar(qCount){
    progress.innerHTML="Question "+(qCount+1)+" of 10";
    tracker=$("num"+(qCount+1))
    tracker.style.backgroundColor="#cc7a00";
}

function defaultOptionColors() {
	button1.style.backgroundColor = "#e6f3ff";
	button2.style.backgroundColor = "#e6f3ff";
	button3.style.backgroundColor = "#e6f3ff";
	button4.style.backgroundColor = "#e6f3ff";
}


function getQuestion(qCount,rand){

    if(qCount==9){//is this the last question
        submit.innerHTML="Submit Test";
        submit.style.backgroundColor="green";
    }
    if(qCount>9){//ran out of questions
        return; //stops the function
    }

    setQuestion(qCount,rand);
    changeProgressBar(qCount);
    defaultOptionColors();

}

document.addEventListener("keydown", function(e) {
    if (e.key >= 1 && e.key <= 4) {
        let option = $("option" + e.key);
        optionSelect({ target: option });
    }
});

document.addEventListener("keypress", function(event) {
	if (event.key == "Enter") {
		event.preventDefault();
		nextQuestion("submit").click();
	}
});

function setCorrect(){
    tracker.style.backgroundColor="#009900";//change tracker to green
}

function setWrong(){
    tracker.style.backgroundColor="#009900";//change tracker to red
}

function finalScore(){

    if((-5)>userScore){
        result.innerHTML="Your preferences align more closely with CIE";
    }
	else if(userScore>5){
        result.innerHTML="Your preferences align more closely with NCEA";
    }
	else{
		result.innerHTML="Your preferences are diverse, you could go either way!";
	}

}

function setResultPage(){
    quizSet.style.display="none";
    resultBox.style.display="block";
    progress.innerHTML="Quiz Completed"
    finalScore();

    // Initialize the chart with NCEAtotal and CIE_total
    var xValues = ["NCEA", "CIE"];
    var yValues = [NCEAtotal, CIE_total]; // Make sure to use an array here
    var barColors = [
      "#b91d47",
      "#00aba9",
    ];

    // Create the chart
    new Chart("myChart", {
      type: "pie",
      data: {
        labels: xValues,
        datasets: [{
          backgroundColor: barColors,
          data: yValues // Use the array of values
        }]
      },
      options: {
        title: {
          display: true,
          text: "Overall Preferences"
        }
      }
    });
}

function randomGenerator() {
	while(isActive == 0) {
		rand = Math.round(Math.random() * questions.length);
		if(rand !== questions.length) {
			//run through record array to find if its unique
			for(var j=0; j<record.length; j++) {
				if(rand === record[j]) {
					break;
				}
				
				else if(j == record.length - 1) {
					record[questionCount] = rand;
					isActive = 1;
				}
			}
		}
	}
	isActive = 0;
	return rand;
}

// Make option selection work

option1.addEventListener("click",optionSelect);
option2.addEventListener("click",optionSelect);
option3.addEventListener("click",optionSelect);
option4.addEventListener("click",optionSelect);

function optionSelect(e){

//get parent elemnt and change background color
let parentEl=e.target.parentElement//get the target that is clicked and get the parent element
parentEl.style.backgroundColor="#1aff1a"; //change the colour to green

	//switch statement - the other buttons' colors go back to default
	switch(e.target.id) {
		case "option1": button2.style.backgroundColor = "#e6f3ff";
						button3.style.backgroundColor = "#e6f3ff";
						button4.style.backgroundColor = "#e6f3ff";
						userScore=userScore-2;
						CIE_total=CIE_total+2
						break;
		case "option2": button1.style.backgroundColor = "#e6f3ff";
						button3.style.backgroundColor = "#e6f3ff";
						button4.style.backgroundColor = "#e6f3ff";
						userScore=userScore-1;
						CIE_total=CIE_total+1;
						break;
		case "option3": button1.style.backgroundColor = "#e6f3ff";
						button2.style.backgroundColor = "#e6f3ff";
						button4.style.backgroundColor = "#e6f3ff";
						userScore=userScore+1;
						NCEAtotal=NCEAtotal+1
						break;
		case "option4": button1.style.backgroundColor = "#e6f3ff";
						button2.style.backgroundColor = "#e6f3ff";
						button3.style.backgroundColor = "#e6f3ff";
						userScore=userScore+2;
						NCEAtotal=NCEAtotal+2;
						break;
	}
	//set ans(answer) value based on the option selected 
	ans = parseInt(e.target.id.replace("option",""),10);
    //"option1" is converted to "1" 10 means that it will be an integer 
}


//6. Loading the next question after the next question button is clicked 
submit.addEventListener("click",nextQuestion);

function nextQuestion() {
	//no option selected
	console.log(button1.style.backgroundColor);
	console.log(button1.style.backgroundColor !== "rgb(26, 255, 26)");
	if(button1.style.backgroundColor !== "rgb(26, 255, 26)" && 
        button2.style.backgroundColor !== "rgb(26, 255, 26)" && 
        button3.style.backgroundColor !== "rgb(26, 255, 26)" && 
        button4.style.backgroundColor !== "rgb(26, 255, 26)") {
		alert("Please select an option");
		return;
	}

		//if its the last question - load result page 
		if(questionCount == 9 && questionCount != 10) {
			if(ans == questions[rand].answer) {
				setCorrect();
			}
			else {
				setWrong();
			}
			setResultPage();
			return;
		}

        if(ans == questions[rand].answer) {
			setCorrect();
			getQuestion(++questionCount, randomGenerator());
		}
		else {
			setWrong();
			getQuestion(++questionCount, randomGenerator());
		}	
}

//7. Final parts - retake button, setting up random number for the first time, what happens when the page first loads etc
//Retake button 
retake.addEventListener("click",retakeTest);

function retakeTest() {
	window.location.reload();
}

rand = Math.round(Math.random() * questions.length);

while(rand == questions.length) {
	rand = Math.round(Math.random() * questions.length);
}

record[0] = rand;

//onload function
window.onload = getQuestion(questionCount, rand);