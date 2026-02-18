const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");

let tool = "pen";
let drawing = false;
let lastX, lastY;

let undoStack = [];
let redoStack = [];




function getMousePos(e) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    };
}


function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    loadLastDraw();
}
resize();
window.onresize = resize;





function setTool(t) {
    tool = t;
    document.querySelectorAll(".tool-btn").forEach(b => b.classList.remove("active"));
    event.target.classList.add("active");
}


function pushUndo() {
    undoStack.push(canvas.toDataURL());
    redoStack = [];
}

function undo() {
    if (!undoStack.length) return;

    redoStack.push(canvas.toDataURL());

    const img = new Image();
    img.src = undoStack.pop();
    img.onload = () => ctx.drawImage(img, 0, 0);

    saveLastDraw();
}

function redo() {
    if (!redoStack.length) return;

    undoStack.push(canvas.toDataURL());

    const img = new Image();
    img.src = redoStack.pop();
    img.onload = () => ctx.drawImage(img, 0, 0);

    saveLastDraw();
}

document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && !e.shiftKey && e.key === "z") {
        e.preventDefault();
        undo();
    }


    // Supporting of keyboard
    if (e.ctrlKey && e.shiftKey && e.key === "z") {
        e.preventDefault();
        redo();
    }



    if (e.ctrlKey && e.key === "y") {
        e.preventDefault();
        redo();
    }
});

/* ------------------ DRAWING ------------------ */
function start(e) {
    drawing = true;

    // Save state BEFORE any drawing
    pushUndo();

    const pos = getMousePos(e);
    lastX = pos.x;
    lastY = pos.y;
}






function end() {
    drawing = false;
    saveLastDraw();
}







function draw(e) {
    if (!drawing) return;
    const pos = getMousePos(e);




    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(pos.x, pos.y);





    const color = colorPicker.value;
    const size = sizePicker.value;

    if (tool === "pen") {
        ctx.strokeStyle = color;
        ctx.lineWidth = size;
        ctx.globalAlpha = 1;
    } else if (tool === "marker") {
        ctx.strokeStyle = color;
        ctx.lineWidth = size * 3;
        ctx.globalAlpha = 0.25;
    } else if (tool === "pencil") {
        ctx.strokeStyle = color;
        ctx.lineWidth = size * 0.7;
        ctx.globalAlpha = 0.5;
    } else if (tool === "eraser") {
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = size * 4;
        ctx.globalAlpha = 1;
    }

    ctx.lineCap = "round";
    ctx.stroke();

    lastX = pos.x;
    lastY = pos.y;
}




canvas.addEventListener("mousedown", start);
canvas.addEventListener("mouseup", end);
canvas.addEventListener("mousemove", draw);


function fillPage() {
    pushUndo(); 
    


    ctx.fillStyle = colorPicker.value;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    saveLastDraw();
}


function saveLastDraw() {
    localStorage.setItem("saadWhiteboard", canvas.toDataURL());
}

function loadLastDraw() {
    const data = localStorage.getItem("saadWhiteboard");
    if (!data) return;

    const img = new Image();
    img.src = data;
    img.onload = () => ctx.drawImage(img, 0, 0);
}


function toggleSaveMenu() {
    const menu = document.getElementById("saveMenu");
    menu.style.display = menu.style.display === "flex" ? "none" : "flex";
}





function saveAs(type) {
    const link = document.createElement("a");
    link.download = `whiteboard.${type}`;
    link.href = canvas.toDataURL(`image/${type}`);
    link.click();
}
