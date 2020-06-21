function onPageClick(info, tab) {
    chrome.tabs.sendMessage(tab.id, {messageType: "multiple-image"}, function(response) {
        // メッセージ返し
        if(response["respondType"] == "multiple-image-request") {
            console.debug("respond tweet: " + JSON.stringify(response.tweet));

            var user = response.tweet["user"];
            var id = response.tweet["id"];
            var body = "";
            if(response.tweet.hasOwnProperty("body")) {
                body = response.tweet["body"];
            }
            var date = response.tweet["date"];

            // 複数枚
            if(response.tweet.hasOwnProperty("images")) {
                var index = 0;
                for(const imageSrc of response.tweet["images"]) {
                    var extMatches = imageSrc.match(/\?format=([^&]+)/);
                    var ext = extMatches[1];

                    var title = "[" + user + "(" + id + ")] " + body + " (" + date + "_" + (index + 1) + ")." + ext;

                    var downloadUrl = imageSrc.replace(/&name=.+/, "&name=orig");
                    console.debug(title + ": " + downloadUrl);
                    chrome.downloads.download({"url": downloadUrl, "method": "GET", "conflictAction": "prompt", "filename" : title});

                    index++;
                }
            }
        }
    });
}

function onImageClick(info, tab) {
    chrome.tabs.sendMessage(tab.id, {messageType: "single-image"}, function(response) {
        // メッセージ返し
        if(response["respondType"] == "single-image-request") {
            console.debug("respond tweet: " + JSON.stringify(response.tweet));

            var user = response.tweet["user"];
            var id = response.tweet["id"];
            var body = "";
            if(response.tweet.hasOwnProperty("body")) {
                body = response.tweet["body"];
            }
            var date = response.tweet["date"];

            var extMatches = info.srcUrl.match(/\?format=([^&]+)/);
            var ext = extMatches[1];

            var title = "[" + user + "(" + id + ")] " + body + " (" + date + ")." + ext;

            var downloadUrl = info.srcUrl.replace(/&name=.+/, "&name=orig");
            chrome.downloads.download({"url": downloadUrl, "method": "GET", "conflictAction": "prompt", "filename" : title});
        }
    });
}

// 処理開始
chrome.contextMenus.create({"title": "複数画像を保存", "contexts":["page", "image"], "onclick": onPageClick});
chrome.contextMenus.create({"title": "画像を保存（画像経由）", "contexts":["image"], "onclick": onImageClick});
