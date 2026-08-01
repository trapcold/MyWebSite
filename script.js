/* ==========================================================
   PANDEMIA
   SCRIPT.JS
========================================================== */


"use strict";



/* =========================
   ELEMENTS
========================= */


const enter = document.getElementById("enter");

const music = document.getElementById("music");

const card = document.querySelector(".card");

const likeBtn = document.getElementById("likeBtn");

const likes = document.getElementById("likes");



/* =========================
   ENTER
========================= */


function openSite(){


    if(enter){

        enter.style.opacity = "0";


        setTimeout(()=>{

            enter.style.display="none";


        },700);


    }


    if(music){

        music.volume = 0.35;

        music.play().catch(()=>{});

    }


    if(card){

        card.animate(

            [

                {
                    opacity:0,

                    transform:"translateY(40px) scale(.9)"

                },


                {

                    opacity:1,

                    transform:"translateY(0) scale(1)"

                }

            ],

            {

                duration:900,

                easing:"ease-out",

                fill:"forwards"

            }

        );

    }


}






/* =========================
   CARD TILT
========================= */


let rotateX = 0;

let rotateY = 0;



document.addEventListener("mousemove",(e)=>{


    if(!card) return;



    const x =

    (e.clientX / window.innerWidth - .5) * 15;



    const y =

    (e.clientY / window.innerHeight - .5) * -15;



    rotateX += (y - rotateX) * .08;

    rotateY += (x - rotateY) * .08;



    card.style.transform = `

    perspective(1200px)

    rotateX(${rotateX}deg)

    rotateY(${rotateY}deg)

    `;



});





/* =========================
   LIKE SYSTEM
========================= */


let likeCount =

Number(localStorage.getItem("likes")) || 0;



if(likes){

    likes.textContent = likeCount;

}



if(likeBtn){


    likeBtn.addEventListener("click",()=>{


        likeCount++;


        likes.textContent = likeCount;


        localStorage.setItem(
            "likes",
            likeCount
        );


    });


}






/* =========================
   BLOOD CANVAS
========================= */


const canvas =
document.getElementById("bloodCanvas");


const ctx =
canvas?.getContext("2d");



let drops=[];



function resizeCanvas(){


    if(!canvas) return;


    canvas.width =
    window.innerWidth;


    canvas.height =
    window.innerHeight;


}


window.addEventListener(
"resize",
resizeCanvas
);


resizeCanvas();




class BloodDrop{


    constructor(){


        this.x =
        Math.random()*canvas.width;


        this.y =
        -20;


        this.size =
        Math.random()*5+3;


        this.speed =
        Math.random()*2+1;



    }



    update(){


        this.y += this.speed;


        ctx.fillStyle =
        "#8b0000";


        ctx.beginPath();


        ctx.arc(

            this.x,

            this.y,

            this.size,

            0,

            Math.PI*2

        );


        ctx.fill();



    }


}



function bloodLoop(){


    if(ctx){


        ctx.clearRect(

            0,

            0,

            canvas.width,

            canvas.height

        );



        if(Math.random()<0.08){


            drops.push(
                new BloodDrop()
            );


        }



        drops.forEach(
            d=>d.update()
        );



        drops =
        drops.filter(
            d=>d.y < canvas.height
        );


    }



    requestAnimationFrame(
        bloodLoop
    );


}


bloodLoop();