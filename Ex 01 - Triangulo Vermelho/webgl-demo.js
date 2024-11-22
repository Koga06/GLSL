main();

function createVertexShader(gl){
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    const vertexSource = `attribute vec3 aPos;
                          attribute vec4 aCor;
                          varying vec4 vCor;
                          void main(){
                            gl_Position = vec4(aPos.x, aPos.y, aPos.z, 1.0);
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

function createTriangle(gl, bufID) {
    
    var triangleVertexData = new Float32Array([
        0.0, 0.5, 0.0, //Coordenadas x,y,z (V0)
        1.0, 0.0, 0.0, 1.0, //4 valores R,G,B,A

        -0.5, -0.5, 0.0,// (V1)
        1.0, 0.0, 0.0, 1.0,

        0.5, -0.5, 0.0, // (V2)
        1.0, 0.0, 0.0, 1.0,
    ]);

    gl.bufferData(gl.ARRAY_BUFFER, triangleVertexData, gl.STATIC_DRAW);

    var vertexLoc = 0; // localização dos dados de vértice
    var colorLoc = 1; // localização dos dados de cor

    // Acesso ao VBO
    var offset = 0;
    var stride = (3+4) * Float32Array.BYTES_PER_ELEMENT;
    gl.vertexAttribPointer(vertexLoc, 3, gl.FLOAT, false, stride, offset); //Começando de 0 até 3 temos os vertices, para os proximos ***** 7 (stride)
    gl.enableVertexAttribArray(vertexLoc);

    offset = 0 + 3 * Float32Array.BYTES_PER_ELEMENT;
    
    gl.vertexAttribPointer(colorLoc, 4, gl.FLOAT, false, stride, offset); //os 4 valores são da cor e ***** de stride em stride (7)
    gl.enableVertexAttribArray(colorLoc);
}

function drawTriangle(progID, bufID,gl){
    gl.clearColor(0.0, 0.0, 0.0, 1.0);//Definindo a cor de fundo
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(progID);//Executando o programa
    gl.bindBuffer(gl.ARRAY_BUFFER, bufID); //Acessando os dados do traingulo
    gl.drawArrays(gl.TRIANGLES, 0, 3);// Desenhando as 3 coordenadas como Triangulos
}

function main(){
    const canvas = document.getElementById("glcanvas");
    // 1. CRIANDO CONTEXTO
    const gl = canvas.getContext("webgl");

    if (gl == null) {
        alert(
            "Unable to initialize WebGL. Your browser or machine may not support it."
        );
        return;
    }

    // 2. Criando objeto Triangulo
    var bufID = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufID);
    createTriangle(gl, bufID)

    // 3. Criando os shaders de vértice e fragmento
    var vertexShader = createVertexShader(gl)
    var fragShader = createFragmentShader(gl)

    // 4. Cruabdi um programa
    var progID = gl.createProgram();
    gl.attachShader(progID, vertexShader);
    gl.attachShader(progID, fragShader);

    gl.linkProgram(progID);
    if (!gl.getProgramParameter(progID, gl.LINK_STATUS)) { //Verifica o link do Programa
        alert(gl.getProgramInfoLog(progID));
        return;
    }

    gl.viewport(0, 0, canvas.width, canvas.height)//ViewPort do tamanho da Tela (toda a cena 3D)
   
  // Set clear color to black, fully opaque
  gl.clearColor(0.3, 0.0, 0.3, 1.0); //R, G, B, Transparency
  // Clear the color buffer with specified clear color
  gl.clear(gl.COLOR_BUFFER_BIT);

  drawTriangle(progID, bufID,gl);
}