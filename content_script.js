// chrome.browserAction.onClicked.addListener(function (tab) {
//     // No tabs or host permissions needed!
//     console.log('Turning ' + tab.url + ' red!');
//     chrome.tabs.executeScript({
//         code: 'document.body.style.backgroundColor="red"'
//     });
// });
$('a[href^="https://github.com"]').each(function (id, el) {
    var repo = el.href.split('/').slice(3, 5).join('/');
    $.get({
        url: 'https://api.github.com/repos/' + repo,
        data: {
            access_token: ''
        },
        success: function (data) {
            $el = $('<sup style="font-size: 0.75em;font-weight: bold;"></sup>');
            $el.append('★' + data.stargazers_count);
            $el.append(' ');
            $el.append('⑂' + data.forks_count);
            $(el).append($el);
        }
    });
});
