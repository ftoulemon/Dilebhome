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

var systemVue = new Vue ({
    el: '#system',
    data: {
        du: "0"
    },
    created: function() {
        var me = this;
        httpGetAsync("dbCon.php?data=system", function (text) {
                data = JSON.parse(text);
                me.du = data.du;
            }
        );
    },
    components: {
        'system-template': {
            props: ["diskusage"],
            template: `
                <div class="card z-depth-3 blue-grey darken-2">
                    <div class="card-content white-text">
                        <span class="card-title">System</span>
                        <table class="bordered">
                            <tbody>
                                <tr>
                                    <td>Disk usage</td>
                                    <td><meter
                                            min="0"
                                            max="100"
                                            low="75"
                                            high="90"
                                            optimum="0"
                                            :value="diskusage"></meter>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>`
        }
    }
});

var infoVue = new Vue({
    el: "#info",
    data: {
        adco: "",
        optarif: "",
        isousc: "",
        imax: ""
    },
    created: function() {
        var me = this;
        httpGetAsync("dbCon.php?data=info", function (text) {
                data = JSON.parse(text);
                me.adco = data.adco;
                me.optarif = data.optarif;
                me.isousc = data.isousc;
                me.imax = data.imax;
            }
        );
    },
    components: {
        'info-template': {
            props: ['adco', 'optarif', 'isousc', 'imax'],
            template: `
                <div class="card z-depth-3 blue-grey darken-2">
                    <div class="card-content white-text">
                        <span class="card-title">Info</span>
                        <table class="bordered">
                            <tbody>
                                <tr><td>ID</td> <td>{{ adco }}</td></tr>
                                <tr><td>Option tarif</td> <td>{{ optarif }}</td></tr>
                                <tr><td>Intensité souscrite</td> <td>{{ isousc }}</td></tr>
                                <tr><td>Intensité max</td> <td>{{ imax }}</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div> `
        }
    }
});

var ptecVue = new Vue({
    el: '#ptec',
    data: {
        hp: false
    },
    created: function() {
        var d = new Date();
        var h = d.getHours();
        this.hp = (7 <= h && h < 23);
    },
    components: {
        'ptec-template': {
            props: ['checked'],
            template: `
                <div class="card z-depth-3 blue-grey darken-2">
                    <div class="card-content white-text">
                        <span class="card-title">Status</span>
                        <div class="switch">
                            <label>Heure creuse<input disabled
                                type="checkbox" v-model="checked">
                                <span class="lever"></span>Heure pleine
                            </label>
                        </div>
                    </div>
                </div>
                `
        }
    }
});

