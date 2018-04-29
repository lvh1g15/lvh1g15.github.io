let raf;

class Pendulum {
    constructor() {
        this.canvas = document.getElementById("canvas");
        this.ctx = this.canvas.getContext('2d');
        this.ctx2 = this.ctx;

        this.originX = this.canvas.width / 2;
        this.originY = this.canvas.height / 3;

        this.l = 200;
        this.l2 = this.l;
        this.theta1 = Math.PI / 2;
        this.theta2 = Math.PI / 2;

        this.vel1 = 0;
        this.vel2 = 0;

        this.a1_a = 0;
        this.a2_a = 0;

        this.m1 = 15;
        this.m2 = 15;

        this.g = 1;

        this.posX = 0;
        this.posY = 0;

        this.posX2 = 0;
        this.posY2 = 0;

        this.posx2_arr = [];
        this.posy2_arr = [];

        this.secIter = false;
        this.draw();
    }

    draw() {
        this.posX = this.originX + this.l * Math.sin(this.theta1);
        this.posY = this.originY + this.l * Math.cos(this.theta1);

        this.posX2 = this.posX + this.l2 * Math.sin(this.theta2);
        this.posY2 = this.posY  + this.l2 * Math.cos(this.theta2);

        this.ctx.beginPath();
        this.ctx.moveTo(this.originX, this.originY);
        this.ctx.lineTo(this.posX, this.posY);

        this.ctx.moveTo(this.posX, this.posY);
        this.ctx.lineTo(this.posX2, this.posY2);

        this.ctx.stroke();


        this.ctx.moveTo(this.posX, this.posY);
        this.ctx.arc(this.posX, this.posY, this.m1, 0, Math.PI * 2, true);
        this.ctx.fillStyle = 'blue';

        this.ctx.moveTo(this.posX2, this.posY2);
        this.ctx.arc(this.posX2, this.posY2, this.m2, 0, Math.PI * 2, true);
        this.ctx.fillStyle = 'blue';
        this.ctx.closePath();
        this.ctx.fill();

        this.posx2_arr.push(this.posX2);
        this.posy2_arr.push(this.posY2);

        this.ctx2.beginPath();
        for(let i = 0; i < this.posy2_arr.length; i++){
            this.ctx2.lineTo(this.posx2_arr[i], this.posy2_arr[i]);
        }
        this.ctx2.stroke();

        this.vel1 += this.a1_a;
        this.vel2 += this.a2_a;

        this.theta1 += this.vel1;
        this.theta2 += this.vel2;

        this.secIter = true;
    }

    motion(){

        let num1 = -this.g * (2 * this.m1 + this.m2) * Math.sin(this.theta1);
        let num2 = -this.m2 * this.g * Math.sin(this.theta1 - 2 * this.theta2);
        let num3 = -2* Math.sin(this.theta1 - this.theta2) * this.m2;
        let num4 = this.vel2 * this.vel2 * this.l2 + this.vel1 * this.vel1 * this.l * Math.cos(this.theta1 - this.theta2);
        let den = this.l * (2 * this.m1 + this.m2 - this.m2 * Math.cos(2 * this.theta1 - 2 * this.theta2));
        this.a1_a = (num1 + num2 + num3 * num4) / den;

        num1 = 2 * Math.sin(this.theta1 - this.theta2);
        num2 = this.vel1 * this.vel1 * this.l * (this.m1 + this.m2);
        num3 = this.g * (this.m1 + this.m2) * Math.cos(this.theta1);
        num4 = this.vel2*this.vel2*this.l2*this.m2 * Math.cos(this.theta1 - this.theta2);
        den = this.l2 * (2*this.m1 +this.m2-this.m2 * Math.cos(2 * this.theta1 - 2 * this.theta2));
        this.a2_a = (num1*(num2+num3+num4)) / den;

        this.draw();
        console.log(this.theta1);
    }
}

function move() {
    pend.ctx.clearRect(0,0, pend.canvas.width, pend.canvas.width);
    // pend.draw();
    pend.motion();

    raf = window.requestAnimationFrame(move);
}

let pend = new Pendulum();
move();




