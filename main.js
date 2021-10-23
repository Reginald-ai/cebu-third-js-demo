import * as THREE from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
//gui npm
import * as dat from "dat.gui";

const gui = new dat.GUI();
const world = {
  plane: {
    width: 5,
    height: 5,
    widthSegments: 10,
    heightSegments: 10,
  },
};
// gui.add();
gui.add(world.plane, "height", 1, 20).onChange(generatePlane);
gui.add(world.plane, "width", 1, 20).onChange(generatePlane);
gui.add(world.plane, "widthSegments", 1, 10).onChange(generatePlane);
gui.add(world.plane, "heightSegments", 1, 10).onChange(generatePlane);

function generatePlane() {
  planeMesh.geometry.dispose();
  planeMesh.geometry = new THREE.PlaneGeometry(
    world.plane.width,
    world.plane.height,
    world.plane.widthSegments,
    world.plane.heightSegments
  );
  const vertices = planeMesh.geometry.attributes.position.array;
  for (let i = 0; i < vertices.length; i += 3) {
    const x = vertices[i];
    const y = vertices[i + 1];
    const z = vertices[i + 2];

    vertices[i + 2] = z + Math.random();
  }
}
//gui--end

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  innerWidth / innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer();
//---renderer---styles---

renderer.setPixelRatio(devicePixelRatio);
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);
document.body.style.margin = "0px";

new OrbitControls(camera, renderer.domElement);
//---renderer---end---

//--boxGeometry--start---

const PlaneGeometry = new THREE.PlaneGeometry(5, 5, 10, 10);
const PlaneMaterial = new THREE.MeshPhongMaterial({
  color: 0x03045e,
  side: THREE.DoubleSide,
  flatShading: THREE.FlatShading,
});
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 0, 1);

const backlight = new THREE.DirectionalLight(0xffffff, 1);
backlight.position.set(0, 0, -1);

const planeMesh = new THREE.Mesh(PlaneGeometry, PlaneMaterial);

const vertices = planeMesh.geometry.attributes.position.array;
for (let i = 0; i < vertices.length; i += 3) {
  const x = vertices[i];
  const y = vertices[i + 1];
  const z = vertices[i + 2];

  vertices[i + 2] = z + Math.random();
  //   console.log(x);
}
scene.add(light);
scene.add(backlight);
scene.add(planeMesh);
camera.position.z = 5;

//animate

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  // planeMesh.rotation.x += 0.01;
  // planeMesh.rotation.y += 0.01;
}
animate();
//--boxGeometry--end---

// console.log(plane.geometry.attributes.position.array);

const mouse = {
  x: undefined,
  y: undefined,
};

addEventListener("mousemove", (event) => {
  mouse.x = (event.clientX / innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / innerHeight) * 2 + 1;
  console.log(mouse);
});
