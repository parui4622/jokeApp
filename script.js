// Step 1: Find the elements
let jokeButton = document.querySelector("#jokeButton");
let jokeText = document.querySelector("#jokeText");
let loadingSpinner = document.querySelector("#loadingSpinner");
let jokeCard = document.querySelector("#jokeCard");
let saveJokeButton = document.querySelector("#saveJokeButton");
let jokeSound = document.querySelector("#jokeSound");

jokeButton.addEventListener("click", async function () {
  try {
    // Clear the joke text and show the spinner
    jokeText.textContent = "";
    jokeCard.classList.remove("visible"); // Hide the joke card
    loadingSpinner.style.display = "block"; // Show the spinner

    // Fetch a random joke from the primary API
    let joke = await fetchJoke("https://official-joke-api.appspot.com/random_joke");

    // If the primary API fails, try the backup API
    if (!joke) {
      joke = await fetchJoke("https://v2.jokeapi.dev/joke/Any");
    }

    // Display the joke
    if (joke) {
      jokeText.textContent = joke.setup ? `${joke.setup} - ${joke.punchline}` : joke.joke;
      jokeCard.classList.add("visible"); // Show the joke card
    //   jokeSound.play(); // Play a sound effect

    //   Trigger confetti animation
    //   confetti({
    //     particleCount: 100,
    //     spread: 70,
    //     origin: { y: 0.6 },
    //   });
    } else {
      jokeText.textContent = "Oops! Couldn't fetch a joke. Try again later.";
      jokeCard.classList.add("visible"); // Show the joke card
    }
  } catch (error) {
    // Handle errors
    jokeText.textContent = "Oops! Couldn't fetch a joke. Try again later.";
    jokeCard.classList.add("visible"); // Show the joke card
    console.error(error);
  } finally {
    // Hide the spinner
    loadingSpinner.style.display = "none";
  }
});

// Function to fetch a joke from an API
async function fetchJoke(apiUrl) {
  try {
    let response = await fetch(apiUrl);
    if (!response.ok) throw new Error("Failed to fetch joke");
    let data = await response.json();

    // Handle JokeAPI response format
    if (apiUrl.includes("jokeapi.dev")) {
      if (data.type === "single") {
        return { joke: data.joke }; // Return joke in a consistent format
      } else if (data.type === "twopart") {
        return { setup: data.setup, punchline: data.delivery }; // Return joke in a consistent format
      }
    }

    return data; // Return joke from the official API
  } catch (error) {
    console.error("Error fetching joke from API:", apiUrl, error);
    return null; // Return null if the API fails
  }
}

// Saves Joke Feature
saveJokeButton.addEventListener("click", function () {
  let savedJoke = jokeText.textContent;
  if (savedJoke) {
    alert("Joke saved: " + savedJoke);
    // You can also save the joke to localStorage or an array for later use
  } else {
    alert("No joke to save!");
  }
});