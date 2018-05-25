$(document).ready(function () {
    init();
});

var mousePressed = false;
var lastX, lastY;
var ctx;
var tool = "pencil";
var line = true;
var fill = false;
var sym_V = false;
var sym_H = false;


function init() {
    const canvas = $('#canvas');
    ctx = canvas[0].getContext("2d");

    canvas.mousedown(function (e) {
        mousePressed = true;
        if( tool === 'line') {
            drawLine(e.pageX - $(this).offset().left, e.pageY - $(this).offset().top);
        } else if(tool === 'rectangle') {
            drawRec(e.pageX - $(this).offset().left, e.pageY - $(this).offset().top)
        } else if(tool === 'circle') {
            drawCircle(e.pageX - $(this).offset().left, e.pageY - $(this).offset().top)
        } else {
            Draw(e.pageX - $(this).offset().left, e.pageY - $(this).offset().top, false);
        }
    });

    canvas.mousemove(function (e) {
        if (mousePressed && (tool === 'pencil' || tool === 'eraser')) {
            Draw(e.pageX - $(this).offset().left, e.pageY - $(this).offset().top, true);
        }
    });

    canvas.mouseup(function (e) {
        mousePressed = false;
    });

    canvas.mouseleave(function (e) {
        mousePressed = false;
    });

}

$('.tool').click(function(e) {
    line = true;
    tool = this.value;
    console.log(tool);
    $('#checkbox').remove();
    $('#checkboxlabel').remove();
    $('#colorfill').remove();
    $('#colorfilllabel').remove();
    if(tool === 'rectangle' || tool === 'circle') {
        $('#toolbar').append('<input id="checkbox" type="checkbox"><label id="checkboxlabel" for="checkbox">Fill</label>');
        $('#checkbox').change(function(){
            fill = !fill;
            console.log(fill);
            if(fill){
                $('#toolbar').append("<input class='form-control' id='colorfill' type='color' value='" + $('#colorpick').val() + "'><label id='colorfilllabel' for='colorfill'>Couleur de remplissage</label>");
            } else {
                $('#colorfill').remove();
                $('#colorfilllabel').remove();
            }
        });
    } else if(tool === 'clear') {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        tool = 'pencil';
    } else if(tool === 'sym_h') {
        sym_H = !sym_H;
        console.log('sym h ok');
    }else if(tool === 'sym_v') {
        sym_V = !sym_V;
        console.log('sym v ok');
    }
});

$('#import').change(function(){
    readURL(this);
});

$('#download').click(function () {
    var image = canvas.toDataURL("image/png");
    this.download = 'my_paint.png';
    this.href = image;
});

function readURL(input) {

    if (input.files && input.files[0]) {

        var img = new Image();
        img.onload = function () {
            ctx.drawImage(img, 0, 0);
        };
        img.src = URL.createObjectURL(input.files[0]);
        var img_width = img.width > ctx.width ? canvas.width : img.width;
        var img_height = img.height > ctx.height ? canvas.height : img.height;
        ctx.drawImage(img, 0, 0, img_width, img_height);
    }
}

function trace(mx, my, lx, ly, circle = false) {
    console.log(circle);
    ctx.beginPath();
    ctx.strokeStyle = $('#colorpick').val();
    ctx.lineWidth = $('#sizepick').val();
    ctx.lineJoin = "round";
    ctx.moveTo(mx, my);
    if(circle){
        ctx.arc(lx, ly, 0.1, 0, Math.PI * 2, false);
    } else {
        ctx.lineTo(lx, ly);
    }
    ctx.closePath();
    ctx.stroke();
}

// todo getImageData()
function Draw(x, y, isDown) {
    if (isDown) {
        if(tool === 'eraser'){
            ctx.globalCompositeOperation="destination-out"
        } else {
            ctx.globalCompositeOperation="source-over";
        }
        trace(lastX, lastY, x, y);
        if(sym_V) {
            trace(canvas.width - lastX, lastY, canvas.width - x, y);
        }
        if(sym_H){
            trace(lastX, canvas.height - lastY, x, canvas.height - y);
        }
        if(sym_H && sym_V) {
            trace(canvas.width - lastX, canvas.height - lastY, canvas.width - x, canvas.height - y);;
        }

    } else if(tool === 'eraser' || tool === 'pencil'){
        if(tool === 'eraser') {
            ctx.globalCompositeOperation="destination-out";
        } else {
            ctx.globalCompositeOperation="source-over";
        }
        trace(x, y, x, y, true);
        if(sym_H && sym_V) {

            trace(canvas.width - x, canvas.height - y, canvas.width - x, canvas.height - y, true);
        }
        if(sym_H){
            trace(x, canvas.height - y, x, canvas.height - y, true);
        }
        if(sym_V) {
            trace(canvas.width - x, y, canvas.width - x, y, true);
        }
    }
    lastX = x; lastY = y;
}

function drawLine(x, y){
    if(line) {
        ctx.moveTo(x, y);
        lastX = x;
        lastY = y;
        line = false;
    } else {
        ctx.globalCompositeOperation="source-over";
        trace(lastX, lastY, x, y);
        if(sym_V) {
            trace(canvas.width - lastX, lastY, canvas.width - x, y);
        }
        if(sym_H){
            trace(lastX, canvas.height - lastY, x, canvas.height - y);
        }
        if(sym_H && sym_V) {
            trace(canvas.width - lastX, canvas.height - lastY, canvas.width - x, canvas.height - y);;
        }
        line = true
    }
}

function drawRec(x, y){

    ctx.beginPath();
    ctx.strokeStyle = $('#colorpick').val();
    ctx.lineWidth = $('#sizepick').val();
    ctx.lineJoin = "miter";
    if(line) {
        ctx.moveTo(x, y);
        lastX = x;
        lastY = y;
        line = false;
    } else {
        ctx.globalCompositeOperation="source-over";
        ctx.rect(lastX,lastY,(x - lastX),(y - lastY));
        if(sym_H && sym_V) {
            ctx.moveTo(canvas.width - lastX, canvas.height - lastY);
            ctx.rect(canvas.width - lastX, canvas.height - lastY,(-(x - lastX)),(-(y - lastY)));
        }
        if(sym_H){
            ctx.moveTo(lastX, canvas.height - lastY);
            ctx.rect(lastX, canvas.height - lastY,(x - lastX),(-(y - lastY)));
        }
        if(sym_V) {
            ctx.moveTo(canvas.width - lastX, lastY);
            ctx.rect(canvas.width - lastX,lastY,(-(x - lastX)),(y - lastY));
        }
        if(fill) {
            console.log(fill);
            ctx.fillStyle = $('#colorfill').val();
            ctx.fill();
        }
        ctx.closePath();
        ctx.stroke();
        line = true
    }
}

function drawCircle(x, y){

    ctx.beginPath();
    ctx.strokeStyle = $('#colorpick').val();
    ctx.lineWidth = $('#sizepick').val();
    ctx.lineJoin = "round";
    if(line) {
        ctx.moveTo(x, y);
        lastX = x;
        lastY = y;
        line = false;
    } else {
        ctx.globalCompositeOperation="source-over";
        var rayon = Math.sqrt(Math.pow(lastX - x, 2) + Math.pow(lastY - y, 2));
        ctx.arc(lastX,lastY,rayon,0,Math.PI*2,false);
        if(sym_H && sym_V) {
            ctx.moveTo(canvas.width - lastX + rayon, canvas.height - lastY);
            ctx.arc(canvas.width - lastX, canvas.height - lastY,rayon,0,Math.PI*2,false);
        }
        if(sym_H){
            ctx.moveTo(lastX + rayon, canvas.height - lastY);
            ctx.arc(lastX, canvas.height - lastY,rayon,0,Math.PI*2,false);
        }
        if(sym_V) {
            ctx.moveTo((canvas.width + rayon) - lastX, lastY);
            ctx.arc(canvas.width - lastX,lastY,rayon,0,Math.PI*2,false);
        }
        if(fill) {
            ctx.fillStyle = $('#colorfill').val();
            ctx.fill();
        }
        line = true;
    }
    ctx.closePath();
    ctx.stroke();
}
