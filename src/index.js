import * as THREE from 'three';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

const tool = {ORBIT: 0, BUILD: 1, LIGHT: 2, DELETE: 3}
var mode = tool.ORBIT

const blocks = {SOLID: 0, LIGHT: 1}

var children = []

var lightsOn = true
var lights = []

var scene = new THREE.Scene();
scene.background = new THREE.Color( 0xf0f0f0 );

//and god said...
const light = new THREE.AmbientLight( 0x606060 ); // soft white light
scene.add( light );

const directionalLight = new THREE.DirectionalLight( 0xffffff );
directionalLight.position.set( 1, 0.75, 0.5 ).normalize();
scene.add( directionalLight );

var camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 1000 );

var renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();

var width = 8;
var height = 8;
var depth = 8;
var radius = .75;
var widthSegments = 3;
var heightSegments = 3;
var depthSegments= 2;
var smoothness = 20;

const firstSquareGeo= RoundEdgedBox(width, height, depth, radius, widthSegments, heightSegments, depthSegments, smoothness);

const myMat = new THREE.MeshLambertMaterial( {color: 0xffffff, opacity: 1.0, transparent: false} );
const clearMat = new THREE.MeshLambertMaterial( {color: 0xffff00, opacity: 0.9, transparent: true} );


//initalize scene
for(var i = 0; i < 4; i++){
  for(var j = 0; j < 4; j++){
    var firstSquare = new THREE.Mesh( firstSquareGeo, myMat);
    firstSquare.position.set((i-1.5)*8, 4, (j-1.5)*8)
    scene.add( firstSquare );
    children.push(firstSquare)
  }
}



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
  newCube.type = blocks.SOLID

  if(mode == tool.LIGHT){
    newCube.type = blocks.LIGHT

    const light = new THREE.PointLight( 0xffffff, 1, 32, 2 );
    light.position.copy( sel.point ).add( sel.face.normal );
    light.position.divideScalar( 8 ).floor().multiplyScalar( 8 ).addScalar( 4 );
    if(!lightsOn){
      scene.add(light)
    }

    lights.push(light)
    newCube.light = light
  }

  scene.add(newCube)
  children.push(newCube)
}


function onMouseClick( event ) {  
  if(mode != tool.ORBIT){
    // update the picking ray with the camera and mouse position
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    
    raycaster.setFromCamera( mouse, camera );

    // calculate objects intersecting the picking ray
    const intersects = raycaster.intersectObjects( children );

    if(intersects.length > 0){
      const sel = intersects[0]

      if(mode == tool.BUILD || mode == tool.LIGHT){
        drawObject(sel)
      }
      if(mode == tool.DELETE){
        console.log(sel)
        if(sel.object.type == blocks.LIGHT){
          scene.remove(sel.object.light);
        }
        scene.remove( sel.object );
        children.splice( children.indexOf( sel.object ), 1 );
      }
    }
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

function switchToolDelete(e){
  mode = tool.DELETE
}

function todoFunc(e){
  console.log("unimplemented feature :0")
}

function switchToolLight(e){
  mode = tool.LIGHT
}

function toggleLights(e){
  if(lightsOn){
    scene.remove(directionalLight)
    lights.forEach(light => scene.add(light))
    scene.background = new THREE.Color( 0x000000 );
  }
  else {
    scene.add(directionalLight)
    lights.forEach(light => scene.remove(light))
    scene.background = new THREE.Color( 0xf0f0f0 );
  }

  lightsOn = !lightsOn
}

//credits https://discourse.threejs.org/t/round-edged-box/1402
function RoundEdgedBox(w, h, d, r, wSegs, hSegs, dSegs, rSegs) {
  
    w = w || 1;
    h = h || 1;
    d = d || 1;
    let minimum = Math.min(Math.min(w, h), d);
    r = r || minimum * .25;
    r = r > minimum * .5 ? minimum * .5 : r;
    wSegs = Math.floor(wSegs) || 1;
    hSegs = Math.floor(hSegs) || 1;
    dSegs = Math.floor(dSegs) || 1;
    rSegs = Math.floor(rSegs) || 1;

    let fullGeometry = new THREE.BufferGeometry();

    let fullPosition = [];
    let fullUvs = [];
    let fullIndex = [];
    let fullIndexStart = 0;
    
    let groupStart = 0;

    bendedPlane(w, h, r, wSegs, hSegs, rSegs, d * .5, 'y', 0, 0);
    bendedPlane(w, h, r, wSegs, hSegs, rSegs, d * .5, 'y', Math.PI, 1);
    bendedPlane(d, h, r, dSegs, hSegs, rSegs, w * .5, 'y', Math.PI * .5, 2);
    bendedPlane(d, h, r, dSegs, hSegs, rSegs, w * .5, 'y', Math.PI * -.5, 3);
    bendedPlane(w, d, r, wSegs, dSegs, rSegs, h * .5, 'x', Math.PI * -.5, 4);
    bendedPlane(w, d, r, wSegs, dSegs, rSegs, h * .5, 'x', Math.PI * .5, 5);

    fullGeometry.addAttribute("position", new THREE.BufferAttribute(new Float32Array(fullPosition), 3));
    fullGeometry.addAttribute("uv", new THREE.BufferAttribute(new Float32Array(fullUvs), 2));
    fullGeometry.setIndex(fullIndex);
    
    fullGeometry.computeVertexNormals();
    
    return fullGeometry;

    function bendedPlane(width, height, radius, widthSegments, heightSegments, smoothness, offset, axis, angle, materialIndex) {

      let halfWidth = width * .5;
      let halfHeight = height * .5;
      let widthChunk = width / (widthSegments + smoothness * 2);
      let heightChunk = height / (heightSegments + smoothness * 2);

      let planeGeom = new THREE.PlaneBufferGeometry(width, height, widthSegments + smoothness * 2, heightSegments + smoothness * 2);

      let v = new THREE.Vector3(); // current vertex
      let cv = new THREE.Vector3(); // control vertex for bending
      let cd = new THREE.Vector3(); // vector for distance
      let position = planeGeom.attributes.position;
      let uv = planeGeom.attributes.uv;
      let widthShrinkLimit = widthChunk * smoothness;
      let widthShrinkRatio = radius / widthShrinkLimit;
      let heightShrinkLimit = heightChunk * smoothness;
      let heightShrinkRatio = radius / heightShrinkLimit;
      let widthInflateRatio = (halfWidth - radius) / (halfWidth - widthShrinkLimit);
      let heightInflateRatio = (halfHeight - radius) / (halfHeight - heightShrinkLimit);
      for (let i = 0; i < position.count; i++) {
        v.fromBufferAttribute(position, i);
        if (Math.abs(v.x) >= halfWidth - widthShrinkLimit) {
          v.setX((halfWidth - (halfWidth - Math.abs(v.x)) * widthShrinkRatio) * Math.sign(v.x));
        } else {
          v.x *= widthInflateRatio;
        }// lr
        if (Math.abs(v.y) >= halfHeight - heightShrinkLimit) {
          v.setY((halfHeight - (halfHeight - Math.abs(v.y)) * heightShrinkRatio) * Math.sign(v.y));
        } else {
          v.y *= heightInflateRatio;
        }// tb

        //re-calculation of uvs
        uv.setXY(
          i,
          (v.x - (-halfWidth)) / width,
          1 - (halfHeight - v.y) / height
        );


        // bending
        let widthExceeds = Math.abs(v.x) >= halfWidth - radius;
        let heightExceeds = Math.abs(v.y) >= halfHeight - radius;
        if (widthExceeds || heightExceeds) {
          cv.set(
            widthExceeds ? (halfWidth - radius) * Math.sign(v.x) : v.x,
            heightExceeds ? (halfHeight - radius) * Math.sign(v.y) : v.y, -radius);
          cd.subVectors(v, cv).normalize();
          v.copy(cv).addScaledVector(cd, radius);
        };

        position.setXYZ(i, v.x, v.y, v.z);
      }

      planeGeom.translate(0, 0, offset);
      switch (axis) {
        case 'y':
          planeGeom.rotateY(angle);
          break;
        case 'x':
          planeGeom.rotateX(angle);
      }

      // merge positions
      position.array.forEach(function(p){
        fullPosition.push(p);
      });
      
      // merge uvs
      uv.array.forEach(function(u){
        fullUvs.push(u);
      });
      
      // merge indices
      planeGeom.index.array.forEach(function(a) {
        fullIndex.push(a + fullIndexStart);
      });
      fullIndexStart += position.count;
      
      // set the groups
      fullGeometry.addGroup(groupStart, planeGeom.index.count, materialIndex);
      groupStart += planeGeom.index.count;
    }
  }

window.addEventListener( 'click', onMouseClick, false );
window.addEventListener( 'resize', onWindowResize, false );

document.getElementById('orbit').addEventListener('click', switchToolOrbit)
document.getElementById('delete').addEventListener('click', switchToolDelete)
document.getElementById('block').addEventListener('click', switchToolBlock)
document.getElementById('light').addEventListener('click', switchToolLight)
document.getElementById('render').addEventListener('click', toggleLights)
document.getElementById('fam').addEventListener('click', todoFunc)

renderer.setAnimationLoop(() => {
  controls.update();
  renderer.render(scene, camera);
});