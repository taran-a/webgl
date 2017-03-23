function typedArrayFabric(type, data) {
    switch(type) {
        case 'ARRAY_BUFFER':
            return new Float32Array(data);
        case 'ELEMENT_ARRAY_BUFFER':
            return new Uint16Array(data);
    }
}

function addBuffer(gl, type, data) {

    let buffer = {};

    // Create a new buffer object
    buffer[type] = gl.createBuffer();

    // Bind an empty array buffer to it
    gl.bindBuffer(gl[type], buffer[type]);

    // Pass the data to the buffer
    gl.bufferData(gl[type], typedArrayFabric(type, data), gl.STATIC_DRAW);

    // Unbind the buffer
    gl.bindBuffer(gl[type], null);

    return buffer[type]
}


function initWebGl() {

    /* Step1: Prepare the canvas and get WebGL context */
    var canvas = document.getElementById('canvas');
    var gl = canvas.getContext('webgl');


    /* Step2: Define the geometry and store it in buffer objects */
    var vertices = [
        1.0,1.0,0.0,
        1.0,-1.0,0.0,
        -1.0,-1.0,0.0,
        -1.0,1.0,0.0
    ];

    var indices = [0, 1, 2, 0, 2, 3];

    var vertex_buffer = addBuffer(gl, 'ARRAY_BUFFER', vertices);

    var indices_buffer = addBuffer(gl, 'ELEMENT_ARRAY_BUFFER', indices);



    /* Step3: Create and compile Shader programs */

    // Vertex shader source code
    var vertCode =
        'attribute vec2 coordinates;' +
        'void main(void) {' + ' gl_Position = vec4(coordinates, 0.0, 1.0);' + '}';

    //Create a vertex shader object
    var vertShader = gl.createShader(gl.VERTEX_SHADER);

    //Attach vertex shader source code
    gl.shaderSource(vertShader, vertCode);

    //Compile the vertex shader
    gl.compileShader(vertShader);

    var color = {
        R: 0,
        G: 204,
        B: 102
    };

    //Fragment shader source code
    var fragCode = `void main(void) { gl_FragColor = vec4(${1/255*color.R}, ${1/255*color.G}, ${1/255*color.B}, 1.0); }`;

    // Create fragment shader object
    var fragShader = gl.createShader(gl.FRAGMENT_SHADER);

    // Attach fragment shader source code
    gl.shaderSource(fragShader, fragCode);

    // Compile the fragment shader
    gl.compileShader(fragShader);

    // Create a shader program object to store combined shader program
    var shaderProgram = gl.createProgram();

    // Attach a vertex shader
    gl.attachShader(shaderProgram, vertShader);

    // Attach a fragment shader
    gl.attachShader(shaderProgram, fragShader);

    // Link both programs
    gl.linkProgram(shaderProgram);

    // Use the combined shader program object
    gl.useProgram(shaderProgram);


    /* Step 4: Associate the shader programs to buffer objects */

    //Bind vertex buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indices_buffer);

    //Get the attribute location
    var coord = gl.getAttribLocation(shaderProgram, "coordinates");

    //point an attribute to the currently bound VBO
    gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 0, 0);

    //Enable the attribute
    gl.enableVertexAttribArray(coord);


    /* Step5: Drawing the required object (triangle) */

    // Clear the canvas
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // Enable the depth test
    gl.enable(gl.DEPTH_TEST);

    // Clear the color buffer bit
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Set the view port
    gl.viewport(0, 0, canvas.width+300, canvas.height+300);

    // Draw the triangle
    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
}