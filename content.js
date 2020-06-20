function zeroPadding(num,length){
    return ('0000000000' + num).slice(-length);
}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.debug("on content script");

        // console.log("document.all[0].outerHTML = " + document.all[0].outerHTML);
        var elements = document.getElementsByClassName("css-901oao css-16my406 r-1tl8opc r-ad9z0x r-bcqeeo r-qvutc0");
        // elements.forEach(function(e, index) {
        //     console.log(index + ': ' + e.innerHTML);
        //   });
        
        var user = "";
        var id = "";
        var body = "";
        var date = "";
        for(let i = 0; i < elements.length; i++) {
            switch(i)
            {
            // case 10:
            case 23: // 開発者ツールが有効か否かでインデックスが変わる
                user = elements[i].innerHTML;
                break;
            // case 11:
            case 24:
                id = elements[i].innerHTML;
                break;
            // case 12:
            case 25:
                body = elements[i].innerHTML;
                break;
            // case 13: // 本文がない場合はここが有効に
            // case 14:
            case 26:
            case 27:
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

        if (request.messageType == "single-image")
            sendResponse({respondType: "single-image-request", tweet: tweet});
    }
);
