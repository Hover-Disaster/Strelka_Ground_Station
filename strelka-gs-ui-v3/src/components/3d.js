import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

let camera, scene;
export var renderer;
let geometry, material, mesh, controls, directionalLight, ambientLight;

function init() {
    camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(80, 0, 0);

    scene = new THREE.Scene();

    scene.rotation.set(Math.PI / 2, 0, 0);

	// Create an ambient light for overall scene brightness
	// ambientLight = new THREE.AmbientLight(0xffffff, 0.0);
	// scene.add(ambientLight);

	renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true; // Enable shadow mapping in the renderer

    const axesHelper = new THREE.AxesHelper(10); // Specify the size of the axes
    scene.add(axesHelper);

	// Create a directional light
	// directionalLight = new THREE.DirectionalLight(0xfffa000, 0);
	// directionalLight.position.set(10, -10, 10);
	// directionalLight.castShadow = true;
	// directionalLight.shadow.mapSize.width = 1024;
	// directionalLight.shadow.mapSize.height = 1024;
	// directionalLight.shadow.bias = -0.001;
	// scene.add(directionalLight);

	// Visualize the directional light with a helper
	// const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 1);
	// scene.add(directionalLightHelper);

	// Adjust shadow map settings
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const loader = new STLLoader();
    loader.load('/STLs/rocket.stl', (geo) => { 
		geometry = geo;
        material = new THREE.MeshBasicMaterial({ color: 0xFF0000 });
        mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = true; // Enable shadow casting for the mesh
        mesh.receiveShadow = true; // Enable shadow receiving for the mesh
        scene.add(mesh);
        camera.lookAt(mesh.position);

    }, undefined, (error) => {
        console.error('Error loading STL file:', error);
    });
	

    document.body.appendChild(renderer.domElement);

    // Set up animation loop
    renderer.setAnimationLoop(animation);

	controls = new OrbitControls(camera, renderer.domElement);
	controls.target.set(0, 0, 0);
	controls.rotateSpeed = 0.5;
	controls.update();
}

function animation(time) {
    const storedState = JSON.parse(localStorage.getItem('systemState'));
    // Rotate the mesh 
    if(typeof mesh !== 'undefined') {
        mesh.quaternion.w = storedState.quaternion_q1;
        mesh.quaternion.x = storedState.quaternion_q2;
        mesh.quaternion.y = storedState.quaternion_q3;
        mesh.quaternion.z = storedState.quaternion_q4;
    }
	controls.update();
    renderer.render(scene, camera);
}

// Respond to size changes
function resize() {
    if(typeof renderer !== 'undefined') {
        const container = renderer.domElement.parentNode;

        if (container) {
            const width = container.offsetWidth;
            const height = container.offsetHeight;
    
            renderer.setSize(width, height);
    
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
        }
    }
}

window.addEventListener('resize', resize);


// Expose a function to interact with react.js
export function mount(container) {
    init();
    if (container) {
        container.appendChild(renderer.domElement);
      resize();
    } else {
      if (renderer) {
        renderer.domElement.remove();
        renderer.dispose();
      }
    }
  }
  
