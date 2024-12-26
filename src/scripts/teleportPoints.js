import * as THREE from "three";

class TeleportPoints {
    constructor(scene, teleportUrl) {
        this.scene = scene;
        this.teleportPoints = [];
        this.init(teleportUrl);
    }

    async fetchTeleportPoints(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Failed to fetch teleport points:", error);
            return [];
        }
    }

    async init(teleportUrl) {
        const teleportData = await this.fetchTeleportPoints(teleportUrl);
        teleportData.forEach((point) => {
            console.log(point);
            const geometry = new THREE.RingGeometry(1, 1.5, 32);
            const material = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
            const ring = new THREE.Mesh(geometry, material);

            // Position the ring using data from the JSON
            ring.userData = {name: point.name};
            ring.position.set(point.position.x, point.position.y, point.position.z);
            ring.rotation.x = -Math.PI / 2; // Face upwards
            this.scene.add(ring);

            this.teleportPoints.push(ring);
        });
    }

    addToScene() {
        this.teleportPoints.forEach((point) => {
            if (!this.scene.children.includes(point)) {
                this.scene.add(point);
            }
        });
        console.log("Teleport points added to scene");
    }

    removeFromScene() {
        this.teleportPoints.forEach((point) => {
            if (this.scene.children.includes(point)) {
                this.scene.remove(point);
            }
        });
        console.log("Teleport points removed from scene");
    }
}

export default TeleportPoints;
