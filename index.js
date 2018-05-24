$(document).ready(function () {
    init();
});

var mousePressed = false;
var lastX, lastY;
var ctx;
var tool = "pencil";
var line = true;
var fill = false;


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
                // console.log('debut');
                // console.log($('#colorpick').val());
                // $('#colorfill').value = $('#colorpick').val();
                // console.log($('#colorfill').val());
                // $('#colorfill').change(function() {
                //     console.log(this.value);
                // })
            } else {
                $('#colorfill').remove();
                $('#colorfilllabel').remove();
            }
        });
    } else if(tool === 'clear') {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        tool = 'pencil';
    }
});

$('#import').change(function(){
    readURL(this);
});

function readURL(input) {

    if (input.files && input.files[0]) {

        var reader = new FileReader();
        var img = new Image();
        reader.readAsDataURL(input.files[0]);

        console.log(reader);

        reader.onload = function (e) {

            img.src = e.target.result;
            console.log(img.src);

            var img_width = img.width > ctx.width ? canvas.width : img.width;
            var img_height = img.height > ctx.height ? canvas.height : img.height;

            ctx.drawImage(img,0,0,img_width,img_height);

        }
    }
}



// todo getImageData()
function Draw(x, y, isDown) {
    console.log(tool);
    if (isDown) {
        ctx.beginPath();
        ctx.strokeStyle = $('#colorpick').val();
        ctx.lineWidth = $('#sizepick').val();
        ctx.lineJoin = "round";
        if(tool === 'eraser'){
            ctx.globalCompositeOperation="destination-out";
            ctx.moveTo(lastX, lastY);
            ctx.lineTo(x, y);
            ctx.closePath();
            ctx.stroke();
        } else {
            ctx.globalCompositeOperation="source-over";
            ctx.moveTo(lastX, lastY);
            ctx.lineTo(x, y);
            ctx.closePath();
            ctx.stroke();
        }
    }
    else{
        if(tool === 'eraser') {
            ctx.globalCompositeOperation="destination-out";
            ctx.beginPath();
            ctx.strokeStyle = $('#colorpick').val();
            ctx.lineWidth = $('#sizepick').val();
            ctx.lineJoin = "round";
            ctx.moveTo(x, y);
            ctx.arc(x, y, 0.1, 0, Math.PI * 2, false);
            ctx.closePath();
            ctx.stroke();
        }
        else {
            ctx.beginPath();
            ctx.strokeStyle = $('#colorpick').val();
            ctx.lineWidth = $('#sizepick').val();
            ctx.lineJoin = "round";
            ctx.moveTo(x, y);
            ctx.arc(x, y, 0.1, 0, Math.PI * 2, false);
            ctx.closePath();
            ctx.stroke();
        }
    }
    lastX = x; lastY = y;
}

function drawLine(x, y){

    ctx.beginPath();
    ctx.strokeStyle = $('#colorpick').val();
    ctx.lineWidth = $('#sizepick').val();
    ctx.lineJoin = "round";
    if(line) {
        ctx.moveTo(x, y);
        ctx.arc(x,y,0.1,0,Math.PI*2,false);
        ctx.closePath();
        ctx.stroke();
        lastX = x;
        lastY = y;
        line = false;
    } else {
        ctx.globalCompositeOperation="source-over";
        console.log(lastX, lastY);
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(x, y);
        ctx.closePath();
        ctx.stroke();

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
        ctx.closePath();
        ctx.stroke();
        lastX = x;
        lastY = y;
        line = false;
    } else {
        ctx.globalCompositeOperation="source-over";
        console.log(lastX, lastY);
        ctx.rect(lastX,lastY,(x - lastX),(y - lastY));
        ctx.closePath();
        if(fill) {
            console.log(fill);
            ctx.fillStyle = $('#colorfill').val();
            ctx.fill();
            ctx.stroke();
        } else {
            ctx.stroke();
            console.log(fill);
        }
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
        ctx.closePath();
        lastX = x;
        lastY = y;
        line = false;
    } else {
        ctx.globalCompositeOperation="source-over";
        var rayon = Math.sqrt(Math.pow(lastX - x, 2) + Math.pow(lastY - y, 2));
        ctx.arc(lastX,lastY,rayon,0,Math.PI*2,false);
        // ctx.ellipse(lastX, lastY, 30, 30);
        ctx.closePath();
        ctx.stroke();
        line = true
    }
}
