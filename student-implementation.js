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
    currentWord = WordleWords.getRandomWord();  // Set this to a random word
    currentWord = currentWord.toUpperCase();
    currentGuess = '';
    currentRow = 0;
    gameOver = false;
    gameWon = false;
    resetBoard();
    hideModal();
    
    // TODO: Get a random word from the word list
    // HINT: Use WordleWords.getRandomWord()
    
    // TODO: Reset the game board
    // HINT: Use resetBoard()
    
    // TODO: Hide any messages
    // HINT: Use hideModal() and ensure message element is hidden
    
    console.log('Game initialized! Word: ' + currentWord); // Remove this line when implementing
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
    if (gameOver) return;
    // TODO: Handle letter keys (A-Z)
    if (/^[A-Z]$/.test(key) && currentGuess.length < WORD_LENGTH) {
        currentGuess += key;
        updateTileDisplay(getTile(currentRow, currentGuess.length - 1), key);
    }

    // HINT: Use regex /^[A-Z]$/ to test if key is a letter
    // HINT: Check if currentGuess.length < WORD_LENGTH before adding
    // HINT: Use getTile() and updateTileDisplay() to show the letter

    // TODO: Handle ENTER key
    if (key === "ENTER") {
        if (isGuessComplete()) {
            submitGuess();
        } else {
            showMessage('ERROR: Make sure your word is complete', "Error", 10000);
        }
    }

    // HINT: Check if guess is complete using isGuessComplete()
    // HINT: Call submitGuess() if complete, show error message if not

    // TODO: Handle BACKSPACE key
    if (key === "BACKSPACE") {
        if (currentGuess.length > 0) {
            currentGuess = currentGuess.slice(0, -1);
            updateTileDisplay(getTile(currentRow, currentGuess.length), "");
        }
    }
    // HINT: Check if there are letters to remove
    // HINT: Clear the tile display and remove from currentGuess
    
    console.log('Key pressed:', key); // Remove this line when implementing
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
    if (!isGuessComplete()) {
        showMessage('Word is not complete!', 'error', 4000);
        return;
    }
    
    // TODO: Validate guess is a real word
    if (!WordleWords.isValidWord(currentGuess)) {
        showMessage('Word is not valid!', 'error', 4000);
        shakeRow(currentRow);
        return;
    }
    // HINT: Use WordleWords.isValidWord()
    // HINT: Show error message and shake row if invalid
    
    // TODO: Check each letter and get results
    let results = [];
    for (let i = 0; i < 5; i++) {
        results[i] = checkLetter(currentGuess[i], i, currentWord);
        setTileState(tileRows[currentRow].querySelectorAll(".tile")[i], results[i]);
    }
    // HINT: Use checkLetter() for each position
    // HINT: Store results in an array
    
    // TODO: Update tile colors immediately
    // HINT: Loop through results and use setTileState()
    
    // TODO: Update keyboard colors
    updateKeyboardColors(currentGuess, results);
    // HINT: Call updateKeyboardColors()
    
    // TODO: Check if guess was correct
    if (currentGuess.toUpperCase() === currentWord.toUpperCase()) {
        gameWon = true;
    }
    // HINT: Compare currentGuess with currentWord
    
    // TODO: Update game state
    updateGameState(gameWon);
    // HINT: Call updateGameState()
    
    // TODO: Move to next row if game continues
    if (!gameWon) {
        currentRow++;
        currentGuess = "";
    }
    // HINT: Increment currentRow and reset currentGuess
    console.log('Guess submitted:', currentGuess); // Remove this line when implementing
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
    let count = 1;
    for (let i = 0; i < targetWord.length; i++) {
        if (targetWord[i] === guessLetter) {
            count++;
        }
    }

    // TODO: Check if letter is in correct position
    // HINT: Compare targetWord[position] with guessLetter


    // TODO: Check if letter exists elsewhere in target
    for (let i = 0; i < targetWord.length; i++) {
        if (guessLetter === targetWord[i] && i !== position) {
            count--;
        }
    }

    if (targetWord[position] === guessLetter) {
        return "correct";
    }
    for (let i = 0; i < targetWord.length; i++) {
        if (guessLetter === targetWord[i] && count > 0) {
            return "present";
        }
    }

    // HINT: Use targetWord.includes() or indexOf()
    // TODO: Handle duplicate letters correctly


    // This is the most challenging part - you may want to implement
    // a more sophisticated algorithm that processes the entire word
    
    console.log('Checking letter:', guessLetter, 'at position:', position); // Remove this line
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
    if (isCorrect) {
        gameWon = true;
        gameOver = true;
        showEndGameModal(isCorrect, currentWord);
    }
    
    // TODO: Handle lose condition
    if (currentRow >= MAX_GUESSES - 1) {
        gameWon = false;
        gameOver = true;
        showEndGameModal(isCorrect, currentWord);
    }
    // HINT: Check if currentRow >= MAX_GUESSES - 1
    
    console.log('Game state updated. Correct:', isCorrect); // Remove this line
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
    // TODO: Loop through each letter in the guess
    // for (let i = 0; i < guess.length; i++) {
    //     if (results[i] === "correct") {
    //         document.querySelector()
    //     }
    //     else if (results[i] === "present") {
    //         document.querySelector()
    //     }
    //     else if (results[i] === "absent") {
    //         document.querySelector()
    //     }
    // }

    // TODO: Get the keyboard key element
    // HINT: Use document.querySelector with [data-key="LETTER"]
    
    // TODO: Apply color with priority system
    // HINT: Don't change green keys to yellow or gray
    // HINT: Don't change yellow keys to gray
    
    console.log('Updating keyboard colors for:', guess); // Remove this line
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
    if (results.every() === "correct") {
        celebrateRow(currentRow);
    }
    // HINT: Use results.every() method
    
    // TODO: If all correct, trigger celebration
    // HINT: Use celebrateRow() function
    
    console.log('Processing row reveal for row:', rowIndex); // Remove this line
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

    showModal(won, targetWord, currentRow);

    // HINT: For wins, include number of guesses used
    // HINT: For losses, reveal the target word
    
    // TODO: Update statistics
    // HINT: Use updateStats() function
    updateStats(won);
    
    // TODO: Show the modal
    // HINT: Use showModal() function
    
    console.log('Showing end game modal. Won:', won, 'Word:', targetWord); // Remove this line
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
    if (gameOver) {
        return false;
    }
    
    // TODO: Handle letter keys
    if (/^[A-Z]$/.test(key) && currentGuess < WORD_LENGTH) {
        return true;
    }
    // HINT: Check if currentGuess.length < WORD_LENGTH
    
    // TODO: Handle ENTER key
    if (key === "ENTER" && currentGuess.length === WORD_LENGTH) {
        return true;
    }
    // HINT: Check if currentGuess.length === WORD_LENGTH

    // TODO: Handle BACKSPACE key
    if (key === "BACKSPACE" && currentGuess.length > 0) {
        return true;
    }
    // HINT: Check if currentGuess.length > 0
    
    console.log('Validating input:', key); // Remove this line
    return false;
}

// ========================================
// DEBUGGING HELPERS (REMOVE BEFORE SUBMISSION)
// ========================================

// Uncomment these lines for debugging help:
// console.log('Current word:', currentWord);
// console.log('Current guess:', currentGuess);
// console.log('Current row:', currentRow);

console.log('Student implementation template loaded. Start implementing the functions above!'); 