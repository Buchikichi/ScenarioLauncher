/**
 * Repository.<br/>
 * 先読みをする貯蔵庫.
 * @author Hidetaka Sasai
 */
function Repository() {
	this.max = 0;
	this.loaded = 0;
	this.dic = {};
	this.type = 'json';
}

Repository.prototype.isComplete = function() {
	return 0 < this.max && this.max == this.loaded;
};

Repository.prototype.reserve = function(list) {
	var repository = this;

	list.forEach(function(key) {
		repository.load(key);
	});
};

Repository.prototype.makeName = function(key) {
	return key;
};

Repository.prototype.load = function(key) {
	var repository = this;
	var request = new XMLHttpRequest();
	var name = this.makeName(key);

	this.max++;
	request.open('GET', name, true);
	request.responseType = this.type;
	request.addEventListener('load', function() {
		var data = request.response;

		repository.dic[key] = data;
		repository.onload(key, name, data);
		repository.loaded++;
//		console.log('load:' + key);
	});
	request.send();
};

Repository.prototype.onload = function(key, name, data) {
	// サブクラスが実装する
};
