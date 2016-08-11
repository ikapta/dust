/**
 * @author xylonhuang
 * @version 1.2.3
 * @date 2010.09.15
 * @class milo.biz.Dialog 
 * 浮层对话框<br/>
 * modified by cathzhang on 2011-10-18<br/>
 * modified content 修改结构为模块化定义的方式 <br/>
 * modified content 对部分方法调整为milo的base库方法<br/>
 * modified content 增加zIndex属性，可提供调用<br/>
 * 更改命名从showDialog=>Dialog<br/>
 * modified by xy on 2011-12-20<br/>
 * modified content 将源showDialog更新到1.1.9 <br/>
 * modified by xy on 2011-12-28<br/>
 * modified content 增加fixed和iTop属性，可以自定义是否固定弹出框 <br/>
 * modified content 修改在ie6下fixed的一个bug， <br/>
 * modified by xy on 2012-12-4<br/>
 * modified content 修改一些小bug <br/>
 * modified by xy on 2013-3-13<br/>
 * modified content 优化了在长弹出框下的一个bug <br/>
 * modified by xy on 2013-4-1<br/>
 * modified content 优化了在超长弹出框下背景的一个bug <br/>
 * modified content 添加了无障碍支持 <br/>
 * modified content 添加PopzIndex支持，可以自己修改弹出层的层级，默认9999 <br/>
 * modified by xy on 2013-4-17<br/>
 * modified content 修改了一个弹出层关不了的bug <br/>
 * modified content 删除了大量垃圾代码 <br/>
 * modified content 添加isNoAccessible参数，可以关闭无障碍支持，默认开启（true） <br/>
 * modified content 删除了旧的调用模式支持 <br/>
 * modified by xy on 2013-4-23<br/>
 * modified content 修改几个关于无障碍支持的bug <br/>
 * @demo http://gameact.qq.com/milo/biz/dialog.html
 */ 
namespace("showDialog");
define(function () {
    var M = milo,
        oIfrBg,fixIECenter, oOverLay, 
		popType ='',
		fMsgClose = null,
        fixOverlay = null,
        dialogElement = null, 
        lastFocus = null, 
		focusHandle = null,
		escCloseHandle = null,
		bOverlay = false,
        isLongPopBox = false,
        dialogOpen = false,
        oBw = M.browser,
        isIE = oBw.msie,
        bVsn = oBw.version,
        isIE6 = isIE && bVsn == '6.0',
        isIE9 = isIE && bVsn == '9.0',
        isSafari = oBw.safari,
        oWin = window,
        oDoc = document,
        oBody = oDoc.body,
        oDel = oDoc.documentElement,
        IFRAME_ID = '_PopupIframe_',
        MESSAGE_ID = '_PopupMsg_',
        OVERLAY_ID = '_overlay_';
        /**
         * 显示对话框
         * 入口方法,处理属性
         * @param {object} p 显示样式
         * @return {undefined}
         */
    var dialogs = {
        show: function (p) {
            var _p = (typeof (p) === 'object') ? p : {},
				_sAuto = 'auto';
            this.id            = _p.id           || null;
            this.bgcolor       = _p.bgcolor      || '#111';
            this.opacity       = _p.opacity      || 70;
            this.src           = _p.src          || null;
            this.fixed         = _p.fixed        || false;
            this.iTop          = _p.iTop         || _sAuto;
            this.iWidth        = _p.iWidth       || _sAuto;
            this.iHeight       = _p.iHeight      || _sAuto;
            this.sMsg          = _p.sMsg         || null;
            this.sClass        = _p.sClass       || null;
            this.sStyles       = _p.sStyle       || 'padding:10px;border:4px solid #dedede;background-color:#fff';
            this.sTime         = _p.sTime        || null;
            this.delayPop      = _p.delayPop     || false;
            this.sPzIndex      = _p.PopzIndex    || 9999;
			this.isNoAccessible  = _p.isNoAccessible || false;
            if (this.sPzIndex < 9) {
                this.sPzIndex = 9
            }
            this.onPopupCallback = _p.onPopupCallback || null;
            this.onCloseCallback = _p.onCloseCallback || null;
            this.hasFrame = _p.bFrame || false;
			
			if(typeof(p) == "string" && p != null && p!= ''){
				this.id=p
			}

			if(arguments.length==4){
					this.src=arguments[0];
					this.iWidth=arguments[1];
					this.iHeight=arguments[2];
			}

            if (this.id == null && this.src == null && this.sMsg == null) {
                return
            }
			if(dialogOpen){
				this.hide({isNoCloseOverLay:true})
			}
            if (this.src != null) {
                this.id = IFRAME_ID;
				popType = 'iframe';
				return this.popupInit()
            }
            if (this.sMsg != null) {
                this.id = MESSAGE_ID;
				popType = 'message';
				return this.popupInit()
            }
            if (this.id != null) {
				dialogElement = M.g(this.id);
				popType = 'dialog';
				return this.popupInit()
            }
        },
        /**
         * 对话框初始化
         * @return {undefined}
         */
        popupInit: function () {
            var _callBack = this.onPopupCallback,
                _zIndex = this.sPzIndex,
                _that = this,
                _oIfrWrap, _oIframe, _oMsg, _class, _length,_msgCloseTime;
            if (typeof (_callBack) === 'function') {
                _callBack()
            }
			if (oOverLay === undefined) {
                oOverLay = M.g(OVERLAY_ID)
            }
            if (!bOverlay) {
                if (oOverLay) {
                    M.setStyle(oOverLay, {
                        backgroundColor: this.bgcolor,
                        zIndex: _zIndex - 1,
                        display: 'block'
                    });
                } else {
                    this.overlay()
                }
            }

            if (popType === 'iframe') {

                if (!M.g(IFRAME_ID)) {
                    _oIfrWrap = oDoc.createElement('div');
                    oOverLay.parentNode.insertBefore(_oIfrWrap, oOverLay)
                } else {
                    _oIfrWrap = M.g(IFRAME_ID).parentNode
                }

                _oIfrWrap.style.display = 'none';
                _oIframe = oDoc.createElement('iframe');
                _oIframe.setAttribute('allowtransparency', 'true');
                _oIframe.setAttribute('scrolling', 'no');
                _oIframe.setAttribute('frameborder', '0');
                _oIframe.setAttribute('height', this.iHeight);
                _oIframe.setAttribute('width', this.iWidth);
                _oIframe.setAttribute('id', IFRAME_ID);
                _oIframe.src = this.src;

                if (_oIframe.attachEvent) {
                    _oIframe.attachEvent('onload', function () {
                        _that.ifrAutoHeight(_oIframe)
                    })
                } else {
                    _oIframe.onload = function () {
                        _that.ifrAutoHeight(_oIframe)
                    }
                } 

				if (!this.delayPop) {
                    _oIfrWrap.style.display = 'block'
                }

                _oIfrWrap.innerHTML = '';
                _oIfrWrap.appendChild(_oIframe);
				dialogElement = _oIfrWrap;
            }

            if (popType === 'message') {
                if (!M.g(MESSAGE_ID)) {
                    _oMsg = oDoc.createElement('div');
                    _oMsg.setAttribute('id', MESSAGE_ID);
                    oOverLay.parentNode.insertBefore(_oMsg, oOverLay)
                } else {
                    _oMsg = M.g(MESSAGE_ID);
                }
				_oMsg.style.cssText = this.sStyles;
                if (this.sClass != null) {
                    _class = isIE ? 'className' : 'class';
                    _oMsg.setAttribute(_class, this.sClass)
                }
                _oMsg.style.display = 'none';
                _oMsg.innerHTML = this.sMsg;
                if (!this.delayPop) {
                    _oMsg.style.display = 'block'
                }
                if (this.sTime != null) {
                    if(!dialogOpen){
                        clearTimeout(_msgCloseTime);
                    }
                    _msgCloseTime = setTimeout(function () {
                        _that.hide()
                    }, this.sTime);

                } else {
                    fMsgClose = function (e) {
                        var targ;
                        e = e || oWin.event;
                        targ = e.target || e.srcElement;
                        if(targ.id === OVERLAY_ID){
							M.stopPropagation(e);
                            _that.hide();
                        };
                    };
                    M.addEvent(oOverLay, 'click', fMsgClose);
                }
				dialogElement = _oMsg;
            }

			if (this.delayPop) {
				dialogElement.style.display = 'none'
			} else {
				dialogElement.style.display = 'block'
			}

			M.setStyle(dialogElement, {
				visibility: 'visible',
				position:'absolute',
				zIndex: _zIndex,
				left: '50%',
				top: '50%'
			});

            dialogElement.setAttribute('role', 'dialog');
            dialogElement.tabIndex = -1;

			if(!this.isNoAccessible){
				focusHandle = function (e) {
					var targ;
					e = e || oWin.event;
					targ = e.target || e.srcElement;
					if (dialogOpen && !dialogElement.contains(targ)) {
						M.stopPropagation(e);
						M.setStyle(dialogElement, {
							display: 'block',
							visibility: 'visible'
						});
						setTimeout(function(){
							try{
								if(dialogElement && dialogElement.offsetHeight>0){
									dialogElement.focus();
								}
							}catch(e){}
						},250)
					}
				};
				lastFocus = oDoc.activeElement;
				oDoc.onfocus = focusHandle;
				if (oDoc.addEventListener) {
					oDoc.addEventListener('focus', focusHandle, true)
				} else {
					oDoc.onfocusin = focusHandle
				}
				
				escCloseHandle = function(e){
					var code;
					e = e || oWin.event;
					code = e.keyCode || e.which;
					if (dialogOpen && code == 27 && !this.isNoAccessible) {
						_that.hide()
					}
				};
				M.addEvent(oDoc, 'keyup', escCloseHandle, true);
			}

            if (!this.delayPop) {
                this.adjust()
            }
        },
        /**
         * 对话框显示
         * 处理对话框显示
         * @return {undefined}
         */
        popup: function () {
            var _obj = dialogElement,
				_oIfrWrap;
            if (this.delayPop) {
                if (popType === 'iframe') {
                    _oIfrWrap = M.g(IFRAME_ID).parentNode;
                    _oIfrWrap.style.display = 'block'
                }
				_obj.style.display = 'block'
            }
            this.adjust()
        },
        /**
         * 对话框样式调整
         * @param {object} p 显示样式
         * @return {undefined}
         */
        adjust: function () {
			var _h = M.getWinHeight(),
                _imh = M.getMaxH(),
                _rt = null,
                _st = null,
                _that = this,
                _obj = dialogElement, 
				_iw, _ih, _iTop, _iPh;
			if (oOverLay === undefined) {
				oOverLay = M.g(OVERLAY_ID)
			}
            if (_obj) {
                _iw = _obj.offsetWidth;
                _ih = _obj.offsetHeight;

                if (this.fixed) {
                    if (M.isInt(this.iTop)) {
                        M.setStyle(_obj, {
                            top: this.iTop + 'px',
                            marginTop: 0
                        });
                    } else {
                        _obj.style.marginTop = '-' + _ih / 2 + 'px'
                    }
                    M.setStyle(_obj, {
                        position: 'absolute',
                        marginLeft: '-' + _iw / 2 + 'px'
                    })
                } else {
                    if (_ih >= _h) {
                        isLongPopBox = true;
                        if (M.isInt(this.iTop)) {
                            _iTop = this.iTop;
                        } else {
                            _iTop = oBody.scrollTop || oDel.scrollTop||0;
                            _iTop = _iTop + 50;
                        }
                        M.setStyle(_obj, {
                            position: 'absolute',
                            top: _iTop + 'px',
                            marginLeft: '-' + _iw / 2 + 'px',
                            marginTop:0
                        });
                        _iPh = _ih + _iTop;
                        oOverLay.style.height = Math.max(_iPh, _imh) + 'px';
                    } else {
                        isLongPopBox = false;
                        isIE6 || oDoc.documentMode < 7 ? (_obj.style.position = 'absolute') : (_obj.style.position = 'fixed');
                        M.setStyle(_obj, {
                            marginTop: '-' + _ih / 2 + 'px',
                            marginLeft: '-' + _iw / 2 + 'px'
                        });
                    }
                }
                fixOverlay = function () {
                    if (_rt) {
                        clearTimeout(_rt)
                    }
                    _rt = setTimeout(function () {
                        _that.fix_Overlay()
                    }, 250)
                };
                M.addEvent(oWin, 'resize', fixOverlay);
                if (isIE || isSafari) {
                    this.fix_Overlay();
                    if (isIE6) {
                        this.fixIE6_Center();
                        fixIECenter = function () {
                            if (_st) {
                                clearTimeout(_st)
                            }
                            _st = setTimeout(function () {
                                _that.fixIE6_Center()
                            }, 250)
                        };
                        M.addEvent(oWin, 'scroll', fixIECenter)
                    }
                }
            }
            dialogOpen = true;
        },
        fix_Overlay: function () {
            var _w = M.getMaxW(),
                _h = M.getMaxH(),
                _wh = M.getWinHeight(),
                _obj = dialogElement,
                _ih, _iTop;
            if (oOverLay === undefined) {
                oOverLay = M.g(OVERLAY_ID)
            }
            if (isIE9 && (!oDoc.documentMode || oDoc.documentMode > 8)) {
                _w = (_w - 17) < 0 ? 0 : _w - 3;
            }
            _h = (_h - 3) < 0 ? 0 : _h - 3;
            try {
                _ih = _obj.offsetHeight
            } catch (e) {
                _ih = this.iHeight;
                _obj = M.g(IFRAME_ID)
            }
            if (_ih >= _wh) {
                isLongPopBox = true;
                if (M.isInt(this.iTop)) {
                    _iTop = this.iTop
                } else {
                    _iTop = oBody.scrollTop || oDel.scrollTop;
                    _iTop = _iTop + 50
                }
                M.setStyle(_obj, {
                    position: 'absolute',
                    top: _iTop + 'px',
                    marginTop: '0'
                });
            } else {
                isLongPopBox = false
            } if (isIE) {
                oOverLay.style.width = _w + 'px'
            }
            oOverLay.style.height = _h + 'px'
        },
        /**
         * ie6下的滚动
         * @return {undefined}
         */
        fixIE6_Center: function () {
            var _iScrollTop, _obj = dialogElement;
            if (!isLongPopBox) {
                if (!this.fixed) {
                    _iScrollTop = oBody.scrollTop || oDel.scrollTop;
                    dialogElement.style.marginTop = parseInt(_iScrollTop - _obj.offsetHeight / 2, 10) + 'px'
                }
            }
        },
        /**
         * iframe自适应高度
         * @param {object} ele iframe元素的id
         * @return {undefined}
         */
        ifrAutoHeight: function (ele) {
            var _bh, _dh, _win, _h;
            if (this.iHeight != 'auto') {
                return
            }
            _win = dialogElement;
            try {
                _bh = _win.contentWindow.document.body.scrollHeight;
                _dh = _win.contentWindow.document.documentElement.scrollHeight;
                _h = Math.max(_bh, _dh);
                this.iHeight = win.height = _h
            } catch (e) {
			}
            M.setStyle(_win, {
                marginTop: '-' + _win.offsetHeight / 2 + 'px',
                marginLeft: '-' + _win.offsetWidth / 2 + 'px'
            });
            this.fix_Overlay()
        },
        /**
         * 对话框关闭
         * 处理对话框显示
         * @return {undefined}
         */
        hide: function (p) {
            var _p = (typeof (p) === 'object') ? p : {}, 
				_callBack = this.onCloseCallback,
				_cancleCallback = _p.cancleCallback || false,
				_isNoCloseOverLay = _p.isNoCloseOverLay || false;
			if (oOverLay === undefined) {
                oOverLay = M.g(OVERLAY_ID)
            }
            if (fixOverlay !== null) {
                M.removeEvent(oWin, 'resize', fixOverlay)
            }
            if (isIE6 && fixIECenter != null) {
                M.removeEvent(oWin, 'scroll', fixIECenter)
            }
            if (fMsgClose !== null) {
                M.removeEvent(oOverLay, 'click', fMsgClose)
            }
            if (escCloseHandle !== null) {
                M.removeEvent(oDoc, 'keyup', escCloseHandle)
            }

            if (typeof (_callBack) === 'function' && !_cancleCallback) {
                _callBack()
            }

            dialogOpen = false;

			if(!this.isNoAccessible){
				if(focusHandle !== null){
					if (oDoc.removeEventListener) {
						oDoc.removeEventListener('focus', focusHandle, false)
					} else {
						oDoc.onfocus = null;
					}
					if(oDoc.onfocus = focusHandle){
						oDoc.onfocus = null;
					}
				}
				if(lastFocus && lastFocus.offsetHeight>0){
					lastFocus.focus();
				}
			}

			if(dialogElement === null){
				switch (popType){
					case "message":
						dialogElement = M.g(MESSAGE_ID);
					case "iframe":
						dialogElement = M.g(IFRAME_ID);
					case "dialog":
						dialogElement = M.g(this.id);
					default:
						return;
				}
			}

			dialogElement.style.display='none';
			if(!_isNoCloseOverLay){
				oOverLay.style.display = 'none';
			}
			
            bOverlay = false;
            return
        },
        overlay: function () {
            var _h = M.getMaxH(),
                _zIndex = this.sPzIndex - 1,
				_op = this.opacity,
                _it, _ib, _w;
            if (isIE) {
                _it = parseInt(M.getStyle(oBody, 'marginTop'), 10);
                _ib = parseInt(M.getStyle(oBody, 'marginBottom'), 10);
                _h = _h + _it + _ib
            }
            oOverLay = oDoc.createElement('div');
            oOverLay.setAttribute('id', OVERLAY_ID);
            M.setStyle(oOverLay, {
                backgroundColor: this.bgcolor,
                borderTop: '1px solid ' + this.bgcolor,
                position: 'absolute',
                height: _h + 'px',
                zIndex: _zIndex,
                width: '100%',
                left: '0',
                top: '0'
            });
            if (isIE6 || this.hasFrame) {
                _w = M.getMaxW();
                oOverLay.style.width = _w + 'px';
                oOverLay.innerHTML = '<iframe style="position:absolute;top:0;left:0;width:100%;height:100%;opacity:0;filter:alpha(opacity=0);z-index:9" src="javascript:void(0)"></iframe>'
            }
			if(isIE && (!oDoc.documentMode || oDoc.documentMode < 9)){
				oOverLay.style.filter = 'Alpha(opacity=' + _op + ')'
			}else{
				oOverLay.style.opacity = _op / 100
			}
            bOverlay = true;
            return oBody.appendChild(oOverLay)
        }
    };
    showDialog = dialogs;
    return dialogs
});/*  |xGv00|0198a36e7a703dad0d8999f69cf2e772 */