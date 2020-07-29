
//含非法字符就返回true
function check(a){
    var fibdn = ["\'" ,"\\",",","/","-",'\"']    
    j=a.length;
    
    for (var i=0;i<j;i++){
        for(var s=0;s<fibdn.length;s++){
            if (a[i]==fibdn[s]){
                return true
            }
        }
    }
    return false
}

module.exports=check