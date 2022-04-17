document.addEventListener("DOMContentLoaded", () => {
    console.log("App loaded succesfully...")

    // ADD CREATE GAME FUNCTION TO SUBMIT BUTTON PASSING IN USERS ->
    document.querySelector(".create-game button").addEventListener("click", (e) => {
        const userInputs = document.querySelectorAll(".create-game input[type='text']");
        
        // CREATE THE USER OBJECTS AND APPEND THEM TO THE USERS ARRAY
        const users = [];
        userInputs.forEach((input) => {
            users.push({
                name: input.value,
                exhaust: 0,
                total_exhaust: 0,
                color: input.dataset.color,
                current_player: false,
                last_player: false,
                next_player: false
            })
        })
        // GENERATE THE INITIAL TURN ORDER RANDOMLY -> 
        const turnOrder = generateFirstTurn(users)
        // HIDE THE GAME SETUP MENU AND DISPLAY THE TURN ORDER ->
        document.querySelector(".create-game").style.display = "none";
        displayTurnOrder(turnOrder);

    })

})