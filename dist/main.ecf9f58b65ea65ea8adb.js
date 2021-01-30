(self["webpackChunknooodle"] = self["webpackChunknooodle"] || []).push([["main"],{

/***/ 138:
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! three */ 212);
/* harmony import */ var three_examples_jsm_controls_OrbitControls__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! three/examples/jsm/controls/OrbitControls */ 886);



const tool = {ORBIT: 0, BUILD: 1, LIGHT: 2, DELETE: 3}
var mode = tool.ORBIT

const blocks = {SOLID: 0, LIGHT: 1}

var children = []

var lightsOn = true
var lights = []

var scene = new three__WEBPACK_IMPORTED_MODULE_0__.Scene();
scene.background = new three__WEBPACK_IMPORTED_MODULE_0__.Color( 0x333333 );

//and god said...
const light = new three__WEBPACK_IMPORTED_MODULE_0__.AmbientLight( 0x606060 ); // soft white light
scene.add( light );

const directionalLight = new three__WEBPACK_IMPORTED_MODULE_0__.DirectionalLight( 0xffffff );
directionalLight.position.set( 1, 0.75, 0.5 ).normalize();
scene.add( directionalLight );

var camera = new three__WEBPACK_IMPORTED_MODULE_0__.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 1000 );

var renderer = new three__WEBPACK_IMPORTED_MODULE_0__.WebGLRenderer({antialias: true});
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var raycaster = new three__WEBPACK_IMPORTED_MODULE_0__.Raycaster();
var mouse = new three__WEBPACK_IMPORTED_MODULE_0__.Vector2();

var width = 8;
var height = 8;
var depth = 8;
var radius = .75;
var widthSegments = 3;
var heightSegments = 3;
var depthSegments= 2;
var smoothness = 20;

const firstSquareGeo= RoundEdgedBox(width, height, depth, radius, widthSegments, heightSegments, depthSegments, smoothness);

const myMat = new three__WEBPACK_IMPORTED_MODULE_0__.MeshLambertMaterial( {color: 0xffffff, opacity: 1.0, transparent: false} );
const clearMat = new three__WEBPACK_IMPORTED_MODULE_0__.MeshLambertMaterial( {color: 0xffff00, opacity: 0.9, transparent: true} );


//initalize scene
for(var i = 0; i < 4; i++){
  for(var j = 0; j < 4; j++){
    var firstSquare = new three__WEBPACK_IMPORTED_MODULE_0__.Mesh( firstSquareGeo, myMat);
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
var controls = new three_examples_jsm_controls_OrbitControls__WEBPACK_IMPORTED_MODULE_1__.OrbitControls( camera, renderer.domElement );
controls.target.set(2, -4, 2);
  controls.update();  

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
  var newCube = new three__WEBPACK_IMPORTED_MODULE_0__.Mesh( firstSquareGeo, myMat);
  if(mode == tool.LIGHT){
    newCube = new three__WEBPACK_IMPORTED_MODULE_0__.Mesh( firstSquareGeo, clearMat)
  }

  newCube.position.copy( sel.point ).add( sel.face.normal );
  newCube.position.divideScalar( 8 ).floor().multiplyScalar( 8 ).addScalar( 4 );
  newCube.type = blocks.SOLID

  if(mode == tool.LIGHT){
    newCube.type = blocks.LIGHT

    const light = new three__WEBPACK_IMPORTED_MODULE_0__.PointLight( 0xffffff, 1, 32, 2 );
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

    if(event.clientX == null){
      mouse.x = ( event.touches[0].clientX / window.innerWidth ) * 2 - 1;
      mouse.y = - ( event.touches[0].clientY / window.innerHeight ) * 2 + 1;
    }
    
    raycaster.setFromCamera( mouse, camera );

    // calculate objects intersecting the picking ray
    const intersects = raycaster.intersectObjects( children );

    if(intersects.length > 0){
      const sel = intersects[0]

      if(mode == tool.BUILD || mode == tool.LIGHT){
        drawObject(sel)
      }
      if(mode == tool.DELETE){
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
  clearButtons()
  document.getElementById("orbit").classList.add("selected")
  mode = tool.ORBIT
}

function switchToolBlock(e){
  clearButtons()
  document.getElementById("block").classList.add("selected")
  mode = tool.BUILD
}

function switchToolDelete(e){
  clearButtons()
  document.getElementById("delete").classList.add("selected")
  mode = tool.DELETE
}

function todoFunc(e){
  console.log("unimplemented feature :0")
}

function switchToolLight(e){
  clearButtons()
  document.getElementById("light").classList.add("selected")
  mode = tool.LIGHT
}

function toggleLights(e){
  if(lightsOn){
    scene.remove(directionalLight)
    lights.forEach(light => scene.add(light))
    scene.background = new three__WEBPACK_IMPORTED_MODULE_0__.Color( 0x000000 );
    document.getElementById("render").innerHTML = "🌞";
  }
  else {
    scene.add(directionalLight)
    lights.forEach(light => scene.remove(light))
    scene.background = new three__WEBPACK_IMPORTED_MODULE_0__.Color( 0x333333 );
    document.getElementById("render").innerHTML = "🌚" ;
  }

  lightsOn = !lightsOn
}

function clearButtons(){
  document.getElementById("orbit").classList.remove("selected")
  document.getElementById("block").classList.remove("selected")
  document.getElementById("light").classList.remove("selected")
  document.getElementById("delete").classList.remove("selected")
  document.getElementById("orbit").classList.remove("selected")
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

    let fullGeometry = new three__WEBPACK_IMPORTED_MODULE_0__.BufferGeometry();

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

    fullGeometry.setAttribute("position", new three__WEBPACK_IMPORTED_MODULE_0__.BufferAttribute(new Float32Array(fullPosition), 3));
    fullGeometry.setAttribute("uv", new three__WEBPACK_IMPORTED_MODULE_0__.BufferAttribute(new Float32Array(fullUvs), 2));
    fullGeometry.setIndex(fullIndex);
    
    fullGeometry.computeVertexNormals();
    
    return fullGeometry;

    function bendedPlane(width, height, radius, widthSegments, heightSegments, smoothness, offset, axis, angle, materialIndex) {

      let halfWidth = width * .5;
      let halfHeight = height * .5;
      let widthChunk = width / (widthSegments + smoothness * 2);
      let heightChunk = height / (heightSegments + smoothness * 2);

      let planeGeom = new three__WEBPACK_IMPORTED_MODULE_0__.PlaneBufferGeometry(width, height, widthSegments + smoothness * 2, heightSegments + smoothness * 2);

      let v = new three__WEBPACK_IMPORTED_MODULE_0__.Vector3(); // current vertex
      let cv = new three__WEBPACK_IMPORTED_MODULE_0__.Vector3(); // control vertex for bending
      let cd = new three__WEBPACK_IMPORTED_MODULE_0__.Vector3(); // vector for distance
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
window.addEventListener( 'touchstart', onMouseClick, false );
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

/***/ })

},
0,[[138,"runtime","npm.three"]]]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9ub29vZGxlLy4vc3JjL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUErQjtBQUN5Qzs7QUFFeEUsY0FBYztBQUNkOztBQUVBLGdCQUFnQjs7QUFFaEI7O0FBRUE7QUFDQTs7QUFFQSxnQkFBZ0Isd0NBQVc7QUFDM0IsdUJBQXVCLHdDQUFXOztBQUVsQztBQUNBLGtCQUFrQiwrQ0FBa0IsYUFBYTtBQUNqRDs7QUFFQSw2QkFBNkIsbURBQXNCO0FBQ25EO0FBQ0E7O0FBRUEsaUJBQWlCLG9EQUF1Qjs7QUFFeEMsbUJBQW1CLGdEQUFtQixFQUFFLGdCQUFnQjtBQUN4RDtBQUNBOztBQUVBLG9CQUFvQiw0Q0FBZTtBQUNuQyxnQkFBZ0IsMENBQWE7O0FBRTdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUEsa0JBQWtCLHNEQUF5QixHQUFHLGtEQUFrRDtBQUNoRyxxQkFBcUIsc0RBQXlCLEdBQUcsaURBQWlEOzs7QUFHbEc7QUFDQSxjQUFjLE9BQU87QUFDckIsZ0JBQWdCLE9BQU87QUFDdkIsMEJBQTBCLHVDQUFVO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUFJQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsbUJBQW1CLG9GQUFhO0FBQ2hDO0FBQ0Esb0I7O0FBRUEsOEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxDQUFDOztBQUVEO0FBQ0Esb0JBQW9CLHVDQUFVO0FBQzlCO0FBQ0Esa0JBQWtCLHVDQUFVO0FBQzVCOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBLHNCQUFzQiw2Q0FBZ0I7QUFDdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQSxnQztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkJBQTJCLHdDQUFXO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkIsd0NBQVc7QUFDdEM7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsMkJBQTJCLGlEQUFvQjs7QUFFL0M7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLDhDQUE4QyxrREFBcUI7QUFDbkUsd0NBQXdDLGtEQUFxQjtBQUM3RDs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSwwQkFBMEIsc0RBQXlCOztBQUVuRCxrQkFBa0IsMENBQWEsR0FBRztBQUNsQyxtQkFBbUIsMENBQWEsR0FBRztBQUNuQyxtQkFBbUIsMENBQWEsR0FBRztBQUNuQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCLG9CQUFvQjtBQUN6QztBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBLFNBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsT0FBTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQSxPQUFPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsQ0FBQyxFIiwiZmlsZSI6Im1haW4uZWNmOWY1OGI2NWVhNjVlYThhZGIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBUSFJFRSBmcm9tICd0aHJlZSc7XG5pbXBvcnQge09yYml0Q29udHJvbHN9IGZyb20gXCJ0aHJlZS9leGFtcGxlcy9qc20vY29udHJvbHMvT3JiaXRDb250cm9sc1wiO1xuXG5jb25zdCB0b29sID0ge09SQklUOiAwLCBCVUlMRDogMSwgTElHSFQ6IDIsIERFTEVURTogM31cbnZhciBtb2RlID0gdG9vbC5PUkJJVFxuXG5jb25zdCBibG9ja3MgPSB7U09MSUQ6IDAsIExJR0hUOiAxfVxuXG52YXIgY2hpbGRyZW4gPSBbXVxuXG52YXIgbGlnaHRzT24gPSB0cnVlXG52YXIgbGlnaHRzID0gW11cblxudmFyIHNjZW5lID0gbmV3IFRIUkVFLlNjZW5lKCk7XG5zY2VuZS5iYWNrZ3JvdW5kID0gbmV3IFRIUkVFLkNvbG9yKCAweDMzMzMzMyApO1xuXG4vL2FuZCBnb2Qgc2FpZC4uLlxuY29uc3QgbGlnaHQgPSBuZXcgVEhSRUUuQW1iaWVudExpZ2h0KCAweDYwNjA2MCApOyAvLyBzb2Z0IHdoaXRlIGxpZ2h0XG5zY2VuZS5hZGQoIGxpZ2h0ICk7XG5cbmNvbnN0IGRpcmVjdGlvbmFsTGlnaHQgPSBuZXcgVEhSRUUuRGlyZWN0aW9uYWxMaWdodCggMHhmZmZmZmYgKTtcbmRpcmVjdGlvbmFsTGlnaHQucG9zaXRpb24uc2V0KCAxLCAwLjc1LCAwLjUgKS5ub3JtYWxpemUoKTtcbnNjZW5lLmFkZCggZGlyZWN0aW9uYWxMaWdodCApO1xuXG52YXIgY2FtZXJhID0gbmV3IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhKCA2MCwgd2luZG93LmlubmVyV2lkdGggLyB3aW5kb3cuaW5uZXJIZWlnaHQsIDEsIDEwMDAgKTtcblxudmFyIHJlbmRlcmVyID0gbmV3IFRIUkVFLldlYkdMUmVuZGVyZXIoe2FudGlhbGlhczogdHJ1ZX0pO1xucmVuZGVyZXIuc2V0U2l6ZSggd2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodCApO1xuZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCggcmVuZGVyZXIuZG9tRWxlbWVudCApO1xuXG52YXIgcmF5Y2FzdGVyID0gbmV3IFRIUkVFLlJheWNhc3RlcigpO1xudmFyIG1vdXNlID0gbmV3IFRIUkVFLlZlY3RvcjIoKTtcblxudmFyIHdpZHRoID0gODtcbnZhciBoZWlnaHQgPSA4O1xudmFyIGRlcHRoID0gODtcbnZhciByYWRpdXMgPSAuNzU7XG52YXIgd2lkdGhTZWdtZW50cyA9IDM7XG52YXIgaGVpZ2h0U2VnbWVudHMgPSAzO1xudmFyIGRlcHRoU2VnbWVudHM9IDI7XG52YXIgc21vb3RobmVzcyA9IDIwO1xuXG5jb25zdCBmaXJzdFNxdWFyZUdlbz0gUm91bmRFZGdlZEJveCh3aWR0aCwgaGVpZ2h0LCBkZXB0aCwgcmFkaXVzLCB3aWR0aFNlZ21lbnRzLCBoZWlnaHRTZWdtZW50cywgZGVwdGhTZWdtZW50cywgc21vb3RobmVzcyk7XG5cbmNvbnN0IG15TWF0ID0gbmV3IFRIUkVFLk1lc2hMYW1iZXJ0TWF0ZXJpYWwoIHtjb2xvcjogMHhmZmZmZmYsIG9wYWNpdHk6IDEuMCwgdHJhbnNwYXJlbnQ6IGZhbHNlfSApO1xuY29uc3QgY2xlYXJNYXQgPSBuZXcgVEhSRUUuTWVzaExhbWJlcnRNYXRlcmlhbCgge2NvbG9yOiAweGZmZmYwMCwgb3BhY2l0eTogMC45LCB0cmFuc3BhcmVudDogdHJ1ZX0gKTtcblxuXG4vL2luaXRhbGl6ZSBzY2VuZVxuZm9yKHZhciBpID0gMDsgaSA8IDQ7IGkrKyl7XG4gIGZvcih2YXIgaiA9IDA7IGogPCA0OyBqKyspe1xuICAgIHZhciBmaXJzdFNxdWFyZSA9IG5ldyBUSFJFRS5NZXNoKCBmaXJzdFNxdWFyZUdlbywgbXlNYXQpO1xuICAgIGZpcnN0U3F1YXJlLnBvc2l0aW9uLnNldCgoaS0xLjUpKjgsIDQsIChqLTEuNSkqOClcbiAgICBzY2VuZS5hZGQoIGZpcnN0U3F1YXJlICk7XG4gICAgY2hpbGRyZW4ucHVzaChmaXJzdFNxdWFyZSlcbiAgfVxufVxuXG5cblxucmVuZGVyZXIucmVuZGVyKHNjZW5lLCBjYW1lcmEpXG5cbi8vY2VudGVyIGNhbWVyYVxudmFyIGNlbnRlcnggPSAwO1xudmFyIGNlbnRlcnkgPSAwO1xuY2FtZXJhLnBvc2l0aW9uLnggPSBjZW50ZXJ4O1xuY2FtZXJhLnBvc2l0aW9uLnkgPSBjZW50ZXJ5O1xuXG4vL2NvbnRyb2xzXG52YXIgY29udHJvbHMgPSBuZXcgT3JiaXRDb250cm9scyggY2FtZXJhLCByZW5kZXJlci5kb21FbGVtZW50ICk7XG5jb250cm9scy50YXJnZXQuc2V0KDIsIC00LCAyKTtcbiAgY29udHJvbHMudXBkYXRlKCk7ICBcblxuY29udHJvbHMuZW5hYmxlRGFtcGluZyA9IHRydWU7IFxuY29udHJvbHMuZGFtcGluZ0ZhY3RvciA9IDAuMDU7XG5jb250cm9scy5zY3JlZW5TcGFjZVBhbm5pbmcgPSBmYWxzZTtcbmNvbnRyb2xzLm1pbkRpc3RhbmNlID0gMTAwO1xuY29udHJvbHMubWF4RGlzdGFuY2UgPSA1MDA7XG5jb250cm9scy5tYXhQb2xhckFuZ2xlID0gTWF0aC5QSSAvIDI7XG5cbnJlbmRlcmVyLnJlbmRlcihzY2VuZSwgY2FtZXJhKVxuXG4vL2xpc3RlbiB0byBzY3JvbGwgd2hlZWxcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwid2hlZWxcIiwgZnVuY3Rpb24oZSkge1xuICAvL2NhbWVyYS5wb3NpdGlvbi56ICs9IC0xICogKGUuZGVsdGFZIC8gMjApO1xuICBcbiAgLy90aGlzIHNlZW1zIGEgbGl0dGxlIHNtb290aGVyLi4uXG4gIFxuICBpZihlLmRlbHRhWSA8IDApe1xuICAgIGlmKGNhbWVyYS5wb3NpdGlvbi56IDwgMTAwKXtcbiAgICAgIGNhbWVyYS5wb3NpdGlvbi56Kys7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGlmKGNhbWVyYS5wb3NpdGlvbi56ID4gMil7XG4gICAgICBjYW1lcmEucG9zaXRpb24uei0tO1xuICAgIH1cbiAgfVxuXG59LCB0cnVlKTtcblxuZnVuY3Rpb24gZHJhd09iamVjdChzZWwpe1xuICB2YXIgbmV3Q3ViZSA9IG5ldyBUSFJFRS5NZXNoKCBmaXJzdFNxdWFyZUdlbywgbXlNYXQpO1xuICBpZihtb2RlID09IHRvb2wuTElHSFQpe1xuICAgIG5ld0N1YmUgPSBuZXcgVEhSRUUuTWVzaCggZmlyc3RTcXVhcmVHZW8sIGNsZWFyTWF0KVxuICB9XG5cbiAgbmV3Q3ViZS5wb3NpdGlvbi5jb3B5KCBzZWwucG9pbnQgKS5hZGQoIHNlbC5mYWNlLm5vcm1hbCApO1xuICBuZXdDdWJlLnBvc2l0aW9uLmRpdmlkZVNjYWxhciggOCApLmZsb29yKCkubXVsdGlwbHlTY2FsYXIoIDggKS5hZGRTY2FsYXIoIDQgKTtcbiAgbmV3Q3ViZS50eXBlID0gYmxvY2tzLlNPTElEXG5cbiAgaWYobW9kZSA9PSB0b29sLkxJR0hUKXtcbiAgICBuZXdDdWJlLnR5cGUgPSBibG9ja3MuTElHSFRcblxuICAgIGNvbnN0IGxpZ2h0ID0gbmV3IFRIUkVFLlBvaW50TGlnaHQoIDB4ZmZmZmZmLCAxLCAzMiwgMiApO1xuICAgIGxpZ2h0LnBvc2l0aW9uLmNvcHkoIHNlbC5wb2ludCApLmFkZCggc2VsLmZhY2Uubm9ybWFsICk7XG4gICAgbGlnaHQucG9zaXRpb24uZGl2aWRlU2NhbGFyKCA4ICkuZmxvb3IoKS5tdWx0aXBseVNjYWxhciggOCApLmFkZFNjYWxhciggNCApO1xuICAgIGlmKCFsaWdodHNPbil7XG4gICAgICBzY2VuZS5hZGQobGlnaHQpXG4gICAgfVxuXG4gICAgbGlnaHRzLnB1c2gobGlnaHQpXG4gICAgbmV3Q3ViZS5saWdodCA9IGxpZ2h0XG4gIH1cblxuICBzY2VuZS5hZGQobmV3Q3ViZSlcbiAgY2hpbGRyZW4ucHVzaChuZXdDdWJlKVxufVxuXG5cbmZ1bmN0aW9uIG9uTW91c2VDbGljayggZXZlbnQgKSB7IFxuICBpZihtb2RlICE9IHRvb2wuT1JCSVQpe1xuICAgIC8vIHVwZGF0ZSB0aGUgcGlja2luZyByYXkgd2l0aCB0aGUgY2FtZXJhIGFuZCBtb3VzZSBwb3NpdGlvblxuICAgIG1vdXNlLnggPSAoIGV2ZW50LmNsaWVudFggLyB3aW5kb3cuaW5uZXJXaWR0aCApICogMiAtIDE7XG4gICAgbW91c2UueSA9IC0gKCBldmVudC5jbGllbnRZIC8gd2luZG93LmlubmVySGVpZ2h0ICkgKiAyICsgMTtcblxuICAgIGlmKGV2ZW50LmNsaWVudFggPT0gbnVsbCl7XG4gICAgICBtb3VzZS54ID0gKCBldmVudC50b3VjaGVzWzBdLmNsaWVudFggLyB3aW5kb3cuaW5uZXJXaWR0aCApICogMiAtIDE7XG4gICAgICBtb3VzZS55ID0gLSAoIGV2ZW50LnRvdWNoZXNbMF0uY2xpZW50WSAvIHdpbmRvdy5pbm5lckhlaWdodCApICogMiArIDE7XG4gICAgfVxuICAgIFxuICAgIHJheWNhc3Rlci5zZXRGcm9tQ2FtZXJhKCBtb3VzZSwgY2FtZXJhICk7XG5cbiAgICAvLyBjYWxjdWxhdGUgb2JqZWN0cyBpbnRlcnNlY3RpbmcgdGhlIHBpY2tpbmcgcmF5XG4gICAgY29uc3QgaW50ZXJzZWN0cyA9IHJheWNhc3Rlci5pbnRlcnNlY3RPYmplY3RzKCBjaGlsZHJlbiApO1xuXG4gICAgaWYoaW50ZXJzZWN0cy5sZW5ndGggPiAwKXtcbiAgICAgIGNvbnN0IHNlbCA9IGludGVyc2VjdHNbMF1cblxuICAgICAgaWYobW9kZSA9PSB0b29sLkJVSUxEIHx8IG1vZGUgPT0gdG9vbC5MSUdIVCl7XG4gICAgICAgIGRyYXdPYmplY3Qoc2VsKVxuICAgICAgfVxuICAgICAgaWYobW9kZSA9PSB0b29sLkRFTEVURSl7XG4gICAgICAgIGlmKHNlbC5vYmplY3QudHlwZSA9PSBibG9ja3MuTElHSFQpe1xuICAgICAgICAgIHNjZW5lLnJlbW92ZShzZWwub2JqZWN0LmxpZ2h0KTtcbiAgICAgICAgfVxuICAgICAgICBzY2VuZS5yZW1vdmUoIHNlbC5vYmplY3QgKTtcbiAgICAgICAgY2hpbGRyZW4uc3BsaWNlKCBjaGlsZHJlbi5pbmRleE9mKCBzZWwub2JqZWN0ICksIDEgKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gb25XaW5kb3dSZXNpemUoKXtcblxuICAgIGNhbWVyYS5hc3BlY3QgPSB3aW5kb3cuaW5uZXJXaWR0aCAvIHdpbmRvdy5pbm5lckhlaWdodDtcbiAgICBjYW1lcmEudXBkYXRlUHJvamVjdGlvbk1hdHJpeCgpO1xuXG4gICAgcmVuZGVyZXIuc2V0U2l6ZSggd2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodCApO1xuXG59XG5cbmZ1bmN0aW9uIHN3aXRjaFRvb2xPcmJpdChlKXtcbiAgY2xlYXJCdXR0b25zKClcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvcmJpdFwiKS5jbGFzc0xpc3QuYWRkKFwic2VsZWN0ZWRcIilcbiAgbW9kZSA9IHRvb2wuT1JCSVRcbn1cblxuZnVuY3Rpb24gc3dpdGNoVG9vbEJsb2NrKGUpe1xuICBjbGVhckJ1dHRvbnMoKVxuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJsb2NrXCIpLmNsYXNzTGlzdC5hZGQoXCJzZWxlY3RlZFwiKVxuICBtb2RlID0gdG9vbC5CVUlMRFxufVxuXG5mdW5jdGlvbiBzd2l0Y2hUb29sRGVsZXRlKGUpe1xuICBjbGVhckJ1dHRvbnMoKVxuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImRlbGV0ZVwiKS5jbGFzc0xpc3QuYWRkKFwic2VsZWN0ZWRcIilcbiAgbW9kZSA9IHRvb2wuREVMRVRFXG59XG5cbmZ1bmN0aW9uIHRvZG9GdW5jKGUpe1xuICBjb25zb2xlLmxvZyhcInVuaW1wbGVtZW50ZWQgZmVhdHVyZSA6MFwiKVxufVxuXG5mdW5jdGlvbiBzd2l0Y2hUb29sTGlnaHQoZSl7XG4gIGNsZWFyQnV0dG9ucygpXG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibGlnaHRcIikuY2xhc3NMaXN0LmFkZChcInNlbGVjdGVkXCIpXG4gIG1vZGUgPSB0b29sLkxJR0hUXG59XG5cbmZ1bmN0aW9uIHRvZ2dsZUxpZ2h0cyhlKXtcbiAgaWYobGlnaHRzT24pe1xuICAgIHNjZW5lLnJlbW92ZShkaXJlY3Rpb25hbExpZ2h0KVxuICAgIGxpZ2h0cy5mb3JFYWNoKGxpZ2h0ID0+IHNjZW5lLmFkZChsaWdodCkpXG4gICAgc2NlbmUuYmFja2dyb3VuZCA9IG5ldyBUSFJFRS5Db2xvciggMHgwMDAwMDAgKTtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJlbmRlclwiKS5pbm5lckhUTUwgPSBcIvCfjJ5cIjtcbiAgfVxuICBlbHNlIHtcbiAgICBzY2VuZS5hZGQoZGlyZWN0aW9uYWxMaWdodClcbiAgICBsaWdodHMuZm9yRWFjaChsaWdodCA9PiBzY2VuZS5yZW1vdmUobGlnaHQpKVxuICAgIHNjZW5lLmJhY2tncm91bmQgPSBuZXcgVEhSRUUuQ29sb3IoIDB4MzMzMzMzICk7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyZW5kZXJcIikuaW5uZXJIVE1MID0gXCLwn4yaXCIgO1xuICB9XG5cbiAgbGlnaHRzT24gPSAhbGlnaHRzT25cbn1cblxuZnVuY3Rpb24gY2xlYXJCdXR0b25zKCl7XG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwib3JiaXRcIikuY2xhc3NMaXN0LnJlbW92ZShcInNlbGVjdGVkXCIpXG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYmxvY2tcIikuY2xhc3NMaXN0LnJlbW92ZShcInNlbGVjdGVkXCIpXG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibGlnaHRcIikuY2xhc3NMaXN0LnJlbW92ZShcInNlbGVjdGVkXCIpXG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZGVsZXRlXCIpLmNsYXNzTGlzdC5yZW1vdmUoXCJzZWxlY3RlZFwiKVxuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm9yYml0XCIpLmNsYXNzTGlzdC5yZW1vdmUoXCJzZWxlY3RlZFwiKVxufVxuXG4vL2NyZWRpdHMgaHR0cHM6Ly9kaXNjb3Vyc2UudGhyZWVqcy5vcmcvdC9yb3VuZC1lZGdlZC1ib3gvMTQwMlxuZnVuY3Rpb24gUm91bmRFZGdlZEJveCh3LCBoLCBkLCByLCB3U2VncywgaFNlZ3MsIGRTZWdzLCByU2Vncykge1xuICBcbiAgICB3ID0gdyB8fCAxO1xuICAgIGggPSBoIHx8IDE7XG4gICAgZCA9IGQgfHwgMTtcbiAgICBsZXQgbWluaW11bSA9IE1hdGgubWluKE1hdGgubWluKHcsIGgpLCBkKTtcbiAgICByID0gciB8fCBtaW5pbXVtICogLjI1O1xuICAgIHIgPSByID4gbWluaW11bSAqIC41ID8gbWluaW11bSAqIC41IDogcjtcbiAgICB3U2VncyA9IE1hdGguZmxvb3Iod1NlZ3MpIHx8IDE7XG4gICAgaFNlZ3MgPSBNYXRoLmZsb29yKGhTZWdzKSB8fCAxO1xuICAgIGRTZWdzID0gTWF0aC5mbG9vcihkU2VncykgfHwgMTtcbiAgICByU2VncyA9IE1hdGguZmxvb3IoclNlZ3MpIHx8IDE7XG5cbiAgICBsZXQgZnVsbEdlb21ldHJ5ID0gbmV3IFRIUkVFLkJ1ZmZlckdlb21ldHJ5KCk7XG5cbiAgICBsZXQgZnVsbFBvc2l0aW9uID0gW107XG4gICAgbGV0IGZ1bGxVdnMgPSBbXTtcbiAgICBsZXQgZnVsbEluZGV4ID0gW107XG4gICAgbGV0IGZ1bGxJbmRleFN0YXJ0ID0gMDtcbiAgICBcbiAgICBsZXQgZ3JvdXBTdGFydCA9IDA7XG5cbiAgICBiZW5kZWRQbGFuZSh3LCBoLCByLCB3U2VncywgaFNlZ3MsIHJTZWdzLCBkICogLjUsICd5JywgMCwgMCk7XG4gICAgYmVuZGVkUGxhbmUodywgaCwgciwgd1NlZ3MsIGhTZWdzLCByU2VncywgZCAqIC41LCAneScsIE1hdGguUEksIDEpO1xuICAgIGJlbmRlZFBsYW5lKGQsIGgsIHIsIGRTZWdzLCBoU2VncywgclNlZ3MsIHcgKiAuNSwgJ3knLCBNYXRoLlBJICogLjUsIDIpO1xuICAgIGJlbmRlZFBsYW5lKGQsIGgsIHIsIGRTZWdzLCBoU2VncywgclNlZ3MsIHcgKiAuNSwgJ3knLCBNYXRoLlBJICogLS41LCAzKTtcbiAgICBiZW5kZWRQbGFuZSh3LCBkLCByLCB3U2VncywgZFNlZ3MsIHJTZWdzLCBoICogLjUsICd4JywgTWF0aC5QSSAqIC0uNSwgNCk7XG4gICAgYmVuZGVkUGxhbmUodywgZCwgciwgd1NlZ3MsIGRTZWdzLCByU2VncywgaCAqIC41LCAneCcsIE1hdGguUEkgKiAuNSwgNSk7XG5cbiAgICBmdWxsR2VvbWV0cnkuc2V0QXR0cmlidXRlKFwicG9zaXRpb25cIiwgbmV3IFRIUkVFLkJ1ZmZlckF0dHJpYnV0ZShuZXcgRmxvYXQzMkFycmF5KGZ1bGxQb3NpdGlvbiksIDMpKTtcbiAgICBmdWxsR2VvbWV0cnkuc2V0QXR0cmlidXRlKFwidXZcIiwgbmV3IFRIUkVFLkJ1ZmZlckF0dHJpYnV0ZShuZXcgRmxvYXQzMkFycmF5KGZ1bGxVdnMpLCAyKSk7XG4gICAgZnVsbEdlb21ldHJ5LnNldEluZGV4KGZ1bGxJbmRleCk7XG4gICAgXG4gICAgZnVsbEdlb21ldHJ5LmNvbXB1dGVWZXJ0ZXhOb3JtYWxzKCk7XG4gICAgXG4gICAgcmV0dXJuIGZ1bGxHZW9tZXRyeTtcblxuICAgIGZ1bmN0aW9uIGJlbmRlZFBsYW5lKHdpZHRoLCBoZWlnaHQsIHJhZGl1cywgd2lkdGhTZWdtZW50cywgaGVpZ2h0U2VnbWVudHMsIHNtb290aG5lc3MsIG9mZnNldCwgYXhpcywgYW5nbGUsIG1hdGVyaWFsSW5kZXgpIHtcblxuICAgICAgbGV0IGhhbGZXaWR0aCA9IHdpZHRoICogLjU7XG4gICAgICBsZXQgaGFsZkhlaWdodCA9IGhlaWdodCAqIC41O1xuICAgICAgbGV0IHdpZHRoQ2h1bmsgPSB3aWR0aCAvICh3aWR0aFNlZ21lbnRzICsgc21vb3RobmVzcyAqIDIpO1xuICAgICAgbGV0IGhlaWdodENodW5rID0gaGVpZ2h0IC8gKGhlaWdodFNlZ21lbnRzICsgc21vb3RobmVzcyAqIDIpO1xuXG4gICAgICBsZXQgcGxhbmVHZW9tID0gbmV3IFRIUkVFLlBsYW5lQnVmZmVyR2VvbWV0cnkod2lkdGgsIGhlaWdodCwgd2lkdGhTZWdtZW50cyArIHNtb290aG5lc3MgKiAyLCBoZWlnaHRTZWdtZW50cyArIHNtb290aG5lc3MgKiAyKTtcblxuICAgICAgbGV0IHYgPSBuZXcgVEhSRUUuVmVjdG9yMygpOyAvLyBjdXJyZW50IHZlcnRleFxuICAgICAgbGV0IGN2ID0gbmV3IFRIUkVFLlZlY3RvcjMoKTsgLy8gY29udHJvbCB2ZXJ0ZXggZm9yIGJlbmRpbmdcbiAgICAgIGxldCBjZCA9IG5ldyBUSFJFRS5WZWN0b3IzKCk7IC8vIHZlY3RvciBmb3IgZGlzdGFuY2VcbiAgICAgIGxldCBwb3NpdGlvbiA9IHBsYW5lR2VvbS5hdHRyaWJ1dGVzLnBvc2l0aW9uO1xuICAgICAgbGV0IHV2ID0gcGxhbmVHZW9tLmF0dHJpYnV0ZXMudXY7XG4gICAgICBsZXQgd2lkdGhTaHJpbmtMaW1pdCA9IHdpZHRoQ2h1bmsgKiBzbW9vdGhuZXNzO1xuICAgICAgbGV0IHdpZHRoU2hyaW5rUmF0aW8gPSByYWRpdXMgLyB3aWR0aFNocmlua0xpbWl0O1xuICAgICAgbGV0IGhlaWdodFNocmlua0xpbWl0ID0gaGVpZ2h0Q2h1bmsgKiBzbW9vdGhuZXNzO1xuICAgICAgbGV0IGhlaWdodFNocmlua1JhdGlvID0gcmFkaXVzIC8gaGVpZ2h0U2hyaW5rTGltaXQ7XG4gICAgICBsZXQgd2lkdGhJbmZsYXRlUmF0aW8gPSAoaGFsZldpZHRoIC0gcmFkaXVzKSAvIChoYWxmV2lkdGggLSB3aWR0aFNocmlua0xpbWl0KTtcbiAgICAgIGxldCBoZWlnaHRJbmZsYXRlUmF0aW8gPSAoaGFsZkhlaWdodCAtIHJhZGl1cykgLyAoaGFsZkhlaWdodCAtIGhlaWdodFNocmlua0xpbWl0KTtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcG9zaXRpb24uY291bnQ7IGkrKykge1xuICAgICAgICB2LmZyb21CdWZmZXJBdHRyaWJ1dGUocG9zaXRpb24sIGkpO1xuICAgICAgICBpZiAoTWF0aC5hYnModi54KSA+PSBoYWxmV2lkdGggLSB3aWR0aFNocmlua0xpbWl0KSB7XG4gICAgICAgICAgdi5zZXRYKChoYWxmV2lkdGggLSAoaGFsZldpZHRoIC0gTWF0aC5hYnModi54KSkgKiB3aWR0aFNocmlua1JhdGlvKSAqIE1hdGguc2lnbih2LngpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2LnggKj0gd2lkdGhJbmZsYXRlUmF0aW87XG4gICAgICAgIH0vLyBsclxuICAgICAgICBpZiAoTWF0aC5hYnModi55KSA+PSBoYWxmSGVpZ2h0IC0gaGVpZ2h0U2hyaW5rTGltaXQpIHtcbiAgICAgICAgICB2LnNldFkoKGhhbGZIZWlnaHQgLSAoaGFsZkhlaWdodCAtIE1hdGguYWJzKHYueSkpICogaGVpZ2h0U2hyaW5rUmF0aW8pICogTWF0aC5zaWduKHYueSkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHYueSAqPSBoZWlnaHRJbmZsYXRlUmF0aW87XG4gICAgICAgIH0vLyB0YlxuXG4gICAgICAgIC8vcmUtY2FsY3VsYXRpb24gb2YgdXZzXG4gICAgICAgIHV2LnNldFhZKFxuICAgICAgICAgIGksXG4gICAgICAgICAgKHYueCAtICgtaGFsZldpZHRoKSkgLyB3aWR0aCxcbiAgICAgICAgICAxIC0gKGhhbGZIZWlnaHQgLSB2LnkpIC8gaGVpZ2h0XG4gICAgICAgICk7XG5cblxuICAgICAgICAvLyBiZW5kaW5nXG4gICAgICAgIGxldCB3aWR0aEV4Y2VlZHMgPSBNYXRoLmFicyh2LngpID49IGhhbGZXaWR0aCAtIHJhZGl1cztcbiAgICAgICAgbGV0IGhlaWdodEV4Y2VlZHMgPSBNYXRoLmFicyh2LnkpID49IGhhbGZIZWlnaHQgLSByYWRpdXM7XG4gICAgICAgIGlmICh3aWR0aEV4Y2VlZHMgfHwgaGVpZ2h0RXhjZWVkcykge1xuICAgICAgICAgIGN2LnNldChcbiAgICAgICAgICAgIHdpZHRoRXhjZWVkcyA/IChoYWxmV2lkdGggLSByYWRpdXMpICogTWF0aC5zaWduKHYueCkgOiB2LngsXG4gICAgICAgICAgICBoZWlnaHRFeGNlZWRzID8gKGhhbGZIZWlnaHQgLSByYWRpdXMpICogTWF0aC5zaWduKHYueSkgOiB2LnksIC1yYWRpdXMpO1xuICAgICAgICAgIGNkLnN1YlZlY3RvcnModiwgY3YpLm5vcm1hbGl6ZSgpO1xuICAgICAgICAgIHYuY29weShjdikuYWRkU2NhbGVkVmVjdG9yKGNkLCByYWRpdXMpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHBvc2l0aW9uLnNldFhZWihpLCB2LngsIHYueSwgdi56KTtcbiAgICAgIH1cblxuICAgICAgcGxhbmVHZW9tLnRyYW5zbGF0ZSgwLCAwLCBvZmZzZXQpO1xuICAgICAgc3dpdGNoIChheGlzKSB7XG4gICAgICAgIGNhc2UgJ3knOlxuICAgICAgICAgIHBsYW5lR2VvbS5yb3RhdGVZKGFuZ2xlKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAneCc6XG4gICAgICAgICAgcGxhbmVHZW9tLnJvdGF0ZVgoYW5nbGUpO1xuICAgICAgfVxuXG4gICAgICAvLyBtZXJnZSBwb3NpdGlvbnNcbiAgICAgIHBvc2l0aW9uLmFycmF5LmZvckVhY2goZnVuY3Rpb24ocCl7XG4gICAgICAgIGZ1bGxQb3NpdGlvbi5wdXNoKHApO1xuICAgICAgfSk7XG4gICAgICBcbiAgICAgIC8vIG1lcmdlIHV2c1xuICAgICAgdXYuYXJyYXkuZm9yRWFjaChmdW5jdGlvbih1KXtcbiAgICAgICAgZnVsbFV2cy5wdXNoKHUpO1xuICAgICAgfSk7XG4gICAgICBcbiAgICAgIC8vIG1lcmdlIGluZGljZXNcbiAgICAgIHBsYW5lR2VvbS5pbmRleC5hcnJheS5mb3JFYWNoKGZ1bmN0aW9uKGEpIHtcbiAgICAgICAgZnVsbEluZGV4LnB1c2goYSArIGZ1bGxJbmRleFN0YXJ0KTtcbiAgICAgIH0pO1xuICAgICAgZnVsbEluZGV4U3RhcnQgKz0gcG9zaXRpb24uY291bnQ7XG4gICAgICBcbiAgICAgIC8vIHNldCB0aGUgZ3JvdXBzXG4gICAgICBmdWxsR2VvbWV0cnkuYWRkR3JvdXAoZ3JvdXBTdGFydCwgcGxhbmVHZW9tLmluZGV4LmNvdW50LCBtYXRlcmlhbEluZGV4KTtcbiAgICAgIGdyb3VwU3RhcnQgKz0gcGxhbmVHZW9tLmluZGV4LmNvdW50O1xuICAgIH1cbiAgfVxuXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciggJ2NsaWNrJywgb25Nb3VzZUNsaWNrLCBmYWxzZSApO1xud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoICd0b3VjaHN0YXJ0Jywgb25Nb3VzZUNsaWNrLCBmYWxzZSApO1xud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoICdyZXNpemUnLCBvbldpbmRvd1Jlc2l6ZSwgZmFsc2UgKTtcblxuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ29yYml0JykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBzd2l0Y2hUb29sT3JiaXQpXG5kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZGVsZXRlJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBzd2l0Y2hUb29sRGVsZXRlKVxuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Jsb2NrJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBzd2l0Y2hUb29sQmxvY2spXG5kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbGlnaHQnKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHN3aXRjaFRvb2xMaWdodClcbmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZW5kZXInKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRvZ2dsZUxpZ2h0cylcbmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmYW0nKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRvZG9GdW5jKVxuXG5yZW5kZXJlci5zZXRBbmltYXRpb25Mb29wKCgpID0+IHtcbiAgY29udHJvbHMudXBkYXRlKCk7XG4gIHJlbmRlcmVyLnJlbmRlcihzY2VuZSwgY2FtZXJhKTtcbn0pOyJdLCJzb3VyY2VSb290IjoiIn0=