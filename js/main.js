let raf;
let arm1_len = 200;
let arm2_len = 200;

class Pendulum {
    constructor() {
        this.canvas = document.getElementById("canvas");
        this.ctx = this.canvas.getContext('2d');
        this.ctx2 = this.ctx;

        this.originX = this.canvas.width / 2;
        this.originY = this.canvas.height / 2;

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

        this.dotsOrNot = true;

        this.R = 100;
        this.G = 100;
        this.B = 100;

        this.draw();
    }

    draw() {

        switch(this.dotsOrNot) {
            case true:
                this.ctx2.beginPath();
                for(let i = 0; i < this.posy2_arr.length; i++){
                    this.ctx2.arc(this.posx2_arr[i], this.posy2_arr[i], 1, 0, Math.PI * 2, true);
                    // this.ctx2.fill();
                    this.ctx2.fillRect(this.posx2_arr[i],this.posy2_arr[i],2,2);
                    this.ctx2.fillStyle = 'green';
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
        this.ctx.fillStyle = `rgb(${this.R}, ${this.G}, ${this.B})`;

        this.ctx.moveTo(this.posX2, this.posY2);
        this.ctx.arc(this.posX2, this.posY2, this.m2, 0, Math.PI * 2, true);
        this.ctx.fillStyle = `rgb(${this.R}, ${this.G}, ${this.B})`;
        this.ctx.closePath();
        this.ctx.fill();

        if(this.posx2_arr.length > 1000){
            this.posx2_arr.splice(0, 1);
            this.posy2_arr.splice(0, 1);
        }
        this.posx2_arr.push(this.posX2);
        this.posy2_arr.push(this.posY2);

        this.vel1 += this.a1_a;
        this.vel2 += this.a2_a;

        this.theta1 += this.vel1;
        this.theta2 += this.vel2;

        this.vel1 *= this.damping1;
        this.vel2 *= this.damping2;
    }

    len1() {
        this.l = document.getElementById("slider1").value;
        this.reset(false);
    }

    len2() {
        this.l2 = document.getElementById("slider2").value;
        this.reset(false);
    }

    mass1() {
        this.m1 = document.getElementById("slider3").value;
        this.reset(false);
    }

    mass2(){
        this.m2 = document.getElementById("slider4").value;
        this.reset(false);
    }

    the1(){
        this.theta1 = document.getElementById("slider5").value * Math.PI / 180;
        this.reset(true);
    }

    the2(){
        this.theta2 = document.getElementById("slider6").value * Math.PI / 180;
        this.reset(true);
    }

    damp1(){
        this.damping1 = document.getElementById("slider7").value / 1000;
        this.reset(false);
    }

    damp2(){
        this.damping2 = document.getElementById("slider8").value / 1000;
        this.reset(false);
    }

    checkboxvalue(){
        if($("#linestyle").prop('checked') === true){
            //dots
            this.dotsOrNot = true;
        }else{
            // lines
            this.dotsOrNot = false;
        }
    }

    changeRGB(value){
        switch(value){
            case 'R':
                pend.R = document.getElementById("R").value;
                break;
            case 'G':
                pend.G = document.getElementById("G").value;
                break;
            case 'B':
                pend.B = document.getElementById("B").value;
                break;
        }
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
    }

    reset(isTheta) {
        this.posy2_arr = [];
        this.posx2_arr = [];
        if(!isTheta) {
            this.theta1 = 60 * Math.PI / 180;
            this.theta2 = 60 * Math.PI / 180;
        }
        this.a2_a = 0;
        this.a1_a = 0;
        this.vel1 = 0;
        this.vel2 = 0;
    }
}

function move() {
    pend.ctx.clearRect(0,0, pend.canvas.width, pend.canvas.width);
    pend.motion();
    raf = window.requestAnimationFrame(move);
}

let pend = new Pendulum();
move();

