var canvas, gl, program, vPosition, vNormal, fColor, eyePos, pLightPosition, sLightPosition, spotLightDir, sPointTo, spotLightLim, spotFlag,sFlag, vBuffer, normalBuffer, proMat, viewMat, worldMat, worldInverseTransposeworldInverseTranspose, identityMat;
var flatNormals, lightDir, angle, disp, spotAngle, panLeft, stopCount, vM, spotPos, smoothNormals, normals;
var bunnyVert, bunnyFaces, vertFaces, cubeVert, cubeCenter, coneVert, coneTop;
var translation, scaling, rotation, axis, angle, orthM;
var isLeftClicked, isRightClicked, xDist, yDist, zDist, xOrig, yOrig, isTranslated;

window.onload = function init() {
    console.log("this is working."); 
    canvas = document.getElementById('gl-canvas');
    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) gl = canvas.getContext("experimental-webgl");
    if (!gl) alert("Browser doesn't support webgl");

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1, 1, 1, 1);

    program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    vPosition = gl.getAttribLocation(program, "vPosition");
    vNormal = gl.getAttribLocation(program, "vNormal");

    fColor = gl.getUniformLocation(program, "fColor");
    pLightPosition = gl.getUniformLocation(program, "pLightPosition");
    sLightPosition = gl.getUniformLocation(program, "sLightPosition");
    spotLightDir = gl.getUniformLocation(program, "spotLightDir");
    spotLightLim = gl.getUniformLocation(program, "spotLightLim");
    spotFlag = gl.getUniformLocation(program, "spotFlag");
    eyePos = gl.getUniformLocation(program, "eyePos");
    worldInverseTranspose = gl.getUniformLocation(program, "worldInverseTranspose");

    proMat = gl.getUniformLocation(program, "proMat");
    viewMat = gl.getUniformLocation(program, "viewMat");
    worldMat = gl.getUniformLocation(program, "worldMat");

    initialize();

    vBuffer = gl.createBuffer();
    setVertice(vertFaces);

    normalBuffer = gl.createBuffer();
    setNormal(normals);
   
    render();
};


function render(){
    animation = undefined;

    gl.clearColor(1, 1, 1, 1);
    gl.clear(gl.COLOR_BUFFER_BIT); 
    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);

    gl.enableVertexAttribArray(vPosition); 
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);

    gl.enableVertexAttribArray(vNormal); 
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.vertexAttribPointer(vNormal, 3, gl.FLOAT, false, 0, 0);

    drawScene();
    //setTimeout(start, 100);
    requestAnimationFrame(render);
}

function start(){
    if (!animation) {
        animation = requestAnimFrame(render);
    }   
}

function initialize(){
    identityMat = mat4(
      vec4(1, 0, 0, 0),
      vec4(0, 1, 0, 0),
      vec4(0, 0, 1, 0),
      vec4(0, 0, 0, 1));
    flatNormals = [];
    xDist = 0;
    yDist = 0;
    zDist = 0;
    angle = 0;
    disp = 0;
    panLeft = true;
    spotAngle = 0;
    bunnyVert = get_vertices();
    bunnyFaces = get_faces();
    vertFaces = getTriangles();
    console.log("start getting smooth...");
    smoothNormals = getSmoothNormals();
    console.log("finished getting smooth...");
    normals = setBunnyNorm();

    cubeCenter = [5, 5, 0];
    //console.log("#veritices : ",smoothNormals);
    cubeVert = getCube(cubeCenter, 0.3);
    vertFaces = vertFaces.concat(cubeVert);
    normals = normals.concat(fakeNorm(cubeVert));
    translation = [xDist, yDist, zDist];
    scaling = [1, 1, 1];
    rotation = [0, 0, 0];
    stopCount = 0;

    limit = radians(15);
    sPointTo = [0, 0, 0];
    spotPos = [0, 4, 2];
    spotDir = subtractVec(sPointTo, spotPos);    
    coneTop = [0, 0, 0];
    coneVert = getCone(coneTop, 0.1, 0.5);
    vertFaces = vertFaces.concat(coneVert);
    normals = normals.concat(fakeNorm(coneVert));
    sFlag = 1.0;

    var eye, up, at;
    eye = vec3(0, 0, 10);
    up = vec3(0, 1, 0);
    at =vec3(0, 0, 0);
    vM = lookAt(eye, at, up);
    //viewM = inverse(vM);
    gl.uniformMatrix4fv(viewMat, false, flatten(vM));
    gl.uniform3fv(eyePos, eye);

    var matrix = perspective(90, gl.canvas.clientWidth / gl.canvas.clientHeight, 0.1, 1000);
    gl.uniformMatrix4fv(proMat, false, flatten(matrix));
    gl.uniformMatrix4fv(worldMat, false, flatten(identityMat));
    gl.uniform4fv(fColor, [0.764, 0.556, 0.1, 1]); //0.75, 0.45, 0.75,
    gl.uniform3fv(pLightPosition, cubeCenter);
    gl.uniform3fv(sLightPosition, spotPos);
    gl.uniform3fv(spotLightDir, normalize(spotDir));
    gl.uniform1f(spotLightLim, Math.cos(limit));  

    orthM = mat4();
    orthM[0][0] = 1;
    orthM[1][1] = 1;
    orthM[3][3] = 1;

}


function drawScene(){

    //prepare mat and draw bunny
    var wM = mat4();
    wM = mRotateX(identityMat, rotation[0]);
    wM = mRotateY(wM, rotation[1]);
    wM = mRotateZ(wM, rotation[2]);
    wM = mTranslate(wM, translation[0], translation[1], translation[2]); //
    wM = mScale(wM, scaling[0], scaling[1], scaling[2]); //
    var worldInverseMatrix = inverse(wM);
    var worldInverseTransposeMatrix = transpose(worldInverseMatrix);
    gl.uniformMatrix4fv(worldMat, false, flatten(wM));
    gl.uniformMatrix4fv(worldInverseTranspose, false, flatten(worldInverseTransposeMatrix));
    gl.drawArrays(gl.TRIANGLES, 0, 3 * bunnyFaces.length);




    //prepare mat and draw cone

    if (sFlag % 2 != 0) {
        disp += 0.01;
        if (panLeft) {
            spotAngle = (spotAngle + (Math.PI / 200));
            if (spotAngle >= Math.PI / 2) panLeft = false;
        }
        else {
            spotAngle = (spotAngle - (Math.PI / 200));
            if (spotAngle <= -Math.PI / 2) panLeft = true;
        }
    }
    var wCone = mRotateY(identityMat,  (spotAngle));//(90 * Math.sin(disp)))); //angle: Math.atan(Math.sin(disp))
    wCone = mRotateX(wCone, Math.atan(0.5));
    wCone = mTranslate(wCone, 0, 4, 2); 
    //worldInverseMatrix = inverse(wCone);
    //worldInverseTransposeMatrix = transpose(worldInverseMatrix);
    gl.uniformMatrix4fv(worldMat, false, flatten(wCone));
    //gl.uniformMatrix4fv(worldInverseTranspose, false, flatten(worldInverseTransposeMatrix));

    //var newSpotPoint = [0, -1, 0];
    let spotWorld = mRotateZ(identityMat, (spotAngle));
    var newSpotPoint = matXVec(spotWorld, vec4(spotDir, 1));
    console.log(newSpotPoint);
    gl.uniform3fv(spotLightDir, normalize(vec3(newSpotPoint)));
    gl.drawArrays(gl.LINES, 3 * bunnyFaces.length + 24 , 24);



    //prepare mat and draw cube

    if(stopCount % 2 == 0) angle -= 0.01;
    var wCube = mRotateY(identityMat, angle);
    var newLightDir = vec4(cubeCenter, 1);
    newLightDir = matXVec(wCube, newLightDir);
    gl.uniformMatrix4fv(worldMat, false, flatten(wCube));
    gl.uniform3fv(pLightPosition, (vec3(newLightDir)));
    gl.drawArrays(gl.LINES, 3 * bunnyFaces.length , 24);
}


function getTriangles(){
    var res = [];
    var x, y, z;
    var n;
    for (i = 0; i<bunnyFaces.length; i++){
        x = bunnyFaces[i][0]-1;
        y = bunnyFaces[i][1]-1;
        z = bunnyFaces[i][2]-1;
        res.push(bunnyVert[x], bunnyVert[y], bunnyVert[z]);
        n = getNormal(bunnyVert[x], bunnyVert[y], bunnyVert[z]);
        flatNormals.push(n, n, n);

    }
    return res;
}

function setBunnyNorm (){
    var res = [];
    var x, y, z;
    var n;
    for (i = 0; i<bunnyFaces.length; i++){
        x = bunnyFaces[i][0]-1;
        y = bunnyFaces[i][1]-1;
        z = bunnyFaces[i][2]-1;
        res.push(smoothNormals[x], smoothNormals[y], smoothNormals[z]);
    }
    return res;
}

function setVertice(v){
    //console.log("vertFaces: ", vertFaces);
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(v), gl.STATIC_DRAW);
}

function setNormal(n){
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(n), gl.STATIC_DRAW);
}

function getCube(center, length) {
    var a = length/2;
    var x = center[0];
    var y = center[1];
    var z = center[2];
    var res = [];
    res.push(
        vec3(x + a, y + a, z + a), // 1
        vec3(x + a, y + a, z - a), // 2

        vec3(x + a, y + a, z - a), //2
        vec3(x + a, y - a, z - a), //3

        vec3(x + a, y - a, z - a), //3
        vec3(x + a, y - a, z + a), //4

        vec3(x + a, y - a, z + a), //4
        vec3(x + a, y + a, z + a), //1

        vec3(x - a, y + a, z + a), // 1
        vec3(x - a, y + a, z - a), // 2

        vec3(x - a, y + a, z - a), //2
        vec3(x - a, y - a, z - a), //3

        vec3(x - a, y - a, z - a), //3
        vec3(x - a, y - a, z + a), //4

        vec3(x - a, y - a, z + a), //4
        vec3(x - a, y + a, z + a), //1

        vec3(x + a, y + a, z + a), // 1
        vec3(x - a, y + a, z + a), // 1

        vec3(x + a, y + a, z - a), // 2
        vec3(x - a, y + a, z - a), // 2

        vec3(x + a, y - a, z - a), //3
        vec3(x - a, y - a, z - a), //3

        vec3(x + a, y - a, z + a), //4
        vec3(x - a, y - a, z + a) //4

    );
    return res;
}

function fakeNorm(vert){
    var res = [];
    for (i = 0; i<vert.length; i++){
        res.push([0, 0, 0]);
    }
    return res;
}

function getCone (vert, length, height){
    var res = [];
    var h = Math.sqrt(3)/2 * length;
    var a = vert[0];
    var b = vert[1];
    var c = vert[2];
    res.push(
        vec3(vert),
        vec3(a + h, b - height, c), //1

        vec3(vert),
        vec3(a + h/2, b - height, c - h), //2

        vec3(vert),
        vec3(a - h/2, b - height, c - h),//3

        vec3(vert),
        vec3(a - h, b - height, c ), //4

        vec3(vert),
        vec3(a - h/2, b - height, c + h), //5

        vec3(vert),
        vec3(a + h/2, b - height, c + h), //6

        vec3(a + h, b - height, c), //1
        vec3(a + h/2, b - height, c - h), //2

        vec3(a + h/2, b - height, c - h), //2
        vec3(a - h/2, b - height, c - h),//3

        vec3(a - h/2, b - height, c - h),//3
        vec3(a - h, b - height, c ), //4

        vec3(a - h, b - height, c ), //4
        vec3(a - h/2, b - height, c + h), //5

        vec3(a - h/2, b - height, c + h), //5
        vec3(a + h/2, b - height, c + h), //6

        vec3(a + h/2, b - height, c + h), //6
        vec3(a + h, b - height, c), //1

        )
    
    return res;
}


