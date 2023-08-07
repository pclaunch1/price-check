let productId;

fetch("https://jvhttn9e7f.execute-api.us-east-1.amazonaws.com/test/challenge/today")
.then((response) => {
    if (response.ok) {
        return response.json();
    } else {
        throw new Error("API CALL FAIL");
    }
})
.then(data => {
    productId = data[0]["id"];
    displayChallenge(data[0]);
});

var form = document.getElementById("guessForm")

form.addEventListener('submit', submitGuess)

function submitGuess(e) {
    e.preventDefault();
    const priceGuess = document.getElementById("guessValue").value
    
    postData("https://jvhttn9e7f.execute-api.us-east-1.amazonaws.com/test/challenge/"+ productId + "/guess", { priceGuess: parseInt(priceGuess), attemptCount: 1 }).then((data) => {
        console.log(data); // JSON data parsed by `data.json()` call
        document.getElementById("feedback").innerText = data.result + " -- " + data.suggestion
        if(data.result === "Correct"){
          fetch("https://jvhttn9e7f.execute-api.us-east-1.amazonaws.com/test/challenge/" + productId)
          .then((response) => {
              if (response.ok) {
                  return response.json();
              } else {
                  throw new Error("API CALL FAIL");
              }
          })
          .then(data => {
            const buyBtn = document.getElementById("buyProductBtn")
            buyBtn.setAttribute('href', data.purchaseUrl)
            buyBtn.style.display = "block"
          });
        }
      });
};

function displayChallenge(data) {
    console.log(data);
    const challengeImage = data["imageUrls"][0];
    const imageDiv = document.getElementById("productImage");

    imageDiv.src = challengeImage;
}

async function postData(url = "", data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json"
      },
      redirect: "follow",
      referrerPolicy: "no-referrer",
      body: JSON.stringify(data),
    });
    return response.json(); // parses JSON response into native JavaScript objects
  }