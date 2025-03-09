import * as THREE from 'three';
const G = 6.6743 * Math.pow(10, -11);

class Planet {
    constructor(scene, size, color, lighting=true) {
        this.orbit_pos = 0;
        this.distance = 0;
        this.position = [0, 0, 0];
        this.tan_velocity = 0;
        this.mass = 0;
        this.parent;
        this.children = [];
        this.influ = 0;

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

    get_gravity(r) {
        return G * (this.mass / Math.pow(r, 2));
    }

    orbit(parent, distance) {
        this.parent = parent;
        this.parent.children.push(this);
        this.distance = distance;

        this.parent_mass = parent.mass;
        this.tan_velocity = Math.sqrt((G * this.parent_mass) / this.distance);
    }

    set_pos(x, y, z) {
        this.sphere.position.set( x, y, z );
        this.position = [x, y, z];
    }

    orbit_tick(warp=1) { // divide by distance?
        this.orbit_pos += (this.tan_velocity*warp) / this.distance;
        this.set_pos(
            this.distance * Math.cos(this.orbit_pos),
            0, 
            this.distance * Math.sin(this.orbit_pos),
        );
    }
    

}

export default Planet;