console.log("canvas.js loaded");

// get the canvas
const canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
window.addEventListener("resize", function () { canvas.width = window.innerWidth; canvas.height = window.innerHeight; draw(); });


let angle = 0;
function draw() {
    if (!canvas.getContext) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    // change to cartesian coordinate system
    ctx.translate(0, canvas.height);
    ctx.scale(1,-1);

    ctx.translate(canvas.width/2, canvas.height/2);
    ctx.rotate(angle * Math.PI / 180);

    ctx.beginPath();
    ctx.arc(0, 0, 300, 0, Math.PI);
    ctx.fill();

    ctx.restore();

    angle += 1;
    requestAnimationFrame(draw);
}

draw();