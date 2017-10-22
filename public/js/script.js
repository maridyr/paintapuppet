var frameSelectorButton = $('[data-action="selectFrame"]'),
    frameOptions        = $('[data-target="frame-option"]'),
    colorOptions        = $('[data-color]'),
    strokeOptions       = $('[data-stroke]'),
    exitButton          = $('[data-action="exit"]'),
    canvas              = $('[data-target="canvas"]')[0],
    context             = canvas.getContext('2d'),
    isDrawing;


frameOptions.on('click', function () {
    frameOptions.removeClass('selected');
    $(this).addClass('selected');
});

frameSelectorButton.on('click', function(e) {
    var mask      = document.createElement('img'),
        src       = $('[data-target="frame-option"].selected').find('img').attr('src'),
        container = $('[data-target="canvas-container"]');

    $(mask).ready(function() {
        mask.src = src;

        if (mask.height > mask.width) {
            canvas.height  = container.height() - 60;
            canvas.width = canvas.height * (mask.width / mask.height);
        } else {
            canvas.width  = container.width() - 60;
            canvas.height = canvas.width * (mask.height / mask.width);
        }

        context.drawImage(mask, 0, 0, canvas.width, canvas.height);
        context.globalCompositeOperation = 'source-atop';

        context.beginPath();
        context.rect(0, 0, canvas.width, canvas.height);
        context.fillStyle = "white";
        context.fill();
        context.lineCap = "round";
        context.lineJoin = "round";
        context.closePath();

        $('[data-target="frame-options"]').hide();
        $(canvas).show();
        $('[data-target="tools"]').show();
        $('[data-target="actions"]').show();

        enableDrawing();
    });
});

colorOptions.on('click', function() {
    context.beginPath();
    context.closePath();
    context.strokeStyle = $(this).data('color') || context.strokeStyle;
    colorOptions.removeClass('selected');
    $(this).addClass('selected');
});

strokeOptions.on('click', function() {
    context.beginPath();
    context.closePath();
    context.lineWidth = $(this).data('stroke') || context.lineWidth;
    strokeOptions.removeClass('selected');
    $(this).addClass('selected');
});

exitButton.on('click', function() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    $(canvas).hide();
    $('[data-target="tools"]').hide();
    $('[data-target="actions"]').hide();
    $('[data-target="frame-options"]').show();
    colorOptions.removeClass('selected');
    colorOptions.first().addClass('selected');
    strokeOptions.removeClass('selected');
    strokeOptions.first().addClass('selected');
});

function enableDrawing() {
    $(canvas).on('mousedown', function (e) {
        var offset = $(canvas).offset();
        isDrawing = true;
        context.beginPath();
        context.lineTo(e.clientX - offset.left, e.clientY - offset.top);
    });

    $(canvas).on('mousemove', function (e) {
        var offset = $(canvas).offset();
        if (isDrawing) {
            context.lineTo(e.clientX - offset.left, e.clientY - offset.top);
            context.stroke();
        }
    });

    $(canvas).on('mouseup', function () {
        isDrawing = false;
        context.closePath();
    });
}