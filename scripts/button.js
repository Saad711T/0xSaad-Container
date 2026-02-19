function testButton() {
    return `
    <button 
    style="
    font-family: Dubai;
    font-size: 20px;
    padding: 10px 20px;
    background-color: #4CAF50;
    color: white;
    border: none;
    margin: 10px;
    "
    

    onclick="alert('Hello XD')"
    
    
    Click the button
    </button>
    `;
}

document.getElementById("button1").innerHTML = testButton();