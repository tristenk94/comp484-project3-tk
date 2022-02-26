//some consts, I didn't change any of these
const testWrapper = document.querySelector(".test-wrapper");
const testArea = document.querySelector("#test-area");
const originText = document.querySelector("#origin-text p").innerHTML;
const resetButton = document.querySelector("#reset");
const theTimer = document.querySelector(".timer");

//globals for timer, since they're all shared
var minutes = 0;
var seconds = 0; 
var hundredths = 0;
var timer; //the timer variable

var scoreTimes = []; //the array to save scores

//the array that holds all test texts
var textChosen = 0; //iterator to hold what test # we are on
var textIt = 0; //text iterator to check what word the user is on
var textTestArray =[ ["These", "are",  "some" , "words", "that", "you", "are", "being", "tested", "on."],  //test 1, something i made up
                     ["The", "Fitness", "Gram", "Pacer", "Test", "is" , "a",  "multistage", "aerobic" , "capacity" , "test" , "that" , "progressively" , "gets" ,  "more" ,  "difficult" ,  "as" , "it" ,  "continues." , "The" , "test" , "is" , "used" , "to" , "measure" , "a" , "student's" ,  "aerobic" , "capacity" , "as" ,  "part" , "of" , "the" , "FitnessGram" , "assessment." ,  "Students" , "run" , "back" , "and" , "forth" , "as" , "many" , "times" , "as" , "they" , "can" , "each" , "lap" , "signaled" , "by" , "a" , "beep" , "sound." , "The" , "test" , "gets" , "progressively" , "faster" , "as" , "it" , "continues" , "until" , "the" , "student" , "reaches" , "their" , "max" , "lap" , "score."], //test 2, from https://fitnessgram.net/pacertest/
                      ["Sally", "sells", "seashells",  "by",  "the",  "seashore"] //test 3, idk common tongue twister
                   ] 


// Add leading zero to numbers 9 or below (purely for aesthetics):
function checkFormat() //to check this, we need to see if num < 9 AND if the length of the variable is == 1 (eg has to be a single digit, double or triple digits ok)
{
  //console.log("time recieved : "+ minutes + " " + seconds + " " +  hundredths);
   // console.log("l recieved : "+ minutes.length + " " + seconds.length + " " +  hundredths.length);
  
  //convert the numbers to string using temp check variables (solely just in case nothing hapens to the original vars)
  let minCheck = ""+minutes;
  let secCheck = ""+seconds;
  let hundCheck = ""+hundredths;
  
  //since js can do math on string but not string on math, we check if its <= 9 AND then see if the length of the string is a single digit. if it is, add a 0. This way we always preserve the current time!
  if(minCheck <= 9 && minCheck.length < 2) //check if the number value is 9 or less AND if its a single digit
  {
    minutes = "0" + minutes; //append the 0
  }
  
  if(seconds <= 9 && secCheck.length < 2)//check if the number value is 9 or less AND if its a single digit
  {
    seconds = "0" + seconds;//append the 0
  }
  else
  
  if(hundredths <= 9 && hundCheck.length < 2)//check if the number value is 9 or less AND if its a single digit
  {
    hundredths = "0" + hundredths;//append the 0
  }

   // console.log("time output : "+ minutes + " " + seconds + " " +  hundredths);
}

// Run a standard minute/second/hundredths timer
function timeClock()
{
  hundredths++; //start at hundreths
  if(hundredths > 60) 
  {//wraps around, inc next level
    hundredths = 0;
    seconds++;
    if(seconds > 60) //then at seconds
      {//wraps around, inc next level
        seconds = 0;
        minutes++;
        if(minutes > 60) //if this is incremented, why (overflow protection)
          {//wraps around, but why did you wait 60 minutes?
            minutes = 0;
            console.log("Are you still there??")
          }
      }
  }
  checkFormat(); //check and adjust format at end of timer loop
  
  //after adjusting format, display it
  document.getElementById("timer").innerHTML = minutes + ":" + seconds + ":" + hundredths; 
}

//change Text to test
function chooseAnother() { //simple function to inc the iterator to choose which test we will be using, it wraps around so we can always keep clicking it
  textChosen++;
  if(textChosen > textTestArray.length-1) //wrap around to select the right test, we check after incrementing so we dont go out of bounds
  {
      textChosen = 0;
  }
  
  //after choosing the array, make it into a string, replace commas with spaces to be an actual block of text
  document.getElementById("text-test").innerHTML = (""+textTestArray[textChosen]).replace(/,/g,' '); 
}

// Match the text entered with the provided text on the page
function testingInSession() //this is called everytime a user places an input
{
  if(textIt >= textTestArray[textChosen].length) //check if we have typed out ALL words, if we have we are done!
  { //so if we are done lets do the following:
    checkFormat();//just in case there is any number that needs to be formatted
    
    alert("Wow very cool! Your time was : " +  minutes + ":" + seconds + ":" + hundredths + " with "+ (textTestArray[textChosen].length / (parseInt(minutes) + (parseInt(seconds) / 60) + ((parseInt(hundredths) / 100) / 60))).toPrecision(3)+" WPM."); //lets user know score and WPM

  saveScore(); //saves score
    
   reset(); //then reset everything, exit funct
  
  }
  //we compare the whole testArea and see if it contains the word that we are typing, if it contains it, check for the next word.
  if(testArea.value.indexOf(textTestArray[textChosen][textIt]) > -1)
  {
        //console.log("pog");
       textIt++;
  }
 /* else
  {
          console.log("no pog");
  }*/
  
  /* by using indexOf, we are looking for the first index of appearance of a word, since we are using the testArea's field, we are looking to see if the word that the user is on is FOUND EXACTLY on the box 
    if the word is exactly found, starts to check for the next word!
    
    i also tried to use pattern attribute but couldnt get it to work
  */
  
  //update % done also, precision of 3 so 100% is not truncated 
  document.getElementById("complete").innerHTML = ((textIt / textTestArray[textChosen].length) * 100).toPrecision(3);
}

function saveScore()
{
  //console.log("save time");
  let thisRun = {minutes, seconds, hundredths}; //temp var to save this run
  
  let i = 0; //iterator
  let saved = false; //easy var to 
  for(i; i < 5 && saved == false; i++) //this 5 limits how many scores we save, could probabbly change this to a while loop
    {
      if(scoreTimes[i] == null) //if the spot is null, we dont have a score (eg if i == 2, and its null, it means that we dont have enough scores to have a score at 2) therefore, we immediately save this value and break from the loop
      {
        scoreTimes[i] = thisRun;
        saved = true;
      }
      
      if(saved == false) //if we havent saved yet
        {
         if(thisRun.minutes < scoreTimes[i].minutes) //this run had better minutes
          {
            if(thisRun.seconds < scoreTimes[i].seconds) //AND this run had better seconds
              {
                if(thisRun.seconds < scoreTimes[i].hundredths) //AND this run had better hundredths
                {
                  //console.log("Hsave" + i);
                  scoreTimes.splice(i, 0, thisRun); //insert at here (splice with 0 inserts)
                  saved = true; //our way of "breaking" from the loop
                } //end of hund if
              }
            else //if better minutes but not the best seconds, lets still consider the score place here
              {
                 //console.log("Ssave" + i);
                  scoreTimes.splice(i, 0, thisRun); //insert at here
                  saved = true;
              } //end of sec if
          } //end of min if
        } // end of saved if
       
    }
  
  //sort based on best times (i made an anonymous function that converts everything to the same unit (eg minute), then compares them like a usual sort) IN THIS WAY BEST SCORE IS ALWAYS #1
scoreTimes.sort(function(x, y){return  (x.minutes + (x.seconds * 60) + ((x.hundredths * 100) * 60)) - (y.minutes + (y.seconds * 60) + ((y.hundredths * 100) * 60))})

  //if not inserted at this point, we reject the run
  displayScores(); //now display everything we got
}

//display top 5 scores
function displayScores()
{
   document.getElementById("scoresVals").innerHTML = ""; //clear
  for(var x = 0; x < 5; x++) //then print + concatenate
    {
      if(scoreTimes[x] != null) //if its not null (makes it look cleaner, and doesnt reference empty spaces)
        { //do the print, i tried to make it clean as possible...
       document.getElementById("scoresVals").innerHTML =   document.getElementById("scoresVals").innerHTML+ (""+(x+1)) + " ........................ " + scoreTimes[x].minutes + ":" + scoreTimes[x].seconds + ":" +scoreTimes[x].hundredths+"<br>";
        }
    }
}


// Start the timer, calls testingInSession class
function timerStart() //uses setInterval bc its perpetual
{
  //console.log("it begins")
  if(timer == null) //only run once, in case its invocated multiple times
    {
       timer = setInterval(timeClock, 18); //repeatedly calls timeClock, the actual time, this is SAVED in the timer variable
      //im pretty sure 18 is the right speed, seems a little too fast
      document.getElementById("next-test").style.visibility = "hidden"; //hide the next test link
    }
 
  testingInSession(); //the most important function call
  //console.log("baddaboom");
}

// Reset everything
function reset()
{
  clearTimeout(timer); //stops running timer
  //console.log("baddabing");
  
  //clear vars used
  timer = null; //clearing the instance of the timer obj
  hundredths = 0;
  minutes = 0;
  seconds = 0;
  textIt = 0; //reset the iterator  
  
  document.getElementById("timer").innerHTML = "00:00:00"; //clearing prev numbers
  document.getElementById("test-area").value = ""; //clearing the value puts back the placeholder
  document.getElementById("next-test").style.visibility = "visible"; //show the next test link
  document.getElementById("complete").innerHTML = "NaN"; //% completed clear
  
}

// Event listeners for keyboard input and the reset button:
window.onload = setup(); //calls below helper function

testArea.addEventListener("input", timerStart); //runs based on keyboard input

resetButton.addEventListener("click", reset);//reset button

document.querySelector("#next-test").addEventListener("click", chooseAnother);//listener to choose another test function

document.querySelector("#test-area").addEventListener("updateValue", testingInSession); //for every update the user does, call the testingInSession Function


function setup() //helper function to setup the page on load
{
  document.getElementById("complete").innerHTML = "NaN"; //% completed
  document.getElementById("text-test").innerHTML = (""+textTestArray[textChosen]).replace(/,/g,' ');  //put text in testing area
  document.getElementById("test-area").value = ""; //clearing the value puts back the placeholder if site was reloaded and reset function was not invoked
}