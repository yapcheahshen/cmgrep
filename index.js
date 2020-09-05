require('./controlpanel.js');
require('./searchresult.js');
const store=require("./store");



new Vue({
	//store,
    el:"#app"
   // state:Vuex.mapState(['cmgrep'])
   ,mounted(){
        const cm=document.getElementById("cm");
        const myCodeMirror = CodeMirror(cm, {
            lineNumbers:true,
            theme:'ambiance',
        value: ''
        });
        myCodeMirror.setSize(null,'50vh')
        store.dispatch('setcodemirror',myCodeMirror);
   }
});