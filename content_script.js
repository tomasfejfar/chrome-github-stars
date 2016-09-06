// chrome.browserAction.onClicked.addListener(function (tab) {
//     // No tabs or host permissions needed!
//     debug('Turning ' + tab.url + ' red!');
//     chrome.tabs.executeScript({
//         code: 'document.body.style.backgroundColor="red"'
//     });
// });
(function ($) {
    var CACHE_LIFETIME = 1000 * 60 * 60; // hour

    var debug = function (args) {
        console.log.apply(this, arguments);
    };
    var decorateLink = function (data, $el) {
        debug('decorating', $el, 'with', data);

        $decorator = $('<sup style="font-size: 0.75em;font-weight: bold;"></sup>');
        $decorator.append('★' + data.stargazers_count);
        $decorator.append(' ');
        $decorator.append('⑂' + data.forks_count);
        $el.find('sup').remove();
        $el.append($decorator);
    };

    var getFromCache = function (repo, $el) {
        chrome.storage.local.get(repo, function (cache) {
            //debugger;
            debug(cache);
            if (typeof cache[repo] !== 'undefined') {
                var data = cache[repo];
                var cacheDeadline = Date.now() - CACHE_LIFETIME;
                if (data.date < cacheDeadline || typeof data.date === 'undefined') {
                    debug('cache miss ' + repo, cacheDeadline, data.date, cacheDeadline - data.date);
                    chrome.storage.local.remove(repo, function () {
                        debug('Removing ' + repo);
                        debug(chrome.runtime.lastError);
                        getFromGithub(repo, $el);
                    });
                    return;
                }
                debug('from cache: ' + repo);
                decorateLink(data, $el);
                return;
            }
            debug('no cache ' + repo);
            getFromGithub(repo, $el);
        });

    };

    var getFromGithub = function (repo, $el) {
        debug('from github: ' + repo);
        $.get({
            url: 'https://api.github.com/repos/' + repo,
            data: {
                access_token: 'e706117e6b331985eb98960a2f35be4e46697655'
            },
            success: function (data) {
                storage = {};
                storage[repo] = {
                    stargazers_count: data.stargazers_count,
                    forks_count: data.forks_count,
                    date: Date.now()
                };
                debug('storing ' + repo);
                chrome.storage.local.set(storage);
                decorateLink(storage[repo], $el);
            },
            error: function (i, j) {
                debug('Error XHR', i, j);
            }
        });
    };

    $('a[href^="https://github.com"]').each(function (id, el) {
        var repo = el.href.split('/').slice(3, 5).join('/');
        getFromCache(repo, $(el));
    });
}($));
