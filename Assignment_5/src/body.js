import * as THREE from 'three';
const G = 6.6743 * Math.pow(10, -11);

class Body {
    constructor(scene, size, color, lighting=false) {
        this.position = [0, 0, 0];
        this.parent;
        this.velocity = [0, 0, 0];
        this.last_grav = new THREE.Vector3(0, 0, 0);


        const Geo = new THREE.SphereGeometry( size, 32, 16); 
        let Mat;
        if (lighting) {
            Mat = new THREE.MeshPhongMaterial( { color: color } );
        } else {
            Mat = new THREE.MeshBasicMaterial( { color: color } );
        }
        this.sphere = new THREE.Mesh( Geo, Mat );
        this.sphere.position.set( 0, 0, 0 );
        scene.add(this.sphere);
    }

    set_pos(x, y, z) {
        this.sphere.position.set( x, y, z );
    }

    orbit(parent, distance) {
        this.parent = parent;
        this.distance = distance;

        this.parent = parent;
        this.velocity[2] += Math.sqrt((G * this.parent.mass) / this.distance);
        this.position = [
            this.parent.position[0] + distance,
            this.parent.position[1],
            this.parent.position[2],
        ];
    }

    fall(warp=1) {
        const a = new THREE.Vector3(
            this.parent.position[0] - this.position[0],
            this.parent.position[1] - this.position[1],
            this.parent.position[2] - this.position[2],
        );
        const r = Math.sqrt(
            Math.pow(a.x, 2) +
            Math.pow(a.y, 2) +
            Math.pow(a.z, 2)
        );
        a.normalize();
        a.multiplyScalar(this.parent.get_gravity(r));
        
        // const g = new THREE.Vector3(0, 0, 0).addVectors(a, this.last_grav);
        // g.multiplyScalar(0.5);
        // g.multiplyScalar(warp)
        //a.multiplyScalar(0.5);
        a.multiplyScalar(warp)

        this.last_grav = a;
        
        // const vm = Math.sqrt(
        //     Math.pow(this.velocity[0], 2) +
        //     Math.pow(this.velocity[1], 2) +
        //     Math.pow(this.velocity[2], 2) 
        // );

        this.velocity = [
            this.velocity[0] + a.x,
            this.velocity[1] + a.y,
            this.velocity[2] + a.z,
        ];

        this.position = [
            this.position[0] + this.velocity[0]*warp,
            this.position[1] + this.velocity[1]*warp,
            this.position[2] + this.velocity[2]*warp,
        ];

        this.set_pos(this.position[0], this.position[1], this.position[2]);
        //console.log(this.position);
    }
}


export default Body;
