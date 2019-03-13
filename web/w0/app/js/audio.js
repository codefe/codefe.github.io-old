(function() {
	window.onload=function(){
		var musicBar = document.getElementById("musicBar"),
			volBar = document.getElementById("volBar"),
			player = document.querySelector('audio'),
			btnPlayPause = document.querySelector('#btn-playPause'),
			currentTime = document.querySelector('#currentTime'),
			totalTime = document.querySelector('#totalTime'),
			musicLyricItems = document.querySelector('#musicLyricItems'),
			musicPic = document.querySelector('#musicPic'),
			musicList = document.querySelector('#musicList'),
			musicPic = document.querySelector('#musicPic'),
			musicName = document.querySelector('#musicName'),
			musicNamePlay = document.querySelector('#musicNamePlay'),
			tabMusic = document.querySelectorAll('#tabMusic>span'),
			lyricIndex = 0,
			lyric = null;

		//渲染列表
		function setMusicList(flag) {
			let tmpData = musicData[flag];
			let str = '<dt class="flex"><label>&nbsp;</label><span>标题</span><span>来源</span><span>时长</span></dt>';
			for (let rs in tmpData) {
				str += '<dd class="flex"><label>&nbsp;</label><span>' + tmpData[rs].title + '</span><span class="btnCtr" id=' + rs + '><i></i></span><span>' + tmpData[rs].form + '</span><span>' + tmpData[rs].time + '</span></dd>';
			}
			musicList.innerHTML = str;
			var obj = musicList.querySelectorAll('dd');
			for (let item of obj) {
				item.querySelector('.btnCtr').addEventListener('click', function() {
					changeMusic(this.id,flag);
					togglePlay();
				})
			}
		}
		function initAudio() {
			Gs.getData('./app/'+Gs.getPara('id')+'/index.json').then((json)=>{
				musicData.def = json.children;
				setMusicList('def');
				autoTab();
				//加载默认歌曲
				changeMusic(0,'def','start');
			})
		}
		initAudio();
		//切换列表btn
		function autoTab(){
			tabMusic.forEach(function (item, index) {
				item.addEventListener('click', function () {
					clearCur();
					item.classList.add('cur');
					setMusicList(this.id);
					changeMusic(0, this.id, 'start');
					pause();
				})
			});
		}
		
		//切换列表btn cur clear
		function clearCur() {
			tabMusic.forEach(function (item, index) {
				item.classList.remove('cur');
			});
		}
		//切换歌曲
		function changeMusic(id,name,flag) {
			let data = musicData[name][id];
			player.src = data.src;
			player.load();
			showLoading();
			loadLyric(data.lyric);
			updateTxt(data,flag);
			var obj = musicList.querySelectorAll('dd');
			obj.forEach(function (item, idx) {
				if (id == idx) { 
					item.classList.add('on');
				} else {
					item.classList.remove('on');
				}
			})
		}
		
		//添加监听事件
		btnPlayPause.addEventListener('click', togglePlay);//播放暂停
		player.addEventListener('timeupdate', updateProgress);//当前播放位置
		player.addEventListener('canplay', function () {//数据已加载
			totalTime.textContent = formatTime(player.duration);
			setTimeout(clearLoading, 500);
		});
		player.addEventListener('ended', function () {//播放结束
			player.currentTime = 0;
			updateProgress();
			musicLyricItems.setAttribute('style','top:100px');
			btnPlayPause.innerHTML = '<i class="ic ic-play"></i>';
		});
		//加载歌词
		function loadLyric(url){
			lyric = null;
			if (url.length > 2) {
				Gs.getData(url, 'audio').then((json) => {
					lyric = parseLyric(json);
					setLyric();
				});
			} else {
				musicLyricItems.innerHTML = '<p>没有内空！</p>';
			}
			
		}
		//渲染歌词
		function setLyric(){
			let tmp = '';
			for(let rs in lyric){
				if(rs == lyricIndex){
					tmp += '<p class="on">'+lyric[rs].txt+'</p>'
				}else{
					tmp += '<p>'+lyric[rs].txt+'</p>'
				}
			}
			musicLyricItems.innerHTML = tmp;
		}
		//手动控制播放进度
		musicBar.addEventListener("change",function(){
			this.setAttribute('style','background-size:'+this.value+'% 100%');
			player.currentTime = this.value;
			currentTime.textContent = formatTime(player.currentTime);
		});
		//手动控制音量
		volBar.addEventListener("change",function(){
			this.setAttribute('style','background-size:'+this.value*100+'% 100%');
			this.value = this.value;
			player.volume = this.value;
			updateLyric()
		});
		//时间格式化
		function formatTime(time) {
			var min = Math.floor(time / 60);
			var sec = Math.floor(time % 60);
			return min + ':' + (sec < 10 ? '0' + sec : sec);
		}
		function updateTxt(data,flag) {
			musicPic.setAttribute('style','background-image:url('+data.pic+');');
			musicName.textContent = data.title;
			musicNamePlay.textContent = data.title;
		}
		//播放暂停
		function togglePlay() {
			if (player.paused) {
				btnPlayPause.innerHTML = '<i class="ic ic-stop"></i>';
				player.play();
				musicPic.classList.add('circle');
			} else {
				pause();
			}
		}
		//暂停
		function pause() {
			btnPlayPause.innerHTML = '<i class="ic ic-play"></i>';
			player.pause();
			musicPic.classList.remove('circle');
		}
		//更新播放进度条
		function updateProgress() {
			var current = player.currentTime;
			var percent = current / player.duration * 100 || 0;
			musicBar.setAttribute('style','background-size:'+percent+'%  100%');
			musicBar.value = percent;
			currentTime.textContent = formatTime(current);
			setTimeout(updateLyric,10000);
		}
		//处理歌词
		function parseLyric(lrc) {
			var lyrics = lrc.split("\n");
			var lrcObj = [];
			for(var i=0;i<lyrics.length;i++){
				var lyric = decodeURIComponent(lyrics[i]);
				var timeReg = /\[\d*:\d*((\.|\:)\d*)*\]/g;
				var timeRegExpArr = lyric.match(timeReg);
				if(!timeRegExpArr)continue;
				var clause = lyric.replace(timeReg,'');
				for(var k = 0,h = timeRegExpArr.length;k < h;k++) {
					var t = timeRegExpArr[k];
					var min = Number(String(t.match(/\[\d*/i)).slice(1)),
						sec = Number(String(t.match(/\:\d*/i)).slice(1));
					var time = min * 60 + sec;
					lrcObj.push({
						time:time,
						txt: clause
					})
				}
			}
			return lrcObj;
		}
		// 计算歌词居中的 top值
		function clacTop(){
			let top = 100 - 30 * lyricIndex;
			musicLyricItems.setAttribute('style','top:'+top+'px');
		}
		/* 滚动歌词 高亮同步 */
		function updateLyric() {
			var value = Math.floor(player.currentTime);
			for(let rs in lyric){
				if(lyric[rs].time === value){
					lyricIndex = rs;
					setLyric();
					clacTop();
					break;
				}
			}
		}
		/* 弹出加载 */
		function showLoading() {
			var node = document.createElement("section");
			node.id = 'loading';
			document.body.appendChild(node)
		}
		/* 删除弹出加载 */
		function clearLoading() {
			document.body.removeChild(document.querySelector("#loading"));
		}
	}
})();