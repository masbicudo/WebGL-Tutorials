"use strict";

function equivType(t) {
  if (t == "--pixel-size") t = "vec2";
  if (t == "--time") t = "float";
  if (t == "float" || t == "int" || t == "bool" || t == "vec2" || t == "vec3" || t == "vec4")
    return t;
  throw new Error("Type not recognized: " + t);
}

function startWebGLApp(uniforms) {
  var gl = getWebGLContext("canvas");
  var programInfo = initShaders(gl);

  var uniforms2 = {};
  for(var p in uniforms) {
    var u = uniforms[p];
    var inputList = [];
    var t = equivType(u.type);
    if (/^vec\d$/g.test(t)) {
      var count = parseInt(u.type.substring(3,1));
      for(var it=0; it<count; it++)
        inputList.push(
          document.getElementById(p+"."+("xyzw"[it]))
          || document.getElementById(p+"."+("rgba"[it]))
          || document.getElementById(p+"["+it+"]")
        );
    }
    else if (t == "float" || t == "int" || t == "bool") {
      inputList.push(document.getElementById(p));
    }
    uniforms2[p] = {
      name: p,
      type: u.type,
      inputs: inputList,
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
  var coordsArray = [
    -1, +1, // 1st point
    +1, +1, // 2nd point
    -1, -1, // 3rd point
    +1, -1  // 4th point
  ];
  gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexCoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(coordsArray), gl.STATIC_DRAW);
  return {
    coordsBuffer: squareVertexCoordBuffer,
    coordsArray: coordsArray,
    pointCount: 4,
    pointSize: 2
  };
}

function ratio(w, h, a) {
  var min = w > h ? h : w;
  var max = w > h ? w : h;
  var div = min*a + max*(1-a);
  return {
    x: w/div,
    y: h/div,
  };
}

function draw(gl, shape, programInfo, uniforms) {
  // http://webglfundamentals.org/webgl/lessons/webgl-anti-patterns.html
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  var pixelWidth = 1;
  var pixelHeight = 1;
  
  var r = ratio(gl.drawingBufferWidth*pixelWidth, gl.drawingBufferHeight*pixelHeight, 1);

  var transformMatrix = [
      r.x,   0,   0,   0,
        0, r.y,   0,   0,
        0,   0,   1,   0,
        0,   0,   0,   1,
  ];
  gl.uniformMatrix4fv(programInfo.uTransform, false, transformMatrix);

  // setting the current buffer
  gl.bindBuffer(gl.ARRAY_BUFFER, shape.coordsBuffer);

  // associate attribute 'aVertexCoords' with current buffer
  gl.vertexAttribPointer(programInfo.aVertexCoords, 2, gl.FLOAT, false, 0, 0);

  // testing performance
  if (gl.fenceSync && gl.clientWaitSync)
    perfTest(gl, shape, programInfo, uniforms);

  var time = 0;
  var interval = 1000 / 15;
  window.setInterval(function(){renderScene(gl, shape, programInfo, uniforms, time += interval);}, interval);
}

function renderScene(gl, shape, programInfo, uniforms, time) {

  gl.uniform1f(programInfo.uTime, time * 0.01);
  
  txt.innerHTML = time.toFixed(0);
  for(var p in uniforms) {
    var uniformInfo = uniforms[p];
    
    if (uniformInfo.type == "--pixel-size") {
      var w = gl.drawingBufferWidth;
      var h = gl.drawingBufferHeight;
      var x = w > h ? w/h : 1.0;
      var y = w > h ? 1.0 : h/w;
      gl.uniform2f(uniformInfo.uniform, 2*x/w, 2*y/h);
    }
    
    else if (equivType(uniformInfo.type) == "float")
      gl.uniform1f(uniformInfo.uniform, parseFloat(uniformInfo.inputs[0].value));
    
    else if (equivType(uniformInfo.type) == "bool")
      gl.uniform1i(uniformInfo.uniform, !!(uniformInfo.inputs[0].type == "checkbox" ? uniformInfo.inputs[0].checked : uniformInfo.inputs[0].value) ? 1 : 0);
    
    else if (equivType(uniformInfo.type) == "int")
      gl.uniform1i(uniformInfo.uniform, parseInt(uniformInfo.inputs[0].value));
    
    else if (equivType(uniformInfo.type) == "vec2")
      gl.uniform2f(uniformInfo.uniform, parseFloat(uniformInfo.inputs[0].value), parseFloat(uniformInfo.inputs[1].value));
    
    else if (equivType(uniformInfo.type) == "vec3")
      gl.uniform3f(uniformInfo.uniform, parseFloat(uniformInfo.inputs[0].value), parseFloat(uniformInfo.inputs[1].value), parseFloat(uniformInfo.inputs[2].value));
    
    else if (equivType(uniformInfo.type) == "vec4")
      gl.uniform4f(uniformInfo.uniform, parseFloat(uniformInfo.inputs[0].value), parseFloat(uniformInfo.inputs[1].value), parseFloat(uniformInfo.inputs[2].value), parseFloat(uniformInfo.inputs[3].value));
  }

  // draw triangles, using the shaders of the current program, with the current attributes
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, shape.pointCount);

}

function perfTest(gl, shape, programInfo, uniforms) {
  var maxPow = 11;
  var perfList = [];
  for(var pow = 1; pow < maxPow; pow++) {
    var mul = Math.pow(2, pow);
    var vp = { x: r.x*mul, y: r.y*mul };

    var mustBreak = vp.x > gl.drawingBufferWidth || vp.y > gl.drawingBufferHeight;

    if (vp.x > gl.drawingBufferWidth)
    {
      mul = gl.drawingBufferWidth / r.x;
      vp = { x: r.x*mul, y: r.y*mul };
    }
    if (vp.y > gl.drawingBufferHeight)
    {
      mul = gl.drawingBufferHeight / r.y;
      vp = { x: r.x*mul, y: r.y*mul };
    }

    gl.viewport(0, 0, vp.x, vp.y);

    var cnt = 32*Math.floor(Math.pow(1.42, maxPow-pow));

    var startTime = performance.now();
    {
      var fps0 = 1e20;
      var slowest = -1;
      for(var it2 = 0; it2*2 < cnt; it2++) {
        var tx0 = performance.now();
        for(var it3 = 0; it3 < 2; it3++) {
          renderScene(gl, shape, programInfo, uniforms, it2*333);
          gl.finish();
        }
        var tx1 = performance.now();
        var fps1 = Math.min(fps0, 2*1000/(tx1 - tx0));
        if (fps1 < fps0) slowest = it2;
        fps0 = fps1;
      }
      for(var it2 = 0; it2 < cnt; it2++) {
        renderScene(gl, shape, programInfo, uniforms, (slowest + 2*(it2/cnt - 0.5))*333);
        gl.finish();
      }
    }
    var stopTime = performance.now();
    var fps = cnt*1000/(stopTime - startTime);

    var currPerf = {
      size: mul,
      repeats: cnt,
      fps: fps,
      quality: Math.log(fps*2.718281828459/30)*mul };

    perfList.push(currPerf);

    console.log(currPerf);
    
    if (mustBreak)
      break;
  }
}