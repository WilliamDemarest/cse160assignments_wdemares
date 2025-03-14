import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';

const G = 6.6743 * Math.pow(10, -11);

class Ship {
    constructor(scene) {
        this.position = new THREE.Vector3(0, 0, 0);
        this.parent;
        this.velocity = new THREE.Vector3(0, 0, 0);
        this.camera;

        this.old_parent_pos = new THREE.Vector3(0, 0, 0);
        this.inertia = true;
        this.throttle = 10;
        this.arrow_size = 1;

        this.zoom = 1;
        // const Geo = new THREE.SphereGeometry( size, 32, 16); 
        // let Mat;
        // if (lighting) {
        //     Mat = new THREE.MeshPhongMaterial( { color: color } );
        // } else {
        //     Mat = new THREE.MeshBasicMaterial( { color: color } );
        // }
        // this.mesh = new THREE.Mesh( Geo, Mat );
        this.mesh;
        this.load(scene);
        //console.log(this.mesh)
        //this.mesh.position.set( 0, 0, 0 );
        //scene.add(this.mesh);
    }

    set_pos(x, y, z) {
        this.mesh.position.set( x, y, z );
    }

    orbit(parent, distance) {
        this.parent = parent;
        this.distance = distance;

        this.parent = parent;
        this.velocity.set( 0, 0, Math.sqrt((G * this.parent.mass) / this.distance)*-1);

        //this.velocity.add(this.parent.velocity);
        this.old_parent_pos.set(this.parent.position.x, this.parent.position.y, this.parent.position.z);

        //this.position.set(this.parent.position);
        //this.position.x -= distance;
        this.set_pos(this.parent.position.x - distance, this.parent.position.y, this.parent.position.z);
    }

    set_camera_pos() {
        if (!this.mesh) {
            return;
        }
        const forwards = new THREE.Vector3(0, 0, 1);
        const up = new THREE.Vector3(0, 1, 0);
        const left = new THREE.Vector3(1, 0, 0);
        left.applyQuaternion(this.mesh.quaternion);

        forwards.applyQuaternion(this.mesh.quaternion);
        up.applyQuaternion(this.mesh.quaternion);

        this.camera.up.set(up.x, up.y, up.z);

        this.camera.up.applyAxisAngle(forwards, 0.2617);
        forwards.applyAxisAngle(up, -0.04);
        left.multiplyScalar(-0.05);
        
        forwards.multiplyScalar(0.5*this.zoom);
        up.multiplyScalar(0.25*this.zoom);
        //const f = this.mesh.localToWorld(this.forwards);
        const f = new THREE.Vector3(0, 0, 0);
        //const f = forwards;
        f.subVectors(forwards, up);
        //TODO: add a local up vector to ship, use that to adjsut camera
        this.camera.position.set(
            this.position.x - f.x + left.x,
            this.position.y - f.y + left.y,
            this.position.z - f.z + left.z,
        );

        //up.multiplyScalar(0.25);
        this.camera.lookAt(
            this.position.x + up.x + left.x,
            this.position.y + up.y + left.y,
            this.position.z + up.z + left.z
        );
    
        //console.log(this.camera);
        this.set_pos(this.position.x, this.position.y, this.position.z);
    }

    attatch_camera(camera) {
        this.camera = camera;
        //this.camera.parent = this.mesh;
        //this.mesh.add(camera);
        //THREE.SceneUtils.attach( this.camera, scene, this.mesh );
        this.set_camera_pos();
    }

    rotate(x, y) {
        if (!this.mesh) {
            return;
        }
        // rotate camera based on ship's rotation matrix?
        //this.camera.rotateY(x*0.5);
        //this.camera.rotateX(y*0.5);
        this.mesh.rotateY(x);
        this.mesh.rotateX(y);
    }

    move(key_array) {
        if (!this.mesh) {
            return;
        }
        const speed = -0.1;
        if (this.inertia) {
            if (key_array[87]) { "W"
                const forwards = new THREE.Vector3(0, 0, 1);
                forwards.applyQuaternion(this.mesh.quaternion);
                forwards.multiplyScalar(this.throttle*0.00001);
                this.velocity.add(forwards);
                this.plumes["cones"][0].visible = true;
                this.plumes["cones"][1].visible = true;
            } else {
                this.plumes["cones"][0].visible = false;
                this.plumes["cones"][1].visible = false;
            }


        } else {
            if (key_array[87]) { "W"
                this.mesh.translateZ(speed * -1);
                //this.camera.translateZ(speed);
            } 
            if (key_array[83]) { "S"
                this.mesh.translateZ(speed);
                //this.camera.translateZ(speed * -1);
            } 
            if (key_array[65]) { "A"
                this.mesh.translateX(speed * -1);
                //this.camera.translateX(speed);
            } 
            if (key_array[68]) { "D"
                this.mesh.translateX(speed);
                //this.camera.translateX(speed * -1);
            } 
        }
        if (key_array[81]) {
            this.mesh.rotateZ(speed * 0.25);
            //this.camera.rotateZ(speed * -0.25);
        } 
        if (key_array[69]) {
            this.mesh.rotateZ(speed * -0.25);
            //this.camera.rotateZ(speed * 0.25);
        }
        this.position.set(this.mesh.position.x, this.mesh.position.y, this.mesh.position.z);

        //this.set_pos(this.position[0], this.position[1], this.position[2]);
        this.set_camera_pos();
    }

    fall(warp=1) {
        if (!this.mesh || !this.inertia) {
            return;
        }
        this.check_parent();

        const a = new THREE.Vector3(0, 0, 0);
        a.subVectors(this.parent.position, this.position);

        const r = Math.sqrt(
            Math.pow(a.x, 2) +
            Math.pow(a.y, 2) +
            Math.pow(a.z, 2)
        );
        a.normalize();
        a.multiplyScalar(this.parent.get_gravity(r));
        a.multiplyScalar(warp)        
        // const vm = Math.sqrt(
        //     Math.pow(this.velocity[0], 2) +
        //     Math.pow(this.velocity[1], 2) +
        //     Math.pow(this.velocity[2], 2) 
        // );

        this.velocity.add(a);

        this.position.sub(this.old_parent_pos);
        this.position.set(
            this.position.x + this.velocity.x*warp,
            this.position.y + this.velocity.y*warp,
            this.position.z + this.velocity.z*warp,
        );
        this.position.add(this.parent.position);
        this.old_parent_pos.set(this.parent.position.x, this.parent.position.y, this.parent.position.z);

        this.set_pos(this.position.x, this.position.y, this.position.z);

        this.v_helper.position.setX(this.position.x);
        this.v_helper.position.setY(this.position.y);
        this.v_helper.position.setZ(this.position.z);
        this.v_helper.setDirection(this.velocity.clone().normalize());
        this.v_helper.setLength(mag(this.velocity)*50*this.arrow_size);
        //console.log(this.velocity);
        //console.log(this.parent.orbit_pos);
    }

    load(scene){
        // Instantiate a loader
        const loader = new GLTFLoader();
        
        // Optional: Provide a DRACOLoader instance to decode compressed mesh data
        const dracoLoader = new DRACOLoader();
        //dracoLoader.setDecoderPath( '/examples/jsm/libs/draco/' );
        loader.setDRACOLoader( dracoLoader );
        // Load a glTF resource
        loader.load(
            // resource URL
            './sidewinder_mk_i/scene.gltf',
            // called when the resource is loaded
            function ( gltf, ) {
                gltf.scene.name = "ship";
                
                scene.add( gltf.scene );
        
                gltf.animations; // Array<THREE.AnimationClip>
                gltf.scene; // THREE.Group
                gltf.scenes; // Array<THREE.Group>
                gltf.cameras; // Array<THREE.Camera>
                gltf.asset; // Object
        
            },
            // called while loading is progressing
            function ( xhr ) {
        
                console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
                //this.mesh = model;
                //console.log(this.mesh);
        
            },
            // called when loading has errors
            function ( error ) {
        
                console.log( 'An error happened ' + error);
        
            }
        );
    }

    init_details(scene) {
        const spotLight = new THREE.SpotLight( 0xffffff, 5, 100, 0.15, 0.5);
        spotLight.target = this.mesh;
        spotLight.position.set( 0, 0, -1 );
        this.mesh.add(spotLight);

        this.v_helper = new THREE.ArrowHelper(
            this.velocity,
            this.position,
            0.2,
            0xff0000,
        );
        scene.add( this.v_helper );

        const geometry = new THREE.ConeGeometry( 1, 10, 6 ); 
        const material = new THREE.MeshBasicMaterial( {color: 0xeeff} );
        const conel = new THREE.Mesh(geometry, material ); 
        conel.position.set(-6.6, -1.4, -12);
        conel.rotateZ(0.2617);
        conel.rotateX(Math.PI / -2);
        //conel.rotateY(-0.09);
        this.mesh.add( conel );

        const coner = new THREE.Mesh(geometry, material ); 
        coner.position.set(0, 0, -12);
        coner.position.set(6.8, 2.2, -12);
        coner.rotateZ(0.2617);
        coner.rotateX(Math.PI / -2);
        //coner.rotateY(-0.2);
        this.mesh.add( coner );
        
        this.plumes = {"cones": [conel, coner]};
        //console.log(this.plumes["cones"])
    }

    check_parent() {
        let r = distance(this.position, this.parent.position)
        if (this.parent.influ < r) {
            const up = new THREE.Vector3(0, 1, 0);
            const pv = this.parent.velocity.clone();
            pv.applyAxisAngle(up, (this.parent.orbit_pos % (2 * Math.PI)*-1));
            //pv.multiplyScalar(-1);
            this.velocity.add(pv);
            //console.log(this.parent.orbit_pos);
            this.parent = this.parent.parent;
            this.old_parent_pos.set(this.parent.position.x, this.parent.position.y, this.parent.position.z);
            //r = distance(this.position, this.parent.position);
            //this.velocity.z += Math.sqrt((G * this.parent.mass) / r);

            if (this.parent) {
                this.check_parent()
            } else {
                return;
            }
        } else {
            for (let i = 0; i < this.parent.children.length; i += 1) {
                if (this.parent.children[i].influ > 0) {
                    r = distance(this.position, this.parent.children[i].position);
                    if (r < this.parent.children[i].influ) {
                        this.parent = this.parent.children[i];
                        this.old_parent_pos.set(this.parent.position.x, this.parent.position.y, this.parent.position.z);
                        
                        const up = new THREE.Vector3(0, 1, 0);
                        const pv = this.parent.velocity.clone();
                        pv.applyAxisAngle(up, (this.parent.orbit_pos % (2 * Math.PI)*-1));
                        this.velocity.sub(pv);
                        return;
                    }
                }
            }
        }
    }

    ap_and_per() {
        if (!this.mesh) {
            this.apo = 0;
            this.per = 0;
            this.alt = 0;
            return;
        }
        const rad = new THREE.Vector3(
            this.parent.position.x - this.position.x,
            this.parent.position.y - this.position.y,
            this.parent.position.z - this.position.z,
        );

        const r = mag(rad);
        this.alt = r;

        const h = new THREE.Vector3(0, 0, 0);
        h.crossVectors(rad, this.velocity);
        const u = G * this.parent.mass;

        // const e_vec = new THREE.Vector3(0, 0, 0);
        // e_vec.crossVectors(this.velocity, h);
        // e_vec.divideScalar(u)
        // e_vec.sub(rad.normalize());

        // const e = mag(e_vec);



        // norm.normalize();
        // const vt = new THREE.Vector3(0, 0, 0);
        // vt.crossVectors(rad, this.velocity);
        // rad.multiplyScalar(-1);
        // vt.crossVectors(rad, vt);
        const v = mag(this.velocity);

        const a = -((u * r) / ((r * Math.pow(v, 2)) - (2 * u)));
        //const E = -(u / (2*a));
        //const L = v; // idk about this one
        // TODO, links:
        // https://en.wikipedia.org/wiki/Orbital_eccentricity
        // https://physics.stackexchange.com/questions/72203/calculating-specific-orbital-energy-semi-major-axis-and-orbital-period-of-an-o
        // https://www.omnicalculator.com/physics/orbital-velocity
        // https://astronomy.stackexchange.com/questions/29005/calculation-of-eccentricity-of-orbit-from-velocity-and-radius
        // try last one
        const Lv = new THREE.Vector3(0, 0, 0);
        Lv.crossVectors(rad, this.velocity);
        rad.normalize();
        const ev = new THREE.Vector3(0, 0, 0);
        ev.crossVectors(this.velocity, Lv);
        ev.multiplyScalar(1 / u);
        ev.sub(rad);
        const e = mag(ev);
        //const e = Math.sqrt(1 + ((2 * E * Math.pow(L,2)) / ))
        //const b = a * Math.sqrt(1 - Math.pow(e, 2));

        this.apo = a * (1 + e);
        //this.apo = e;
        this.per = a * (1 - e);
    }
}

function mag(v) {
    return Math.sqrt(
        Math.pow(v.x, 2) +
        Math.pow(v.y, 2) +
        Math.pow(v.z, 2) 
    );
}

function distance(v1, v2) {
    const v = new THREE.Vector3(0, 0, 0);
    v.subVectors(v2, v1);
    return mag(v);
}

function set_arow_d(arrow, dir_v) {
    const dir = dir_v.clone();

    if (dir.y > 0.99999) {
      arrow.quaternion.set(0, 0, 0, 1);
  
    } else if (dir.y < - 0.99999) {
      arrow.quaternion.set(1, 0, 0, 0);
  
    } else {
      _axis.set(dir.z, 0, - dir.x).normalize();
      const radians = Math.acos(dir.y);
      arrow.quaternion.setFromAxisAngle(_axis, radians);
    }
  }

export default Ship;
