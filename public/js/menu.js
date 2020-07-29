window.onload = function () {
    var flag = true;
    var liC = document.querySelectorAll(".navBox li h2");
    // 主导航nav点击事件
    for (var i = 0; i < liC.length; i++) {
        liC[i].onclick = function () {
            if (flag) {
                // 节流阀
                flag = false;
                setTimeout(function () {
                    flag = true;
                }, 500)
                // 自点
                if (this.className === "obFocus") {
                    this.querySelector("i").classList.remove("arrowRot");
                    getNext(this).style.height = "0";
                    this.classList.add("obtain");
                    this.classList.remove("obFocus");
                    return
                }

                var sec = getNext(this);
                var sib = siblings(sec.parentNode);
                var otherArr = [];
                var arrowClass = [];
                // 排他 secondary arrowRot obFocus
                for (var j = 0; j < sib.length; j++) {
                    var sibSec = sib[j].getElementsByTagName('*');
                    for (var i = 0; i < sibSec.length; i++) {
                        if (sibSec[i].className == "secondary") {
                            otherArr.push(sibSec[i])
                        }
                        if (sibSec[i].className == "arrowRot") {
                            arrowClass.push(sibSec[i])
                        }
                        if (sibSec[i].className == "obFocus") {
                            sibSec[i].classList.remove("obFocus");
                            sibSec[i].classList.add("obtain");

                        }
                    }
                }
                for (var i = 0; i < otherArr.length; i++) {
                    otherArr[i].style.height = "0";
                }
                if (arrowClass[0]) {
                    arrowClass[0].classList.remove("arrowRot");
                }

                // 留自己2.5078
                var count = sec.childNodes.length
                sec.style.height = (count-1)*17.5+10 + "px";
                this.getElementsByTagName("i")[0].classList.add("arrowRot");
                this.classList.remove("obtain");
                this.classList.add("obFocus");
            }

        }
    }

    // 子导航点击事件
    var seconC = document.querySelectorAll(".secondary h3")
    for (var i = 0; i < seconC.length; i++) {
        seconC[i].onclick = function () {
            for (var i = 0; i < seconC.length; i++) {
                seconC[i].classList.remove("seconFocus");
            }
            this.classList.add("seconFocus");
        }
    }

    // 隐藏菜单
    var menu_contents=document.querySelector("#menu_contents");
    var obscure = document.querySelector("#user_header_info");
    var username_under_header = document.querySelector("#username_under_header");
    var open = document.querySelector("#open");
    var openbutten = document.querySelector("#openbutten");
    if(obscure){
        obscure.onclick = function () {
            if (open.style.marginLeft == "0px") {
                open.style.marginLeft = "-260px";
                openbutten.style.marginLeft = "240px";
                username_under_header.style.marginLeft = '30px'
                menu_contents.style.marginLeft = '0px'
            } else {
                open.style.marginLeft = "0px";
                openbutten.style.marginLeft = "0px";
                username_under_header.style.marginLeft = '50px'
                menu_contents.style.marginLeft = '260px'
            }
    
        }
    }
    //显示菜单
}

function getByClass(clsName, parent) {
    var oParent = parent ? document.getElementById(parent) : document,
        boxArr = new Array(),
        oElements = oParent.getElementsByTagName('*');
    for (var i = 0; i < oElements.length; i++) {
        if (oElements[i].className == clsName) {
            boxArr.push(oElements[i]);
        }
    }
    return boxArr;
}
// 获取下一个兄弟元素
function getNext(node) {
    if (!node.nextSibling) return null;
    var nextNode = node.nextSibling;
    if (nextNode.nodeType == 1) {
        return nextNode;
    }
    return getNext(node.nextSibling);
}

// 获取除了自己以外的其他亲兄弟元素
function siblings(elem) {
    var r = [];
    var n = elem.parentNode.firstChild;
    for (; n; n = n.nextSibling) {
        if (n.nodeType === 1 && n !== elem) {
            r.push(n);
        }
    }
    return r;
}
