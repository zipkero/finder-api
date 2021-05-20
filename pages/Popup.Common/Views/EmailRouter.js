/****************************************************************************************************
1. Create Date : 2019.04.08
2. Creator     : 정명수
3. Description : Email Router
4. Precaution  : 
5. History     :    2019.05.27(양미진) -  A19_01864 메일앱에 판매전표 보이지 않는 현상
6. Old file    : 
****************************************************************************************************/

var param = $.decryptJson(this.viewBag.DefaultOption.p);
var url = param.returnUrl + "?" + param.param;
top.location.href = $.ecrt(url);