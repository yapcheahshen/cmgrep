const Bufs=new WeakMap();
const SBufs=new WeakMap();
const Paranums=new WeakMap();
const {readFileSync,readdirSync}=require('fs');
const MAXLINE=500;
const nikaya={
	dn:'dn1,dn2,dn3',mn:'mn1,mn2,mn3',sn:'sn1,sn2,sn3,sn4,sn5',an:'an1,an2,an3,an4,an5,an6,an7'
};
const allfiles=(nikaya.dn+','+nikaya.mn+','+nikaya.sn+','+nikaya.an).split(',');
const filesFromPat=pat=>{
    return pat?nikaya[pat].split(',')||['dn1']:allfiles;
}
const suffix='-orig.txt'
const folder='../komyoji/'

const paranumAt=(fn,pn)=>{
    getFileContent(fn);
    return Paranums[fn][pn];
}
const getFileContent=(fn,cb)=>{
    if (!Bufs[fn]){
        SBufs[fn]=readFileSync(folder+fn+suffix,'utf8');
        Bufs[fn]=SBufs[fn].split(/\r?\n/);
        const lines=Bufs[fn]; 
        Paranums[fn] = {};  
        for (let i=0;i<lines.length;i++) {
            if (lines[i][0]=='N') {
                const pn=lines[i].substr(2);
                Paranums[fn][ pn]=i;
            }
        }
    }

    cb&&cb(SBufs[fn]); //for code mirror
    return Bufs[fn];
}

const dogrep=(tf,filepat,cb)=>{
    const out=[];
    const files=filesFromPat(filepat);
    let pn='';
    for (let i=0;i<files.length;i++) {
        const fn=files[i];
        const lines=getFileContent(fn);
        const regex=(tf[0]=='/')?new RegExp(tf.substr(1),'gi'):null;
        for (let j=0;j<lines.length;j++){
            const line=lines[j];
            const pnm=line.match(/N\|(.+)/);
            if (pnm) pn=pnm[1]
            const m=regex?line.match(regex): line.indexOf(tf)>-1;
            if (m) {
                out.push([fn,j,line,pn]);
                if (out.length>=MAXLINE) break;
            }
        }
    }
    if (typeof cb=='function') cb(out);
    return out;
}



module.exports={dogrep,getFileContent,paranumAt}