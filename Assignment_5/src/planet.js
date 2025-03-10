import * as THREE from 'three';
const G = 6.6743 * Math.pow(10, -11);

class Planet {
    constructor(scene, size, color, lighting=true, texture=false) {
        this.orbit_pos = 0;
        this.distance = 0;
        this.position = new THREE.Vector3(0, 0, 0);
        this.velocity = new THREE.Vector3(0, 0, 0);
        this.mass = 0;
        this.parent;
        this.children = [];
        this.children_obj = [];
        this.influ = 0;

        const Geo = new THREE.SphereGeometry( size, 32, 16); 
        let Mat;
        if (texture) {
            Mat = new THREE.MeshPhongMaterial( {
                map: new THREE.TextureLoader().load(texture)
            } );
        } else if (lighting) {
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
        this.velocity.z = Math.sqrt((G * this.parent_mass) / this.distance);
    }

    set_pos(x, y, z) {
        this.sphere.position.set( x, y, z );
        this.position.set( x, y, z );
    }

    orbit_tick(warp=1) { // divide by distance?
        this.orbit_pos += (this.velocity.z*warp) / this.distance;
        this.set_pos(
            this.distance * Math.cos(this.orbit_pos),
            0, 
            this.distance * Math.sin(this.orbit_pos),
        );

        // for(let i = 0; i < this.children_obj.length(); i += 1) {
        //     this.children_obj[i].position.x += 
        // }
    }
    

}

export default Planet;