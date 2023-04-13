// ==UserScript==
// @name          PT Group Merc Hit Request
// @namespace     http://tampermonkey.net/
// @version       1.2
// @author        ThtAstronautGuy [1977683], Oran [1778676]
// @description   Send merc request to PT Group
// @match         https://www.torn.com/*
// @grant         GM_xmlhttpRequest
// @grant         GM_addStyle
// @connect       api.torn.com
// @connect       discord.com
// @connect       ptmerc.xyz
// @updateURL     https://raw.githubusercontent.com/ThatAstronautGuy/pt-merc/main/userscript.js
// @downloadURL   https://raw.githubusercontent.com/ThatAstronautGuy/pt-merc/main/userscript.js
// ==/UserScript==

//https://www.torn.com/preferences.php#tab=api?step=addNewKey&title=ptmerc&user=basic,battlestats,profile    <--- use link to generate special API Key just for this script.
let apiKey = window.localStorage.getItem('torn-pt-api-key') || null;

(function() {
  var hospButton = `
<div id="top-page-links-list" class="content-title-links" role="list" aria-labelledby="top-page-links-button">
<a role="button" aria-labelledby="pt-hosp" class="pt-hosp t-clear h c-pointer  m-icon line-h24 right last" href="#" style="padding-left: 10px; padding-right: 10px" id="pt-hosp-api">
    <span id="pt-hosp" style="color:rgb(255,233,0)">Update Key</span>
</a>
<a role="button" aria-labelledby="pt-hosp" class="pt-hosp t-clear h c-pointer  m-icon line-h24 right last" href="#" style="padding-left: 10px; margin-right: 0px" id="pt-hosp-link">
    <span id="pt-hosp" style="color:rgb(218,41,28)">Hosp Me</span>
</a>
<a role="button" aria-labelledby="pt-hosp" class="pt-hosp t-clear h c-pointer  m-icon line-h24 right last" href="https://www.torn.com/forums.php#/p=threads&f=10&t=16262963&b=0&a=0" style="padding-left: 10px; margin-right: 0px; color:rgb(4,106,56);" id="pt-hosp-premium-link">
    Premium
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

          document.getElementById('pt-hosp-link').addEventListener('click', callForHosp);
          document.getElementById('pt-hosp-api').addEventListener('click', updateAPIKeyEvent);
      }
    }

    setTimeout(addLink, 500);
  }

  function updateAPIKeyEvent(e){
    e.preventDefault;
    updateAPIKey("Please enter your API key to save it");
  }

  function updateAPIKey(message){
    let key = prompt(message);
    if(key == null || key == ""){
      alert("Key not entered.");
    }
    else{
      GM_xmlhttpRequest ({
      method: 'POST',
      url: 'https://api.torn.com/user/?selections=battlestats&key=' + key,
      onload: (r) => {
        if(r.status == 200){
          const obj = JSON.parse(r.responseText);
          if(obj.hasOwnProperty('error')){
            var errorCode = obj.error.code;
            if(errorCode == 2){
              alert("Incorrect key. Enter a proper key.");
            }
            else if(errorCode == 5 || errorCode == 8){
              alert("Too many requests. Please try again soon.");
            }
            else if(errorCode == 9){
              alert("API system disabled. Please try again soon.");
            }
            else if(errorCode == 14){
              alert("Daily read limited reached. Please wait until the next day or reach out through our thread.");
            }
            else if(errorCode == 16){
              alert("Key access level is not high enough. A limited access API key is required.");
            }
            else{
              alert("Unknown error with key. Please try another key or try again later.");
            }
            window.localStorage.setItem('torn-pt-api-key', "");
          }
          else{
            alert("Key saved.");
            window.localStorage.setItem('torn-pt-api-key', key);
            apiKey = key;
          }
        }
        else{
          alert("HTTP Error Code: " + r.status);
          window.localStorage.setItem('torn-pt-api-key', "");
        }
      },
      onerror: () =>{
        alert("Couldn't check. Error");
      },
      onabort: () =>{
        alert("Couldn't check. Aborted");
      },
      onprogress: () =>{
      },
      ontimeout: () =>{
        alert("Couldn't check. Timeout");
      }
    })
    }
  }

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  function callForHosp(e){
    e.preventDefault;
    let confirmAction = confirm("Are you sure you want to request a hosp at a cost of 4m?");
    if(apiKey == null || apiKey == ""){
      updateAPIKey("Please enter your API key then try again");
    }
    if(confirmAction) {
      GM_xmlhttpRequest ({
        method: 'POST',
        url: 'https://api.torn.com/user/?selections=profile,battlestats&key=' + apiKey,
        onload: (r) => {
          const obj = JSON.parse(r.responseText);
            var total = obj.strength + obj.dexterity + obj.speed + obj.defense;
         var postData = {
    content: "Looking for merc hit <@&946417833435361320>",
    embeds: [{
        title: obj.name + " [" + obj.player_id + "]",
        url: "https://www.torn.com/profiles.php?XID=" + obj.player_id,
        color: 16734296,
        fields: [
            {
                name: "Faction",
                value: obj.faction.faction_name + " [" + obj.faction.faction_id + "]",
                inline: true
            },
            {
                name: "Status",
                value: obj.status.description,
                inline: true
            },
            {
                name: "Strength",
                value: numberWithCommas(obj.strength),
                inline: true
            },
            {
                name: "Dexterity",
                value: numberWithCommas(obj.dexterity),
                inline: true
            },
            {
                name: "Defense",
                value: numberWithCommas(obj.defense),
                inline: true
            },
            {
                name: "Speed",
                value: numberWithCommas(obj.speed),
                inline: true
            },
            {
                name: "Total",
                value: numberWithCommas(total),
                inline: true
            },
            {
                name: "Attack",
                value: "[Click Here](https://www.torn.com/loader.php?sid=attack&user2ID=" + obj.player_id + ")",
                inline: true
            }
        ]
    }]
};


            //alert(JSON.stringify(postData));
           GM_xmlhttpRequest({
    method: 'POST',
    url: 'https://ptmerc.xyz/mercscript.php',
    data: JSON.stringify(postData),
    headers: {
      "Content-Type": "application/json"
    },
    onload: function(responseDetails) {
      //alert(responseDetails.responseText);
              }
          });
        }
      });
    }
    else {
      alert("Request not sent.");
    }
  }
})();
