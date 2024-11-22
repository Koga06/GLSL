main();

//
// start here
//

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

function createSquare(gl, bufID) {
    // Dados do quadrado: vértices (x, y, z) e cores (r, g, b, a)
    var squareVertexData = new Float32Array([
      // Triângulo 1
      -0.5,  0.5, 0.0,  1.0, 0.0, 0.0, 1.0, // V0 - canto superior esquerdo
       0.5,  0.5, 0.0,  0.0, 1.0, 0.0, 1.0, // V1 - canto superior direito
      -0.5, -0.5, 0.0,  0.0, 0.0, 1.0, 1.0, // V2 - canto inferior esquerdo
  
      // Triângulo 2
      -0.5, -0.5, 0.0,  0.0, 0.0, 1.0, 1.0, // V2 - canto inferior esquerdo
       0.5,  0.5, 0.0,  0.0, 1.0, 0.0, 1.0, // V1 - canto superior direito
       0.5, -0.5, 0.0,  1.0, 1.0, 0.0, 1.0  // V3 - canto inferior direito
    ]);
  
    // Transferindo os dados para o buffer
    gl.bufferData(gl.ARRAY_BUFFER, squareVertexData, gl.STATIC_DRAW);
  
    // Configurando atributos de posição e cor
    var vertexLoc = 0; // Localização do atributo de posição no shader
    var colorLoc = 1; // Localização do atributo de cor no shader
  
    var stride = (3 + 4) * Float32Array.BYTES_PER_ELEMENT; // 3 coordenadas + 4 cores
    var offset = 0;
  
    // Atributos de posição (x, y, z)
    gl.vertexAttribPointer(vertexLoc, 3, gl.FLOAT, false, stride, offset);
    gl.enableVertexAttribArray(vertexLoc);
  
    // Atributos de cor (r, g, b, a)
    offset = 3 * Float32Array.BYTES_PER_ELEMENT;
    gl.vertexAttribPointer(colorLoc, 4, gl.FLOAT, false, stride, offset);
    gl.enableVertexAttribArray(colorLoc);
}
  
function drawSquare(progID, bufID, gl) {
  gl.clearColor(0.0, 0.0, 0.0, 1.0); // Cor de fundo
  gl.clear(gl.COLOR_BUFFER_BIT); // Limpa o buffer de cor

  gl.useProgram(progID); // Usa o programa (shaders)
  gl.bindBuffer(gl.ARRAY_BUFFER, bufID); // Vincula o buffer com os dados do quadrado
  gl.drawArrays(gl.TRIANGLES, 0, 6); // Desenha 6 vértices (2 triângulos)
}

function main() {
  const canvas = document.querySelector("#glcanvas");
  //1. Criar o contexto
  const gl = canvas.getContext("webgl");

  // Only continue if WebGL is available and working
  if (gl === null) {
    alert(
      "Unable to initialize WebGL. Your browser or machine may not support it."
    );
    return;
  }

  //2. Criar o objeto Triangulo e retorna o VBO
  var bufID = gl.createBuffer(); //Criando o Buffer VBO
  gl.bindBuffer(gl.ARRAY_BUFFER, bufID); //Acessando o Buffer VBO
  createSquare(gl,bufID)

  //3. Criar os shaders de Vértice e Fragmento
  var vertexShader = createVertexShader(gl)
  var fragShader = createFragmentShader(gl)

  //3. Criar um programa (relacionado aos Shaders de Vértice e Fragmento)
  var progID = gl.createProgram();//Cria um programa (objeto para os shaders)
  gl.attachShader(progID, vertexShader);//Associa o programa com os shaders
  gl.attachShader(progID, fragShader);

  gl.linkProgram(progID);// Cria um link com o Programa
  if (!gl.getProgramParameter(progID, gl.LINK_STATUS)) { //Verifica o link do Programa
    alert(gl.getProgramInfoLog(progID));
    return;
  }
  
  gl.viewport(0, 0, canvas.width, canvas.height)//ViewPort do tamanho da Tela (toda a cena 3D)
   
  // Set clear color to black, fully opaque
  gl.clearColor(0.3, 0.0, 0.3, 1.0); //R, G, B, Transparency
  // Clear the color buffer with specified clear color
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Definindo tx, ty, tz
  const translation = [0.5, -0.5, 0.0];

  // Localizando o uniform no programa Shader
  const translationLoc = gl.getUniformLocation(progID, "uTranslation");

  // Enviando dados para o Shader
  gl.useProgram(progID);
  gl.uniform3fv(translationLoc, translation);


  drawSquare(progID, bufID,gl);
}

