var systemVue = new Vue ({
    el: '#system',
    data: {
        loading: false,
        du: "0"
    },
    created: function() {
        var me = this;
        me.loading = true;
        me.$http.get("dbCon.php?data=system").then(response => {
                me.loading = false;
                data = response.body
                me.du = data.du;
            }
        );
    },
    components: {
        'system-template': {
            props: ["loading", "diskusage"],
            template: `
                <div class="card z-depth-3 blue-grey darken-2">
                    <div class="card-content white-text">
                        <span class="card-title">System</span>
                        <div class="center" v-if="loading">
                            <loader></loader>
                        </div>
                        <table class="bordered" v-if="!loading">
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
        imax: "",
        loading: false
    },
    created: function() {
        var me = this;
        me.loading = true;
        me.$http.get("dbCon.php?data=info").then(response => {
            data = response.body;
            me.loading = false;
            me.adco = data.adco;
            me.optarif = data.optarif;
            me.isousc = data.isousc;
            me.imax = data.imax;
        });
    },
    components: {
        'info-template': {
            props: ['loading', 'adco', 'optarif', 'isousc', 'imax'],
            template: `
                <div class="card z-depth-3 blue-grey darken-2">
                    <div class="card-content white-text">
                        <span class="card-title">Info</span>
                        <div class="center" v-if="loading">
                            <loader></loader>
                        </div>
                        <table class="bordered" v-if="!loading">
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

