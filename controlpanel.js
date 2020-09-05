const store=require('./store');
const inputpali=require('./inputpali');
let cbtext='';
let timer=setInterval(()=>{
    const clipboard=nw.Clipboard.get();
    const text=clipboard.get('text');
    if (text&&text!==cbtext) {
        if (text.match(/[^_]+_.+/)) {
            store.dispatch('setparanum',text);
        } else if (text.split('\t').length==7) {
            store.dispatch('setfilepat','');
            store.dispatch('dosearch',text);
        }
        cbtext=text;
    }
},500);
const SearchInput=Vue.extend({
    methods:{
        search(tf){
            store.dispatch('setfilepat',this.$refs.filepat.value);
            store.dispatch('dosearch',tf)
        },
        oninput(event){
            inputpali(event.target);
			if (event.key=="Enter") {
                event.target.disabled=true;
                this.search(event.target.value);
			}
        },
        oninputparanum(event){
			if (event.key=="Enter") {
                store.dispatch('setparanum',event.target.value);
			}        
        }
    },
    updated(){
        this.$refs.tofind.disabled=false
    },
    destroyed(){
        clearInterval(timer);
    },
    render(h){
        const rescount=store.getters.result.length;
        return h('div',[
            h('span',{},rescount),
            h('input',{ref:'tofind',class:'tofind',on:{keyup:this.oninput}}),
            h('span','file'),
            h('input',{class:'filepat',ref:'filepat',attrs:{value:'dn'}}),
            h('span','para'),
            h('input',{class:'filepat',on:{keyup:this.oninputparanum},ref:'paranum',attrs:{value:''}})
        ]);
    }
})
Vue.component('ControlPanel',{
    render(h){
        return h('div',{},[h(SearchInput)])
    }
})