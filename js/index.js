let productId;

let slideIndex = 1;

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
    showSlides(slideIndex);
});

var form = document.getElementById("guessForm")

form.addEventListener('submit', submitGuess)

function submitGuess(e) {
    e.preventDefault();
    const priceGuess = document.getElementById("guessValue").value
    
    postData("https://jvhttn9e7f.execute-api.us-east-1.amazonaws.com/test/challenge/"+ productId + "/guess", { priceGuess: parseInt(priceGuess), attemptCount: 1 }).then((data) => {
        // document.getElementById("feedback").innerText = data.result + " -- " + data.suggestion
        let guessList = document.getElementById("guessList")
        let guessDiv = document.createElement("div")
        let suggestionDiv = document.createElement("span")
        if(data.suggestion === "Go Higher"){
          suggestionDiv.setAttribute("class", "fa fa-chevron-up")
        }
        else if(data.suggestion === "Go Lower"){
          suggestionDiv.setAttribute("class", "fa fa-chevron-down")
        }
        else{
          suggestionDiv.setAttribute("class", "fa fa-check")
        }
        guessDiv.innerText = priceGuess

        guessList.appendChild(guessDiv)
        guessList.appendChild(suggestionDiv)
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
    data.imageUrls.forEach((element, index) => {
      let imageParentDiv = document.createElement("div");
      imageParentDiv.setAttribute("class", "mySlides fade");

      let imageDiv = document.createElement("img");
      imageDiv.setAttribute("src", element);
      imageDiv.setAttribute("style", "width:100%");

      imageParentDiv.appendChild(imageDiv);

      const navBtn = document.getElementById("prevBtn");

      document.getElementById("carousel1").insertBefore(imageParentDiv, navBtn);

      let dotSpan = document.createElement("span");
      dotSpan.setAttribute("class", "dot");
      dotSpan.setAttribute("onclick", "currentSlide(index+1);");

      document.getElementById("carouselDots").appendChild(dotSpan);
    });
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

// Next/previous controls
function plusSlides(n) {
  showSlides(slideIndex += n);
}

// Thumbnail image controls
function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  let i;
  let slides = document.getElementsByClassName("mySlides");
  let dots = document.getElementsByClassName("dot");
  if (n > slides.length) {slideIndex = 1}
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex-1].style.display = "block";
  dots[slideIndex-1].className += " active";
}