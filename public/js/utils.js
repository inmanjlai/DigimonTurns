let currentTurnOrder;

const buttons = document.querySelectorAll(".image-container button");
buttons.forEach((button) => {
    button.addEventListener("click", () => {
        goNext(button.value)
    })
})

/////////////////////////////////
//////// HELPER FUNCTIONS ///////
/////////////////////////////////

function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle.
    while (currentIndex != 0) {
  
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
}

function sortByExhaust(user1, user2) {
    if(user1.exhaust > user2.exhaust) return 1
    if(user1.exhaust < user2.exhaust) return -1
    if(user1.exhaust === user2.exhaust){
        if(user1.total_exhaust > user2.total_exhaust) return 1
        if(user1.total_exhaust < user2.total_exhaust) return -1
        if(user1.total_exhaust === user2.total_exhaust) {
            // Randomize between user1 and user2
            const random = Math.round(Math.random())
            if(random === 1) return 1
            if(random === 0) return -1
        }
    }
}

/////////////////////////////////
///////// TURN FUNCTIONS ////////
/////////////////////////////////

function reset(){
    const users = [];
    currentTurnOrder.forEach((user) => {
        users.push({
            name: user.name,
            exhaust: 0,
            total_exhaust: 0,
            color: user.color,
            current_player: false,
            next_player: false,
            last_player: false
        })
    })
    currentTurnOrder = generateFirstTurn(users)
    displayTurnOrder(currentTurnOrder)
}

function generateFirstTurn(users) {
    const turnOrder = shuffle(users)
    
    turnOrder[0].current_player = true;
    turnOrder[1].next_player = true;
    
    return turnOrder
}
// WILL SORT THE USERS BY EXHAUST AND TOTAL EXHAUST BUT NEEDS TO RANDOMIZE OTHERS
function generateNextTurn(users) {    
    console.log("GENERATING NEXT TURN...")
    const currentUser = users.filter(user => user.current_player === true)[0]
    const sortedUsers = users.sort(sortByExhaust)
    const newSortedUsers = sortedUsers.filter(user => user.current_player === false)
    newSortedUsers.unshift(currentUser)
    newSortedUsers[1].next_player = true
    currentTurnOrder = newSortedUsers;

    displayTurnOrder(currentTurnOrder)
}

// WORKS FINE
function displayTurnOrder(turnOrder) {
    if(!currentTurnOrder) currentTurnOrder = turnOrder;

    const turnOrderList = document.querySelector(".turn-order-list");
    turnOrderList.innerHTML = ""        

    currentTurnOrder.forEach((user, idx) => {

        const currentPlayer = user.current_player ? "current_player" : false
        const showImage = (user.next_player || user.last_player) ? "show-image" : false
        const lastPlayer = user.last_player ? "last_player" : false

        turnOrderList.innerHTML += `
            <div class="single-user-turn-object ${currentPlayer} ${lastPlayer}" style="background-color:${user.color}">
                <h2>${user.name}</h2>
                <div class='user-stats'>
                    <div class='exhaust-scores'>
                        <p>Exhaust: ${user.exhaust}</p>
                        <p>Total Exhaust: ${user.total_exhaust}</p>
                    </div>
                    <div class='attack-image ${showImage}'>
                        <img src='/images/attack.svg' alt='attack'>
                    </div>
                </div>
                <h2 class='order' style="color:${user.color}">0${idx + 1}</h2>
            </div>
        `
    })

}

// !!!!!!! HAS A BUG WHERE THE CURRENT PLAYER WILL STOP BEING HIGHLIGHTED AFTER A COUPLE LOOPS !!!!!!!
function goNext(value){
    // TAKE IN USER INPUT FOR EXHAUST 
    const numberChosen = +value
    
    // FIND CURRENT USER IN THE TURN ORDER
    const currentUser = currentTurnOrder.filter((user) => user.current_player === true)[0];

    // FIND THE INDEX OF THE CURRENT USER IN TURN ORDER
    const idx = currentTurnOrder.indexOf(currentUser)

    // FIND LAST USER IN TURN ORDER
    const lastUser = currentTurnOrder.filter((user) => user.last_player === true)[0];

    // IF THE LAST USER EXISTS THEN THE EXHAUST IS EQUAL TO NUMBERCHOSEN + LAST USERS EXHAUST
    const totalExhaust = numberChosen + (lastUser ? lastUser.exhaust : 0)

    // TAKE THE PLAYER BEFORE CURRENT SET 'LAST_PLAYER' TAG TO FALSE
    if(lastUser) {
        const lastUsersIdx = currentTurnOrder.indexOf(lastUser)
        currentTurnOrder[lastUsersIdx].last_player = false;
    }

    // UPDATE CURRENT PLAYER EXHAUST VALUES TO CHOSEN VALUES
    currentTurnOrder[idx].exhaust = numberChosen;
    currentTurnOrder[idx].total_exhaust = totalExhaust;

    // SET CURRENT PLAYER TAG TO FALSE FOR CURRENT USER AND LAST PLAYER TAG TO TRUE
    currentTurnOrder[idx].current_player = false;
    currentTurnOrder[idx].last_player = true;
    
    // SET THE PLAYER AFTER CURRENT USERS 'CURRENT_PLAYER' TAG TO TRUE
    if(currentTurnOrder[idx + 1]){
        currentTurnOrder[idx + 1].current_player = true;
        currentTurnOrder[idx + 1].next_player = false;
    }

    if(currentTurnOrder[idx + 2]) {
        currentTurnOrder[idx + 2].next_player = true
    }
    
    if(currentTurnOrder.indexOf(currentTurnOrder.filter((user) => user.current_player===true)[0]) >= currentTurnOrder.length - 1){
        generateNextTurn(currentTurnOrder)
    }

    // if(idx === (currentTurnOrder.length - 1)){
    //     console.log(`generating new turn order, the index ${idx} is equal to ${currentTurnOrder.length-1}`)
    //     return generateNextTurn(currentTurnOrder)
    //     // return generateNewTurn(currentTurnOrder)
    // }
    


     displayTurnOrder(currentTurnOrder)

}