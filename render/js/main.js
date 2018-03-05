let units = [];
let angle = .05;
distanceX = [0.,40.,40.,0.,0.,-40.,-40.,0.];
distanceY = [40.,0.,0.,40.,-40.,0.,0.,-40.];
distanceZ = [28.284271,28.284271,-28.284271,-28.284271,28.284271,28.284271,-28.284271,-28.284271];


window.setInterval(getResources, 1000);

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

           obj.sharePos = function(x,y,z){
               if(this.x === null) {
                   this.x = x;
                   this.y = y;
                   this.z = z;
                   this.surrounding.forEach((id, index) => {
                       if (id !== 0) {
                           this.array = [distanceX[index], distanceY[index], distanceZ[index]];
                          // console.log(id, index,this.array);
                           this.array[index] += 1;
                           getObjByID(id).sharePos(this.x + this.array[0], this.y + this.array[1], this.z + this.array[2])
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
