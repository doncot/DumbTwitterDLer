function zeroPadding(num,length){
    return ('0000000000' + num).slice(-length);
}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.debug("on content script");

        var elements = document.getElementsByClassName("css-901oao css-16my406 r-1tl8opc r-bcqeeo r-qvutc0");
        
        // elements.forEach(function(e, index) {
        //     console.log(index + ': ' + e.innerHTML);
        //   });
        
        if (request.messageType == "single-image") {
            var user = "";
            var id = "";
            var body = "";
            var date = "";
            for(let i = 0; i < elements.length; i++) {
                console.debug(i + ": " + elements[i].innerHTML);

                switch(i)
                {
                // case 10:
                case 27: // 開発者ツールが有効か否かでインデックスが変わる
                    // ユーザー名
                    user = elements[i].innerHTML;
                    user = user.replace(/\//g, '_');
                    user = user.replace(/\*/g, '_');
                    user = user.replace(/\|/g, '_');
                    user = user.replace(/\:/g, '_');
                    break;
                // case 11:
                case 28:
                    // ID
                    id = elements[i].innerHTML;
                    break;
                // case 12:
                case 29:
                    // 本文
                    if(elements[i].innerHTML.search("<span class=") == -1) {
                        body = elements[i].innerHTML;

                        // 改行をスペースに置き換え
                        // 正規表現でないと全体の適用にならない
                        body = body.replace(/\n/g, " ");

                        // スラッシュ置き換え
                        body = body.replace(/\//g, '_');
                        // :置き換え
                        body = body.replace(/:/g, '_');
                        // *置き換え
                        body = body.replace(/\*/g, '_');

                        // トリム
                        body = body.trim();
                    }
                    break;
                // case 13: // 本文がない場合はここが有効に
                // case 14:
                case 31:
                case 32:
                    // 日付
                    // 既に日付が入った場合は無視する
                    if(date == "") {
                        var results = /((\d{4})年(\d{1,2})月(\d{1,2})日)/.exec(elements[i].innerHTML);
                        if(results != null) {
                            date = results[2] + zeroPadding(results[3], 2) + zeroPadding(results[4], 2);
                        }
                    }
                    break;
                }
            }
            var tweet = {
                "user" : user,
                "id" : id,
                "body" : body,
                "date": date
            };

            sendResponse({respondType: "single-image-request", tweet: tweet});
        } else if (request.messageType == "multiple-image") {
            var user = "";
            var id = "";
            var body = "";
            var date = "";
            for(let i = 0; i < elements.length; i++) {
                switch(i)
                {
                case 27: // 開発者ツールが有効か否かでインデックスが変わる
                    user = elements[i].innerHTML;
                    user = user.replace(/\//g, '_');
                    break;
                case 28:
                    id = elements[i].innerHTML;
                    break;
                case 29:
                    if(elements[i].innerHTML.search("<span class=") == -1) {
                        body = elements[i].innerHTML;

                        // 改行をスペースに置き換え
                        // 正規表現でないと全体の適用にならない
                        body = body.replace(/\n/g, " ");

                        // スラッシュ置き換え
                        body = body.replace(/\//g, '_');

                        // トリム
                        body = body.trim();
                    }
                    break;
                case 31:
                    // 既に日付が入った場合は無視する
                    if(date == "") {
                        var results = /((\d{4})年(\d{1,2})月(\d{1,2})日)/.exec(elements[i].innerHTML);
                        if(results != null) {
                            date = results[2] + zeroPadding(results[3], 2) + zeroPadding(results[4], 2);
                        }
                    }
                    break;
                }
                console.debug(i + ": " + elements[i].innerHTML);
            }
            var tweet = {
                "user" : user,
                "id" : id,
                "body" : body,
                "date": date
            };

            var elements = document.getElementsByClassName("css-1dbjc4n r-1p0dtai r-1mlwlqe r-1d2f490 r-11wrixw r-61z16t r-1udh08x r-u8s1d r-zchlnj r-ipm5af r-417010");
            if(elements != null) {
                tweet["images"] = [];
                for(const e of elements) {
                    var children = e.childNodes;
                    console.debug("image src: " + children[1]["src"]);

                    tweet["images"].push(children[1]["src"]);
                }
            }

            sendResponse({respondType: "multiple-image-request", tweet: tweet});
        }

        return true;
    }
);
