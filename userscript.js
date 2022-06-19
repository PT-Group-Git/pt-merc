// ==UserScript==
// @name          PT Group Merc Hit Request
// @namespace     http://tampermonkey.net/
// @version       0.1
// @author        ThtAstronautGuy [1977683]
// @description   Send merc request to PT Group
// @match         https://www.torn.com/*
// @grant         GM_xmlhttpRequest
// @grant         GM_addStyle
// @connect       thatastronautguy.space
// @connect       api.torn.com
// @updateURL     https://raw.githubusercontent.com/ThatAstronautGuy/pt-merc/main/userscript.js
// @downloadURL   https://raw.githubusercontent.com/ThatAstronautGuy/pt-merc/main/userscript.js
// ==/UserScript==

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
            var postData = {PlayerID: obj.player_id, PlayerName: obj.name, Strength: obj.strength, Dexterity: obj.dexterity, Defense: obj.defense, Speed: obj.speed, FactionID: obj.faction.faction_id, FactionName: obj.faction.faction_name, Revivable: obj.revivable, Status: obj.status.description};
            alert(JSON.stringify(postData));
            GM_xmlhttpRequest ( {
              method:     'POST',
              url:        'https://www.thatastronautguy.space/api/gethosp',
              data:       JSON.stringify(postData),
              onload:     function (responseDetails) {
                  alert(responseDetails.responseText);
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
