// ==UserScript==
// @name         YouTube Subtitle Auto Switcher
// @version      0.1
// @author       Tony
// @description  自动切换YouTube字幕到中文
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict'

    // 中文（简体）-> 中文（中国）-> 中文 -> 中文（香港） -> 中文（台湾）
    const LANGUAGE_CODE_PRIORITY = [ 'zh-Hans', 'zh-CN', 'zh', 'zh-HK', 'zh-TW' ]

    function getBestLanguageCode(captions) {
        if (captions) {
            for (const code of LANGUAGE_CODE_PRIORITY) {
                for (const caption of captions) {
                    if (caption.languageCode === code) {
                        return code
                    }
                }
            }
        }
    }

    let player

    function changeCaptionLanguage() {
        // No languageCode means caption not enabled
        const captionsSetting = player.getOption?.('captions', 'track')
        if (!captionsSetting?.languageCode) {
            return
        }
        const code = getBestLanguageCode(player.getOption('captions', 'tracklist'))
        if (code && code !== captionsSetting.languageCode) {
            player.setOption?.('captions', 'track', { languageCode: code })
        }
    }

    function hookPlayer() {
        const newPlayer = document.getElementById('movie_player')
        if (player !== newPlayer) {
            player = newPlayer
        }
        if (!player) {
            return
        }

        const subtitleButtons = player.getElementsByClassName('ytp-subtitles-button ytp-button')
        for (const button of subtitleButtons) {
            button.addEventListener('click', changeCaptionLanguage)
        }

        changeCaptionLanguage()
    }

    function onPageDataUpdated(event) {
        if (event.detail.pageType === 'watch') {
            hookPlayer()
        }
    }

    window.addEventListener('load', hookPlayer)
    window.addEventListener('yt-page-data-updated', onPageDataUpdated)
})()
