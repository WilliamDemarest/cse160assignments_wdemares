import * as THREE from 'three';
const G = 6.6743 * Math.pow(10, -11);

class Planet {
    constructor(scene, size, color, lighting=true, texture=false, is_ring=false) {
        this.orbit_pos = 0;
        this.distance = 0;
        this.position = new THREE.Vector3(0, 0, 0);
        this.velocity = new THREE.Vector3(0, 0, 0);
        this.mass = 0;
        this.parent;
        this.children = [];
        this.children_obj = [];
        this.influ = 0;
        this.old_parent_pos = new THREE.Vector3(0, 0, 0);
        let Geo;
        if (is_ring) {
            Geo = new THREE.DodecahedronGeometry( size, 0 );
        } else {
            Geo = new THREE.SphereGeometry( size, 32, 16); 
        }
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
        //this.old_parent_pos = this.parent.position;
        this.velocity.z = Math.sqrt((G * this.parent_mass) / this.distance);
    }

    set_pos(x, y, z) {
        this.sphere.position.set( x, y, z );
    }

    orbit_tick(warp=1) { // divide by distance?
        if (!this.parent) {
            return;
        }
        this.orbit_pos += (this.velocity.z*warp) / this.distance;
        this.position.set(
            this.distance * Math.cos(this.orbit_pos),
            0, 
            this.distance * Math.sin(this.orbit_pos),
        );
        this.position.add(this.parent.position);
        this.set_pos(this.position.x, this.position.y, this.position.z);

        // for(let i = 0; i < this.children_obj.length(); i += 1) {
        //     this.children_obj[i].position.x += 
        // }
    }

    system_tick(warp=1) {
        this.orbit_tick(warp);

        for (let i = 0; i < this.children.length; i += 1) {
            this.children[i].system_tick(warp);
        }
    }

    add_rings(scene, r1, r2, p_size, p_count, p_color) {
        const width = r2 - r1;
        for (let i = 0; i < p_count; i += 1) {
            const particle = new Planet(scene, p_size, p_color, true, false, true);
            particle.orbit(this, (Math.random() * width)+r1);
            particle.orbit_pos = Math.random() * 2 * Math.PI;
            //this.children.push(particle);
        }
    }
    

}



export default Planet;