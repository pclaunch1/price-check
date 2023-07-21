document.getElementById("productImage").src = config.PRODUCT_IMAGE;

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