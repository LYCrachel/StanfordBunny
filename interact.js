
// ----- interaction

window.oncontextmenu = () => { return false; }

window.addEventListener("mousedown", function(event){
    setClick(event);
});
window.addEventListener("mousemove", function(event) {
    transOrScale(event);
});

window.addEventListener("mouseup", unsetClick);

window.addEventListener("keydown", function(event) {
    keydown(event);
  });

function setClick(e){
    if ( e.button == 0){
        isLeftClicked = true;
    }
    if ( e.button == 2){
        isRightClicked = true;
    }
    xOrig = e.clientX;
    yOrig = e.clientY;
}

function transOrScale(e){

    if (isLeftClicked ){ 
        var x = e.clientX;
        var y = e.clientY;
        xDist = (x - xOrig)/10;
        yDist = (yOrig - y)/10;
        translation[0] += xDist;
        translation[1] += yDist;
        xOrig = x;
        yOrig = y;
    }

    if (isRightClicked) {
        var x = e.clientX;
        var y = e.clientY;
        var angY = radians((x - xOrig)%360);
        var angX = radians((yOrig - y)%360);
        xOrig = x;
        yOrig = y;
        rotation[0] += angX;
        rotation[1] += angY;
    }
}

function unsetClick(){
    isLeftClicked = false;
    isRightClicked = false;
}

function keydown(k){
    switch (k.key){
        case "ArrowUp":
            zDist++;
            translation[2] = zDist;
            break;
        case "ArrowDown":
            zDist--;
            translation[2] = zDist;
            break;  
        case "r":
            zDist = 0;
            rotation = [0, 0, 0];
            translation = [0, 0, 0];
            isLeftClicked = false;
            isRightClicked = false;
            break; 
        case "p":
            stopCount++;
            break; 
        case "s":
            sFlag++;
            break;
    }
   drawScene();
}

// --- end of interaction