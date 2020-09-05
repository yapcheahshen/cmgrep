const {getFileContent,dogrep,paranumAt}=require('./worker');
const state={
    tf:'',
    filepat:'',
    curfn:'',
    result:[],
    codemirror:null
}
const actions={
    dosearch:({commit,state},tf)=>{
        commit('settofind',tf);
        dogrep(tf,state.filepat,res=>{
            commit('setresult',res)
        });
    },
    setfilepat:({commit,state},filepat)=>{
        commit('setfilepat',filepat);
    },
    showfile:({commit,state},filelinenum)=>{
        const at=filelinenum.indexOf('_');
        const fn=filelinenum.substr(0,at);
        const line=parseInt(filelinenum.substr(at+1));
        const cm=state.codemirror;
        getFileContent(fn,filecontent=>{
            if (state.curfn!==fn) {
                commit('setcurfilename',fn)
                cm.doc.setValue(filecontent);
            }
            const ch=cm.doc.getLine(line).length;
            cm.doc.setCursor({line:cm.doc.lineCount()}); //scroll to bottom
            cm.doc.setCursor({line:line-5}); //show previous 5 lines
            cm.doc.setSelection({line,ch},{line,ch:0})
        });

    },
    setcodemirror:({commit,state},cm)=>{
        commit('setcodemirror',cm);
    },
    setparanum:({commit,dispatch,state},fnpn)=>{
        let m=fnpn.match(/([^_]+)_(.+)/);
        if (m) {
            const linenum=paranumAt(m[1],m[2]);
            if (linenum>-1) dispatch('showfile',m[1]+'_'+linenum);
        }
    }
}
const mutations={
    setresult:(state,newresult)=>state.result=newresult
    ,settofind:(state,newtf)=>state.tofind=newtf
    ,setfilepat:(state,newfilepat)=>state.filepat=newfilepat
    ,setcodemirror:(state,newcm)=>state.codemirror=newcm
    ,setcurfilename:(state,newfn)=>state.curfn=newfn
}
const getters={
    result : state=>state.result
};
const store=new Vuex.Store({state,getters,mutations,actions});
module.exports=store;