import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';

class STLViewer {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.controls = null;
        this.currentModel = null;
        this.init();
    }

    init() {
        // Setup renderer
        this.renderer.setSize(document.getElementById('viewer').clientWidth, document.getElementById('viewer').clientHeight);
        this.renderer.setClearColor(0xf5f5f5);
        document.getElementById('viewer').appendChild(this.renderer.domElement);

        // Setup camera
        this.camera.position.z = 100;

        // Setup controls
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;

        // Add lights
        const ambientLight = new THREE.AmbientLight(0x404040);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(1, 1, 1);
        this.scene.add(ambientLight, directionalLight);

        // Add grid helper
        const gridHelper = new THREE.GridHelper(100, 20);
        this.scene.add(gridHelper);

        // Setup event listeners
        window.addEventListener('resize', () => this.onWindowResize());
        this.setupFileHandlers();

        // Start animation loop
        this.animate();
    }

    setupFileHandlers() {
        const dropZone = document.getElementById('dropZone');
        const fileInput = document.getElementById('fileInput');

        // Drag and drop handlers
        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('dragover');
        });

        dropZone.addEventListener('dragleave', () => {
            dropZone.classList.remove('dragover');
        });

        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('dragover');
            const file = e.dataTransfer.files[0];
            if (file && file.name.toLowerCase().endsWith('.stl')) {
                this.loadSTL(file);
            }
        });

        // File input handler
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                this.loadSTL(file);
            }
        });

        // Click to upload
        dropZone.addEventListener('click', () => {
            fileInput.click();
        });

        // Reset camera button
        document.getElementById('resetCamera').addEventListener('click', () => {
            this.resetCamera();
        });
    }

    loadSTL(file) {
        const loader = new STLLoader();
        const reader = new FileReader();

        reader.onload = (e) => {
            const geometry = loader.parse(e.target.result);
            
            // Remove previous model if exists
            if (this.currentModel) {
                this.scene.remove(this.currentModel);
            }

            // Create new mesh
            const material = new THREE.MeshPhongMaterial({
                color: 0x3498db,
                specular: 0x111111,
                shininess: 30
            });
            this.currentModel = new THREE.Mesh(geometry, material);

            // Center the model
            geometry.computeBoundingBox();
            const center = geometry.boundingBox.getCenter(new THREE.Vector3());
            this.currentModel.position.set(-center.x, -center.y, -center.z);

            // Add to scene
            this.scene.add(this.currentModel);

            // Update info
            document.getElementById('fileName').textContent = file.name;
            document.getElementById('vertexCount').textContent = geometry.attributes.position.count;
            document.getElementById('faceCount').textContent = geometry.attributes.position.count / 3;

            // Reset camera to fit model
            this.resetCamera();
        };

        reader.readAsArrayBuffer(file);
    }

    resetCamera() {
        if (this.currentModel) {
            const box = new THREE.Box3().setFromObject(this.currentModel);
            const center = box.getCenter(new THREE.Vector3());
            const size = box.getSize(new THREE.Vector3());
            
            const maxDim = Math.max(size.x, size.y, size.z);
            const fov = this.camera.fov * (Math.PI / 180);
            let cameraZ = Math.abs(maxDim / Math.sin(fov / 2));
            
            this.camera.position.set(center.x, center.y, center.z + cameraZ * 1.5);
            this.camera.lookAt(center);
            
            this.controls.target.copy(center);
            this.controls.update();
        } else {
            this.camera.position.set(0, 0, 100);
            this.camera.lookAt(0, 0, 0);
            this.controls.target.set(0, 0, 0);
            this.controls.update();
        }
    }

    onWindowResize() {
        const container = document.getElementById('viewer');
        this.camera.aspect = container.clientWidth / container.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(container.clientWidth, container.clientHeight);
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize the viewer when the page loads
window.addEventListener('DOMContentLoaded', () => {
    new STLViewer();
}); 