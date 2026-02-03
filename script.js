var messageSpace = document.getElementById("welcomeMessage");
messageSpace.innerHTML = "You've connected to the JavaScript!";

function changeHeading() {
    document.getElementById("welcomeMessage").innerHTML = document.getElementById("titleChangerInput").value;
}