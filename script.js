let toDoContainer = document.getElementById('toDo');
let inProgressContainer = document.getElementById('inProgress');
let doneContainer = document.getElementById('done');

//add,save,reset button along with thier event listeners
let resetBtn = document.getElementById('reset');
resetBtn.addEventListener('click',resetEverthing);

let addCardBtn = document.getElementById('addCard');
addCardBtn.addEventListener('click', addingNewTask )

let saveChangesBtn = document.getElementById('saveChanges');
saveChangesBtn.addEventListener('click',saveChanges);


function resetEverthing(){
    localStorage.removeItem("taskListArray");
    
    while (toDoContainer.childNodes.length > 1) {
        toDoContainer.removeChild(toDoContainer.lastChild);
    }
    while (inProgressContainer.childNodes.length > 1) {
        inProgressContainer.removeChild(inProgressContainer.lastChild);
    }
    while (doneContainer.childNodes.length > 1) {
        doneContainer.removeChild(doneContainer.lastChild);
    }
    
}


function saveChanges(eventDetails){
    console.log("save changes")
    console.log(taskList)
    let stringifiedTaskListArray = JSON.stringify(taskList);
    localStorage.setItem("taskListArray",stringifiedTaskListArray);
}



function getTaskList(){
    stringifiedTaskListArrayItems = localStorage.getItem("taskListArray")
    let taskListArrayItems = JSON.parse(stringifiedTaskListArrayItems);
    if(taskListArrayItems===null){
        return []
    }else {
        return taskListArrayItems
    }
}


let taskList  = getTaskList()

for(let t of taskList){
    addingTask(t)
}

function addingTask(tastDetails){
    console.log(`adding previous tasks`)
    let Container = document.getElementById(tastDetails.columnId)
    //crating div card
    let divCard = document.createElement("div");
    divCard.className="divCard";
    divCard.id=tastDetails.divCardId;
    divCard.setAttribute("draggable","true")
    Container.append(divCard);
    
   
    //creating normal card
    let card = document.createElement("div")
    card.className="card";
    card.innerHTML = tastDetails.cardText;
    card.id=tastDetails.cardId;
    card.setAttribute("contenteditable","true");
    card.focus()
    card.addEventListener("blur",deleteElement)
    divCard.append(card);
    
    

    //adding delete icon
    const deleteButton = document.createElement('i');
    deleteButton.className="fa fa-trash";
    deleteButton.setAttribute("aaria-hidden","true");
    divCard.append(deleteButton);
    
    deleteButton.addEventListener('click',(eventDetails)=>{
        deleteTask(eventDetails,divCard.id )
    });
    

    
    //draggingStart
    divCard.addEventListener('dragstart',(eventDetails)=>{
        let cardDragged = eventDetails.target;
        eventDetails.dataTransfer.setData("text/plain",cardDragged.id)
        cardDragged.style.opacity=0.5;
        console.log("dragging started");
        // let elementComingFrom = column.id
        let parentOfCarDragged = cardDragged.parentNode;
        // console.log(parentOfCarDragged);
        let elementComingFrom = parentOfCarDragged.id;
        eventDetails.dataTransfer.setData("elementComingFrom",elementComingFrom);
        

    })

    

    divCard.addEventListener('dragend',(eventDetails)=>{
        let cardDragged = eventDetails.target;
        cardDragged.style.opacity="";//u can give "" or 1, resetting the opaticity when drap is completed
        
    })  

    card.addEventListener("focusout", (eventDetails)=>{
        focusOutEvent(eventDetails, card.id)
    })
}


function addingNewTask(){
    let divCard = document.createElement("div");
    divCard.className="divCard";
    divCard.id="divCard-"+Date.now();
    divCard.setAttribute("draggable","true")
    toDoContainer.append(divCard);
    
   
    
    let card = document.createElement("div")
    card.className="card";
    card.setAttribute("title","hiee");
    card.innerHTML = "";
    card.id="card-"+ Date.now();
    card.setAttribute("contenteditable","true");
    card.focus();
    
    
    card.addEventListener("blur",deleteElement)
    divCard.append(card);
    
    

    //adding delete icon
    const deleteButton = document.createElement('i');
    deleteButton.className="fa fa-trash";
    deleteButton.setAttribute("aaria-hidden","true");
    divCard.append(deleteButton);
    deleteButton.addEventListener('click',(eventDetails)=>{
        deleteTask(eventDetails,divCard.id )
    });

    

    
    //draggingStart
    divCard.addEventListener('dragstart',(eventDetails)=>{
        let cardDragged = eventDetails.target;
        eventDetails.dataTransfer.setData("text/plain",cardDragged.id)
        cardDragged.style.opacity=0.5;
        console.log("dragging started");
        // let elementComingFrom = column.id
        let parentOfCarDragged = cardDragged.parentNode;
        // console.log(parentOfCarDragged);
        let elementComingFrom = parentOfCarDragged.id;
        eventDetails.dataTransfer.setData("elementComingFrom",elementComingFrom);

       
        
        

    })

    

    divCard.addEventListener('dragend',(eventDetails)=>{
        let cardDragged = eventDetails.target;
        cardDragged.style.opacity="";//u can give "" or 1, resetting the opaticity when drap is completed
        
    })

    //storing cardDetails in localStorage
   
    let newtask={
        "divCardId": divCard.id,
        "columnId": "toDo",
        "taskId":divCard.id,
        "cardText":card.innerText,
        "CardId":card.id,
    

    }
    
    taskList.push(newtask);
    

    // let stringifiedTaskListArray = JSON.stringify(taskList);
    // localStorage.setItem("taskListArray",stringifiedTaskListArray);
    
    card.addEventListener("focusout", (eventDetails)=>{
        focusOutEvent(eventDetails, card.id)
    })
    
    

}
function deleteTask(eventDetails, divCardIdd){
    let targetCard= eventDetails.target;
    
    // let divCardId = +(targetCard.id.replace('d',''));
    // console.log(divCardId);
    // let removableCard = document.getElementById(divCardId);
    // removableCard.remove();
    let parentCard = targetCard.parentNode;
    parentCard.remove();
    for(let t of taskList){
        if(t.divCardId===divCardIdd){
            taskList = taskList.filter((t,v)=>t.divCardId!=divCardIdd)
        }
    }
}
function deleteElement(eventDetails){
    let targetCard= eventDetails.target;
    let parentCard = targetCard.parentElement;
    // let divCardId = +(targetCard.id.replace('c',''));
    // let removableCard = document.getElementById(divCardId);
    // console.log(removableCard)
    // console.log(targetCard.textContent)
    // console.log(parentCard)
    if(!targetCard.textContent.trim()){ 
        // removableCard.remove() //remove the card if card is empty
        parentCard.remove()
    }
}

let dragEvents = ["dragover","dragenter","drop"]
dragEvents.forEach((dropevent)=> {
        document.querySelectorAll(".column").forEach(column=>{
            column.addEventListener(dropevent,(eventDetails)=>{
                eventDetails.preventDefault();
                const elementComingFrom = eventDetails.dataTransfer.getData("elementComingFrom")
                
                if(dropevent==="drop"){
                    
                    const cardId = eventDetails.dataTransfer.getData("text/plain");
                    const elementComingFrom = eventDetails.dataTransfer.getData("elementComingFrom");
                    const card = document.getElementById(cardId);
                    column.append(card);
                    
    
                    
                    
                    for(let i=0;i< taskList.length;i++){
                        console.log( taskList[i])
                        if(cardId=== taskList[i].divCardId){
                            taskList[i]["columnId"] = column.id
                        }
                        
                    }

                // let stringifiedTaskListArray = JSON.stringify(taskList);
                // localStorage.setItem("taskListArray",stringifiedTaskListArray);    
                }
                
            })
        })
    });




function  focusOutEvent(eventDetails, cardId){
    console.log(`--focusout-------`)
    console.log(taskList)
    console.log(eventDetails.target.innerHTML)
    for(let t of taskList){
        if(t.CardId === cardId){
            let card = document.getElementById(cardId)
            card.innerHTML = eventDetails.target.innerHTML;
            t.cardText = card.innerHTML
        }

        
        
        
        
    }

    console.log(`--focusout--end-----`)
    // card.innerHTML = eventDetails.target.innerHTML;
    
    // newtask.cardText = eventDetails.target.innerHTML;
  };

