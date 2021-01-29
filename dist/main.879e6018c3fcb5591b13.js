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



const tool = {ORBIT: 0, BUILD: 1}
var mode = tool.ORBIT

var scene = new three__WEBPACK_IMPORTED_MODULE_0__.Scene();

//and god said...
const light = new three__WEBPACK_IMPORTED_MODULE_0__.AmbientLight( 0x404040 ); // soft white light
scene.add( light );

const point = new three__WEBPACK_IMPORTED_MODULE_0__.PointLight( 0xff0000, 1, 100 );
point.position.set( 10, 10, 10 );
scene.add( point );

var camera = new three__WEBPACK_IMPORTED_MODULE_0__.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 1000 );

var renderer = new three__WEBPACK_IMPORTED_MODULE_0__.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var raycaster = new three__WEBPACK_IMPORTED_MODULE_0__.Raycaster();
var mouse = new three__WEBPACK_IMPORTED_MODULE_0__.Vector2();

//make covering plane for use later.
var firstSquareGeo = new three__WEBPACK_IMPORTED_MODULE_0__.BoxBufferGeometry(10,10,10);
var firstSquareMat = new three__WEBPACK_IMPORTED_MODULE_0__.MeshLambertMaterial( {color: 0xffffff, opacity: 1.0, transparent: false} );
var firstSquare = new three__WEBPACK_IMPORTED_MODULE_0__.Mesh( firstSquareGeo, firstSquareMat);

scene.add( firstSquare );

renderer.render(scene, camera)

//center camera
var centerx = 0;
var centery = 0;
camera.position.x = centerx;
camera.position.y = centery;

//controls
var controls = new three_examples_jsm_controls_OrbitControls__WEBPACK_IMPORTED_MODULE_1__.OrbitControls( camera, renderer.domElement );
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


function onMouseClick( event ) {
  console.log(event)

  if(mode == tool.BUILD){
    // update the picking ray with the camera and mouse position
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    
    raycaster.setFromCamera( mouse, camera );

    // calculate objects intersecting the picking ray
    const intersects = raycaster.intersectObjects( scene.children );

    console.log(intersects)
  }

  if(mode == tool.ORBIT){

  }
}

function onWindowResize(){

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

function onKeyUp(e){
  if(e.key == "o"){
    mode = tool.ORBIT
  }

  if(e.key == "b"){
    mode = tool.BUILD
  }
}

window.addEventListener( 'click', onMouseClick, false );
window.addEventListener( 'resize', onWindowResize, false );
window.addEventListener( 'keyup', onKeyUp, false);

renderer.setAnimationLoop(() => {
  controls.update();
  renderer.render(scene, camera);
});

/***/ })

},
0,[[138,"runtime","npm.three"]]]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9ub29vZGxlLy4vc3JjL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUErQjtBQUN5Qzs7QUFFeEUsY0FBYztBQUNkOztBQUVBLGdCQUFnQix3Q0FBVzs7QUFFM0I7QUFDQSxrQkFBa0IsK0NBQWtCLGFBQWE7QUFDakQ7O0FBRUEsa0JBQWtCLDZDQUFnQjtBQUNsQztBQUNBOztBQUVBLGlCQUFpQixvREFBdUI7O0FBRXhDLG1CQUFtQixnREFBbUI7QUFDdEM7QUFDQTs7QUFFQSxvQkFBb0IsNENBQWU7QUFDbkMsZ0JBQWdCLDBDQUFhOztBQUU3QjtBQUNBLHlCQUF5QixvREFBdUI7QUFDaEQseUJBQXlCLHNEQUF5QixHQUFHLGtEQUFrRDtBQUN2RyxzQkFBc0IsdUNBQVU7O0FBRWhDOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxtQkFBbUIsb0ZBQWE7QUFDaEMsOEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxDQUFDOzs7QUFHRDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLENBQUMsRSIsImZpbGUiOiJtYWluLjg3OWU2MDE4YzNmY2I1NTkxYjEzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgVEhSRUUgZnJvbSAndGhyZWUnO1xuaW1wb3J0IHtPcmJpdENvbnRyb2xzfSBmcm9tIFwidGhyZWUvZXhhbXBsZXMvanNtL2NvbnRyb2xzL09yYml0Q29udHJvbHNcIjtcblxuY29uc3QgdG9vbCA9IHtPUkJJVDogMCwgQlVJTEQ6IDF9XG52YXIgbW9kZSA9IHRvb2wuT1JCSVRcblxudmFyIHNjZW5lID0gbmV3IFRIUkVFLlNjZW5lKCk7XG5cbi8vYW5kIGdvZCBzYWlkLi4uXG5jb25zdCBsaWdodCA9IG5ldyBUSFJFRS5BbWJpZW50TGlnaHQoIDB4NDA0MDQwICk7IC8vIHNvZnQgd2hpdGUgbGlnaHRcbnNjZW5lLmFkZCggbGlnaHQgKTtcblxuY29uc3QgcG9pbnQgPSBuZXcgVEhSRUUuUG9pbnRMaWdodCggMHhmZjAwMDAsIDEsIDEwMCApO1xucG9pbnQucG9zaXRpb24uc2V0KCAxMCwgMTAsIDEwICk7XG5zY2VuZS5hZGQoIHBvaW50ICk7XG5cbnZhciBjYW1lcmEgPSBuZXcgVEhSRUUuUGVyc3BlY3RpdmVDYW1lcmEoIDYwLCB3aW5kb3cuaW5uZXJXaWR0aCAvIHdpbmRvdy5pbm5lckhlaWdodCwgMSwgMTAwMCApO1xuXG52YXIgcmVuZGVyZXIgPSBuZXcgVEhSRUUuV2ViR0xSZW5kZXJlcigpO1xucmVuZGVyZXIuc2V0U2l6ZSggd2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodCApO1xuZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCggcmVuZGVyZXIuZG9tRWxlbWVudCApO1xuXG52YXIgcmF5Y2FzdGVyID0gbmV3IFRIUkVFLlJheWNhc3RlcigpO1xudmFyIG1vdXNlID0gbmV3IFRIUkVFLlZlY3RvcjIoKTtcblxuLy9tYWtlIGNvdmVyaW5nIHBsYW5lIGZvciB1c2UgbGF0ZXIuXG52YXIgZmlyc3RTcXVhcmVHZW8gPSBuZXcgVEhSRUUuQm94QnVmZmVyR2VvbWV0cnkoMTAsMTAsMTApO1xudmFyIGZpcnN0U3F1YXJlTWF0ID0gbmV3IFRIUkVFLk1lc2hMYW1iZXJ0TWF0ZXJpYWwoIHtjb2xvcjogMHhmZmZmZmYsIG9wYWNpdHk6IDEuMCwgdHJhbnNwYXJlbnQ6IGZhbHNlfSApO1xudmFyIGZpcnN0U3F1YXJlID0gbmV3IFRIUkVFLk1lc2goIGZpcnN0U3F1YXJlR2VvLCBmaXJzdFNxdWFyZU1hdCk7XG5cbnNjZW5lLmFkZCggZmlyc3RTcXVhcmUgKTtcblxucmVuZGVyZXIucmVuZGVyKHNjZW5lLCBjYW1lcmEpXG5cbi8vY2VudGVyIGNhbWVyYVxudmFyIGNlbnRlcnggPSAwO1xudmFyIGNlbnRlcnkgPSAwO1xuY2FtZXJhLnBvc2l0aW9uLnggPSBjZW50ZXJ4O1xuY2FtZXJhLnBvc2l0aW9uLnkgPSBjZW50ZXJ5O1xuXG4vL2NvbnRyb2xzXG52YXIgY29udHJvbHMgPSBuZXcgT3JiaXRDb250cm9scyggY2FtZXJhLCByZW5kZXJlci5kb21FbGVtZW50ICk7XG5jb250cm9scy5lbmFibGVEYW1waW5nID0gdHJ1ZTsgXG5jb250cm9scy5kYW1waW5nRmFjdG9yID0gMC4wNTtcbmNvbnRyb2xzLnNjcmVlblNwYWNlUGFubmluZyA9IGZhbHNlO1xuY29udHJvbHMubWluRGlzdGFuY2UgPSAxMDA7XG5jb250cm9scy5tYXhEaXN0YW5jZSA9IDUwMDtcbmNvbnRyb2xzLm1heFBvbGFyQW5nbGUgPSBNYXRoLlBJIC8gMjtcblxucmVuZGVyZXIucmVuZGVyKHNjZW5lLCBjYW1lcmEpXG5cbi8vbGlzdGVuIHRvIHNjcm9sbCB3aGVlbFxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJ3aGVlbFwiLCBmdW5jdGlvbihlKSB7XG4gIC8vY2FtZXJhLnBvc2l0aW9uLnogKz0gLTEgKiAoZS5kZWx0YVkgLyAyMCk7XG4gIFxuICAvL3RoaXMgc2VlbXMgYSBsaXR0bGUgc21vb3RoZXIuLi5cbiAgXG4gIGlmKGUuZGVsdGFZIDwgMCl7XG4gICAgaWYoY2FtZXJhLnBvc2l0aW9uLnogPCAxMDApe1xuICAgICAgY2FtZXJhLnBvc2l0aW9uLnorKztcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgaWYoY2FtZXJhLnBvc2l0aW9uLnogPiAyKXtcbiAgICAgIGNhbWVyYS5wb3NpdGlvbi56LS07XG4gICAgfVxuICB9XG5cbn0sIHRydWUpO1xuXG5cbmZ1bmN0aW9uIG9uTW91c2VDbGljayggZXZlbnQgKSB7XG4gIGNvbnNvbGUubG9nKGV2ZW50KVxuXG4gIGlmKG1vZGUgPT0gdG9vbC5CVUlMRCl7XG4gICAgLy8gdXBkYXRlIHRoZSBwaWNraW5nIHJheSB3aXRoIHRoZSBjYW1lcmEgYW5kIG1vdXNlIHBvc2l0aW9uXG4gICAgbW91c2UueCA9ICggZXZlbnQuY2xpZW50WCAvIHdpbmRvdy5pbm5lcldpZHRoICkgKiAyIC0gMTtcbiAgICBtb3VzZS55ID0gLSAoIGV2ZW50LmNsaWVudFkgLyB3aW5kb3cuaW5uZXJIZWlnaHQgKSAqIDIgKyAxO1xuICAgIFxuICAgIHJheWNhc3Rlci5zZXRGcm9tQ2FtZXJhKCBtb3VzZSwgY2FtZXJhICk7XG5cbiAgICAvLyBjYWxjdWxhdGUgb2JqZWN0cyBpbnRlcnNlY3RpbmcgdGhlIHBpY2tpbmcgcmF5XG4gICAgY29uc3QgaW50ZXJzZWN0cyA9IHJheWNhc3Rlci5pbnRlcnNlY3RPYmplY3RzKCBzY2VuZS5jaGlsZHJlbiApO1xuXG4gICAgY29uc29sZS5sb2coaW50ZXJzZWN0cylcbiAgfVxuXG4gIGlmKG1vZGUgPT0gdG9vbC5PUkJJVCl7XG5cbiAgfVxufVxuXG5mdW5jdGlvbiBvbldpbmRvd1Jlc2l6ZSgpe1xuXG4gICAgY2FtZXJhLmFzcGVjdCA9IHdpbmRvdy5pbm5lcldpZHRoIC8gd2luZG93LmlubmVySGVpZ2h0O1xuICAgIGNhbWVyYS51cGRhdGVQcm9qZWN0aW9uTWF0cml4KCk7XG5cbiAgICByZW5kZXJlci5zZXRTaXplKCB3aW5kb3cuaW5uZXJXaWR0aCwgd2luZG93LmlubmVySGVpZ2h0ICk7XG5cbn1cblxuZnVuY3Rpb24gb25LZXlVcChlKXtcbiAgaWYoZS5rZXkgPT0gXCJvXCIpe1xuICAgIG1vZGUgPSB0b29sLk9SQklUXG4gIH1cblxuICBpZihlLmtleSA9PSBcImJcIil7XG4gICAgbW9kZSA9IHRvb2wuQlVJTERcbiAgfVxufVxuXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciggJ2NsaWNrJywgb25Nb3VzZUNsaWNrLCBmYWxzZSApO1xud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoICdyZXNpemUnLCBvbldpbmRvd1Jlc2l6ZSwgZmFsc2UgKTtcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCAna2V5dXAnLCBvbktleVVwLCBmYWxzZSk7XG5cbnJlbmRlcmVyLnNldEFuaW1hdGlvbkxvb3AoKCkgPT4ge1xuICBjb250cm9scy51cGRhdGUoKTtcbiAgcmVuZGVyZXIucmVuZGVyKHNjZW5lLCBjYW1lcmEpO1xufSk7Il0sInNvdXJjZVJvb3QiOiIifQ==