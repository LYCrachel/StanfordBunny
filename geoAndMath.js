//------------- tansform matrices


function mTranslate(m, x, y, z) {
    return mult(m, translate(x, y, z));
}
 
function mRotateX(m, angleInRadians) {
    return mult(m, rotateX(angleInRadians));
}

function mRotateY(m, angleInRadians) {
    return mult(m, rotateY(angleInRadians));
}

function mRotateZ(m, angleInRadians) {
    return mult(m, rotateZ(angleInRadians));
}

 
function mScale(m, sx, sy, sz) {
    return mult(m, scalem(sx, sy, sz));
}

function mProj(l, r, b, t, n, f){
    return mult(orthM, ortho(l, r, b, t, n, f));
}

function rotateX(angleInRadians) {
    var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);
    var res = mat4(
      vec4(1, 0, 0, 0),
      vec4(0, c, s, 0),
      vec4(0, -s, c, 0),
      vec4(0, 0, 0, 1)
    );
    //console.log("inside rotateX, mat is ", flatten(res));
    return res;
  }

function rotateY(angleInRadians) {
    var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);
    return mat4(
      vec4(c, 0, -s, 0),
      vec4(0, 1, 0, 0),
      vec4(s, 0, c, 0),
      vec4(0, 0, 0, 1)
    );
  }

function rotateZ(angleInRadians) {
    var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);
    return mat4(
      vec4(c, s, 0, 0),
      vec4(-s, c, 0, 0),
      vec4(0, 0, 1, 0),
      vec4(0, 0, 0, 1)
    );
  }

function getNormal(x, y, z) {
    var line1 = subtract(x, y);
    var line2 = subtract(x, z);
    var norm = normalize(cross(line1, line2));
    return norm;
}

function matXVec(m, v){
    var res = [];
    for (i = 0; i< m.length; i++){
        sum = 0;
       for (j = 0; j< v.length; j++){
            sum += m[i][j] * v[j];
       }
       res.push(sum);
    }
    return res;
}

function subtractVec(v1, v2){
    var res = [];
    if (v1.length != v2.length){
        return false;
    }
    for (i = 0; i < v1.length; i++){
        res.push(v1[i] - v2[i]);
    }
    return res;
}

function addVec(v1, v2) {
    var res = [];
    if (v1.length != v2.length){
        return false;
    }
    for (i = 0; i < v1.length; i++){
        res.push(v1[i] + v2[i]);
    }
    return res;
}

function isEqual(v1, v2){ //only for vec3
    var res = false;
    if (v1.length != v2.length){
        return false;
    }
    for (i = 0; i < v1.length; i++){
        if(v1[0] == v2[0] && v1[1] == v2[1] && v1[2] == v2[2]) res = true;
    }
    return res;
}

function getSmoothNormals() {
    var j, k, res, x, y, z;
    var avg_normals, count_normals, vertex_index, normal_index, used;
    var n, usedFlag;

    res = [];
    usedFlag = false;
    avg_normals = [];
    count_normals = [];
    used = [];
    all_index = flatten(bunnyFaces);

    for (j = 0; j < bunnyVert.length; j++) {
      avg_normals[j] = vec3(0, 0, 0);
      count_normals[j] = 0;
      used[j] = [];
    }

    for (k = 0; k < all_index.length; k++) {
      vertex_index = all_index[k] - 1;
      normal_this = flatNormals[k]; 
      usedFlag = false;
        //console.log("used[vertex_index]: ", used[vertex_index]);
      for(i = 0; i < used[vertex_index].length; i++){
        if (isEqual(used[vertex_index][i], normal_this)) {
          console.log("used.");
          usedFlag = true;
          break;
        }
      }
      if (!usedFlag){
        //used[vertex_index].push(normal_this); // used [[vec3, vec3, ],[],[]....]
        count_normals[vertex_index] += 1;
        avg_normals[vertex_index] = addVec(avg_normals[vertex_index], normal_this);
      }
    }
    for (k = 0; k < avg_normals.length; k ++) {
      if (count_normals[k] > 0) {
        // avg_normals[k][0] /= count_normals[k];
        // avg_normals[k][1] /= count_normals[k];
        // avg_normals[k][2] /= count_normals[k];
        res.push(normalize(avg_normals[k]));
      } 
    }
    return res;
}

// -------- end of transform matrices


