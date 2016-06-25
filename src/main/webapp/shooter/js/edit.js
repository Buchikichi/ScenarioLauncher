$(document).ready(function() {
	var win = $(window);
	var body = $('body');
	var canvas = document.getElementById('canvas');
	var ctx = canvas.getContext('2d');
	var slider = $('#slider');
	var landform = new Landform(canvas);

	landform.isEdit = true;
	$('#bg').change(function() {
		var file = this.files[0];

		landform.load(file);
	});
	$(landform.img).load(function() {
		slider.val(0);
		slider.attr('max', this.width / Landform.BRICK_WIDTH);
		slider.slider('refresh');
	});
	slider.change(function() {
		landform.x = slider.val() * Landform.BRICK_WIDTH;
	});
	$('#generateButton').click(function() {
		landform.generateBrick(ctx);
	});
	$('#map').change(function() {
		var file = this.files[0];

		landform.loadMapData(file);
	});
	setupActorList(landform);

	$(canvas).mousemove(function(e) {
		var magni = landform.magni;
		var mx = e.offsetX / magni;
		var my = e.offsetY / magni;
		landform.target = {x: mx, y: my};
	});
	win.resize(function() {
		var body = $('body');
		var header = $('#header');
		var controls = $('#controls');
		var height = body.height() - header.outerHeight(true) - controls.outerHeight(true) - 4;
		var magniH = body.width() / Field.WIDTH;
		var magniV = height / Field.HEIGHT;
		var magni = Math.min(magniH, magniV);

		canvas.width = Field.WIDTH * magni;
		canvas.height = Field.HEIGHT * magni;
		landform.magni = magni;
	});
	win.resize();

//landform.load('./img/stage01bg.png');
//landform.loadMapData('./img/stage01map.png');
	var activate = function() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		landform.draw();
		setTimeout(function() {
			activate();
		}, 33);
	};
	activate();
});

function setupActorList(landform) {
	var actorList = $('#actorList');
	var container = actorList.controlgroup('container');

	Enemy.LIST.forEach(function(rec, ix) {
		var id = 'actor' + ix;
		var input = $('<input type="radio" name="actor"/>').attr('id', id).val(ix + 1);
		var label = $('<label></label>').text(rec.name).attr('for', id);
		var img = $('<img/>').attr('src', 'img/' + rec.img);

		rec.instance = new rec.type(landform);
		container.append(input);
		container.append(label.prepend(img));
	});
	actorList.parent().trigger('create');
	actorList.find('input').click(function() {
		landform.selection = this.value;
	});
}

function Field(){}
Field.WIDTH = 512;
Field.HEIGHT = 224;
