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
    resetBoard();

    // TODO: Reset game state variables
    currentWord = getRandomWord();
    currentGuess = '';
    currentRow = 0;
    gameOver = false;
    gameWon = false;
    
    hideModal();
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
    if (gameOver) return;

    key = key.toUpperCase();

    if (!validateInput(key, currentGuess)) {
        return;
    }
    
    if (/^[A-Z]$/.test(key)) {
        updateTileDisplay(getTile(currentRow, currentGuess.length), key);
        currentGuess += key;
    } else if (key === 'ENTER') {
        submitGuess();
    } else if (key === 'BACKSPACE') {
        updateTileDisplay(getTile(currentRow, currentGuess.length - 1), '')
        currentGuess = currentGuess.slice(0, -1);
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
    if (gameOver) return;

    if (isGuessComplete() && isValidWord(currentGuess)) {

        let state_arr = [];

        for(let i = 0; i < currentGuess.length; i++) {
            let state = checkLetter(currentGuess[i], i, currentWord);
            state_arr.push(state);
            setTileState(getTile(currentRow, i), state);
        }

        updateKeyboardColors(currentGuess, state_arr);

        processRowReveal(currentRow, state_arr);

        if (getCurrentGuess() === getTargetWord()) {
            updateGameState(true);
        } else if (currentRow >= MAX_GUESSES - 1) {
            updateGameState(false);
        } else {
            currentRow += 1;
            currentGuess = '';
        }

    } else {
        shakeRow(currentRow);
        showMessage("Not valid!", 'error');
    }
 
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
    let upper = guessLetter.toUpperCase();
    let guess = currentGuess.toUpperCase();
    let target = targetWord.toUpperCase();


    if (target[position] === upper) {
        return 'correct';
    }

    let count = 0;
    
    for (let i = 0; i < target.length; i++) {
        if (target[i] === upper) {
            count++;
        }
    }

    if (count === 0) {
        return 'absent';
    }

    let matches = 0;
    for (let i = 0; i < guess.length; i++) {
        if (guess[i] === upper && target[i] === upper) {
            matches++;
        }
    }
    
    let previous = 0;
    for (let i = 0; i < position; i++) {
        if (guess[i] === upper && target[i] !== upper) {
            previous++;
        }
    }
    
    if (matches + previous < count) {
        return 'present';
    }
    
    return 'absent';
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
    if (isCorrect) {
        gameWon = true;
        gameOver = true;
        showEndGameModal(true, currentWord)
    } else if (currentRow >= MAX_GUESSES - 1) {
        gameOver = true;
        showEndGameModal(false, currentWord) 
    }
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

    for (let i = 0; i < guess.length; i++) {

        let key = guess[i];
        let state = results[i];
        const keyElement = document.querySelector(`[data-key="${key.toUpperCase()}"]`);

        if (!keyElement) continue;

        const currentClasses = keyElement.classList;
    
        if (state === 'correct') {
            keyElement.classList.remove('present', 'absent');
            keyElement.classList.add('correct');
        } else if (state === 'present' && !currentClasses.contains('correct')) {
            keyElement.classList.remove('absent');
            keyElement.classList.add('present');
        } else if (state === 'absent' && !currentClasses.contains('correct') && !currentClasses.contains('present')) {
            keyElement.classList.add('absent');
        }
    }

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

    if (results.every(result => result === 'correct')) {
        celebrateRow(rowIndex);
    }

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
    
    updateStats(won);
    updateStatsDisplay();
    showModal(won, targetWord, currentRow + 1);
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
    
    if (gameOver) return false;

    if (/^[A-Z]$/.test(key.toUpperCase())) {
        return currentGuess.length < WORD_LENGTH;
    }

    if (key === 'ENTER') {
        return currentGuess.length === WORD_LENGTH;
    }
    
    if (key === 'BACKSPACE') {
        return currentGuess.length > 0;
    }

    return false;
}