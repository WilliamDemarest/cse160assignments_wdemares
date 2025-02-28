class Camera {
    constructor(canvas) {
        this.canvas = canvas;
        this.type='camera';

        this.speed = 0.1;

        this.fov = 90.0;
        this.eye = new Vector3([0, 0, 0]);
        this.at = new Vector3([0, 0, -1]);
        this.up = new Vector3([0, 1, 0]);

        this.viewMatrix = new Matrix4();
        this.projectionMatrix = new Matrix4();

        this.updateLook();
        this.updateProjection();

    }

    updateLook() {
        this.viewMatrix.setLookAt(
            this.eye.elements[0], this.eye.elements[1], this.eye.elements[2],
            this.at.elements[0], this.at.elements[1], this.at.elements[2], 
            this.up.elements[0], this.up.elements[1], this.up.elements[2], 
        );
    }

    updateProjection() {
        this.projectionMatrix.setPerspective(
            this.fov,
            this.canvas.width / this.canvas.height,
            0.1,
            100,
        );
    }

    moveForward() {
        const f =  new Vector3();
        f.set(this.at);
        f.sub(this.eye);
        f.normalize();
        f.mul(this.speed);
        this.eye.add(f);
        this.at.add(f);

        this.updateLook();
    }

    moveBackwards() {
        const b =  new Vector3();
        b.set(this.eye);
        b.sub(this.at);
        b.normalize();
        b.mul(this.speed);
        this.eye.add(b);
        this.at.add(b);

        this.updateLook();
    }

    moveLeft() {
        const f =  new Vector3();
        const s = new Vector3();
        f.set(this.at);
        s.set(this.up);

        f.sub(this.eye);
        const s_prime = Vector3.cross(s, f);
        
        s_prime.normalize();
        s_prime.mul(this.speed*1);

        this.eye.add(s_prime);
        this.at.add(s_prime);

        this.updateLook();
    }

    moveRight() {
        const f =  new Vector3();
        const s = new Vector3();
        f.set(this.eye);
        s.set(this.up);

        f.sub(this.at);
        const s_prime = Vector3.cross(s, f);
        
        s_prime.normalize();
        s_prime.mul(this.speed*1);

        this.eye.add(s_prime);
        this.at.add(s_prime);

        this.updateLook();
    }

    panLeft(alpha = this.speed) {
        const f =  new Vector3();
        f.set(this.at);
        f.sub(this.eye);
        f.normalize();

        const m = new Matrix4().setRotate(alpha*-30, 
            this.up.elements[0],
            this.up.elements[1],
            this.up.elements[2],
        );

        const f_prime = m.multiplyVector3(f);

        this.at.set(this.eye);
        this.at.add(f_prime);

        this.updateLook();
    }

    panRight(alpha = this.speed) {
        const f =  new Vector3();
        f.set(this.at);
        f.sub(this.eye);
        f.normalize();

        const m = new Matrix4().setRotate(alpha*30, 
            this.up.elements[0],
            this.up.elements[1],
            this.up.elements[2],
        );

        const f_prime = m.multiplyVector3(f);

        this.at.set(this.eye);
        this.at.add(f_prime);

        this.updateLook();
    }

    panUp(alpha = this.speed) {
        const f =  new Vector3();
        f.set(this.at);
        f.sub(this.eye);
        f.normalize();


        const s_prime = Vector3.cross(this.up, f);
        s_prime.normalize();

        const m = new Matrix4().setRotate(alpha*30, 
            s_prime.elements[0],
            s_prime.elements[1],
            s_prime.elements[2],
        );

        const f_prime = m.multiplyVector3(f);

        this.at.set(this.eye);
        this.at.add(f_prime);
        this.up.set(m.multiplyVector3(this.up))

        this.updateLook();
    }

    rotateClock(alpha = this.speed) {
        const f = new Vector3();
        f.set(this.at);
        f.sub(this.eye);
        f.normalize();

        const m = new Matrix4().setRotate(alpha, 
            f.elements[0],
            f.elements[1],
            f.elements[2],
        );

        const up_prime = m.multiplyVector3(this.up);


        //this.up.set(this.eye);
        this.up.set(up_prime);

        this.updateLook();
    }
}