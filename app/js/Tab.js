/**
 * Tab
 * Created by jaro on 28.10.16.
 */

window.$ = window.jQuery = require('jquery');

module.exports = class Tab {
    constructor() {
        this.invocedBy = null;
        this.isActive = false;
        this.favicons = [];
        this.title = "";
        this.isPinned = false;

        this.button = $('<button type="button" id="addtab"><object>+</object></button>\n');
        this.onButtonClick = event => {
            var tabs = Tabs.getInstance();
            if (event.button == 2 && !this.isNewTab()) {
                this.togglePin();
            } else {
                tabs.activateTab(this);
            }
        };

        this.webview = $('<webview src="browser://newtab">');

        var wv = this.webview[0];
        var gettingRealTabListener = (event) => {
            if (!this.isNewTab()) {
                wv.removeEventListener('did-start-loading', gettingRealTabListener);
                this.isGettingRealTab();
            }
        };

        this.webview[0].addEventListener('page-title-updated', (title) => {
            this.title = title.title;
            Tabs.getInstance().renderTitlebar();
        });
        this.webview[0].addEventListener('did-navigate', (url) => {
            Tabs.getInstance().renderTitlebar();
        });
        this.webview[0].addEventListener('page-favicon-updated', (favicons) => {
            this.favicons = favicons.favicons;
            this.setIcon(this.favicons[this.favicons.length - 1]);
        });

        this.webview[0].addEventListener('did-start-loading', () => {
            if (!this.isNewTab()) {
                this.setIcon("assets/icons/loading.svg");
            }
        });
        this.webview[0].addEventListener('did-finish-load', () => {
            if (!this.isNewTab()) {
                this.setAltText(this.getTitle().substr(0, 1).toUpperCase());
            }
        });
        this.webview[0].addEventListener('did-fail-load', (errorCode, errorDescription, validatedURL) => {
            console.log(errorCode);
            this.setIcon("");
            this.setAltText(":(");
            //TODO: render error page
        });

        wv.addEventListener('did-start-loading', gettingRealTabListener);
    }

    isNewTab() {
        return this.getUrl() == "browser://newtab";
    }

    isGettingRealTab() {
        this.button.removeAttr("id");
        this.setAltText("");

        var tabs = Tabs.getInstance();
        tabs.renderTabState();
    }

    getUrl() {
        return this.webview.attr("src");
    }

    setUrl(newUrl) {
        this.webview.attr("src", newUrl);
    }

    setActive() {
        this.isActive = true;
        this.button.addClass("current");
        this.webview.addClass("current");
    }

    setUnActive() {
        this.isActive = false;
        this.button.removeClass("current");
        this.webview.removeClass("current");
    }

    getTitle() {
        return this.title;
    }

    setIcon(url) {
        var object = this.button.children('object');
        object.attr("data", url);
        this.button.html(this.button.html());
    }

    setAltText(altText) {
        this.button.children('object').html(altText);
    }

    pin() {
        this.isPinned = true;
        Tabs.getInstance().renderTabState();
    }

    unPin() {
        this.isPinned = false;
        Tabs.getInstance().renderTabState();
    }

    togglePin() {
        this.isPinned = !this.isPinned;
        Tabs.getInstance().renderTabState();
    }
};