let units = [];
let angle = .05;
distanceX = [0.,40.,40.,0.,0.,-40.,-40.,0.];
distanceY = [40.,0.,0.,40.,-40.,0.,0.,-40.];
distanceZ = [28.284271,28.284271,-28.284271,-28.284271,28.284271,28.284271,-28.284271,-28.284271];
inverse = [4,5,6,7,0,1,2,3]; // D1-D6; D2-D7; D3-D8; D4-D5;


window.setInterval(getResources, 3000);

function setup() {
   createCanvas($(window).width(), $(window).height(), WEBGL);
    getResources();
    background(115);
}

function draw() {

    clear();
    background(115);
    ambientMaterial(255);
    ambientLight(255);
    rotateY(angle);
   // rotateX(angle);
    units.forEach((unit) => {
        push();
        translate(unit.x*1.5, unit.y*1.5, unit.z*1.5);
        sphere(40);
        pop();
    });

    angle += 0.005;
}


function getResources(){
    $.getJSON("http://maxiemgeldhof.com/node", (data) => {

       units = data.map((obj) => {
           obj.x=null;
           obj.y=null;
           obj.z=null;

           obj.startUp = function(x,y,z){
               this.x = x;
               this.y = y;
               this.z = z;
               this.surrounding.forEach((id) => {
                   if (id !== 0) {
                       getObjByID(id).sharePos(this.x, this.y, this.z, this.id);
                   }
               });
           };

           obj.sharePos = function(x,y,z, id){
               if(this.x === null) {
                   let index = this.surrounding.indexOf(id);
                   let neighbor = getObjByID(id).surrounding.indexOf(this.id);
                   while(inverse[index] !== neighbor){
                       this.turnSurroundingOne();
                       index = this.surrounding.indexOf(id);
                   }
                   this.array = [distanceX[index], distanceY[index], distanceZ[index]];
                   this.startUp(x + this.array[0], y+this.array[1], z+this.array[2]);
               }
               };

           obj.turnSurroundingOne = function(){
            console.log(this.surrounding);
             let last = this.surrounding[0];
             for(let i = 0; i < this.surrounding.length - 1; i++){
                 this.surrounding[i] = this.surrounding[i+1];
             }
             this.surrounding[this.surrounding.length - 1] = last;
            console.log(this.surrounding);
           };


           return obj
       });
       calcRelPositions();
    });
}

function calcRelPositions(){
    units[0].startUp(0,0,0);
}

function getObjByID(id){
    return units.find(function(unit){
        return unit.id === id;
    })
}
