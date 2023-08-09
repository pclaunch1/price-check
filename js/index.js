let productId;
let slideIndex = 1;
let apiHost = "https://jvhttn9e7f.execute-api.us-east-1.amazonaws.com/test";

getTodayChallenge();

var form = document.getElementById("guessForm");
form.addEventListener('submit', submitGuess);

$("input[data-type='currency']").on({
  keyup: function() {
    formatCurrency($(this));
  },
  blur: function() { 
    formatCurrency($(this), "blur");
  }
});

function getTodayChallenge(){
  fetch(apiHost + "/challenge/today")
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
}

function submitGuess(e) {
    e.preventDefault();
    const priceGuess = document.getElementById("guessValue").value;
    const reqBody = { priceGuess: parseInt(priceGuess), attemptCount: 1 };

    postData(apiHost + "/challenge/"+ productId + "/guess", reqBody).then((data) => {
      appendGuess(data=data);
      if(data.result === "Correct"){
        displayBuyLink();
      }
      });
};

function appendGuess(data = {}){
  let guessList = document.getElementById("guessList");
  let guessDiv = document.createElement("div");
  let suggestionDiv = document.createElement("span");

  if(data.suggestion === "Go Higher"){
    suggestionDiv.setAttribute("class", "fa fa-chevron-up");
  }
  else if(data.suggestion === "Go Lower"){
    suggestionDiv.setAttribute("class", "fa fa-chevron-down");
  }
  else{
    suggestionDiv.setAttribute("class", "fa fa-check");
  }
  guessDiv.innerText = priceGuess;

  guessList.appendChild(guessDiv);
  guessList.appendChild(suggestionDiv);
}

function displayBuyLink(){
  fetch(apiHost + "/challenge/" + productId)
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

function formatNumber(n) {
  // format number 1000000 to 1,234,567
  return n.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}


function formatCurrency(input, blur) {
  // appends $ to value, validates decimal side
  // and puts cursor back in right position.

  // get input value
  var input_val = input.val();

  // don't validate empty input
  if (input_val === "") { return; }

  // original length
  var original_len = input_val.length;

  // initial caret position 
  var caret_pos = input.prop("selectionStart");
    
  // check for decimal
  if (input_val.indexOf(".") >= 0) {

    // get position of first decimal
    // this prevents multiple decimals from
    // being entered
    var decimal_pos = input_val.indexOf(".");

    // split number by decimal point
    var left_side = input_val.substring(0, decimal_pos);
    var right_side = input_val.substring(decimal_pos);

    // add commas to left side of number
    left_side = formatNumber(left_side);

    // validate right side
    right_side = formatNumber(right_side);
    
    // On blur make sure 2 numbers after decimal
    if (blur === "blur") {
      right_side += "00";
    }
    
    // Limit decimal to only 2 digits
    right_side = right_side.substring(0, 2);

    // join number by .
    input_val = "$" + left_side;

  } else {
    // no decimal entered
    // add commas to number
    // remove all non-digits
    input_val = formatNumber(input_val);
    input_val = "$" + input_val;
  }

  // send updated string to input
  input.val(input_val);

  // put caret back in the right position
  var updated_len = input_val.length;
  caret_pos = updated_len - original_len + caret_pos;
  input[0].setSelectionRange(caret_pos, caret_pos);
}