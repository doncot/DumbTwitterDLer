function onPageClick(info, tab) {
}

function onImageClick(info, tab) {
    // console.log("item " + info.menuItemId + " was clicked");
    // console.log("info: " + JSON.stringify(info));
    // console.log("tab: " + JSON.stringify(tab));

    chrome.tabs.sendMessage(tab.id, {messageType: "single-image"}, function(response) {
        // メッセージ返し
        if(response["respondType"] == "single-image-request") {
            // console.log("JSON: " + JSON.stringify(response.tweet));
            var user = response.tweet["user"];
            var id = response.tweet["id"];
            var body = "";
            if(response.hasOwnProperty("body"))
                body = response.tweet["body"];
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
// chrome.contextMenus.create({"title": "画像を保存（ページ経由）", "contexts":["page"], "onclick": onPageClick});
chrome.contextMenus.create({"title": "画像を保存（画像経由）", "contexts":["image"], "onclick": onImageClick});
