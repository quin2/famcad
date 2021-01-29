import * as THREE from 'three';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

const tool = {ORBIT: 0, BUILD: 1, LIGHT: 2}
var mode = tool.ORBIT

var children = []

var scene = new THREE.Scene();

//and god said...
const light = new THREE.AmbientLight( 0x404040 ); // soft white light
scene.add( light );

var camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 1000 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();

//place our first thing here
const firstSquareGeo = new THREE.BoxBufferGeometry(8,8,8);
const myMat = new THREE.MeshLambertMaterial( {color: 0xffffff, opacity: 1.0, transparent: false} );
const clearMat = new THREE.MeshLambertMaterial( {color: 0xffff00, opacity: 0.9, transparent: true} );
var firstSquare = new THREE.Mesh( firstSquareGeo, myMat);

scene.add( firstSquare );
children.push(firstSquare)

renderer.render(scene, camera)

//center camera
var centerx = 0;
var centery = 0;
camera.position.x = centerx;
camera.position.y = centery;

//controls
var controls = new OrbitControls( camera, renderer.domElement );
controls.enableDamping = true; 
controls.dampingFactor = 0.05;
controls.screenSpacePanning = false;
controls.minDistance = 100;
controls.maxDistance = 500;
controls.maxPolarAngle = Math.PI / 2;

renderer.render(scene, camera)

//listen to scroll wheel
window.addEventListener("wheel", function(e) {
  //camera.position.z += -1 * (e.deltaY / 20);
  
  //this seems a little smoother...
  
  if(e.deltaY < 0){
    if(camera.position.z < 100){
      camera.position.z++;
    }
  } else {
    if(camera.position.z > 2){
      camera.position.z--;
    }
  }

}, true);

function drawObject(sel){
  var newCube = new THREE.Mesh( firstSquareGeo, myMat);
  if(mode == tool.LIGHT){
    newCube = new THREE.Mesh( firstSquareGeo, clearMat)
  }

  newCube.position.copy( sel.point ).add( sel.face.normal );
  newCube.position.divideScalar( 8 ).floor().multiplyScalar( 8 ).addScalar( 4 );
  scene.add(newCube)
  children.push(newCube)

  if(mode == tool.LIGHT){
    const light = new THREE.PointLight( 0xffffff, 1, 32, 2 );
    light.position.copy( sel.point ).add( sel.face.normal );
    light.position.divideScalar( 8 ).floor().multiplyScalar( 8 ).addScalar( 4 );
    scene.add(light)
    children.push(light)
  }
}


function onMouseClick( event ) {
  if(mode == tool.BUILD || mode == tool.LIGHT){
    // update the picking ray with the camera and mouse position
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    
    raycaster.setFromCamera( mouse, camera );

    // calculate objects intersecting the picking ray
    const intersects = raycaster.intersectObjects( children );

    if(intersects.length > 0){
      const sel = intersects[0]

      drawObject(sel)
    }

    console.log(intersects)
  }
}

function onWindowResize(){

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

function switchToolOrbit(e){
  mode = tool.ORBIT
}

function switchToolBlock(e){
  mode = tool.BUILD
}

function todoFunc(e){
  console.log("unimplemented feature :0")
}

function switchToolLight(e){
  mode = tool.LIGHT
}

//credits https://discourse.threejs.org/t/round-edged-box/1402
function createBoxWithRoundedEdges( width, height, depth, radius0, smoothness ) {
  let shape = new THREE.Shape();
  let eps = 0.00001;
  let radius = radius0 - eps;
  shape.absarc( eps, eps, eps, -Math.PI / 2, -Math.PI, true );
  shape.absarc( eps, height -  radius * 2, eps, Math.PI, Math.PI / 2, true );
  shape.absarc( width - radius * 2, height -  radius * 2, eps, Math.PI / 2, 0, true );
  shape.absarc( width - radius * 2, eps, eps, 0, -Math.PI / 2, true );
  let geometry = new THREE.ExtrudeBufferGeometry( shape, {
    amount: depth - radius0 * 2,
    bevelEnabled: true,
    bevelSegments: smoothness * 2,
    steps: 1,
    bevelSize: radius,
    bevelThickness: radius0,
    curveSegments: smoothness
  });
  
  geometry.center();
  
  return geometry;
}

window.addEventListener( 'click', onMouseClick, false );
window.addEventListener( 'resize', onWindowResize, false );

document.getElementById('orbit').addEventListener('click', switchToolOrbit)
document.getElementById('delete').addEventListener('click', todoFunc)
document.getElementById('block').addEventListener('click', switchToolBlock)
document.getElementById('light').addEventListener('click', switchToolLight)
document.getElementById('render').addEventListener('click', todoFunc)
document.getElementById('fam').addEventListener('click', todoFunc)

renderer.setAnimationLoop(() => {
  controls.update();
  renderer.render(scene, camera);
});