let canvas = document.getElementById('myCanvas');
let ctx = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

const mouse = {
    x: innerWidth,
    y: innerHeight
}

const colors = ['#c3e0e5','#274472','#5885af','#41729f']

// Event Listeners
addEventListener('mousemove', (event) => {
    // this gets the canvas bound rect and then removes page offsets 
    // to get canvas relative mouse point
    const rect = canvas.getBoundingClientRect()
    mouse.x = event.clientX - rect.left;
    mouse.y = event.clientY - rect.top;
    // console.log(`Canvas x:${mouse.x}\nCanvas y:${mouse.y}`);
})

addEventListener('resize', () => {
    canvas.width = innerWidth;
    canvas.height = innerHeight;

    init()
})

// Objects
function Particle(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radians = Math.random() * Math.PI * 2;

    if (radius==undefined){
        this.radius = randomIntFromRange(3, 12);
    }else{
        this.radius = radius;
    }
    // random orbit from range
    // this.orbitMag = randomIntFromRange(30,500);
    // smaller radius have smaller orbit
    this.orbitMag = this.radius*20;
    this.bodyMax = 5;
    this.lastMouse = {x: x, y: y};

    // conditional assignments
    // if no color parsed in randomly sample from colors array
    if (color==undefined){
        this.color = randomColor(colors);
    }else{
        this.color = color;
    }

    // smaller elements are faster
    this.velocity = 1/(this.radius)**2;

    
    this.update = () => {
        // store this point for the draw to refer to
        const lastPoint = {x: this.x, y: this.y};


        // Drag effect - integrator control
        this.lastMouse.x += (mouse.x - this.lastMouse.x) * 0.02;
        this.lastMouse.y += (mouse.y - this.lastMouse.y) * 0.02;

        // continually increase the radians counter
        this.radians += this.velocity;
        // add the new circulation position to the last mouse position
        this.x = this.lastMouse.x + Math.cos(this.radians)*this.orbitMag;
        this.y = this.lastMouse.y + Math.sin(this.radians)*this.orbitMag;
        this.draw(lastPoint);
    }

    this.draw = (lastPoint) => {
        ctx.beginPath()
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.radius;
        // the particles old location
        ctx.moveTo(lastPoint.x, lastPoint.y);
        // the particles new location
        ctx.lineTo(this.x, this.y);
        ctx.stroke();
        // ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        // ctx.fillStyle = this.color
        // ctx.fill()
        ctx.closePath()
    }

}

// Implementation
let particles;
let objCount = 100;

function init() {
    particles = []

    for (let i = 0; i < objCount; i++) {
        particles.push(new Particle(mouse.x, mouse.y));
    }

    console.log(particles);
}

// Animation Loop
function animate() {
    requestAnimationFrame(animate)
    // ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillText('', mouse.x, mouse.y);
    particles.forEach(particle => {
     particle.update()
    })
}

init()
animate()


// Utilities
function randomIntFromRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function randomColor(colors) {
    return colors[Math.floor(Math.random() * colors.length)]
}

function distance(x1, y1, x2, y2) {
    const xDist = x2 - x1
    const yDist = y2 - y1

    return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2))
}


