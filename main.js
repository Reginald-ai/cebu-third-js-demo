import boostrap from "./node_modules/bootstrap/dist/css/bootstrap.min.css";
// console.log(boostrap);
import * as THREE from "three";
import { gsap } from "gsap";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
//gui npm
import * as dat from "dat.gui";

const gui = new dat.GUI();
const world = {
  plane: {
    width: 400,
    height: 400,
    widthSegments: 50,
    heightSegments: 50,
  },
};
// gui.add();
gui.add(world.plane, "height", 1, 1000).onChange(generatePlane);
gui.add(world.plane, "width", 1, 1000).onChange(generatePlane);
gui.add(world.plane, "widthSegments", 1, 100).onChange(generatePlane);
gui.add(world.plane, "heightSegments", 1, 100).onChange(generatePlane);

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

    vertices[i] = x + (Math.random() - 0.5);
    vertices[i + 1] = y + (Math.random() - 0.5);
    vertices[i + 2] = z + Math.random();
  }
  const colors = [];
  for (let i = 0; i < planeMesh.geometry.attributes.position.count; i++) {
    colors.push(0, 0.3, 0.5);
  }
  planeMesh.geometry.setAttribute(
    "color",
    new THREE.BufferAttribute(new Float32Array(colors), 3)
  );
  for (let i = 0; i < vertices.length; i++) {
    if (i % 3 === 0) {
      const x = vertices[i];
      const y = vertices[i + 1];
      const z = vertices[i + 2];

      vertices[i] = x + (Math.random() - 0.5) * 3;
      vertices[i + 1] = y + (Math.random() - 0.5) * 3;
      vertices[i + 2] = z + (Math.random() - 0.5) * 3;
    }

    randomValues.push(Math.random() * Math.PI * 2);
  }

  planeMesh.geometry.attributes.position.randomValues = randomValues;

  planeMesh.geometry.attributes.position.originalPosition =
    planeMesh.geometry.attributes.position.array;
}
//gui--end
const raycaster = new THREE.Raycaster();
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

const PlaneGeometry = new THREE.PlaneGeometry(
  world.plane.width,
  world.plane.height,
  world.plane.widthSegments,
  world.plane.heightSegments
);
const PlaneMaterial = new THREE.MeshPhongMaterial({
  // color: 0x03045e,
  side: THREE.DoubleSide,
  flatShading: THREE.FlatShading,
  vertexColors: true,
});
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, -1, 1);

const backlight = new THREE.DirectionalLight(0xffffff, 1);
backlight.position.set(0, 0, -1);

const planeMesh = new THREE.Mesh(PlaneGeometry, PlaneMaterial);

const randomValues = [];
const vertices = planeMesh.geometry.attributes.position.array;
for (let i = 0; i < vertices.length; i++) {
  if (i % 3 === 0) {
    const x = vertices[i];
    const y = vertices[i + 1];
    const z = vertices[i + 2];

    vertices[i] = x + (Math.random() - 0.5) * 3;
    vertices[i + 1] = y + (Math.random() - 0.5) * 3;
    vertices[i + 2] = z + (Math.random() - 0.5) * 3;
  }

  randomValues.push(Math.random() - 0.5);
}

planeMesh.geometry.attributes.position.randomValues = randomValues;

planeMesh.geometry.attributes.position.originalPosition =
  planeMesh.geometry.attributes.position.array;
const colors = [];

for (let i = 0; i < planeMesh.geometry.attributes.position.count; i++) {
  colors.push(0, 0.3, 0.5);
}
planeMesh.geometry.setAttribute(
  "color",
  new THREE.BufferAttribute(new Float32Array(colors), 3)
);

scene.add(light);
scene.add(backlight);
scene.add(planeMesh);
camera.position.z = 50;

//animate
const mouse = {
  x: undefined,
  y: undefined,
};

let frame = 0;
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  // planeMesh.rotation.x += 0.01;
  // planeMesh.rotation.y += 0.01;

  raycaster.setFromCamera(mouse, camera);
  frame += 0.01;

  const { array, originalPosition, randomValues } =
    planeMesh.geometry.attributes.position;
  for (let i = 0; i < array.length; i += 3) {
    array[i] = originalPosition[i] + Math.cos(frame + randomValues[i]) * 0.01;

    array[i + 1] =
      originalPosition[i + 1] + Math.sin(frame + randomValues[i + 1]) * 0.01;
  }

  planeMesh.geometry.attributes.position.needsUpdate = true;

  const intersects = raycaster.intersectObject(planeMesh);
  if (intersects.length > 0) {
    const color = intersects[0].object.geometry.attributes.color;

    color.setX(intersects[0].face.a, [0.1]);
    color.setY(intersects[0].face.a, [0.5]);
    color.setZ(intersects[0].face.a, [1]);

    color.setX(intersects[0].face.b, [0.1]);
    color.setY(intersects[0].face.b, [0.5]);
    color.setZ(intersects[0].face.b, [1]);

    color.setX(intersects[0].face.c, [0.1]);
    color.setY(intersects[0].face.c, [0.5]);
    color.setZ(intersects[0].face.c, [1]);

    intersects[0].object.geometry.attributes.color.needsUpdate = true;

    const initialColor = {
      r: 0,
      g: 0.3,
      b: 0.5,
    };
    const hoverColor = {
      r: 0,
      g: 0.5,
      b: 1,
    };
    gsap.to(hoverColor, {
      r: initialColor.r,
      g: initialColor.g,
      b: initialColor.b,
      duration: 1,
      onUpdate: () => {
        color.setX(intersects[0].face.a, hoverColor.r);
        color.setY(intersects[0].face.a, hoverColor.g);
        color.setZ(intersects[0].face.a, hoverColor.b);

        color.setX(intersects[0].face.b, hoverColor.r);
        color.setY(intersects[0].face.b, hoverColor.g);
        color.setZ(intersects[0].face.b, hoverColor.b);

        color.setX(intersects[0].face.c, hoverColor.r);
        color.setY(intersects[0].face.c, hoverColor.g);
        color.setZ(intersects[0].face.c, hoverColor.b);
        color.needsUpdate = true;
      },
    });
  }
}
animate();
//--boxGeometry--end---

addEventListener("mousemove", (event) => {
  mouse.x = (event.clientX / innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / innerHeight) * 2 + 1;
});
