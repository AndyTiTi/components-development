/**
 * 预加载图片函数
 * @param  {[type]}   images   [description]
 * @param  {Function} callback [description]
 * @param  {[type]}   timeout  [description]
 * @return {[type]}            [description]
 */
function loadImage(images,callback,timeout){
	// 加载完成图片的计数器
	var count = 0;
	// 全部图片加载成功的一个标志位
	var success = true;
	// 超时timer的id
	var timeoutId = 0;
	// 是否加载超时的标志位
	var isTimeout = false;
	// 对图片数组或对象进行遍历
	for(var key in images){
		if(!images.hasOwnProperty(key)){
			continue;
		}
		// 获得每个图片元素 期望格式为object:{src:xxx}
		var item = images[key];
		if(typeof item === 'string'){
			item = images[key] = {
				src:item
			}
		}
		// 如果格式不满足期望，则丢弃词条数据进行下一次遍历
		if(!item||!item.src){
			continue;
		}
		// 基数+1
		count++;
		// 设置图片元素的id
		item.id = '__img__'+key+getId();
		// 设置图片元素的img，它是一个Image对象
		item.img = window[item.id] = new Image();

		doLoad(item);
	}

	// 遍历完成如果基数为0，直接调用callback
	if(!count){
		callback(success);
	}else if(timeout){
		timeoutId = setTimeout(onTimeout,timeout);
	}

	// 真正进行图片加载的函数 item  图片元素对象
	function doLoad(item){
		item.status = 'loading';
		var img = item.img;
		img.onload = function(){
			success = success & true;
			item.status = 'loaded';
			done();
		}
		img.onerror = function(){
			success = false;
			item.status = 'error';
			done();
		}
		// 发起了一个http请求加载图片
		img.src = item.src;
		// 每张图片加载完成的回调函数
		function done(){
			img.onload = img.onerror = null;
			try{
				delete window[item.id];
			} catch (e){

			}
			// 每张图片加载完成，计数器减一，所有图片加载完成且没有超时，清除超时计时器，并执行回调函数
			if(!--count && !isTimeout){
				clearTimeout(timeoutId);
				callback(success);
			}
		}
	}

	/**
	 * 超时函数
	 * @return {[type]} [description]
	 */
	function onTimeout(){
		isTimeout = true;
		callback(false);
	}
}
// 获取id自增
var __id = 0;
functioni getId(){
	return ++__id;
}
module.exports = loadImage;