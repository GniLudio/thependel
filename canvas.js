console.log("canvas.js loaded");

// get the canvas
const canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
window.addEventListener("resize", function () { canvas.width = window.innerWidth; canvas.height = window.innerHeight; draw(); });

function draw() {
    if (!canvas.getContext) return;
    const ctx = canvas.getContext("2d");

    const s = 6;

    quadraticCurveTo(ctx, 75*s, 25*s, 25*s, 25*s, 25*s, 62.5*s)
    quadraticCurveTo(ctx, 25*s, 62.5*s, 25*s, 100*s, 50*s, 100*s);
    quadraticCurveTo(ctx, 50*s, 100*s, 50*s, 120*s, 30*s, 125*s, true, "rgba(0,255,0, 0.75)");
    quadraticCurveTo(ctx, 30*s, 125*s, 60*s, 120*s, 65*s, 100*s, true, "rgba(0,0,255, 0.75)");
    quadraticCurveTo(ctx, 65*s, 100*s, 125*s, 100*s, 125*s, 62.5*s);
    quadraticCurveTo(ctx, 125*s, 62.5*s, 125*s, 25*s, 75*s, 25*s);
}

window.addEventListener("load", draw);

/**
 * 
 * @param {CanvasRenderingContext2D } ctx 
 * @param {number} cpx 
 * @param {number} cpy 
 * @param {number} x 
 * @param {number} y 
 * @param {boolean} debugPoints 
 * @param {string} debugColor 
 */
function quadraticCurveTo(ctx, x1, y1, cpx, cpy, x2, y2, debugPoints = true, debugColor = "rgba(255,0,0,0.75)", debugSize = 3) {
    ctx.beginPath();
    ctx.moveTo(x1,y1);
    ctx.quadraticCurveTo(cpx, cpy, x2, y2);
    ctx.stroke();

    ctx.save();
    ctx.beginPath();

    for (const p of [[x1, y1],[cpx, cpy],[x2, y2]]) {
        ctx.moveTo(p[0], p[1]);
        ctx.arc(p[0], p[1], debugSize, 0, Math.PI*2);
    }
    ctx.fillStyle = debugColor;
    ctx.fill();
    ctx.restore();
}