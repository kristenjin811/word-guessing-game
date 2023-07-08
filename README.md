# word-guessing-game
This is a Word guessing game.

## Programming languages and tools
Javascript, HTML, CSS, MVC pattern, BEM Naming conventions

## Functionalities
Get the random word from the following API: https://random-word-api.herokuapp.com/word

Use the following random word list if the API is down:
```
[
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
```

### Initialize the game board that displays:
A header at the center of the page that includes:
The game title
The ratio of incorrect guesses to maximum allowed chances (e.g., 0 / 10 at the start of the game)
An input field that accepts only one letter
A button to start a new game
### After obtaining the random word,
Generate a random number to determine the number of letters to conceal (Note: this number must not exceed the word's length)
Randomly choose the positions of the letters to hide.
Display hidden letters as an underscore (_).
### When user makes a guess (i.e., input a letter and presses Enter):
If the letter is correct, reveal all the same letters on the page. The incorrect guess count remains the same.
"correct" means that the letter exists in the current hidden letters
If the letter is not correct, increment the wrong guess count by 1.
If users exhausts all chances (i.e., wrong guesses equal max allowed chances), display an alert message with the total number of correctly guessed words (e.g., "Game over! You have guessed 5 words!").
### Start a new game after user clicks the OK button in the alert window.
If all letters are revealed and user still has remaining chances, generate a new word.
Continue generating new words until user runs out of chances.
When the new game button is clicked, begin a new game.
Generate a new word, and reset the wrong guess count to 0.
