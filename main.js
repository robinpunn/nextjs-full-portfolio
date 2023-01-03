import './style.css'
import * as THREE from 'three'
/* orbit controls allow us to move around the scene with the mouse */
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { SphereGeometry } from 'three'


/* always need three objects: scene, camera, and renderer
  scene is a container that holds all objects, cameras, and lights
*/
const scene = new THREE.Scene()

/*
  need camera to view scene
  first argument: aspect ratio
  second argument: field of view ( based of user's browser window)
  third and fourth argument: view frustrum (control which objects are visible relative to camera)
*/
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1,1000)

/* renderer renders out actual graphics to scene */
const renderer = new THREE.WebGL1Renderer({
  canvas: document.querySelector('#bg'),
})

renderer.setPixelRatio( window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight)
camera.position.setZ(30)

renderer.render( scene, camera )

/* three basic steps when creating an object
  1) geometry ( a set of vectors that define the object)
  2) material (the wrapping of an object)
  3) mesh (geometry + material)
*/

//SPACE

const geometry = new THREE.TorusGeometry(10, 3, 16, 100)

/* MeshBasicMaterial doesn't require a light source*/
const material = new THREE.MeshStandardMaterial({color: 0xFF6347})

const torus = new THREE.Mesh( geometry, material )

/* add the object to the scene */
scene.add(torus)

/* pointLight emits light in all directions */
const pointLight = new THREE.PointLight(0xffffff)
pointLight.position.set(5,5,5)
/* ambient light is like a floodlight */
const ambientLight = new THREE.AmbientLight(0xffffff)
scene.add(pointLight,ambientLight)
/* helper, this one shows positon of pointlight */
const lightHelper = new THREE.PointLightHelper(pointLight)
/* draws 2 dimensional grid across the scene*/
const gridHelper = new THREE.GridHelper(200,50)
scene.add(lightHelper,gridHelper)

/* don't forget to add the things you create to the scene, including light */
scene.add(pointLight)

/* instantiate orbitcontrols... camera+domElements args update camera postion based on mouse */
const controls = new OrbitControls(camera, renderer.domElement)

/* helper function to add objects */
function addStar() {
  const geometry = new THREE.SphereGeometry(0.25,24,24)
  const material = new THREE.MeshStandardMaterial({color: 0xffffff})
  const star = new THREE.Mesh( geometry, material )

  /* random position value for each star, using threejs random float spread function */
  const [x,y,z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread( 100 ))

  star.position.set(x,y,z)
  scene.add(star)
}

/* populate stars creating an array */
Array(200).fill().forEach(addStar)

/* load image with threejs texture loader */
const spaceTexture = new THREE.TextureLoader().load('./images/space.png')
scene.background = spaceTexture

//AVATAR

const robinTexture = new THREE.TextureLoader().load('./images/robin.jpg')

const robin = new THREE.Mesh(
  new THREE.BoxGeometry(3,3,3),
  new THREE.MeshBasicMaterial({map:robinTexture})
)

scene.add(robin)

//SUN

const sunTexture = new THREE.TextureLoader().load('./images/sun2.png')
const normalTexture = new THREE.TextureLoader().load('./images/normal.png')

const sun = new THREE.Mesh(
  new THREE.SphereGeometry(3,32,32),
  new THREE.MeshStandardMaterial({
    map: sunTexture,
    normalMap: normalTexture
  })
)

scene.add(sun)

sun.position.z = 30
sun.position.setX(-10)


function moveCamera() {
   const t = document.body.getBoundingClientRect().top
   sun.rotation.x += 0.05
   sun.rotation.y += 0.075
   sun.rotation.z += 0.05

   robin.rotation.y += 0.01
   robin.rotation.z += 0.01

   camera.position.z = t * -0.01
   camera.position.x = t * -0.01
   camera.position.y = t * -0.01
}

// document.body.onscroll = moveCamera

/* call the same render method to actually see it... instead of calling it over and over, we can make a recusive function */
function animate () {
  requestAnimationFrame(animate)

  torus.rotation.x += 0.01
  torus.rotation.y += 0.005
  torus.rotation.z += 0.01

  controls.update()

  renderer.render( scene, camera )
}



animate()