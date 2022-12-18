const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

canvas.style.backgroundColor = 'transparent';

let particleArray;

let mouse = {
    x:undefined,
    y:undefined,
    r:100
};

window.addEventListener('mousemove', function(e)
{
    mouse.x = e.x;
    mouse.y = e.y;
    // init();
});

window.addEventListener('resize', function()
{
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    init();
});

window.addEventListener('mouseout', function()
{
    mouse.x = undefined,
    mouse.y = undefined
});

function init()
{
    particleArray = [];
    const NoOfParticles = (innerWidth * innerHeight)/7000;
    for(var i=0; i<NoOfParticles; i++ )
    {
        particleArray.push(new Particle());
    }
}

function GetRandomIntInRange(min, max)
{
    return Math.random()*(max - min +1) + min;
} 

function GetDistance(x1, y1, x2, y2)
{
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
} 

function Particle()
{
    this.r = GetRandomIntInRange(1, 3);
    this.x = GetRandomIntInRange(0, innerWidth - this.r);
    this.y = GetRandomIntInRange(0, innerHeight - this.r);
    
    this.dx =  (Math.random() - 0.5)*2 ;
    this.dy =  (Math.random() - 0.5)*2;

    this.draw = function()
    {
        c.beginPath();
        c.arc(this.x, this.y, this.r, 0, Math.PI*2);
        c.strokeStyle = 'white';
        c.fillStyle = 'white';
        c.fill();
        c.stroke();
        this.update();
    }

    this.update = function()
    {
        if(this.x + this.r > innerWidth || this.x - this.r < 0)
            this.dx *=-1;
        if(this.y + this.r > innerHeight || this.y - this.r < 0)
            this.dy *=-1;

        // if(this.x + this.r > innerWidth || this.x - this.r < 0 || 
        //     this.y + this.r > innerHeight || this.y - this.r < 0)
        // {
        //     particleArray.splice(0,1);
        //     particleArray.push(new Particle());
        // }
        const dst = GetDistance( mouse.x, mouse.y, this.x, this.y);

        if(dst < mouse.r + this.r)
        {
            if( mouse.x < this.x && this.x < innerWidth - this.r *10)
                this.x += 10;
            if( mouse.y < this.y && this.y < innerHeight - this.r *10)
                this.y += 10;
            if( mouse.x > this.x && this.x > this.r *10)
                this.x -= 10;
            if( mouse.y > this.y && this.y > this.r *10)
                this.y -= 10;
        }

        
        this.x += this.dx;
        this.y += this.dy;
        
    }
}

function connect()
{
    const dst = (innerWidth/100)*(innerHeight/100);
    let opacity = 1;
    
    
    for( var i=0; i<particleArray.length; i++)
    {
        for( var j = 0; j<particleArray.length; j++)
        {
            let dist = GetDistance(particleArray[i].x, particleArray[i].y, particleArray[j].x,
                particleArray[j].y);
            
            if(dist < dst)
            {
                opacity = 1 - dist/200;
                c.beginPath();
                c.moveTo(particleArray[i].x, particleArray[i].y);
                c.lineTo(particleArray[j].x, particleArray[j].y);
                c.strokeStyle = 'rgba(22, 255, 255,'+opacity+')';
                // c.strokeStyle = 'white';
                c.lineWidth = 0.5;
                c.stroke();
                c.closePath();
            }
        }
    }
}

init();
animate();

function animate()
{
    requestAnimationFrame(animate);

    c.clearRect(0, 0, innerWidth, innerHeight);

    for(var i=0; i< particleArray.length; i++)
        particleArray[i].draw();

    connect();
}