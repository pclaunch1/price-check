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
    
    const truncated = Math.trunc(priceGuess)
    
    var result = "WRONG - LOWER"
    if(truncated === config.PRODUCT_PRICE){
        result = "CORRECT!!!"
        const buyBtn = document.getElementById("buyProductBtn")
        buyBtn.setAttribute('href', config.PRODUCT_URL)
        buyBtn.style.display = "block"
    }
    
    if(truncated < config.PRODUCT_PRICE){
        result = "WRONG - HIGHER"
    }

    document.getElementById("feedback").innerText = result
};

function displayChallenge(data) {
    console.log(data);
    const challengeImage = data["imageUrls"][0];
    const imageDiv = document.getElementById("productImage");

    imageDiv.src = challengeImage;
}