var renderer	= new THREE.WebGLRenderer({
	antialias	: true
});
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var onRenderFcts= [];
var scene	= new THREE.Scene();
var camera	= new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 1000);
camera.position.z = 10; 


// lighting
(function(){
	// add a ambient light
	var light	= new THREE.AmbientLight( 0x202020 )
	scene.add( light )
	// add a light in front
	var light	= new THREE.DirectionalLight('white', 5)
	light.position.set(0.5, 0.0, 2)
	scene.add( light )
	// add a light behind
	var light	= new THREE.DirectionalLight('white', 0.75*2)
	light.position.set(-0.5, -0.5, -2)
	scene.add( light )		
})();


// add object and move
var heightMap	= THREEx.Terrain.allocateHeightMap(128,128)
// var heightMap	= THREEx.Terrain.allocateHeightMap(64,64)
// var heightMap	= THREEx.Terrain.allocateHeightMap(4, 4)
// var heightMap	= THREEx.Terrain.allocateHeightMap(16,16)

THREEx.Terrain.simplexHeightMap(heightMap)

var geometry	= THREEx.Terrain.heightMapToPlaneGeometry(heightMap)

THREEx.Terrain.heightMapToVertexColor(heightMap, geometry)


//var material	= new THREE.Mesheaterial({});
var material = new THREE.MeshNormalMaterial( { color: 0x00ff00 } );

/*
var material	= new THREE.MeshPhongMaterial({
	shading		: THREE.FlatShading,
	vertexColors 	: THREE.VertexColors,
});
*/

// var material	= new THREE.MeshNormalMaterial({
// 	shading		: THREE.SmoothShading,
// })
var mesh	= new THREE.Mesh( geometry, material );
scene.add( mesh );
mesh.lookAt(new THREE.Vector3(0,1,0))
mesh.scale.y	= 2
mesh.scale.x	= 2
mesh.scale.z	= 0.2
mesh.scale.multiplyScalar(10) 


onRenderFcts.push(function(delta, now){
	//mesh.rotation.z += 0.2 * delta;
	// mesh.rotation.y += 2 * delta;		
})


// camera Controls
var mouse	= {x : 0, y : 0}
document.addEventListener('mousemove', function(event){
	mouse.x	= (event.clientX / window.innerWidth ) - 0.5
	mouse.y	= (event.clientY / window.innerHeight) - 0.5
}, false)
onRenderFcts.push(function(delta, now){
	camera.position.x += (mouse.x*5 - camera.position.x) * (delta*3)
	camera.position.y += (mouse.y*5 - (camera.position.y-2)) * (delta*3)
	camera.lookAt( scene.position )
})


// render scene
onRenderFcts.push(function(){
	renderer.render( scene, camera );		
})

// render loop
var lastTimeMsec= null
requestAnimationFrame(function animate(nowMsec){
	// keep looping
	requestAnimationFrame( animate );
	// measure time
	lastTimeMsec	= lastTimeMsec || nowMsec-1000/60
	var deltaMsec	= Math.min(200, nowMsec - lastTimeMsec)
	lastTimeMsec	= nowMsec
	// call each update function
	onRenderFcts.forEach(function(onRenderFct){
		onRenderFct(deltaMsec/1000, nowMsec/1000)
	})
})

