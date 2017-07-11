/**
 * 工具类方法
 */
var utils = {};
var win = window;
var doc = document;

/**
 * JSON转化为请求参数字符串
 * @param  {Object} json [description]
 * @return {[type]}      [description]
 */
utils.jsonToQueryStr = (json={})=>{
  let arr = [];
  for(var key in json){
    if(json[key]){
      arr.push(`${key}=${json[key]}`);
    }else{
      arr.push(`${key}=`);
    }
  }
  return arr.join('&');
};

/**
 * 给URL添加参数返回新的URL
 * @param  {String} url  [description]
 * @param  {Object} json [description]
 * @return {String}      [description]
 */
utils.urlAddParams = (url='', json={})=>{
  if(!url){ return ''; }
  const part1 = url.split('#')[0];
  let newUrl = url;
  let sign = '?';
  if(url.indexOf('?') === -1){
    sign = '?'; 
  }else{

  }
  return newUrl;
}

/**
 * 请求参数字符串转化为JSON
 * @param  {String} str [description]
 * @return {[type]}     [description]
 */
utils.parseQuery = (str='')=>{
  let json = {};
  let arr = str.split('&');
  for(let i=0; i<arr.length; i++){
    let temp = arr[i].split('=');
    let key = temp[0];
    if(!key){ continue; }
    let val = '';
    if(temp.length > 1){
      val = temp[1];
    }
    json[key] = val;
  }
  return json;
};

/**
 * 将 Date 转化为指定格式的String
 * 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符， 
 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) 
 * 例子： 
 * (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423 
 * (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18 
 */
utils.formatDate = (date, fmt)=>{
  if(!date) {
    return '';
  }
  if(!(date instanceof Date)){
    let dateCopy = date;
    try{
      date = new Date(dateCopy);
    }catch(ex){
      return date;
    }
  }
  let o = {
      "M+": date.getMonth() + 1, // 月份 
      "d+": date.getDate(), // 日 
      "H+": date.getHours(), // 小时 
      "m+": date.getMinutes(), // 分 
      "s+": date.getSeconds(), // 秒 
      "q+": Math.floor((date.getMonth() + 3) / 3), // 季度 
      S: date.getMilliseconds() // 毫秒 
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
  }
  for (let k in o){
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    }
  }
  return fmt;
};

/**
 * 获取计算后的样式
 * @param  {[type]} element [description]
 * @param  {[type]} attr    [description]
 * @return {[type]}         [description]
 */
utils.getComputedStyle = (element, attr)=>{
  if(win.getComputedStyle){
    return win.getComputedStyle(element, null)[attr];
  }else if(element.currentStyle){
    return element.currentStyle[attr];
  }
};

/**
 * 获取当前的运行环境
 * @return {string} dev|test|dryrun|pre|prod
 */
utils.getEnv = ()=>{
  let sp = (win.location.search||'').slice(1);
  return win._opencasterEnv_ || utils.parseQuery(sp)['_opencasterEnv_'] || 'prod'; //默认返回生产环境
};

/**
 * 获取当前连接的网络类型
 * @return {[type]}
 */
utils.getNetConnType = ()=>{
  const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection || {type:'unknown'};
  const type_text = ['unknown','ethernet','wifi','2g','3g','4g','none'];
  if(typeof(conn.type) == "number"){
    return type_text[conn.type];
  }else{
    return conn.type;
  }
};

/**
 * console功能
 * @type {Object}
 */
utils.console = {};
utils.console.error = (msg='')=>{
  if(console && console.error && msg){
    console.error(msg);
  }
};

/**
 * 获取当前执行脚本的文件URL
 * @return {[type]} [description]
 */
utils.getCurScriptUrl = ()=>{
  if(doc.currentScript){
    return doc.currentScript.src;
  }else{
    return doc.scripts[doc.scripts.length - 1].src;
  }
};
/**
 * 获取当前执行脚本的文件Path
 * @return {[type]} [description]
 */
utils.getCurScriptPath = ()=>{
  var scriptUrl = utils.getCurScriptUrl();
  return scriptUrl.slice(0, scriptUrl.lastIndexOf('/') + 1)
};

/**
 * 通过url加载一个样式文件
 * @param  {[type]} url [description]
 * @return {[type]}     [description]
 */
utils.loadStyle = (url)=>{
  var style = doc.createElement('link');
  style.rel = 'stylesheet';
  style.href = url;
  doc.head.appendChild(style);
};

/**
 * 获取UUID
 * @return {[type]} [description]
 */
utils.getUid = ()=>{
  let api = win.yunos || {};
  let id = api.uuid || 'E404';
  // if(!id) { return ''; }
  id = id.toUpperCase();
  let randomNum = utils.getRandomHexNum();
  let rs = [utils.decimal2HexChar(randomNum)];
  for(let i=0,len=id.length; i<len; i++){
    let s = id[i]; 
    let n = (utils.hexChar2Decimal(s) + randomNum) % 16;
    rs.push(utils.decimal2HexChar(n));
  }
  return rs.join('');
};

/**
 * 获取一个随机的十六进制数对应的十进制数字
 * @return {[type]} [description]
 */
utils.getRandomHexNum = ()=>{
  return Math.floor((Math.random() * 15));
};

/**
 * 将十进制数字转换为十六进制的字符
 * @param  {[type]} num [description]
 * @return {[type]}     [description]
 */
utils.decimal2HexChar = (num)=>{
  if(num < 0){
    return '0';
  }else if(num < 10){
    return num + '';
  }else{
    let hex = ['A','B','C','D','E','F'];
    num = Math.min(num, 15);
    return hex[num - 10];
  }
};

/**
 * 十六进制字符转换为十进制数字
 * @param  {[type]} hex [description]
 * @return {[type]}     [description]
 */
utils.hexChar2Decimal = (hex)=>{
  let num = parseInt(hex + '');
  if(isNaN(num)){
     num = (hex + '').charCodeAt() - 55;
  }
  return Math.max(Math.min(num, 15), 0);
};

/**
 * DOM操作
 */
utils.dom = {};
utils.dom.insertAfter = (newElement, targetElement)=>{
  var parent = targetElement.parentNode;
  if (parent.lastChild == targetElement) {
    parent.appendChild(newElement);
  }else {
    parent.insertBefore(newElement, targetElement.nextSibling);
  }
};
utils.dom.removeElement = (element)=>{
  var parentElement = element.parentNode;
  if(parentElement){
    parentElement.removeChild(element);  
  }
}

export default utils;