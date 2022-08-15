var questionTitleNode = document.getElementById('subject');
var questionDescriptionNode = document.getElementById('question');
var submitQuestionNode = document.getElementById('submitBtn');
var questionList = document.getElementById('dataList');
// submitButtonNode.addEventListener("click",onQuestionSubmit);
submitQuestionNode.addEventListener("click", onQuestionSubmit);


var questionForumDivNode = document.getElementById('toggleDisplay');
var clickedQuestionContainerNode = document.getElementById('respondQue');
var resolveContainerNode = document.getElementById('resolveHolder');
var responseContainerNode = document.getElementById('respondAns');
var commentContainerNode = document.getElementById('commentHolder');

var commentatorNameNode = document.getElementById('pickName');
var commentatorCommentNode = document.getElementById('pickComment');
var commentSubmitButton = document.getElementById('commentBtn');


var questionResolveButtonNode = document.getElementById('resolveQuestion');
var upvotesBtnNode = document.getElementById("upvote");
var downvotesBtnNode = document.getElementById("downvote");

var newQuestionButtonNode = document.getElementById('newQuestionForm');
var searchBarNode = document.getElementById('questionSearch');

searchBarNode.addEventListener('keyup',filterQuestions);

let QUESTIONTIMERID;

// Show questions based on input in search bar
function filterQuestions(){
    
    // clear question container
    clearDatalist();

    
    var allQuestions = getAllQuestion();
    var filteredQuestions = allQuestions.filter((question)=>{
        if(question.title.includes(searchBarNode.value))          
        return question;
    })
    
        

    if(filteredQuestions.length)
    {
        filteredQuestions.forEach((question)=>{
            addQuestionToLeftPannel(question);
        })
    }
    else if(!filteredQuestions.length){

        var noMatchFound = document.createElement('h1');
        noMatchFound.innerHTML = "NO Match Found !!";               
        questionList.appendChild(noMatchFound);
    }
}

// Clear data list on left pannel
function clearDatalist()
{
    questionList.innerHTML = '';
}

// Sorting on the basis of favourite marked (favourite marked at top)
function sortByFavourite()
{
    var allQuestions = getAllQuestion();
    allQuestions.sort((cQ, nQ)=>{
        if(cQ.isFav)
        {
            return -1;
        }
        else 
        return 1;
    })
    return allQuestions
}

function onLoad(){
    
    newQuestionButtonNode.onclick = displayQuestionForm();
    var allQuestions = getAllQuestion();

    allQuestions.sort((a,b)=>{return b.upvotes - a.upvotes});
    allQuestions=sortByFavourite();
    
    allQuestions.forEach(question => addQuestionToLeftPannel(question));


}

// adding functionality to submit button
// get question details from right pannel 
function onQuestionSubmit(){
    var questionStructure = {
        title: questionTitleNode.value,
        description: questionDescriptionNode.value,
        responses : [],
        upvotes:0,
        downvotes:0,
        createdAt: Date.now(),
        isFav: false,
    };
    addQuestionToLeftPannel(questionStructure);
    clearQuestionForm();
    saveQuestion(questionStructure);
}



// add question to left pannel
function addQuestionToLeftPannel(question){

    var questionContainer = document.createElement('div');
    questionContainer.setAttribute('id',question.title);
    questionContainer.style.backgroundColor = '#80808082';

    var title = document.createElement('h5');
    var description = document.createElement('p');
    var upvotesContainer = document.createElement('h4');
    var downvotesContainer = document.createElement('h4');
    var createdAtContainer = document.createElement('h5');
    var createdAgo = document.createElement('p');
    var isFavourite = document.createElement('button');
    
    questionContainer.appendChild(title);
    questionContainer.appendChild(description);
    questionContainer.appendChild(upvotesContainer);
    questionContainer.appendChild(downvotesContainer);
    questionContainer.appendChild(createdAtContainer);
    questionContainer.appendChild(createdAgo);
    questionContainer.appendChild(isFavourite);


    title.innerHTML = question.title;
    description.innerHTML = question.description;
    upvotesContainer.innerHTML = "+ "+question.upvotes;
    downvotesContainer.innerHTML = "- "+question.downvotes;
    createdAtContainer.innerHTML = new Date(question.createdAt).toLocaleString() ;
    if(question.isFav == false){
        isFavourite.innerHTML = "Add To Favourite";
    }else{
        isFavourite.innerHTML = "Remove Favourite";
    }

    isFavourite.onclick = filterFav(question);

    // realTime update of Time ago
    
    setInterval(()=>{createdAgo.innerHTML = "Created: " + convertDateTimeToAgoFormat(question.createdAt,createdAgo) + " ago." ;},1000);
    

    questionList.appendChild(questionContainer);

    questionContainer.addEventListener('click',addQuestionToRightPannel(question));

}

// Filter Favourite Question
function filterFav(question){
    return function(event){
    console.log(event.target)
    event.stopPropagation();
    if(event.target.innerHTML == 'Add To Favourite')
    {
        question.isFav = true;
        event.target.innerHTML = 'Remove Favourite';
    }
    else{
        question.isFav = false;
        event.target.innerHTML = 'Add To Favourite';
    }
    let allQuestions = getAllQuestion()
    let updatedQuestion = allQuestions.map((ques)=>{
        if(question.createdAt == ques.createdAt)
        {
            return question;
        }
        return ques;
    })
    localStorage.setItem('questions',JSON.stringify(updatedQuestion));
}
}

//Convert DATE TIME TO Ago Format
function convertDateTimeToAgoFormat(createdAtTime)
{
    
    let currentTime = Date.now();

    let timeLapsed = currentTime - new Date(createdAtTime);

    let hours,minutes,seconds,secondsAgo,minutesAgo,hoursAgo;

    seconds = Math.floor(timeLapsed/1000);
    secondsAgo = seconds%60;

    minutes = Math.floor(seconds/60);
    minutesAgo = minutes%60;

    hours = Math.floor(minutes/60);
    
    return `${hours} hours ${minutesAgo} minutes ${secondsAgo} seconds`;

}






//clear question Submit form
function clearQuestionForm()
{
    questionTitleNode.value = '';
    questionDescriptionNode.value = '';
}


// save question to local storage
function saveQuestion(question){
    
    var allQuestions = getAllQuestion();

    allQuestions.push(question);

    localStorage.setItem('questions', JSON.stringify(allQuestions)); 

}
// get all question from storage
function getAllQuestion(){

    
    
    var allQuestions = localStorage.getItem('questions');


    if(allQuestions)
    {
        allQuestions = JSON.parse(allQuestions);
    }
    else
    {
        allQuestions = [];
    }
    return allQuestions;

}
// add question to right pannel on clicking to question
function addQuestionToRightPannel(question){
    return function(){
        hideQuestionForm();
        displayHiddenContainers(question);
        clearQuestionAndResponseContainer();
        showQuestionOnRightPannelWithDetails(question);
    }
    


}


// hide the question form on question click
function hideQuestionForm(){
    questionForumDivNode.style.display = 'none';
}

// display the hidden containers  on question click
function displayHiddenContainers(question){
    clickedQuestionContainerNode.style.display = 'block';
    resolveContainerNode.style.display = 'block';
    responseContainerNode.style.display = 'block';
    commentContainerNode.style.display = 'block';

    commentSubmitButton.onclick =  onResponseSubmit(question);
    
    questionResolveButtonNode.onclick = resolveQuestion(question);
    upvotesBtnNode.onclick = increaseVotes(question);
    downvotesBtnNode.onclick = decreaseVotes(question);



}

// On click on resolve the question is deleted and New Question Form is shown
function resolveQuestion(question)
{
    
    return function(){

        //console.log(question);
        questionForumDivNode.style.display = 'block';
        
        clickedQuestionContainerNode.style.display = 'none';
        resolveContainerNode.style.display = 'none';
        responseContainerNode.style.display = 'none';
        commentContainerNode.style.display = 'none';


        var allQuestions = getAllQuestion();

        var updatedQuestionArr = allQuestions.filter((ques)=>{
            if(!(question.title == ques.title))
            return ques;
        })

        console.log(updatedQuestionArr);
        localStorage.setItem('questions',JSON.stringify(updatedQuestionArr));
        clearDatalist();
        updatedQuestionArr.sort((a,b)=>{return b.upvotes - a.upvotes});
        updatedQuestionArr.forEach((ques)=>{
            addQuestionToLeftPannel(ques);
        })
    }
    

}

//display Question Form
function displayQuestionForm()
{
    return function(){

        console.log('click hua btn');
        questionForumDivNode.style.display = 'block';
        
        clickedQuestionContainerNode.style.display = 'none';
        resolveContainerNode.style.display = 'none';
        responseContainerNode.style.display = 'none';
        commentContainerNode.style.display = 'none';
    }
}

// on Question click clear question Container and response Container
function clearQuestionAndResponseContainer(){
    clickedQuestionContainerNode.innerHTML = '';
    responseContainerNode.innerHTML = '';
}

// display question details and responses and comment form
// on Question Click
function showQuestionOnRightPannelWithDetails(question){

    var questionContainer = document.createElement('div');
    questionContainer.style.backgroundColor = '#80808082';
    var title = document.createElement('h6');
    var description = document.createElement('p');
    questionContainer.appendChild(title);
    questionContainer.appendChild(description);
    title.innerHTML = question.title;
    description.innerHTML = question.description;
    // console.log(questionContainer);
    clickedQuestionContainerNode.appendChild(questionContainer);
    
    showPreviousResponses(question);
}

// create response
function onResponseSubmit(question){

    return ()=>{
        var responseMade = {
            name: commentatorNameNode.value,
            comment: commentatorCommentNode.value,
            responseUpvotes: 0,
            responseDownvotes: 0,
        }
        addResponses(question,responseMade);
        clearResponseForm();
        saveResponses(question,responseMade);
    }
}

// clear Response Form
function clearResponseForm(){
    commentatorNameNode.value = '';
    commentatorCommentNode.value = '';
}

// show previous responses
function showPreviousResponses(question)
{

    question.responses.sort((a,b)=>{return b.responseUpvotes - a.responseUpvotes});

    question.responses.forEach(function (response){
        addResponses(question,response);
    })
}

// add responses to question 
function addResponses(question,response){
    var responseStructureGenerator = document.createElement('div');
    var commentName = document.createElement('p');
    var commentDescription = document.createElement('p');
    var responseUpvoteContainer = document.createElement('h4');
    var responseDownvoteContainer = document.createElement('h4');
    var responseUpvoteBtn = document.createElement('button');
    var responseDownvoteBtn = document.createElement('button');

    responseStructureGenerator.setAttribute('id',response.name);
    responseStructureGenerator.setAttribute('class',question.title);

    responseUpvoteBtn.setAttribute('id','resUpVoteBtn');
    responseDownvoteBtn.setAttribute('id','resDownVoteBtn');

    responseStructureGenerator.appendChild(commentName);
    responseStructureGenerator.appendChild(commentDescription);
    responseStructureGenerator.appendChild(responseUpvoteContainer);
    responseStructureGenerator.appendChild(responseDownvoteContainer);
    responseStructureGenerator.appendChild(responseUpvoteBtn);
    responseStructureGenerator.appendChild(responseDownvoteBtn);



    commentName.innerHTML = response.name;
    commentDescription.innerHTML = response.comment;
    responseUpvoteContainer.innerHTML = "+ "+response.responseUpvotes;
    responseDownvoteContainer.innerHTML = "- "+response.responseDownvotes;
    responseUpvoteBtn.innerHTML = "Upvote";
    responseDownvoteBtn.innerHTML = "Downvote";

    responseUpvoteBtn.onclick = responseVote(question,responseUpvoteBtn,response);
    responseDownvoteBtn.onclick = responseVote(question,responseDownvoteBtn,response);


    responseContainerNode.appendChild(responseStructureGenerator);
}

// Trial
function responseVote(question,btnId,receivedResponse)         //btnId = btnId
{
    return function(){
        var updatedQuestionsTry;
        var allSQuestions = getAllQuestion();

        
        console.log(btnId.parentNode.childNodes);
        console.log(receivedResponse);
        
        
        console.log(question);
        console.log(allSQuestions);
// debugger;
        if(btnId.id == 'resUpVoteBtn')
        {
            var upvo= ++receivedResponse.responseUpvotes;
            btnId.parentNode.childNodes[2].innerHTML = "+ "+upvo;
        }
        else if(btnId.id=='resDownVoteBtn')
        {
            var downvo= ++receivedResponse.responseDownvotes;
            btnId.parentNode.childNodes[3].innerHTML = "- " + downvo;

        }

        updatedQuestionsTry = allSQuestions.map((questio)=>{
            
            if(question.title == questio.title )
            {
                var updatedResponseTry = questio.responses.map((resp)=>{
                    if(receivedResponse.name == resp.name)
                    {
                        if(btnId.id == 'resUpVoteBtn')
                        {
                            resp.responseUpvotes = ++resp.responseUpvotes ;
                            console.log(resp.responseUpvotes);
                        }
                        else if( btnId.id == 'resDownVoteBtn')
                        {
                            resp.responseDownvotes= ++resp.responseDownvotes;
                            console.log(resp.responseDownvotes);
                        }

                    }
                    // console.log(updatedResponseTry);
                    return resp;
                })
                
                console.log(updatedResponseTry)

                questio.responses = updatedResponseTry;
            }
            return questio;
        })

        console.log(receivedResponse);
        console.log(updatedQuestionsTry);       // save this to local storage 
        localStorage.setItem('questions',JSON.stringify(updatedQuestionsTry));

        // Realtime Update of Votes

    }
}
//save Responses
function saveResponses(receivedQuestion,response){
    
    

    var allQuestions = getAllQuestion();

        var updatedQuestionArray = allQuestions.map((ques)=>{
            if(receivedQuestion.title == ques.title){
                ques.responses.push(response);
            }
            return ques;
        })

    localStorage.setItem('questions',JSON.stringify(updatedQuestionArray));
    

}


// increase Votes
function increaseVotes(question)
{
    return ()=>{
        var allQuestions = getAllQuestion();

        var updatedQuestion = allQuestions.map((ques)=>{
            if(question.title === ques.title)
            {
                ques.upvotes++;
            }
            return ques;
        })
        
        var selectedQuestionOnLeftPane = document.getElementById(question.title);
        
        selectedQuestionOnLeftPane.childNodes[2].innerHTML = "+ " + ++question.upvotes;
        
        
        localStorage.setItem('questions',JSON.stringify(updatedQuestion));
    }

}


//decrease Votes
function decreaseVotes(question)
{
    return ()=>{
        var allQuestions = getAllQuestion();

        var updatedQuestion = allQuestions.map((ques)=>{
            if(question.title === ques.title)
            {
                ques.downvotes++;
            }
            return ques;
        })

        var selectedQuestionOnLeftPane = document.getElementById(question.title);
        selectedQuestionOnLeftPane.childNodes[3].innerHTML = "- " + ++question.downvotes;

        localStorage.setItem('questions',JSON.stringify(updatedQuestion));
    }
}

onLoad();



// --- Using Ajax ---

/*
function placeWhereSaveQuetionIsCalled()
{
    saveQuestion(question,function(){
        // JO BHI KAAM KRNA HO SAVED DATA K SATH
    })
}
function getAllQuestion(onResponse){


    var request = new XMLHttpRequest();
    request.addEventListener('load',function(){
        var data = JSON.parse(request.responseText);
        onResponse(console.log(data));
    })
    request.open('get',"https://storage.codequotient.com/data/get");
    request.send();


}


function saveQuestion(question, onQuestionSaveWork)
{

    getAllQuestion(function(allQuestion){

        allQuestion.push(question);
    
        var body = {
            data: JSON.stringify(allQuestion),
        }
        var request = new XMLHttpRequest();
        request.open('post',"https://storage.codequotient.com/data/save");
        request.setRequestHeader('content-Type','application/json');
        request.send(JSON.stringify(body));
    
        request.addEventListener('load',function(event){
    
            onQuestionSaveWork();
    
        });
    });
} */