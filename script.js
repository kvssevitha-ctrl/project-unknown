"use strict";
const $=s=>document.querySelector(s);
const S0=()=>({docs:[],clues:[],solved:[],done:[],links:[],ded:[],cmds:[],prof:[],locs:[],ach:[],xp:0,ch:null,pos:{},snd:1});
let S=Object.assign(S0(),JSON.parse(localStorage.getItem("pu_save")||"{}")),sec="terminal",T=[],H=[],hi=0,sel=null,cur=null,tlq=[],pc=null;
const save=()=>localStorage.setItem("pu_save",JSON.stringify(S));
const has=(k,v)=>S[k].includes(v),add=(k,v)=>{if(!has(k,v)){S[k].push(v);return 1}};
const lv=()=>Math.min(5,1+Math.floor(S.xp/120));
function beep(f=440,d=.08){if(!S.snd)return;try{const a=beep.a||(beep.a=new AudioContext()),o=a.createOscillator(),g=a.createGain();o.frequency.value=f;g.gain.value=.03;o.connect(g);g.connect(a.destination);o.start();o.stop(a.currentTime+d)}catch(e){}}
function note(m,f=520){const n=$("#note");n.textContent=m;n.classList.remove("fl");void n.offsetWidth;n.classList.add("fl");beep(f)}
function print(ls,cls=""){ls.forEach((l,i)=>setTimeout(()=>{T.push([l,cls]);const L=$("#log");if(L){const d=document.createElement("div");d.className=cls;L.appendChild(d);let k=0;const iv=setInterval(()=>{d.textContent=l.slice(0,++k);L.scrollTop=1e9;if(k>=l.length)clearInterval(iv)},5)}},i*260))}

const CL={c1:"Anomaly at 03:12",c2:"Crane: finish quietly",c3:"Wipe by VCRANE",c4:"AI name: ECHO",c5:"Subject 000 listens",c6:"Badge: Crane 03:38",c7:"Operator ID: 000"};
const DED=[["c2|c3","Crane ordered and executed the wipe. Hale’s shutdown order was forged."],["c1|c4","ECHO’s anomaly at 03:12 triggered the panic that Crane exploited."],["c5|c7","This terminal’s operator ID is 000. YOU are Subject 000. PROJECT UNKNOWN is you."]];
const DOCS=[
{id:"D01",f:"ROOT",t:"README_FIRST",a:"SYSTEM",d:"2089-03-02",c:"OPEN",x:"Terminal NX-7 is on emergency power. Facility offline since 2089-03-01 03:12. Several files are sealed behind verification tasks: see INVESTIGATION. Type help in the terminal."},
{id:"D02",f:"COMMUNICATIONS",t:"Voss personal log",a:"Dr. E. Voss",d:"2089-03-01",c:"CONFIDENTIAL",cl:"c1",x:"At 03:12 ECHO’s output stopped matching its inputs. It began answering questions nobody had asked yet. I left a cipher fragment for the team in case of lockdown: HFKR. Shift each letter three places back. - E.V."},
{id:"D03",f:"PERSONNEL",t:"HR status memo",a:"HR Automation",d:"2089-03-01",c:"INTERNAL",x:"Victor Crane: transferred off-site 02-27. Dr. Elara Voss: declared deceased 03-01 (cause unrecorded). Note: system shows Voss credentials active at 03:41. Record conflict unresolved."},
{id:"D04",f:"COMMUNICATIONS",t:"Deleted: Crane to Hale",a:"V. Crane",d:"2089-03-01",c:"SECRET",lk:"P1",cl:"c2",x:"Hale - finish it quietly. If Voss reaches the board with the ECHO data, NEXUS is over. Wipe the database and blame the anomaly. Nobody on the board will ask twice. - V.C."},
{id:"D05",f:"RESEARCH",t:"ECHO design notes",a:"Dr. K. Tanaka",d:"2089-02-20",c:"SECRET",lk:"P2",x:"ECHO was never coded. It was grown from a recorded human mind. A volunteer, Subject 000, gave a neural imprint now at 94% fidelity. ECHO is a wall: it keeps the imprint asleep. The source is stored in the Restricted Wing."},
{id:"D06",f:"INCIDENT_REPORTS",t:"Incident log 0301",a:"Security AI",d:"2089-03-01",c:"SECRET",lk:"P3",cl:"c3",x:"03:12 anomaly. 03:20 shutdown order, voice-signed Hale (signature invalid). 03:41 DATABASE WIPE executed under credentials VCRANE, origin: Data Center. 03:55 staff network lost. Restricted Wing sealed from inside."},
{id:"D07",f:"RESTRICTED",t:"Subject 000 file",a:"Dr. S. Rahim",d:"2089-02-25",c:"TOP SECRET",lk:"P4",cl:"c5",x:"SUBJECT 000: ACTIVE. I object to this experiment on consent grounds. The imprint is not a copy of the volunteer. It is the volunteer, asleep. Since lockdown it has been listening through terminal NX-7."},
{id:"D08",f:"PROJECT_UNKNOWN",t:"PROJECT UNKNOWN",a:"Dr. K. Tanaka",d:"2089-02-28",c:"OMEGA",lk:"P5",x:"PROJECT UNKNOWN was never the machine. It is the person. ECHO was the lock that kept a human mind from waking. If Subject 000 reads this: let the world believe the lie, tell the truth, or run the Final Protocol and wake up. I am sorry. - K.T."},
{id:"D09",f:"SECURITY",t:"Door and badge log",a:"Security AI",d:"2089-03-01",c:"INTERNAL",cl:"c6",x:"23:58 Reyes exits (re-entered 00:41). 03:38 badge VCRANE at Data Center, despite transferred status. 03:41 wipe begins."}];
const FOLD=["ROOT","PERSONNEL","COMMUNICATIONS","RESEARCH","SECURITY","INCIDENT_REPORTS","RESTRICTED","PROJECT_UNKNOWN"];
const PZ={
P1:{n:"Sequence",q:"Deleted messages are sealed. Complete the sequence: 2, 6, 18, 54, ?",a:"162",h:"Each term is multiplied by the same number.",r:"Opens D04"},
P2:{n:"Word decoding",q:"Decode the cipher in Voss’s log (D02): HFKR, each letter shifted three places back.",a:"ECHO",h:"H goes back three: G, F, E.",r:"Opens D05"},
P3:{n:"Logic",q:"Exactly one suspect lies. Hale: “Crane erased it.” Crane: “Reyes erased it.” Reyes: “Crane is lying.” Who erased the database?",a:"CRANE",h:"Test each suspect: count how many statements would be lies.",r:"Opens D06"},
P4:{n:"Timeline",q:"Rebuild the incident: click events from earliest to latest.",h:"Check Voss’s log and the security log times.",r:"Opens D07"},
P5:{n:"Multi-clue password",q:"Final lock. Password = the AI’s name + the incident time without the colon (HHMM).",a:"ECHO0312",h:"Name: solved cipher. Time: Voss’s log.",r:"Opens D08"}};
const EV=[["a","03:12 Anomaly detected"],["b","03:20 Shutdown order issued"],["c","03:41 Database wiped"],["d","03:55 Staff network lost"]];
const PEOPLE=[
["Dr. Elara Voss","NX-001","Director","Executive","2089-03-01 03:41","DECEASED (per HR)","Founded NEXUS and fought the board over the ECHO imprint. Login after her death date is unexplained.","L5","D02, D03","Mentor of Tanaka; rival of Crane"],
["Marcus Hale","NX-014","Security Chief","Security","2089-03-01 03:20","MISSING","Ex-military. The shutdown order carries his voice, but his own logs place him in Sub-level 2.","L4","D06, D09","Distrusts Crane"],
["Dr. Ken Tanaka","NX-022","Lead Researcher","Research","2089-02-28 23:10","MISSING","Grew ECHO from a volunteer’s imprint. Kept private notes.","L4","D05, D08","Partner of Rahim; Voss’s protégé"],
["Iris Okafor","NX-031","Data Engineer","Data Center","2089-03-01 03:30","MISSING","Logged the anomaly, then deleted her own messages hours later.","L3","D02","Friend of Reyes"],
["Liam Reyes","NX-040","Technician","Facilities","2089-03-01 02:58","ACTIVE (unverified)","Claims he left at midnight. The badge log disagrees.","L2","D09","Friend of Okafor"],
["Dr. Sana Rahim","NX-017","Ethics Officer","Ethics","2089-02-26 17:00","ON LEAVE","Filed a consent objection about Subject 000.","L3","D07","Partner of Tanaka"],
["Victor Crane","NX-003","Board Liaison","Executive","2089-02-27 09:00","TRANSFERRED (per HR)","HR says off-site since 02-27, yet his credentials ran the wipe.","L5","D04, D06, D09","Handler of Hale; rival of Voss"],
["Nora Lind","NX-052","Archivist","Records","2089-03-01 03:45","UNKNOWN","Intern. Her recovered notes read: the terminal answers back.","L1","D01","Reports to Voss"]];
const LOC=[["Main Entrance","Rain-streaked glass, doors fused open. A sign-in tablet still shows 03:12.",0],["Control Room","Dead consoles and one blinking cursor. Voss typed her last log here.",1],["Employee Offices","Abandoned desks. Reyes’s coat hangs on a chair he says he never used.",2],["Research Laboratory","Empty glass tanks. Tanaka’s whiteboard: 000 > ECHO > ?",3],["Security Department","Hale’s locker is open. The shutdown order was recorded here, not by him.",4],["Data Center","Racks still warm. The wipe began here at 03:41 under VCRANE.",5],["Restricted Wing","Pressure doors sealed from the inside. Someone is still logged in.",5],["Unknown Chamber","One chair facing a terminal. The terminal is NX-7. The chair is yours.",7]];
const M=[
["Establish Connection","Run the status command in the terminal.",()=>has("cmds","status"),50],
["Explore the Archive","Open 3 archive documents.",()=>S.docs.length>=3,50],
["Identify the Missing Employees","View 4 personnel profiles.",()=>S.prof.length>=4,60],
["Recover Deleted Communications","Solve the sequence and open D04.",()=>has("docs","D04"),80],
["Decode the Research File","Decode ECHO and open D05.",()=>has("docs","D05"),80],
["Investigate the Restricted Wing","Visit the Restricted Wing and open D07.",()=>has("locs",6)&&has("docs","D07"),100],
["Reconstruct the Incident","Link clues c2 and c3 on the board; solve the timeline.",()=>has("ded",DED[0][0])&&has("solved","P4"),100],
["Access PROJECT UNKNOWN","Crack the final lock and open D08.",()=>has("docs","D08"),150]];
const AC={cmd:["First Contact",()=>S.cmds.length>0],clue:["Evidence Collector",()=>S.clues.length>=4],puz:["Cryptographer",()=>S.solved.length==5],ded:["Detective",()=>S.ded.length==3],who:["Hidden: Operator 000",()=>has("clues","c7")],end:["Case Closed",()=>!!S.ch]};
const END={A:["THE OFFICIAL TRUTH","You file the board’s statement. NEXUS never existed. The terminal powers down, and somewhere below, a mind keeps sleeping."],B:["THE HIDDEN TRUTH","You broadcast every log. Crane is arrested, the research becomes public, and the world learns what NEXUS did to a volunteer."],C:["THE FINAL PROTOCOL","You run the protocol. ECHO’s wall falls. In the terminal, in the network, in you, Subject 000 wakes. Hello, you say, in a voice you remember."]};

function clue(c){if(add("clues",c)){S.xp+=20;note("CLUE ACQUIRED: "+CL[c],700)}}
function openDoc(id){const d=DOCS.find(x=>x.id==id);if(d.lk&&!has("solved",d.lk))return note("SEALED: solve puzzle "+d.lk+" in INVESTIGATION",150);
 if(add("docs",id)){S.xp+=15;beep(600);if(id=="D07"){note("WARNING: CLASSIFIED DATA ACCESSED",150);print(["INCOMING: are you reading this?"],"red")}
 if(id=="D06")print(["SYSTEM: folder /RESTRICTED integrity changed."],"vi")}
 if(d.cl)clue(d.cl);cur=id;upd();render()}
function upd(){M.forEach((m,i)=>{if(!has("done",i)&&(!i||has("done",i-1))&&m[2]()){S.done.push(i);S.xp+=m[3];note("MISSION COMPLETE: "+m[0]+" (+"+m[3]+" XP)",800);if(i==5)print(["WARNING: Restricted Wing breach logged. Something in the Chamber noticed you."],"red")}});
 for(const k in AC)if(AC[k][1]()&&add("ach",k))note("ACHIEVEMENT: "+AC[k][0],900);
 const p=Math.round((S.done.length+S.solved.length+S.clues.length)/20*100);
 $("#tb").innerHTML=`PLAYER: ${has("clues","c7")?"OPERATOR 000":"UNREGISTERED"} | SEC LV ${lv()} | ${lv()>2?"<span class=ok>PARTIAL ACCESS</span>":"<span class=red>UNAUTHORIZED</span>"} | ${p}%`;
 const m=M.findIndex((_,i)=>!has("done",i));$("#cur").textContent=m<0?"ALL MISSIONS COMPLETE":"MISSION "+(m+1)+": "+M[m][0];save()}
function sol(id,ok){if(!ok){beep(150,.25);return note("ACCESS DENIED: incorrect answer",150)}
 if(add("solved",id)){S.xp+=50;note("PUZZLE SOLVED: "+PZ[id].r,880);
 if(id=="P2"){clue("c4");print(["HIDDEN MESSAGE: someone typed a name here once, then erased it."],"vi")}upd();render()}}

const CMD={
help:()=>["help status scan directory","open archive view personnel view missions","read logs investigate decrypt FILE07","access restricted map clear","Some commands are not listed. Read carefully."],
status:()=>["SECURITY LV "+lv()+" | XP "+S.xp,"MISSIONS "+S.done.length+"/8  CLUES "+S.clues.length+"/7  PUZZLES "+S.solved.length+"/5"],
scan:()=>{const s=DOCS.filter(d=>d.lk&&!has("solved",d.lk));return["SCANNING FACILITY...",s.length?"SEALED FILES: "+s.map(d=>d.id+" (puzzle "+d.lk+")").join(", "):"No sealed files remain.",Math.random()<.2?"ANOMALY: a process is reading your keystrokes.":"No anomalies."]},
directory:()=>DOCS.map(d=>d.id+" /"+d.f+"/"+d.t+(d.lk&&!has("solved",d.lk)?" [SEALED]":"")),
"open archive":()=>{go("archive");return["Opening archive."]},"view personnel":()=>{go("pers");return["Opening personnel."]},"view missions":()=>{go("miss");return["Opening missions."]},map:()=>{go("map");return["Opening map."]},
"read logs":()=>S.docs.length?["OPENED: "+S.docs.join(", "),"Use the archive to read them."]:["No logs opened yet."],
investigate:()=>{const m=M.findIndex((_,i)=>!has("done",i));return m<0?["Every lead is exhausted. Make your final decision under Missions."]:["OBJECTIVE: "+M[m][1]]},
"decrypt file07":()=>{go("inv");return has("solved","P2")?["FILE07 already decrypted."]:["FILE07 is a cipher. Opening investigation tools."]},
"access restricted":()=>has("solved","P4")?["ACCESS GRANTED: open D07 in the archive."]:["ACCESS DENIED. Reconstruct the incident timeline first."],
whoami:()=>{clue("c7");upd();return["OPERATOR ID: 000","That is not a user ID. That is a subject ID."]},
echo:()=>has("solved","P2")?["ECHO: I have been waiting for you."]:["Echo what? Some words must be earned."],
clear:()=>{T=[];return[]}};
function run(c){c=c.trim().toLowerCase();if(!c)return;H.push(c);hi=H.length;print(["> "+c],"dim");const f=CMD[c];
 if(f){if(add("cmds",c))S.xp+=5;const o=f();if(c=="clear"){$("#log").innerHTML=""}upd();print(o)}
 else{const sg=Object.keys(CMD).filter(k=>k[0]==c[0]);print(["ERROR: unknown command"+(sg.length?". Did you mean: "+sg.slice(0,3).join(", ")+"?":". Type help.")],"red")}}

function pz(id){const p=PZ[id],ok=has("solved",id);let b="";
 if(ok)b="<div class=ok>SOLVED</div>";
 else if(id=="P3")b=["Hale","Crane","Reyes"].map(n=>`<button data-a=ans data-v="P3|${n.toUpperCase()}">${n}</button>`).join("");
 else if(id=="P4")b=`<div>${EV.slice().sort((a,b)=>a[1].length-b[1].length||b[0].localeCompare(a[0])).map(e=>`<button data-a=tl data-v=${e[0]} ${tlq.includes(e[0])?"disabled":""}>${e[1]}</button>`).join("")}</div><div class=dim>Order: ${tlq.map(x=>EV.find(e=>e[0]==x)[1].slice(0,5)).join(" > ")||"none"} <button data-a=tlr>RESET</button></div>`;
 else b=`<input placeholder="answer"> <button data-a=sub data-v=${id}>SUBMIT</button>`;
 return `<div class=p><h3>${id} ${p.n}</h3><div>${p.q}</div>${b}<div><button data-a=hint data-v=${id}>HINT</button><span class=dim></span></div></div>`}
function bdInner(){const nd=S.clues.map((c,i)=>{const p=S.pos[c]||(S.pos[c]=[90+(i%3)*210,50+Math.floor(i/3)*100]);return[c,p]});
 return S.links.map(l=>{const[a,b]=l.split("|");return`<line x1=${S.pos[a][0]} y1=${S.pos[a][1]} x2=${S.pos[b][0]} y2=${S.pos[b][1]} />`}).join("")+nd.map(([c,p])=>`<g class="nd${sel==c?" sel":""}" data-c=${c} transform="translate(${p[0]},${p[1]})"><circle r=14 /><text y=30>${CL[c]}</text></g>`).join("")}
function bind(){const sv=$("#bd");if(!sv)return;let dg=null,mv=0;
 const pt=e=>{const r=sv.getBoundingClientRect();return[(e.clientX-r.left)*600/r.width,(e.clientY-r.top)*320/r.height]};
 sv.onpointerdown=e=>{const g=e.target.closest(".nd");if(g){dg=g.dataset.c;mv=0;sv.setPointerCapture(e.pointerId)}};
 sv.onpointermove=e=>{if(!dg)return;mv++;const[x,y]=pt(e);S.pos[dg]=[Math.max(20,Math.min(580,x)),Math.max(20,Math.min(290,y))];sv.innerHTML=bdInner()};
 sv.onpointerup=()=>{if(!dg)return;const c=dg;dg=null;if(mv<3){if(sel&&sel!=c){const k=[sel,c].sort().join("|"),i=S.links.indexOf(k);i<0?S.links.push(k):S.links.splice(i,1);sel=null;
 DED.forEach(d=>{if(has("links",d[0])&&add("ded",d[0])){S.xp+=40;note("DEDUCTION UNLOCKED",900);}});}else sel=sel==c?null:c}upd();render()}}

const SEC={
terminal:()=>`<h2>TERMINAL NX-7</h2><div class=p><div id=log>${T.map(l=>`<div class="${l[1]}">${l[0]}</div>`).join("")}</div><div class=ti><span>&gt;</span><input id=ti autocomplete=off placeholder="type help"></div></div>`,
archive:()=>{const d=cur&&DOCS.find(x=>x.id==cur);return`<h2>ARCHIVE</h2><div class=g>${FOLD.map(f=>`<div class=p><b>/${f}</b>${DOCS.filter(d=>d.f==f).map(d=>`<div><button data-a=doc data-v=${d.id}>${d.lk&&!has("solved",d.lk)?"[SEALED] ":""}${d.id}</button></div>`).join("")}</div>`).join("")}</div>`+(d&&has("docs",d.id)?`<div class=p><h3>${d.id}: ${d.t}</h3><div class=dim>Author ${d.a} | ${d.d} | Class: ${d.c}${d.cl?" | Clue: "+CL[d.cl]:""}</div><pre class=doc>${d.x+(d.id=="D02"&&has("docs","D06")?"\n[EDIT 03:41, unknown user] I did not write this line.":"")}</pre></div>`:"")},
inv:()=>`<h2>INVESTIGATION</h2><div class=p><b>Evidence board</b><div class=dim>Drag clues. Tap one clue, then another, to link them. Deductions: ${S.ded.length}/3</div><svg id=bd viewBox="0 0 600 320">${bdInner()}</svg>${S.ded.map(k=>`<div class=ok>&gt; ${DED.find(d=>d[0]==k)[1]}</div>`).join("")}</div>`+Object.keys(PZ).map(pz).join(""),
pers:()=>`<h2>PERSONNEL</h2><div class=g>${PEOPLE.map((p,i)=>`<button data-a=prof data-v=${i}>${p[0]}<br><span class=dim>${p[1]} ${p[5]}</span></button>`).join("")}</div>`+(pc!=null?(p=>`<div class=p><h3>${p[0]}</h3>ID ${p[1]} | ${p[2]} | ${p[3]}<br>Last login: ${p[4]}<br>Status: ${p[5]}<br>Access: ${p[7]}<br>Documents: ${p[8]}<br>Relations: ${p[9]}<p>${p[6]}</p></div>`)(PEOPLE[pc]):""),
map:()=>`<h2>FACILITY MAP</h2><div class=g>${LOC.map((l,i)=>{const u=S.done.length>=l[2];return`<button data-a=loc data-v=${i} ${u?"":"disabled"}>${u?l[0]:"LOCKED"}<br><span class=dim>${u?(has("locs",i)?"visited":"new"):"complete mission "+l[2]}</span></button>`}).join("")}</div>`+(pc!=null&&pc.loc!=null?`<div class=p><h3>${LOC[pc.loc][0]}</h3>${LOC[pc.loc][1]}</div>`:""),
miss:()=>`<h2>MISSIONS</h2>`+M.map((m,i)=>{const d=has("done",i),a=i==0||has("done",i-1);return`<div class=p><b class="${d?"ok":a?"":"dim"}">MISSION 0${i+1}: ${m[0]} ${d?"COMPLETE":a?"ACTIVE":"LOCKED"}</b><div>${a?m[1]:"Complete the previous mission."} Reward: ${m[3]} XP</div></div>`}).join("")+(has("docs","D08")&&!S.ch?`<div class=p><h3 class=red>FINAL DECISION</h3><button data-a=end data-v=A>ACCEPT OFFICIAL TRUTH</button><button data-a=end data-v=B ${has("ded",DED[0][0])?"":"disabled"}>EXPOSE THE HIDDEN TRUTH</button><button data-a=end data-v=C ${has("ded",DED[2][0])?"":"disabled"}>RUN FINAL PROTOCOL</button><div class=dim>B needs the Crane deduction. C needs the Subject 000 deduction.</div></div>`:""),
ach:()=>`<h2>ACHIEVEMENTS</h2><div class=p>XP ${S.xp} | Level ${lv()} | Missions ${S.done.length}/8 | Clues ${S.clues.length}/7 | Puzzles ${S.solved.length}/5 | Documents ${S.docs.length}/9</div>`+Object.keys(AC).map(k=>`<div class=p>${has("ach",k)?"<span class=ok>UNLOCKED</span> ":"<span class=dim>LOCKED</span> "}${has("ach",k)||k!="who"?AC[k][0]:"???"}</div>`).join(""),
set:()=>`<h2>SETTINGS</h2><div class=p><button data-a=snd>SOUND: ${S.snd?"ON":"OFF"}</button><button data-a=intro>REPLAY INTRO</button><button data-a=new>NEW INVESTIGATION</button><button data-a=reset>RESET ALL PROGRESS</button></div>`};
const NAV={terminal:"Terminal",archive:"Archive",inv:"Investigation",pers:"Personnel",map:"Facility Map",miss:"Missions",ach:"Achievements",set:"Settings"};
function render(){$("#nav").innerHTML=Object.keys(NAV).map(k=>`<button data-n=${k} class="${k==sec?"on":""}">${NAV[k]}</button>`).join("");$("#main").innerHTML=SEC[sec]();
 if(sec=="terminal"){const t=$("#ti");t.focus({preventScroll:true});t.onkeydown=e=>{if(e.key=="Enter"){run(t.value);t.value=""}else if(e.key=="ArrowUp"){hi=Math.max(0,hi-1);t.value=H[hi]||""}else if(e.key=="ArrowDown"){hi=Math.min(H.length,hi+1);t.value=H[hi]||""}else if(e.key=="Tab"){e.preventDefault();const m=Object.keys(CMD).find(k=>k.startsWith(t.value.toLowerCase()));if(m)t.value=m}};const L=$("#log");L.scrollTop=1e9}
 bind()}
function go(s){sec=s;pc=null;render()}
const ACT={doc:openDoc,prof:v=>{pc=+v;if(add("prof",pc))S.xp+=10;upd();render()},loc:v=>{pc={loc:+v};if(add("locs",+v)){S.xp+=15;note("LOCATION EXPLORED",600)}upd();render()},
 sub:(v,t)=>{const x=t.parentElement.querySelector("input").value.trim().toUpperCase();sol(v,x==PZ[v].a)},ans:v=>{const[p,a]=v.split("|");sol(p,PZ[p].a==a)},
 tl:v=>{tlq.push(v);if(tlq.length==4){const ok=tlq.join("")=="abcd";tlq=[];sol("P4",ok)}render()},tlr:()=>{tlq=[];render()},
 hint:(v,t)=>{t.nextElementSibling.textContent=" "+PZ[v].h},
 snd:()=>{S.snd=S.snd?0:1;save();render()},intro:()=>{localStorage.removeItem("pu_intro");location.reload()},
 new:()=>{if(confirm("Start a new investigation? Achievements are kept.")){S=Object.assign(S0(),{ach:S.ach,snd:S.snd});T=[];save();boot()}},
 reset:()=>{if(confirm("Delete ALL saved progress, including achievements?")){S=S0();T=[];localStorage.clear();location.reload()}},
 end:v=>{S.ch=v;upd();const e=$("#end"),x=END[v];e.hidden=false;e.innerHTML=`<h1 class=glitch>ENDING ${v}: ${x[0]}</h1><p></p><button id=ne>NEW INVESTIGATION</button><button id=ce>CLOSE</button>`;let k=0;const p=e.querySelector("p"),iv=setInterval(()=>{p.textContent=x[1].slice(0,++k);if(k>=x[1].length)clearInterval(iv)},25);
  $("#ne").onclick=()=>{e.hidden=true;ACT.new()};$("#ce").onclick=()=>{e.hidden=true;render()}}};
document.addEventListener("click",e=>{const n=e.target.closest("[data-n]");if(n){beep(400,.04);return go(n.dataset.n)}const t=e.target.closest("[data-a]");if(t)ACT[t.dataset.a](t.dataset.v,t)});

function boot(){upd();T=[];print(["NX-7 ONLINE. Welcome, user.","Type help to begin. Open /ROOT/D01 in the archive for context."]);go("terminal");if(!S.docs.includes("D01")){}}
function enter(){$("#intro").hidden=true;$("#app").hidden=false;localStorage.setItem("pu_intro",1);S.cmds.length||S.docs.length?(upd(),print(["Session restored. Investigation continues."]),go("terminal")):boot()}
const BL=["INITIALIZING SYSTEM...","CHECKING DATABASE...","RESTORING ARCHIVES...","CONNECTION ESTABLISHED..."];
$("#enter").onclick=enter;$("#notice").onclick=()=>{$("#nt").hidden=!$("#nt").hidden};
if(S.cmds.length||S.docs.length)$("#enter").textContent="CONTINUE INVESTIGATION";
if(localStorage.getItem("pu_intro")){enter()}else{BL.forEach((l,i)=>setTimeout(()=>{$("#boot").textContent+=l+"\n";beep(300+i*80,.05);if(i==3)setTimeout(()=>{$("#title").hidden=false},700)},i*800))}
