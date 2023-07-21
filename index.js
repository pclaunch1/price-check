const PRODUCT_URL = "https://www.amazon.com/crocs-Unisex-Classic-Black-Women/dp/B0014C5S7S/ref=zg_bs_c_fashion_sccl_1/141-0950117-4027757?pd_rd_w=jBTVC&content-id=amzn1.sym.309d45c5-3eba-4f62-9bb2-0acdcf0662e7&pf_rd_p=309d45c5-3eba-4f62-9bb2-0acdcf0662e7&pf_rd_r=QGFNJ2ZC0YP9XQSP467J&pd_rd_wg=T9D7j&pd_rd_r=fd79331d-18d8-4686-b550-08c025c7636a&pd_rd_i=B0014C5S7S&psc=1"
const PRODUCT_IMAGE = "./81Vekenn4lL._AC_UX695_.jpg"
const PRODUCT_PRICE = 31

document.getElementById("productImage").src = PRODUCT_IMAGE;


var form = document.getElementById("guessForm")

form.addEventListener('submit', submitGuess)

function submitGuess(e) {
    e.preventDefault();
    console.log("HERE")
    const priceGuess = document.getElementById("guessValue").value
    
    const truncated = Math.trunc(priceGuess)
    
    var result = "WRONG - LOWER"
    if(truncated === PRODUCT_PRICE){
        result = "CORRECT!!!"
        const buyBtn = document.getElementById("buyProductBtn")
        buyBtn.setAttribute('href', PRODUCT_URL)
        buyBtn.style.display = "block"
    }
    
    if(truncated < PRODUCT_PRICE){
        result = "WRONG - HIGHER"
    }
    console.log(priceGuess)
    console.log(truncated)
    console.log(result)

    document.getElementById("feedback").innerText = result
};