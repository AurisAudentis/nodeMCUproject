let units = [];
let angle = .05;
distanceX = [0.,40.,40.,0.,0.,-40.,-40.,0.];
distanceY = [40.,0.,0.,40.,-40.,0.,0.,-40.];
distanceZ = [28.284271,28.284271,-28.284271,-28.284271,28.284271,28.284271,-28.284271,-28.284271];
//const byte interruptPin[] = {13,12,14,2,0,4,15,16}; //D7 - D6 - D5- D4 - D3 - D2 - D8 - D0


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

           obj.sharePos = function(x,y,z, id){
               if(this.x === null) {
                   let index = this.surrounding.indexOf(id);
                   this.array = [distanceX[index], distanceY[index], distanceZ[index]];
                   startUp(x + array[0], y+array[1], z+array[2]);
               }
               };
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
           return obj
       });
       calcRelPositions();
    });
}

function calcRelPositions(){
    units[0].startUp(0,0,0);
   // console.log(units);
}

function getObjByID(id){
    return units.find(function(unit){
        return unit.id === id;
    })
}
