let raf;
let arm1_len = 200;
let arm2_len = 200;

class Pendulum {
    constructor() {
        this.canvas = document.getElementById("canvas");
        this.ctx = this.canvas.getContext('2d');
        this.ctx2 = this.ctx;

        this.originX = this.canvas.width / 2;
        this.originY = this.canvas.height / 3;

        this.l = 200;
        this.l2 = this.l*0.5;
        this.theta1 = Math.PI / 2;
        this.theta2 = Math.PI / 2;

        this.vel1 = 0;
        this.vel2 = 0;

        this.a1_a = 0;
        this.a2_a = 0;

        this.m1 = 50;
        this.m2 = 10;

        this.g = 1;

        this.posX = 0;
        this.posY = 0;

        this.posX2 = 0;
        this.posY2 = 0;

        this.posx2_arr = [];
        this.posy2_arr = [];

        this.damping1 = 1;
        this.damping2 = 1;

        this.dotsOrNot = false;

        this.draw();
    }

    draw() {

        switch(this.dotsOrNot) {
            case true:
                this.ctx2.beginPath();
                for(let i = 0; i < this.posy2_arr.length; i++){
                    this.ctx2.arc(this.posx2_arr[i], this.posy2_arr[i], 1, 0, Math.PI * 2, true);
                    // this.ctx2.fill();
                    this.ctx2.stroke();
                    this.ctx2.fillStyle = 'black';
                }
                break;
            case false:
                this.ctx2.beginPath();
                for(let i = 0; i < this.posy2_arr.length; i++){
                    this.ctx2.lineTo(this.posx2_arr[i], this.posy2_arr[i]);
                }
                this.ctx2.stroke();
                break;
        }

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

        this.vel1 += this.a1_a;
        this.vel2 += this.a2_a;

        this.theta1 += this.vel1;
        this.theta2 += this.vel2;

        this.vel1 *= this.damping1;
        this.vel2 *= this.damping2;
    }

    updateL1 (length) {
        this.l = length;
    }

    updatedL2 (length) {
        this.l2 = length;
    };

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
    }
}

function move() {
    pend.ctx.clearRect(0,0, pend.canvas.width, pend.canvas.width);
    pend.motion();
    raf = window.requestAnimationFrame(move);
}

let pend = new Pendulum();
move();

function reset() {
    pend.posy2_arr = [];
    pend.posx2_arr = [];
    // pend.theta1 = Math.PI / 2;
    // pend.theta2 = Math.PI / 2;
    pend.a2_a = 0;
    pend.a1_a = 0;
    pend.vel1 = 0;
    pend.vel2 = 0;
}

function changeLengthArm1() {
    pend.l = document.getElementById("slider1").value;
    reset();
}

function changeLengthArm2() {
    pend.l2 = document.getElementById("slider2").value;
    reset();
}

function changeMassOfBall1() {
    pend.m1 = document.getElementById("slider3").value;
    reset();
}

function changeMassOfBall2() {
    pend.m2 = document.getElementById("slider4").value;
    reset();
}

function changeArm1Angle() {
    pend.theta1 = document.getElementById("slider5").value * Math.PI / 180;
    reset();
}

function changeArm2Angle() {
    pend.theta2 = document.getElementById("slider6").value * Math.PI / 180;
    reset();
}

function ball1damping() {
    pend.damping1 = document.getElementById("slider7").value / 1000;
    reset();
}

function ball2damping() {
    pend.damping2 = document.getElementById("slider8").value / 1000;
    reset();
}