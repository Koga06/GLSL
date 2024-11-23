main();

//
// start here
//

function createVertexShader(gl){
  const vertexShader = gl.createShader(gl.VERTEX_SHADER);
  const vertexSource = `attribute vec3 aPos;
                        attribute vec4 aCor;
                        varying vec4 vCor;
                        uniform mat4 uRotation;

                        void main(){
                            gl_Position = uRotation * vec4(aPos.x, aPos.y, aPos.z, 1.0);
                            vCor = aCor;
                        }`;

  gl.shaderSource(vertexShader, vertexSource);//Adiciona o código ao Shader
  gl.compileShader(vertexShader);//Compila o Shader
  
  if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {//Verfica erros do Shader
      alert("invalid vertex shader : " + gl.getShaderInfoLog(vertexShader));
  } 
  return vertexShader;
}

function createFragmentShader(gl){
  const fragShader = gl.createShader(gl.FRAGMENT_SHADER)
  const fragSource = `precision mediump float;
                      varying vec4 vCor;
                      void main(){
                        gl_FragColor = vCor;
                      }`

  gl.shaderSource(fragShader, fragSource);//Adiciona o código ao Shader
  gl.compileShader(fragShader);//Compila o Shader
  
  if (!gl.getShaderParameter(fragShader, gl.COMPILE_STATUS)) {//Verfica erros do Shader
      alert("invalid fragment shader : " + gl.getShaderInfoLog(fragShader));
  } 
  return fragShader;
}

function createCube(gl) {
  const cubeVertexData = new Float32Array([
    // face 1
    -0.5, -0.5,  0.5,  1.0, 0.0, 0.0, 1.0, // V0
     0.5, -0.5,  0.5,  1.0, 0.0, 0.0, 1.0, // V1
     0.5,  0.5,  0.5,  1.0, 0.0, 0.0, 1.0, // V2
    -0.5, -0.5,  0.5,  1.0, 0.0, 0.0, 1.0, // V0
     0.5,  0.5,  0.5,  1.0, 0.0, 0.0, 1.0, // V2
    -0.5,  0.5,  0.5,  1.0, 0.0, 0.0, 1.0, // V3

    // face 2
    -0.5, -0.5, -0.5,  0.0, 1.0, 0.0, 1.0, // V4
    -0.5,  0.5, -0.5,  0.0, 1.0, 0.0, 1.0, // V5
     0.5,  0.5, -0.5,  0.0, 1.0, 0.0, 1.0, // V6
    -0.5, -0.5, -0.5,  0.0, 1.0, 0.0, 1.0, // V4
     0.5,  0.5, -0.5,  0.0, 1.0, 0.0, 1.0, // V6
     0.5, -0.5, -0.5,  0.0, 1.0, 0.0, 1.0, // V7

    // face 3
    -0.5,  0.5, -0.5,  0.0, 0.0, 1.0, 1.0, // V5
    -0.5,  0.5,  0.5,  0.0, 0.0, 1.0, 1.0, // V3
     0.5,  0.5,  0.5,  0.0, 0.0, 1.0, 1.0, // V2
    -0.5,  0.5, -0.5,  0.0, 0.0, 1.0, 1.0, // V5
     0.5,  0.5,  0.5,  0.0, 0.0, 1.0, 1.0, // V2
     0.5,  0.5, -0.5,  0.0, 0.0, 1.0, 1.0, // V6

    // face 4
    -0.5, -0.5, -0.5,  1.0, 1.0, 0.0, 1.0, // V4
     0.5, -0.5, -0.5,  1.0, 1.0, 0.0, 1.0, // V7
     0.5, -0.5,  0.5,  1.0, 1.0, 0.0, 1.0, // V1
    -0.5, -0.5, -0.5,  1.0, 1.0, 0.0, 1.0, // V4
     0.5, -0.5,  0.5,  1.0, 1.0, 0.0, 1.0, // V1
    -0.5, -0.5,  0.5,  1.0, 1.0, 0.0, 1.0, // V0

    // face 5
    -0.5, -0.5, -0.5,  1.0, 0.0, 1.0, 1.0, // V4
    -0.5, -0.5,  0.5,  1.0, 0.0, 1.0, 1.0, // V0
    -0.5,  0.5,  0.5,  1.0, 0.0, 1.0, 1.0, // V3
    -0.5, -0.5, -0.5,  1.0, 0.0, 1.0, 1.0, // V4
    -0.5,  0.5,  0.5,  1.0, 0.0, 1.0, 1.0, // V3
    -0.5,  0.5, -0.5,  1.0, 0.0, 1.0, 1.0, // V5

    // face 6
     0.5, -0.5, -0.5,  0.0, 1.0, 1.0, 1.0, // V7
     0.5,  0.5, -0.5,  0.0, 1.0, 1.0, 1.0, // V6
     0.5,  0.5,  0.5,  0.0, 1.0, 1.0, 1.0, // V2
     0.5, -0.5, -0.5,  0.0, 1.0, 1.0, 1.0, // V7
     0.5,  0.5,  0.5,  0.0, 1.0, 1.0, 1.0, // V2
     0.5, -0.5,  0.5,  0.0, 1.0, 1.0, 1.0, // V1
  ]);

  const bufID = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, bufID);
  gl.bufferData(gl.ARRAY_BUFFER, cubeVertexData, gl.STATIC_DRAW);
  return bufID;
}

function animationLoop(gl, progID, bufID, rotationLoc) {
  let time = 0;

  function animate() {
    const ang = time * 0.01;
    const cosA = Math.cos(ang);
    const sinA = Math.sin(ang);

    const rotationMatrix = new Float32Array([
      cosA, 0.0, -sinA, 0.0,
      0.0,  1.0,  0.0,  0.0,
      sinA, 0.0,  cosA, 0.0,
      0.0,  0.0,  0.0,  1.0,
    ]);

    gl.uniformMatrix4fv(rotationLoc, false, rotationMatrix);

    gl.clearColor(0.0, 0.0, 0.0, 1.0); // Fundo preto
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.useProgram(progID);
    gl.bindBuffer(gl.ARRAY_BUFFER, bufID);

    const posLoc = gl.getAttribLocation(progID, "aPos");
    gl.vertexAttribPointer(posLoc, 3, gl.FLOAT, false, 7 * Float32Array.BYTES_PER_ELEMENT, 0);
    gl.enableVertexAttribArray(posLoc);

    const colorLoc = gl.getAttribLocation(progID, "aCor");
    gl.vertexAttribPointer(colorLoc, 4, gl.FLOAT, false, 7 * Float32Array.BYTES_PER_ELEMENT, 3 * Float32Array.BYTES_PER_ELEMENT);
    gl.enableVertexAttribArray(colorLoc);

    gl.drawArrays(gl.TRIANGLES, 0, 36);

    time++;
    requestAnimationFrame(animate);
  }
  animate();
}

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  gl.viewport(0, 0, canvas.width, canvas.height);
});

function main() {
    const canvas = document.querySelector("#glcanvas");
  
    // 1. Criar o contexto
    const gl = canvas.getContext("webgl");
  
    // Only continue if WebGL is available and working
    if (gl === null) {
      alert(
        "Unable to initialize WebGL. Your browser or machine may not support it."
      );
      return;
    }
  
    gl.enable(gl.DEPTH_TEST);
  
    // 2. Criar o objeto Triangulo e retorna o VBO
    const bufID = createCube(gl); // Create the cube buffer
  
    // 3. Criar os shaders de Vértice e Fragmento
    const vertexShader = createVertexShader(gl);
    const fragShader = createFragmentShader(gl);
  
    // 4. Criar um programa (relacionado aos Shaders de Vértice e Fragmento)
    const progID = gl.createProgram(); // Create a program object
    gl.attachShader(progID, vertexShader); // Attach shaders to the program
    gl.attachShader(progID, fragShader);
    gl.linkProgram(progID); // Link the shaders to the program
    
    if (!gl.getProgramParameter(progID, gl.LINK_STATUS)) {
      alert(gl.getProgramInfoLog(progID));
      return;
    }
  
    // Set viewport size to match canvas
    gl.viewport(0, 0, canvas.width, canvas.height);
  
    // Rotation uniform location
    const rotationLoc = gl.getUniformLocation(progID, "uRotation");
  
    // Start animation loop
    animationLoop(gl, progID, bufID, rotationLoc);
  
    // Handle resizing of the canvas
    window.addEventListener("resize", () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
    });
  }
  