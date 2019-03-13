(function() {
	//模板替换
	String.prototype.tpl = function (obj) {
		return this.replace(/\$\w+\$/gi, function(matchs) {
			var returns = obj[matchs.replace(/\$/g, "")];
			return (returns + "") == "undefined"? "": returns;
		});
	};
	var Gs = {
		//右侧快速菜单
		quickMenu: function(){
			var quickHTML = '<div id="quick_menu"><a href="javascript:Gs.scrollTo()"><i class="ic-up"></i></a></div>',
			quickShell = document.createElement('div');
			quickShell.innerHTML = quickHTML;
			quickShell.className = 'quick_links_wrap';
			document.body.appendChild(quickShell);
			this.quickPanel = document.querySelector('#quick_menu');
		}(),
		//获取url参数
		getPara: function(name){
			var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
			var para = window.location.search.substring(1).match(reg);
			if (para[2]) {
				return para[2];
			}else{
				history.back(-1);
			}
		},
		//fetch网络请求
		getData: function(url,base='json'){
			return new Promise(function (resolve, reject) {
			  fetch(url+"?t="+Date.now(), {method: 'GET'})
				  .then((response) => {
					  if (base == 'audio') {
						  resolve(response.text());
						  return;
					  }
					  //console.log(response)
					  if (response.ok) {
						  return response.json();
					  } else {
						  setTimeout(function(){
								alert('Err '+response.status+' : '+response.statusText);
						  },500);
						  reject({status:response.status})
					  }
				  })
				  .then((response) => {
					  resolve(response);
				  })
				  .catch((err)=> {
					setTimeout(function(){
						alert('请求失败');
				    },500);
					reject({status:-1});
				  })
			})
		},
		tpls: {
			// footer menu
			footerMenu: `<section class="footop flex">
				<section class="foot-boxa">
					<a href="">H5</a>
					<a href="">C3</a>
					<a href="">JS</a>
				</section>
				<section class="foot-a">
					<a href="1">首页</a>
					<a href="2">关于</a>
					<a href="3">服务</a>
					<a href="4">案例</a>
					<a href="5">动态</a>
					<a href="6">联系</a>
				</section>
				<section class="foot-boxa">
					<a href="">V</a>
					<a href="">R</a>
					<a href="">J</a>
				</section>
			</section>`,
			//友情链接
			links: '<a href="$url$" target="_blank">$name$</a>',
			//列表内空
			listCon: `<li>
				<a href="$url$">
					<p class="zoomImg" style="background-image:url($img$)"></p>
					<h3>$name$</h3>
					<h5><span>中级</span><span>34343</span></h5>
				</a>
			</li>`
		},
		//获取标签
		$: function(id){
			return document.querySelector(id)
		},
		
		//数据处理
		obj: {
			json: {},
			//把name内容添加到listBox标签中
			append: function(name){
				this.listBox.innerHTML = this[name]();
				return this;
			},
			// home list
			home: function (data) {
				var vcurrent = Gs.$('#gg'),
					fragment = document.createDocumentFragment(),
					newNode = null,
					newNodeTitle = null,
					newNodeUl = null,
					str = '',str2 = '';

				data.forEach((item, index) => {
					newNode = document.createElement('section');
					newNode.className = 'wrap';
					newNodeTitle = document.createElement('h1');
					newNodeTitle.className = 'home-title';
					newNodeTitle.innerHTML = item.name;
					newNode.appendChild(newNodeTitle);
					
					str = ''; str2 = '';
					item.children.forEach((rs, i) => {
						// str += Gs.tpls.listCon.tpl(rs);
						if (i < 5) {
							str += Gs.tpls.listCon.tpl(rs);
						} else if (i > 4 && i < 10) {
							str2 += Gs.tpls.listCon.tpl(rs);
						} else {
							return false;
						}
					});
					if (str) {
						newNodeUl = document.createElement('ul');
						newNodeUl.className = 'flex flex-justify flex-homelist';
						newNodeUl.innerHTML = str;
						newNode.appendChild(newNodeUl);
					}
					if (str2) {
						newNodeUl = document.createElement('ul');
						newNodeUl.className = 'flex flex-justify flex-homelist';
						newNodeUl.innerHTML = str2;
						newNode.appendChild(newNodeUl);
					}
					fragment.appendChild(newNode)
					vcurrent.parentNode.insertBefore(fragment, vcurrent);
				});
			},
			// init
			init: function (page) {
				Gs.getData('./app/json/menu.json').then((json) => {
					Gs.$('#footer').innerHTML = this.footer(json)
					Gs.$('#headNav').innerHTML = this.nav(json.nav)
					if (page == 'home') {
						this.home(json.nav);
					}
					this.btnSound();
				});
			},
			//加声音
			btnSound: function () {
				var s = document.createElement('audio');
				s.src = './app/sound/chime.ogg';
				s.load();
				document.body.appendChild(s);
				document.querySelectorAll('.btnSound').forEach(function (item, index) {
					item.addEventListener('mouseenter', function () {
						s.pause();
						s.play();
					})
				})
			},
			nav: function (data) {
				return `<button class="btn btn-logo btnSound"><a href="./"><img src="app/img/logo.jpg" height="55">LOGO</a></button>
						<nav class="bgwrite">
							<section class="btn-menu">
								<button class="btn btn-tip">
									<b class="navbtn"></b>
								</button>
								<section class="flex">
									<section class="menu-nav">
										${this.menuNav(data)}
									</section>
									<section class="flex-item">qqqqqq</section>
								</section>
							</section>
						</nav>
						<button class="btn btn-success btn-nav">免费注册</button>
						<button class="btn btn-tip"><img src="app/img/tip.png" height="28"><i>88</i></button>`
			},
			menuNav: function (data) {
				let str = ''
				for (let rs of data) {
					str += '<nav><p>' + rs.name + '</p><ul>'
					for (let item of rs.children) {
						str += '<li>'+item.name+'</li>'
					}
					str += '</ul></nav>'
				}
				return str
			},
			footer: function (data) {
				return `<section class="bg-footer"></section>
				<h3>与其在别处仰望 不如在这里并肩</h3>
				${Gs.tpls.footerMenu}
				<section class="flex foot-nav">
					${this.footerNav(data.nav)}
				</section>
				<section class="links textHidden mlr30">
					<span>友情链接：</span>
					${this.footerLinks(data.links)}
				</section>
				<section class="flex copy">
					<span>Copyright © 2016 Crazy web</span>
					<span>沪ICP备021888888号</span>
				</section>`
			},
			footerNav: function (data) {
				let str = ''
				for (let rs of data) {
					str += '<dl><dt>'+rs.name+'</dt>'
					for (let item of rs.children) {
						str += '<dd>'+item.name+'</dd>'
					}
					str += '</dl>'
				}
				return str
			},
			footerLinks: function (data) {
				let str = ''
				for (let item of data) {
					str += Gs.tpls.links.tpl(item);
				}
				return str;
			}
			
		},
		//弹出框
		pop: {
			initflag : false,
			bg : null,
			cont:null,
			msg : null,
			ok : null,
			init : function() {
				if (this.initflag){
					this.show();
					return;
				}
				var txt = '<div class="alert-ui-bg"></div><div class="alert-ui-cont"><div class="alert-ui-tit">提示</div><div class="alert-ui-msg"></div><div class="alert-ui-btnc"><a class="alert-ui-btn-ok">确定</a></div></div>';
				var obj = document.createElement('div');
				obj.innerHTML = txt;
				obj.className = 'pop';
				document.body.appendChild(obj);
				var WIN_W = window.innerWidth;
					this.bg   =  document.querySelector('.alert-ui-bg');
					this.cont =  document.querySelector('.alert-ui-cont');
					this.msg  =  document.querySelector('.alert-ui-msg');
					this.ok   =  document.querySelector('.alert-ui-btn-ok');
					
				this.cont.style.left = (WIN_W-250)/2 + 'px';
				this.initflag = true;
				this.ok.addEventListener('click',this.hide);
				this.bg.addEventListener('click',this.hide);
			},
			alert: function(msg) {
				this.init();
				this.msg.innerHTML = msg;
			},
			hasClass: function(ele, cls){
				return ele.className.match(new RegExp("(\\s|^)" + cls + "(\\s|$)"));
			},
			addClass: function(ele, cls){
				if (!this.hasClass(ele, cls)) ele.className += " " + cls;
			},
			removeClass: function(ele, cls) {
				if (this.hasClass(ele, cls)) {
					var reg = new RegExp("(\\s|^)" + cls + "(\\s|$)");
					ele.className = ele.className.replace(reg, " ");
				}
			},
			hide: function(){
				Gs.pop.addClass(Gs.pop.cont,'alert-hide');
				setTimeout(function(){
					Gs.pop.cont.style.display="none";
					Gs.pop.bg.style.display="none";
				},300);
			},
			show: function(){
				this.bg.style.display = 'block';
				this.removeClass(this.cont, 'alert-hide');
				this.cont.style.display = 'block';
				this.cont.style.left = (window.innerWidth-250)/2 + 'px';
			}
		},
		//读写文件
		file: {
			//编辑器
			flag:false,//是否需要加载
			editor: null,
			//读取文件
			read: function(files){
				if (files.length) {
					var file = files[0];
					var reader = new FileReader();//new一个FileReader实例
					reader.onload = function() {
							var json = JSON.parse(this.result);
							var html ='';
							for(var obj in json.data){
								if(obj === 'content'){
									Gs.file.flag = true;
									html += '<dl class="flex-wrap"><dt>'+obj+'</dt><dd id="weditor">'+json.data[obj]+'</dd></dl>';
								}else if(obj === 'items'){
									Gs.file.flag = false;
									html += '<dl class="flex-wrap"><dt>'+obj+'</dt><dd><textarea name="'+obj+'">'+JSON.stringify(json.data[obj])+'</textarea></dd></dl>';
								}else{
									html += '<dl class="flex-wrap"><dt>'+obj+'</dt><dd><input name="'+obj+'" value="'+json.data[obj]+'"></dd></dl>';
								}
							}
							document.querySelector('#form').innerHTML = html;
							//加载编辑器
							if(Gs.file.flag){
								var E = window.wangEditor;
								Gs.file.editor = new E('#weditor');
								Gs.file.editor.customConfig.menus = ['head','bold','italic','underline','strikeThrough','foreColor','link','list','quote','image','table','video','code','undo','redo'];
								Gs.file.editor.create();
							}							
						}
						reader.readAsText(file);
				}
			},
			//保存文件
			fake_click: function(obj){
				var ev = document.createEvent("MouseEvents");
				ev.initMouseEvent(
					"click", true, false, window, 0, 0, 0, 0, 0
					, false, false, false, false, 0, null
					);
				obj.dispatchEvent(ev);
			},
			download: function(name,data){
				var urlObject = window.URL || window.webkitURL || window;
				var downloadData = new Blob([data]);
				var save_link = document.createElementNS("http://www.w3.org/1999/xhtml", "a");
				save_link.href = urlObject.createObjectURL(downloadData);
				save_link.download = name;
				this.fake_click(save_link,name);
			},
			//调用保存方法
			saveFile: function(){
				document.execCommand('saveas','true','11.htm');
				var obj = document.querySelector('#form');
				var data = obj.querySelectorAll('input,textarea');
				var json = {sta:1,data:{}};
				for(var i=0,len=data.length;i<len;i++){
					json.data[data[i].name] = data[i].value;
				}
				if(Gs.file.flag){
					json.data.content = Gs.file.editor.txt.html();
				}
				this.download("s1-.json",JSON.stringify(json).replace(/(<!--).*?(-->)/g,''));
			}
		},
		//返回顶部
		noop: function(){},
		scrollTo: (function(){
			var 
			duration = 480,
			setTop = function(top){ window.scrollTo(0, top);},
			fxEase = function(t){return (t*=2)<1?.5*t*t:.5*(1-(--t)*(t-2));};
			return function(top, callback){
				top = Math.max(0, ~~top);
				var 
				tMark = new Date(),
				currTop = document.body.scrollTop || document.documentElement.scrollTop,
				height = top - currTop,
				fx = function(){
					var tMap = new Date() - tMark;
					if(tMap >= duration){
						setTop(top);
						return (callback || Gs.noop).call(Gs, top);
					}
					setTop(currTop + height * fxEase(tMap/duration));
					setTimeout(fx, 16);
				};
				fx();
			};
		})()
	};
	window.Gs = Gs;
	window.alert = function(msg) {
		Gs.pop.alert(msg);
	}
})();