const promiseOfSomeData = fetch("https://jvhttn9e7f.execute-api.us-east-1.amazonaws.com/test/challenge/today").then(r=>r.json()).then(data => {
    console.log('in async');
    return data;
});

window.addEventListener("load", async() => {
    e.preventDefault();
    let someData = await promiseOfSomeJsonData;
    console.log("onload");
    console.log(someData)
});