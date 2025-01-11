// DrawRectangle.js
function main() {
    // Retrieve <canvas> element    <- (1)
    const draw_button = document.getElementById("draw_vector_button");
    const operation_button = document.getElementById("draw_operation_button");
    const v1x_input = document.getElementById("v1x");
    const v1y_input = document.getElementById("v1y");
    const v2x_input = document.getElementById("v2x");
    const v2y_input = document.getElementById("v2y");
    const operation_select = document.getElementById("operation_select");
    const scalar_input = document.getElementById("scalar");

    draw_button.addEventListener("click", handleDrawEvent)
    operation_button.addEventListener("click", handleDrawOperationEvent)


    var canvas = document.getElementById('example');
    if (!canvas) {
        console.log('Failed to retrieve the <canvas> element');
        return;
    }

    // Get the rendering context for 2DCG   <- (2)
    var ctx = canvas.getContext('2d');

    ctx.fillStyle = 'rgba(0, 0, 0, 1.0)'; 
    ctx.fillRect(0, 0, canvas.width, canvas.height); // Fill a rectangle with the color

    function drawVector(v, color) {
        const scale = 20;
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + v.elements[0]*scale, cy + v.elements[1]*scale*-1.0)

        ctx.strokeStyle = color;

        ctx.stroke();
    }

    function angleBetween(v1, v2) {
        const rads = Math.acos(Vector3.dot(v1, v2) / (v1.magnitude() * v2.magnitude()));
        return rads * (180 / Math.PI);
    }

    function areaTriangle(v1, v2) {
        return (Vector3.cross(v1, v2)).magnitude() * 0.5;
    }

    function handleDrawEvent() {
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const v1 = new Vector3([parseFloat(v1x_input.value), parseFloat(v1y_input.value), 0]);
        drawVector(v1, "red");
        const v2 = new Vector3([parseFloat(v2x_input.value), parseFloat(v2y_input.value), 0]);
        drawVector(v2, "blue");
    }

    function handleDrawOperationEvent() {
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const operation = operation_select.value;
        const scalar = parseFloat(scalar_input.value);

        const v1 = new Vector3([parseFloat(v1x_input.value), parseFloat(v1y_input.value), 0]);
        drawVector(v1, "red");
        const v2 = new Vector3([parseFloat(v2x_input.value), parseFloat(v2y_input.value), 0]);
        drawVector(v2, "blue");

        if (operation == "mul") {
            v1.mul(scalar);
            v2.mul(scalar);
            drawVector(v1, "green");
            drawVector(v2, "green");
        } else if (operation == "div") {
            v1.div(scalar);
            v2.div(scalar);
            drawVector(v1, "green");
            drawVector(v2, "green");
        } else if (operation == "add") {
            v1.add(v2);
            drawVector(v1, "green");
        } else if (operation == "sub") {
            v1.sub(v2);
            drawVector(v1, "green");
        } else if (operation == "mag") {
            console.log(v1.magnitude());
            console.log(v2.magnitude());
        } else if (operation == "norm") {
            v1.normalize();
            v2.normalize();
            drawVector(v1, "green");
            drawVector(v2, "green");
        } else if (operation == "angle") {
            console.log(angleBetween(v1, v2));
        }
        else if (operation == "area") {
            console.log(areaTriangle(v1, v2));
        }
    }
    // const v1 = new Vector3([2.25, 2.25, 0.0]);
    // drawVector(v1, "red");
}
