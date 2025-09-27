/**
 * WORDLE CLONE - STUDENT IMPLEMENTATION
 * 
 * Complete the functions below to create a working Wordle game.
 * Each function has specific requirements and point values.
 * 
 * GRADING BREAKDOWN:
 * - Core Game Functions (60 points): initializeGame, handleKeyPress, submitGuess, checkLetter, updateGameState
 * - Advanced Features (30 points): updateKeyboardColors, processRowReveal, showEndGameModal, validateInput
 */

// ========================================
// CORE GAME FUNCTIONS (60 POINTS TOTAL)
// ========================================

/**
 * Initialize a new game
 * POINTS: 10
 * 
 * TODO: Complete this function to:
 * - Reset all game state variables
 * - Get a random word from the word list
 * - Clear the game board
 * - Hide any messages or modals
 */
function initializeGame() {
    // TODO: Reset game state variables
    currentWord = '';  // Set this to a random word
    currentGuess = '';
    currentRow = 0;
    gameOver = false;
    gameWon = false;
    
    // TODO: Get a random word from the word list
    // HINT: Use WordleWords.getRandomWord()
    currentWord = WordleWords.getRandomWord();
    
    // TODO: Reset the game board
    // HINT: Use resetBoard()
    resetBoard();
    
    // TODO: Hide any messages
    // HINT: Use hideModal() and ensure message element is hidden
    hideModal();

    console.log(currentWord); // Remove this line when implementing
}

/**
 * Handle keyboard input
 * POINTS: 15
 * 
 * TODO: Complete this function to:
 * - Process letter keys (A-Z)
 * - Handle ENTER key for word submission
 * - Handle BACKSPACE for letter deletion
 * - Update the display when letters are added/removed
 */
function handleKeyPress(key) {
    // TODO: Check if game is over - if so, return early
    if (gameOver){
        return;
    }
    
    // TODO: Handle letter keys (A-Z)
    // HINT: Use regex /^[A-Z]$/ to test if key is a letter
    // HINT: Check if currentGuess.length < WORD_LENGTH before adding
    // HINT: Use getTile() and updateTileDisplay() to show the letter
    if (/^[A-Z]$/.test(key)){
        
        if (currentGuess.length < WORD_LENGTH ){
            updateTileDisplay(getTile(currentRow,currentGuess.length),key);
            currentGuess += key;
        }
    }

    // TODO: Handle ENTER key
    // HINT: Check if guess is complete using isGuessComplete()
    // HINT: Call submitGuess() if complete, show error message if not
    else if (key == 'ENTER'){
        if (isGuessComplete()){
            submitGuess();
        }
        else {
            showMessage('Not enough letters', 'error', 1500);
        }
    }
    
    // TODO: Handle BACKSPACE key  
    // HINT: Check if there are letters to remove
    // HINT: Clear the tile display and remove from currentGuess
    else if (key == 'BACKSPACE'){
        if (currentGuess.length > 0 && currentGuess.length <= 5){
            updateTileDisplay(getTile(currentRow,currentGuess.length-1),'');
            currentGuess = currentGuess.slice(0,-1);
        } 
    }
    
}

/**
 * Submit and process a complete guess
 * POINTS: 20
 * 
 * TODO: Complete this function to:
 * - Validate the guess is a real word
 * - Check each letter against the target word
 * - Update tile colors and keyboard
 * - Handle win/lose conditions
 */
function submitGuess() {
    // TODO: Validate guess is complete
    // HINT: Use isGuessComplete()
    if (isGuessComplete){
        if(WordleWords.isValidWord(currentGuess)){
            let status = []
            for(i =0 ; i < currentGuess.length; i++){
                results_status = checkLetter(currentGuess[i],i,currentWord);
                status[i] = results_status;

            }
            for (i =0; i < status.length; i++){
                setTileState(getTile(currentRow,i),status[i])
                processRowReveal(currentRow, status);
                updateKeyboardColors(currentGuess[i], status[i]);
            }
        }
        else {
            showMessage('Not in word list', 'error', 1500);
            shakeRow(currentRow);

            return;
        }
        if (currentGuess == currentWord)
        {
            updateGameState(true);
        }
        else{
            updateGameState(false);
            currentRow += 1;
            currentGuess = '';
        }
    }

    
    // TODO: Validate guess is a real word
    // HINT: Use WordleWords.isValidWord()
    // HINT: Show error message and shake row if invalid
    
    // TODO: Check each letter and get results
    // HINT: Use checkLetter() for each position
    // HINT: Store results in an array
    
    // TODO: Update tile colors immediately
    // HINT: Loop through results and use setTileState()
    
    // TODO: Update keyboard colors
    // HINT: Call updateKeyboardColors()
    
    // TODO: Check if guess was correct
    // HINT: Compare currentGuess with currentWord
    
    // TODO: Update game state
    // HINT: Call updateGameState()
    
    // TODO: Move to next row if game continues
    // HINT: Increment currentRow and reset currentGuess
    
}

/**
 * Check a single letter against the target word
 * POINTS: 10
 * 
 * TODO: Complete this function to:
 * - Return 'correct' if letter matches position exactly
 * - Return 'present' if letter exists but wrong position
 * - Return 'absent' if letter doesn't exist in target
 * - Handle duplicate letters correctly (this is the tricky part!)
 */
function checkLetter(guessLetter, position, targetWord) {
    // TODO: Convert inputs to uppercase for comparison
    guessLetter = guessLetter.toUpperCase();
    targetWord = targetWord.toUpperCase();
    
    // TODO: Check if letter is in correct position
    // HINT: Compare targetWord[position] with guessLetter
    if (targetWord[position] == guessLetter){
        return "correct"
    }
    else if (targetWord.includes(guessLetter)){
        return "present"
    }
    // TODO: Check if letter exists elsewhere in target
    // HINT: Use targetWord.includes() or indexOf()
    
    // TODO: Handle duplicate letters correctly
    // This is the most challenging part - you may want to implement
    // a more sophisticated algorithm that processes the entire word
    
    return 'absent'; // Replace with actual logic
}

/**
 * Update game state after a guess
 * POINTS: 5
 * 
 * TODO: Complete this function to:
 * - Check if player won (guess matches target)
 * - Check if player lost (used all attempts)
 * - Show appropriate end game modal
 */
function updateGameState(isCorrect) {
    // TODO: Handle win condition
    // HINT: Set gameWon and gameOver flags, call showEndGameModal
    if (isCorrect)
    {
        gameOver = true;
        gameWon = true;
        showEndGameModal(true, currentWord);
    }
    else
    {
        if (currentRow >= MAX_GUESSES - 1)
        {
            gameOver = true;
            gameWon = false;
            showEndGameModal(false, currentWord);
        }
    }
    
    // TODO: Handle lose condition  
    // HINT: Check if currentRow >= MAX_GUESSES - 1
}

// ========================================
// ADVANCED FEATURES (30 POINTS TOTAL)
// ========================================

/**
 * Update keyboard key colors based on guessed letters
 * POINTS: 10
 * 
 * TODO: Complete this function to:
 * - Update each key with appropriate color
 * - Maintain color priority (green > yellow > gray)
 * - Don't downgrade key colors
 */
function updateKeyboardColors(guess, results) {  
    const letter = guess.toUpperCase();
    const key = document.querySelector(`[data-key="${letter}"]`);

    if (results === 'correct' || key.classList.contains('correct')) 
    {
        if (!key.classList.contains('correct')) 
        {
            key.classList.remove('present', 'absent');
            key.classList.add('correct');
        }
    } 
    else if (results === 'present') 
    {
        if (!key.classList.contains('correct')) 
        {
            key.classList.remove('absent');
            key.classList.add('present');
        }
    } 
    else 
    {
        if (!key.classList.contains('correct') && !key.classList.contains('present')) 
        {
            key.classList.add('absent');
        }
        
    }

    // TODO: Get the keyboard key element
    // HINT: Use document.querySelector with [data-key="LETTER"]
    
    // TODO: Apply color with priority system
    // HINT: Don't change green keys to yellow or gray
    // HINT: Don't change yellow keys to gray
}

/**
 * Process row reveal (simplified - no animations needed)
 * POINTS: 5 (reduced from 15 since animations removed)
 * 
 * TODO: Complete this function to:
 * - Check if all letters were correct
 * - Trigger celebration if player won this round
 */
function processRowReveal(rowIndex, results) {
    // TODO: Check if all results are 'correct'
    // HINT: Use results.every() method
    isCorrect = results.every((status) => status === 'correct');
    if (isCorrect)
    {
        celebrateRow(rowIndex);
    }
    
    // TODO: If all correct, trigger celebration
    // HINT: Use celebrateRow() function
}

/**
 * Show end game modal with results
 * POINTS: 10
 * 
 * TODO: Complete this function to:
 * - Display appropriate win/lose message
 * - Show the target word
 * - Update game statistics
 */
function showEndGameModal(won, targetWord) {
    // TODO: Create appropriate message based on won parameter
    // HINT: For wins, include number of guesses used
    // HINT: For losses, reveal the target word
    // TODO: Update statistics
    // HINT: Use updateStats() function
    showMessage('You '+(won ? 'won!' : 'lost! The word was '+targetWord), 'info', 5000);
    // TODO: Show the modal
    // HINT: Use showModal() function
    showModal(won,targetWord,currentRow+1)
    updateStats(won)
}

/**
 * Validate user input before processing
 * POINTS: 5
 * 
 * TODO: Complete this function to:
 * - Check if game is over
 * - Validate letter keys (only if guess not full)
 * - Validate ENTER key (only if guess complete)
 * - Validate BACKSPACE key (only if letters to remove)
 */
function validateInput(key, currentGuess) {
    // TODO: Return false if game is over

    
    // TODO: Handle letter keys
    // HINT: Check if currentGuess.length < WORD_LENGTH

    
    // TODO: Handle ENTER key
    // HINT: Check if currentGuess.length === WORD_LENGTH
    
    // TODO: Handle BACKSPACE key
    // HINT: Check if currentGuess.length > 0
    
    console.log('Validating input:', key); // Remove this line
    return true; // Replace with actual validation logic
}

// ========================================
// DEBUGGING HELPERS (REMOVE BEFORE SUBMISSION)
// ========================================

// Uncomment these lines for debugging help:
// console.log('Current word:', currentWord);
// console.log('Current guess:', currentGuess);
// console.log('Current row:', currentRow);

console.log('Student implementation template loaded. Start implementing the functions above!'); 