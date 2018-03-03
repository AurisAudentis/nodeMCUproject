let units = [];
let angle = .05;


function setup() {
   createCanvas($(window).width(), $(window).height(), WEBGL);
    getResources();
    background(115);
}

function draw() {
    getResources();
    clear();
    background(115);
    ambientMaterial(255);
    ambientLight(255);
    //rotateY(0.8);
   // rotateX(0.1);
    units.forEach((unit) => {
        push();
        translate(unit.x*80, unit.y*80, unit.z*80);
        sphere(40);
        pop();
    });

    //angle += 0.005;
}


function getResources(){
    $.getJSON("http://maxiemgeldhof.com/node", (data) => {

       units = data.map((obj) => {
           obj.x=null;
           obj.y=null;
           obj.z=null;

           obj.sharePos = function(x,y,z){
               if(this.x === null) {
                   this.x = x;
                   this.y = y;
                   this.z = z;
                   this.surrounding.forEach((id, index) => {
                       if (id !== 0) {
                           this.array = [0,0,0,0,0,0,0,0];
                          // console.log(id, index,this.array);
                           this.array[index] += 1;
                           getObjByID(id).sharePos(this.x + this.array[3] - this.array[2], this.y + this.array[4] - this.array[5], this.z + this.array[0] - this.array[1])
                       }
                   });
               }
               };
           return obj
       });
       calcRelPositions();
    });
}

function calcRelPositions(){
    units[0].sharePos(0,0,0);
   // console.log(units);
}

function getObjByID(id){
    return units.find(function(unit){
        return unit.id === id;
    })
}
