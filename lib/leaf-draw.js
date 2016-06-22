"use strict";

function startWebGLApp() {
  var gl = getWebGLContext("canvas");
  var programs = {
    fragShader: getShader("fragment-shader"),
    vertexShader: getShader("vertex-shader")
  };
  var programParams = initShaders(gl);
  var shape = createSquare(gl);
  gl.clearColor(0, 0, 0, 1);
  draw(gl, shape, programParams);
}

function getWebGLContext(id) {
  var canvasElement = document.getElementById(id);
  try {
    var gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    return gl;
  }
  catch(e) {}
  return null;
}

function initShaders(gl) {
  var fragmentShader = getShader(gl, "fragment-shader");
  var vertexShader = getShader(gl, "vertex-shader");

  // Creating shader program
  var shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert("Could not initialize shaders.");
  }

  gl.useProgram(shaderProgram);

  var aVertexCoords = gl.getAttribLocation(shaderProgram, "aVertexCoords");
  gl.enableVertexAttribArray(aVertexCoords);

  var uTransform = gl.getUniformLocation(shaderProgram, "uTransform");

  return {
    aVertexCoords: aVertexCoords,
    uTransform: uTransform
  };
}

function createSquare(gl) {
  var squareVertexCoordBuffer = gl.createBuffer();
  var coorsdArray = [
    -1,  1, // 1st point
     1,  1, // 2nd point
    -1, -1, // 3rd point
     1, -1  // 4th point
  ];
  gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexCoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(coorsdArray), gl.STATIC_DRAW);
  return {
    coordsBuffer: squareVertexCoordBuffer,
    coorsdArray: coorsdArray,
    pointCount: 4,
    pointSize: 2
  };
}

function draw(gl, shape, programParams) {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  var ratio = canvas.width / canvas.height;
  var rx = ratio > 1 ? 1 : ratio;
  var ry = ratio > 1 ? 1/ratio : 1;
  var transformMatrix = [
       rx,   0,   0,   0,
        0,  ry,   0,   0,
        0,   0,   1,   0,
        0,   0,   0,   1
  ];
  gl.uniformMatrix4fv(programParams.uTransform, false, transformMatrix);

  // setting the current buffer
  gl.bindBuffer(gl.ARRAY_BUFFER, shape.coordsBuffer);

  // associate attribute 'aVertexCoords' with current buffer
  gl.vertexAttribPointer(programParams.aVertexCoords, 2, gl.FLOAT, false, 0, 0);

  // draw triangles, using the shaders of the current program, with the current attributes
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, shape.pointCount);
}

if(window.addEventListener){
  window.addEventListener('load', startWebGLApp)
}else{
  window.attachEvent('onload', startWebGLApp)
}