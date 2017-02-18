export function apiCall(path) {
    return "http://localhost:3000" + path;
}

export function toHHMMSS(secs) {
    var hours = parseInt(secs / 3600) % 24;
    var minutes = parseInt(secs / 60) % 60;
    var seconds = secs % 60;
    return (hours < 10 ? "0" + hours : hours) + ":" + (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds < 10 ? "0" + seconds : seconds);
}

export function cleanPastedHTML(input) {
    // 1. remove line breaks / Mso classes
    var stringStripper = /(\n|\r| class=(")?Mso[a-zA-Z]+(")?)/g;
    var output = input.replace(stringStripper, ' ');
    // 2. strip Word generated HTML comments
    var commentSripper = new RegExp('<!--(.*?)-->', 'g');
    var output = output.replace(commentSripper, '');
    var tagStripper = new RegExp('<(/)*(meta|link|span|\\?xml:|st1:|o:|font)(.*?)>', 'gi');
    // 3. remove tags leave content if any
    output = output.replace(tagStripper, '');
    // 4. Remove everything in between and including tags '<style(.)style(.)>'
    var badTags = ['style', 'script', 'applet', 'embed', 'noframes', 'noscript'];

    for (var i = 0; i < badTags.length; i++) {
        tagStripper = new RegExp('<' + badTags[i] + '.*?' + badTags[i] + '(.*?)>', 'gi');
        output = output.replace(tagStripper, '');
    }
    // 5. remove attributes ' style="..."'
    var badAttributes = ['style', 'start'];
    for (var i = 0; i < badAttributes.length; i++) {
        var attributeStripper = new RegExp(' ' + badAttributes[i] + '="(.*?)"', 'gi');
        output = output.replace(attributeStripper, '');
    }
    output = output.replace(/\u00a0/g, " ");
    output = output.replace(/&nbsp;/g, ' ');

    return output;
}

export function removeHTMLSpace(input) {
    var newinput = input.replace(/\u00a0/g, " ");
    newinput = input.replace(/&nbsp;/g, ' ');
    return newinput;
}

//0 delay pure async
export function asyncExecute(fn, callback, delay) {
    return setTimeout(function () {
        fn();
        callback();
    }, delay);
}


//custom function for checker can be changed to axios
export function apiCallAppChecker(arrayApps) {
    return $.ajax({
        url: this.apiCall('/api/apps/executeTestForApps'),
        data: {
            apps: arrayApps
        },
        type: "POST",
        dataType: 'json',
        async: true
    })
}