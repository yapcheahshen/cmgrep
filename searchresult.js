const store=require("./store");

Vue.component('SearchResult',{
    methods:{
        showfile(event){
            const fn=event.target.attributes.fn.value;
            const lineidx=parseInt(event.target.attributes.linenum.value);
            store.dispatch('showfile',fn+'_'+lineidx);
          console.log()
        }
    },
    render(h){
        const out=[];
        let prevfn='';
        store.getters.result.forEach(item=>{
            const [fn,linenum,str,pn]=item;
            if (prevfn!=fn) {
                out.push(h('div',{class:'resultfilename'},fn));
            }    
            out.push(h('div',{attrs:{fn,linenum},on:{click:this.showfile},class:'resultitem'},
            [ h('span',{class:'paranum'},pn) , str]))
            prevfn=fn;
        })

        return h('div',{},out);
    }
})