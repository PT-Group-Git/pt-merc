// ==UserScript==
// @name         PT Group Merc Hit Request
// @namespace    http://tampermonkey.net/
// @version      0.1
// @author       ThtAstronautGuy [1977683]
// @description  Send merc request to PT Group
// @match        https://www.torn.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      thatastronautguy.space
// ==/UserScript==
 
/*
CHANGE LOG:
Version 0.1 First Version
*/

(function() {
    'use strict';
    var apiKey = `rCRrF2GjYLpCS7HY`
    var hospButton = `
<div id="top-page-links-list" class="content-title-links" role="list" aria-labelledby="top-page-links-button">
<a role="button" aria-labelledby="pt-hosp" class="pt-hosp t-clear h c-pointer  m-icon line-h24 right last" href="#" style="padding-left: 10px; padding-right: 10px" id="pt-hosp-link">
    <span id="pt-hosp" style="color:rgb(218,41,28)">Hosp Me</span>
</a>
<a role="button" aria-labelledby="pt-hosp" class="pt-hosp t-clear h c-pointer  m-icon line-h24 right last" href="#" style="padding-left: 10px; margin-right: 0px;" id="pt-hosp-premium-link">
    <span id="pt-hosp" style="color:rgb(4,106,56); padding-left: 3px;">Premium</span>
</a>
</div>
    `
 
 
    setTimeout(addLink, 500);
 
    function addLink(){
 
        if(!document.getElementById('pt-hosp-link')){
            let linkReference = document.querySelector('.links-footer') || document.querySelector('.content-title .clear') || document.querySelector('.tutorial-switcher') || document.querySelector('.links-top-wrap') || document.querySelector('.forums-main-wrap');
            if(linkReference){
                let linkContainer = linkReference.parentNode;
                let newElelemt = document.createElement('span');
                newElelemt.innerHTML = hospButton;
                linkContainer.insertBefore(newElelemt, linkReference);
 
                document.getElementById('pt-hosp-link').addEventListener('click', callForRegularHosp);
                document.getElementById('pt-hosp-premium-link').addEventListener('click', callForPremiumHosp);
            }
        }
 
        setTimeout(addLink, 500);
    }
 
    function callForRegularHosp(e){
        e.preventDefault;
        callForHosp(false)
    }
 
    function callForPremiumHosp(e){
        e.preventDefault;
        callForHosp(true)
    }
 
    function callForHosp(premium){
        let PlayerID = null;
        let PlayerName = null;
        let factionIcon = null;
        let faction = "";
        let battleStats = "";
 
        let country = document.body.dataset.country;
 
        let Country = [{
            name: 'mexico',
            title: 'Mexico'
        }, {
            name: 'cayman-islands',
            title: 'Cayman Islands'
        }, {
            name: 'canada',
            title: 'Canada'
        }, {
            name: 'hawaii',
            title: 'Hawaii'
        }, {
            name: 'uk',
            title: 'United Kingdom'
        }, {
            name: 'argentina',
            title: 'Argentina'
        }, {
            name: 'switzerland',
            title: 'Switzerland'
        }, {
            name: 'japan',
            title: 'Japan'
        }, {
            name: 'china',
            title: 'China'
        }, {
            name: 'uae',
            title: 'UAE'
        }, {
            name: 'south-africa',
            title: 'South Africa'
        }, {
            name: 'torn',
            title: 'Torn'
        }].find((destination) => country == destination.name);
 
        if(!Country){
            Country = {
                name: 'torn',
                title: 'Torn'
            }
        }
 
        try{
            let uid = getCookie('uid');
            let data = JSON.parse(sessionStorage.getItem('sidebarData' + uid));
            if(data && data.user && data.statusIcons && data.statusIcons.icons){
                PlayerID = uid;
                PlayerName = `${data.user.name} [${uid}]`;
                factionIcon = data.statusIcons.icons.faction;
            }
            else{
                alert('Error getting player information')
                return;
            }
        }
        catch(error){
            alert('Error getting player information')
            return;
        }

        if(factionIcon){
            faction = factionIcon.subtitle;
        }
 
        if(PlayerName){
            var postData = {uid: PlayerID, Player: PlayerName, Faction: faction, Country: Country.title, Premium: premium};
 
            GM_xmlhttpRequest ( {
                method:     'POST',
                url:        'https://www.thatastronautguy.space/dev/hospme.php',
                data:       JSON.stringify(postData),
                onload:     function (responseDetails) {
                    // DO ALL RESPONSE PROCESSING HERE...
                    //console.log(responseDetails, responseDetails.responseText);
                    alert(responseDetails.responseText);
                }
            });
        }
    }
 
    function getCookie(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for(var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }
})();
