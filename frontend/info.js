function httpGet(theUrl) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

function httpGetAsync(theUrl, callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
}

function printCompteurInfo(text) {
    data = JSON.parse(text);
    document.getElementById("adco").innerHTML = data.adco;
    document.getElementById("optarif").innerHTML = data.optarif;
    document.getElementById("isousc").innerHTML = data.isousc;
}

function populateInfo() {
    httpGetAsync("dbCon.php?data=info", printCompteurInfo);
}
