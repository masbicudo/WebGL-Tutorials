"use strict";

function startWebGLApp(uniforms) {
  var gl = getWebGLContext("canvas");
  var programs = {
    fragShader: getShader("fragment-shader"),
    vertexShader: getShader("vertex-shader")
  };
  
  var programInfo = initShaders(gl);

  var uniforms2 = {};
  for(var p in uniforms) {
    var u = uniforms[p];
    uniforms2[p] = {
      name: p,
      type: u.type,
      input: document.getElementById(p),
      uniform: gl.getUniformLocation(programInfo.shaderProgram, p)
    }
  }

  var shape = createSquare(gl);
  gl.clearColor(0, 0, 0, 1);
  draw(gl, shape, programInfo, uniforms2);
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
  var uTime = gl.getUniformLocation(shaderProgram, "uTime");

  return {
    shaderProgram: shaderProgram,
    aVertexCoords: aVertexCoords,
    uTransform: uTransform,
    uTime: uTime
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

function draw(gl, shape, programInfo, uniforms) {
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
  gl.uniformMatrix4fv(programInfo.uTransform, false, transformMatrix);

  // setting the current buffer
  gl.bindBuffer(gl.ARRAY_BUFFER, shape.coordsBuffer);

  // associate attribute 'aVertexCoords' with current buffer
  gl.vertexAttribPointer(programInfo.aVertexCoords, 2, gl.FLOAT, false, 0, 0);

  var time = 0;
  var interval = 1000 / 15;
  window.setInterval(function() {

    gl.uniform1f(programInfo.uTime, time * 0.01);
    time += interval;
    
    txt.innerHTML = time.toFixed(0);
    for(var p in uniforms) {
      var uniformInfo = uniforms[p];
      if (uniformInfo.type == "float")
        gl.uniform1f(uniformInfo.uniform, parseFloat(uniformInfo.input.value));
      if (uniformInfo.type == "bool")
        gl.uniform1i(uniformInfo.uniform, !!(uniformInfo.input.type == "checkbox" ? uniformInfo.input.checked : uniformInfo.input.value) ? 1 : 0);
      if (uniformInfo.type == "int")
        gl.uniform1i(uniformInfo.uniform, parseInt(uniformInfo.input.value));
    }

    // draw triangles, using the shaders of the current program, with the current attributes
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, shape.pointCount);

  }, interval);
}
