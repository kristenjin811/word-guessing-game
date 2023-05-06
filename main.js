const Api = (() => {
  const url = "https://random-word-api.herokuapp.com/word"
  const getRandomWord = () => {
    return fetch(url).then((response) => response.json())
  }
  console.log(getRandomWord)
  return {
    getRandomWord
  }
})()

const View = (() => {
  let domSelector = {
    wordArea: ".game-container__random-word",
    inputBox: ".game-container__user-input",
    btn: ".game-container__new-game-btn",
    counter: ".game-container__counter",
    letterHistory: ".game-container__guessed-letters",
    timer: ".game-container__timer",
    container: "game-container"
  }

  return {
    domSelector,
  }
})()


const Model = ((api, view) => {
  const backupWordList = [
    "ballot",
    "soil",
    "legislation",
    "valley",
    "country",
    "nail",
    "piano",
    "speech",
    "efflux",
    "reason",
    "alcohol",
    "stable",
    "slice",
    "situation",
    "profession",
    "restaurant",
    "pocket",
    "satisfaction",
    "condition",
    "comfortable"
  ]
  class State {
    constructor() {
      this._word = ""
      this._maskedWord = ""
      this._incorrectGuesses = 0
      this._maxIncorrectGuesses = 10
      this._correctWords = 0
      this._guessedLetters = new Set()
    }
    get word() {
      return this._word
    }

    get maskedWord() {
      return this._maskedWord
    }

    get incorrectGuesses() {
      return this._incorrectGuesses
    }

    get maxIncorrectGuesses() {
      return this._maxIncorrectGuesses
    }

    get guessedLetters() {
      return this._guessedLetters;
    }

    set word(value) {
      this._word = value
      this._maskedWord = this.maskWord()
      this._guessedLetters = []
    }

    maskWord(){
      // takes a word as input and returns the word with random indexed letters
        // replaced with underscore _
      let concealCount, concealIndices
      do {
        concealCount = Math.floor(Math.random() * this._word.length) + 1;
        concealIndices = new Set();
        while (concealIndices.size < concealCount) {
          concealIndices.add(Math.floor(Math.random() * this._word.length));
        }
      } while (concealIndices.size === this._word.length)

      return this._word.split('').map((char, index) => {
        return concealIndices.has(index) ? '_' : char;
      }).join('');
    }

    updateIncorrectGuesses() {
      this._incorrectGuesses ++
    }

    isCorrectGuess(input) {
      // check if the input is already in guessedLetters
      if (this._guessedLetters.includes(input)) {
        alert(`You already guessed the letter ${input}.`)
        return true
      }
      this._guessedLetters.push(input)
      // Convert the masked word to an array of characters
      const maskedWordChars = this._maskedWord.split('');

      // Iterate over the array and reveal any matching characters
      let matchFound = false;
      for (let i = 0; i < this._word.length; i++) {
        if (this._word[i] === input) {
          if (maskedWordChars[i] === '_') {
            maskedWordChars[i] = input;
            matchFound = true;
          }
        }
      }

      // If a match was found, update the masked word and return true
      if (matchFound) {
        this._maskedWord = maskedWordChars.join('');
        return true;
      }

      // Otherwise, return false
      return false;
    }

    revealLetter(letter) {
      this._maskedWord = this._maskedWord.split('').map((char, index) => {
        return (char === '_' && this._word[index] === letter) ? letter : char;
      }).join('');
      // change the masked letter back to letter
    }

    isGameOver() {
      return this.incorrectGuesses >= this.maxIncorrectGuesses
    }

    hasWon() {
      // return true if there is no more masked letter in this word
      return !this._maskedWord.includes('_')
    }

    reset() {
      this._word = ""
      this._maskedWord = ""
      this._incorrectGuesses = 0
      this._correctWords = 0
      this._guessedLetters = []
    }

    getCorrectWordsTotal() {
      return this._correctWords
    }

    incrementCorrectWords() {
      this._correctWords++
    }

  }
  const state = new State()

  return {
    state,
    backupWordList
  }
})(Api, View)


const Controller = ((api, model, view) => {
  const { domSelector } = view
  const { state, backupWordList } = model
  const { getRandomWord } = api

  const getNewWord = () => {
    getRandomWord()
      .then(wordArr => {
        state.word = wordArr[0]
        console.log(state.word)
        render()
      })
      .catch(() => {
        // Use backup list in case of API failure.
        const randomIndex = Math.floor(Math.random() * backupWordList.length)
        state.word = backupWordList[randomIndex];
        render()
      });
  }

  const newGame = () => {
    // Initialize a new game.
    state.reset()
    getNewWord()
  }

  const continueGame = () => {
    state.word = ""
    state.maskedWord = ""
    getNewWord()
  }


  const render = () => {
    // Render the game view.
    const wordContainer = document.querySelector(domSelector.wordArea)
    const counterSpan = document.querySelector(domSelector.counter)
    const guessHistory = document.querySelector(domSelector.letterHistory)

    wordContainer.innerText = state.maskedWord
    console.log(state.maskedWord)
    counterSpan.innerText = state.incorrectGuesses
    // clear the guess history
    guessHistory.innerHTML = ""

    // Render the guessed letters

    for (let i = 0; i < state.guessedLetters.length; i++) {
      const guessItem = document.createElement("li")
      guessItem.classList.add("guess-history__item")
      guessItem.innerText = state.guessedLetters[i]

      // Differentiate between correct and incorrect letters
      if (state.word.includes(state.guessedLetters[i])) {
        guessItem.classList.add("guess-history__item--correct")
      } else {
        guessItem.classList.add("guess-history__item--incorrect")
      }

      guessHistory.appendChild(guessItem)
    }
  }

  const guessLetter = () => {
    const inputBox = document.querySelector(domSelector.inputBox)
    inputBox.addEventListener('keypress', (event) => {
      if (event.key === 'Enter') {
        const letter = event.target.value.toLowerCase()
        event.target.value = ""
        if (letter === " ") return;
        if (state.isCorrectGuess(letter)) {
          state.revealLetter(letter)
          if (state.hasWon()) {
            setTimeout(() => {
              state._correctWords += 1
              state._guessedLetters = []
              continueGame()
            }, 500)
          }
        } else {
            state.updateIncorrectGuesses()


          if (state.isGameOver()) {
            setTimeout(() => {
              alert(`Game over! You have guessed ${state.getCorrectWordsTotal()} word${state.getCorrectWordsTotal() !== 1 ? 's' : ''}!`)
              newGame()
            }, 500)
          }
        }
        render()
      }
    })
  }

  const initNewGameBtn = () => {
    const newGameBtn = document.querySelector(domSelector.btn)
    newGameBtn.addEventListener('click', newGame)
  }

  // Initialize the game.
  const bootstrap = () => {
    newGame()
    guessLetter()
    initNewGameBtn()
    render()
  }

  return {
    bootstrap,
  }
})(Api, Model, View)

Controller.bootstrap()
