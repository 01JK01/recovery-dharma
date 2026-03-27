import { useState, useRef, useEffect, useCallback } from "react";

const C = {
  bg:"#0d1810",surface:"#162012",surfaceAlt:"#1e2d18",surfaceDeep:"#111a0e",
  border:"#2a3d24",borderLight:"#3a5432",gold:"#c8a84a",sage:"#7a9e7e",
  sageDim:"#4a6b4e",cream:"#ede4d2",creamMuted:"#a89880",creamDim:"#6a5e50",
  accent:"#4a8a58",rose:"#c47a7a",blue:"#7a9ab8",lavender:"#9a8abf",
  amber:"#c49a4a",teal:"#5a9e9e",orange:"#c47a4a",
};
const GF=`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,500&family=DM+Sans:wght@300;400;500&display=swap');`;
const GS=`${GF}*{box-sizing:border-box;margin:0;padding:0}body{background:${C.bg};color:${C.cream};font-family:'DM Sans',sans-serif;line-height:1.6}::-webkit-scrollbar{width:3px}::-webkit-scrollbar-track{background:${C.bg}}::-webkit-scrollbar-thumb{background:${C.border};border-radius:2px}@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}@keyframes pulse{0%,100%{opacity:1}50%{opacity:.35}}@keyframes breathe{0%,100%{transform:scale(1);opacity:.5}50%{transform:scale(1.5);opacity:1}}@keyframes sosGlow{0%,100%{box-shadow:0 0 20px #c47a7a22}50%{box-shadow:0 0 50px #c47a7a55}}.fu{animation:fadeUp .45s ease forwards}`;

const S={
  async get(k){try{const r=await window.storage.get(k);return r?JSON.parse(r.value):null;}catch{return null;}},
  async set(k,v){try{await window.storage.set(k,JSON.stringify(v));return true;}catch{return false;}},
};
function useStorage(key,def){
  const[val,setV]=useState(def);const[loaded,setL]=useState(false);
  useEffect(()=>{S.get(key).then(v=>{setV(v!==null?v:def);setL(true);});},[key]);
  const set=useCallback(async nv=>{const r=typeof nv==='function'?nv(val):nv;setV(r);await S.set(key,r);},[key,val]);
  return[val,set,loaded];
}
const todayStr=()=>new Date().toISOString().split("T")[0];
const daysBetween=(a,b)=>Math.max(0,Math.floor((new Date(b)-new Date(a))/(864e5)));
const fmtDate=d=>{try{return new Date(d+"T12:00:00").toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"});}catch{return d;}};
const fmtShort=d=>{try{return new Date(d+"T12:00:00").toLocaleDateString("en-US",{month:"short",day:"numeric"});}catch{return d;}};

function Wheel({size=36,color=C.gold,spin=false}){
  return(<svg width={size}height={size}viewBox="0 0 100 100"style={spin?{animation:"spin 24s linear infinite"}:{}}>
    <circle cx="50"cy="50"r="46"fill="none"stroke={color}strokeWidth="2"opacity=".2"/>
    <circle cx="50"cy="50"r="28"fill="none"stroke={color}strokeWidth="1.5"opacity=".3"/>
    <circle cx="50"cy="50"r="7"fill={color}opacity=".7"/>
    {[0,40,80,120,160,200,240,280,320].map((d,i)=><g key={i}transform={`rotate(${d} 50 50)`}><line x1="50"y1="43"x2="50"y2="22"stroke={color}strokeWidth="1.5"opacity=".6"/></g>)}
  </svg>);
}
function Lotus({size=80,color=C.sage,opacity=.15}){
  return(<svg width={size}height={size}viewBox="0 0 140 140"style={{opacity}}>
    {[0,60,120,180,240,300].map((d,i)=><ellipse key={i}cx="70"cy="70"rx="16"ry="34"transform={`rotate(${d} 70 70) translate(0 -18)`}fill={color}/>)}
    {[30,90,150,210,270,330].map((d,i)=><ellipse key={i}cx="70"cy="70"rx="11"ry="24"transform={`rotate(${d} 70 70) translate(0 -24)`}fill={color}/>)}
    <circle cx="70"cy="70"r="12"fill={color}/>
  </svg>);
}
function Tag({label,color=C.gold}){return <span style={{fontSize:10,color,letterSpacing:"0.18em",textTransform:"uppercase",fontWeight:500}}>{label}</span>;}
function Card({children,style={},accent=null}){return <div style={{background:C.surface,border:`1px solid ${accent||C.border}`,borderRadius:14,padding:"20px",...style}}>{children}</div>;}
function SH({title,subtitle}){return(<div style={{padding:"30px 0 20px"}}><h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:36,fontWeight:400,color:C.cream,lineHeight:1.1}}>{title}</h1>{subtitle&&<p style={{color:C.creamMuted,marginTop:9,fontSize:14,lineHeight:1.75,maxWidth:620}}>{subtitle}</p>}</div>);}
function Tabs({tabs,active,onSelect}){return(<div style={{display:"flex",gap:2,marginBottom:18,background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,padding:3,flexWrap:"wrap"}}>{tabs.map(([id,lbl])=><button key={id}onClick={()=>onSelect(id)}style={{flex:1,minWidth:48,padding:"7px 4px",borderRadius:7,border:"none",background:active===id?C.surfaceAlt:"none",color:active===id?C.gold:C.creamMuted,cursor:"pointer",fontSize:10,fontFamily:"'DM Sans'",fontWeight:active===id?500:400,transition:"all .2s",whiteSpace:"nowrap"}}>{lbl}</button>)}</div>);}
function Ring({pct=0,size=64,color=C.gold,children}){const r=26,ci=2*Math.PI*r;return(<div style={{position:"relative",width:size,height:size,display:"inline-flex",alignItems:"center",justifyContent:"center"}}><svg width={size}height={size}viewBox="0 0 64 64"style={{position:"absolute"}}><circle cx="32"cy="32"r={r}fill="none"stroke={C.border}strokeWidth="3"/><circle cx="32"cy="32"r={r}fill="none"stroke={color}strokeWidth="3"strokeDasharray={ci}strokeDashoffset={ci*(1-pct)}transform="rotate(-90 32 32)"strokeLinecap="round"style={{transition:"stroke-dashoffset .8s ease"}}/></svg><div style={{position:"relative",zIndex:1,textAlign:"center"}}>{children}</div></div>);}
function Accord({items}){
  const[open,setOpen]=useState(null);
  return(<div>{items.map((it,i)=><div key={i}style={{marginBottom:8}}><button onClick={()=>setOpen(open===i?null:i)}style={{width:"100%",background:open===i?C.surfaceAlt:C.surface,border:`1px solid ${open===i?it.color||C.borderLight:C.border}`,borderRadius:open===i?"10px 10px 0 0":10,padding:"13px 17px",cursor:"pointer",textAlign:"left",display:"flex",justifyContent:"space-between",alignItems:"center",transition:"all .2s"}}><span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:17,color:C.cream}}>{it.title}</span><span style={{color:it.color||C.gold,transform:open===i?"rotate(180deg)":"none",transition:"transform .2s"}}>⌄</span></button>{open===i&&<div style={{background:C.surface,border:`1px solid ${it.color||C.borderLight}`,borderTop:"none",borderRadius:"0 0 10px 10px",padding:"17px 19px"}}>{typeof it.body==="string"?<p style={{fontSize:13,color:C.creamMuted,lineHeight:1.85,whiteSpace:"pre-line"}}>{it.body}</p>:it.body}</div>}</div>)}</div>);
}


// ── CONTENT DATA ──────────────────────────────────────────────────────────────

const FOUR_TRUTHS=[
  {tag:"First Noble Truth",title:"Dukkha — The Truth of Suffering",color:C.rose,
   body:`The Pali word dukkha is often translated as "suffering," but its meaning is richer — it encompasses physical pain, emotional distress, and the subtle unsatisfactoriness that runs through even pleasant experience. In addiction, dukkha is unmistakable: the morning after, the shame...`,
   reflection:"What forms has dukkha taken in your experience with addiction? Name them specifically — the actual instances, the actual feelings. What suffering have you been most reluctant to acknowledge?"},
  {tag:"Second Noble Truth",title:"Samudāya — The Origin of Suffering",color:C.amber,
   body:`The Second Noble Truth points to the cause of suffering: taṇhā — craving, literally "thirst." This is not ordinary wanting. It is driven, compulsive reaching. Taṇhā operates as craving for sensory pleasure (the high, the relief), craving for becoming (to escape who we are), and c...`,
   reflection:"What are you most deeply craving — underneath the substance or behavior? What feeling are you reaching for? What are you trying to escape? Be specific."},
  {tag:"Third Noble Truth",title:"Nirodha — The Cessation of Suffering",color:C.sage,
   body:`The Third Noble Truth makes the most audacious claim in all of Buddhism: the cause of suffering can cease. Craving can be relinquished. A human life can be lived without enslavement to compulsion. Freedom is not a metaphor — it is a real, attainable condition.\n\nThis is not the...`,
   reflection:"Can you believe — even tentatively — that freedom from your addiction is possible? What evidence exists in the lives of others? What evidence, however small, exists in your own?"},
  {tag:"Fourth Noble Truth",title:"Magga — The Path",color:C.gold,
   body:`The Fourth Noble Truth is the prescription: the Noble Eightfold Path. Not a ladder but an interwoven set of practices — a spiral rather than a line. It is divided into three trainings: Paññā (wisdom: wise understanding, wise intention), Sīla (ethics: wise speech, wise action, wis...`,
   reflection:"Which of the eight path factors feels most alive in your current practice? Which feels most absent? What would it mean to strengthen the weakest one?"},
];

const EIGHTFOLD=[
  {n:"1",t:"Wise Understanding",p:"Sammā diṭṭhi",c:C.gold,group:"Wisdom",b:"Wise Understanding means seeing clearly how things actually are — the Four Noble Truths, the conditi..."},
  {n:"2",t:"Wise Intention",p:"Sammā saṅkappa",c:C.amber,group:"Wisdom",b:"Wise Intention is the orientation of the heart — the commitment, renewed daily, to move toward wisdo..."},
  {n:"3",t:"Wise Speech",p:"Sammā vācā",c:C.sage,group:"Ethics",b:"Wise Speech encompasses four practices: speaking truthfully (no lying), speaking without divisivenes..."},
  {n:"4",t:"Wise Action",p:"Sammā kammanta",c:C.lavender,group:"Ethics",b:"Wise Action encompasses the first four of the Five Precepts: refraining from taking life, from takin..."},
  {n:"5",t:"Wise Livelihood",p:"Sammā ājīva",c:C.blue,group:"Ethics",b:"Wise Livelihood asks: does my work support or undermine my practice? The Buddhist teaching avoids li..."},
  {n:"6",t:"Wise Effort",p:"Sammā vāyāma",c:C.amber,group:"Meditation",b:"Wise Effort has four dimensions: preventing unwholesome states from arising, releasing them when the..."},
  {n:"7",t:"Wise Mindfulness",p:"Sammā sati",c:C.rose,group:"Meditation",b:"Wise Mindfulness is the capacity to be fully present — with the body, with feelings, with the mind....."},
  {n:"8",t:"Wise Concentration",p:"Sammā samādhi",c:C.gold,group:"Meditation",b:"Wise Concentration (samādhi) is the cultivation of a calm, unified, stable mind through meditation....."},
];

const THREE_POISONS=[
  {title:"Greed — Lobha",color:C.amber,icon:"◆",overview:`Lobha — greed, lust, craving — is the grasping quality of mind. In addiction, it is unmistakable: th...`,
   practice:"Naming practice: when craving arises, say internally: 'Lobha is here. Greed is here.' The naming creates distance. Then ask: 'What unmet need is underneath this?' You are not fighting the craving — you are becoming curious about what it points to."},
  {title:"Hatred — Dosa",color:C.rose,icon:"◆",overview:`Dosa — hatred, aversion, anger, ill-will — is the pushing-away quality of mind. In addiction, dosa a...`,
   practice:"When self-hatred or resentment arises, try the metta phrases: 'May I be safe. May I be healthy. May I be happy. May I live with ease.' If this feels impossible, try: 'May I find peace with this feeling.' The intention matters more than the feeling."},
  {title:"Delusion — Moha",color:C.lavender,icon:"◆",overview:`Moha — delusion, ignorance, confusion — is the not-seeing quality of mind. It is the misperception t...`,
   practice:"When you notice a familiar narrative or justification, try: 'Is this thought true? Can I absolutely know it's true? What is actually happening right now, beneath this story?' Moha dissolves in honest examination."},
];

const FIVE_HINDRANCES=[
  {title:"Sensory Desire — Kāmacchanda",color:C.amber,overview:"Sensory desire — the mind's reaching for pleasure — is the most obvious hindranc...",
   antidote:"Contemplation of impermanence: whatever pleasure this brings will pass. Ask: has this kind of seeking ever brought lasting satisfaction? The antidote is not the absence of pleasure — it is the release of clinging to pleasure."},
  {title:"Ill-Will — Vyāpāda",color:C.rose,overview:"Ill-will — anger, resentment, hatred, contempt — is the mind's pushing away. In ...",
   antidote:"Mettā practice. Begin with yourself, where it is hardest: 'May I be safe. May I be healthy. May I be happy.' You need not feel it to practice it. The intention opens the door that feeling cannot. For resentment: the compassion question — 'What conditions created this person's capacity to harm?' Understanding causation releases us from resentment's hold."},
  {title:"Sloth & Torpor — Thīna-middha",color:C.blue,overview:"Sloth and torpor is the heavy, contracted, withdrawn quality of mind — dullness,...",
   antidote:"Physical movement — even a short walk — reliably disrupts thīna-middha. So does contact with the sangha. In meditation, brightening the attention by opening the eyes or sitting up can help. Above all: recognize this state is impermanent — not your actual capacity, not the truth about recovery."},
  {title:"Restlessness & Worry — Uddhacca-kukkucca",color:C.rose,overview:"Restlessness and worry is the agitated, anxious quality of mind — in recovery, t...",
   antidote:"Grounding practices: body, breath, feet on the floor. The parasympathetic nervous system responds to slow exhalation — breathe out longer than you breathe in. For worry and regret: inquiry is the direct antidote. Bringing the specific thought into the four questions dissolves the compulsive mental rehearsal."},
  {title:"Doubt — Vicikicchā",color:C.lavender,overview:"Doubt is the undermining quality of mind — 'this won't work,' 'you're not capabl...",
   antidote:"Investigate the doubt and bring it to the sangha. Doubt lives in isolation. Community dissolves it. Every person who has gone before you and found their way through is proof that the path is real."},
];

const PARAMITAS=[
  {title:"Generosity — Dāna",color:C.gold,b:"The practice of giving without expectation of return. In addiction, the mind is..."},
  {title:"Ethics — Sīla",color:C.sage,b:"The commitment to ethical conduct — living in alignment with our deepest values..."},
  {title:"Renunciation — Nekkhamma",color:C.amber,b:"The willingness to let go — not as deprivation, but as liberation. In the addict..."},
  {title:"Wisdom — Paññā",color:C.lavender,b:"Insight into the nature of reality — the direct seeing of impermanence, sufferin..."},
  {title:"Energy — Viriya",color:C.rose,b:"The steady, consistent commitment to the path — not frantic striving, but balanc..."},
  {title:"Patience — Khanti",color:C.blue,b:"The capacity to remain present with difficulty without reactivity or despair. In..."},
  {title:"Truthfulness — Sacca",color:C.amber,b:"The commitment to honesty in all dimensions — speech, intention, self-knowledge...."},
  {title:"Resolve — Adhiṭṭhāna",color:C.gold,b:"The unwavering commitment to the path — not willpower but the settled quality of..."},
  {title:"Loving-Kindness — Mettā",color:C.rose,b:"The deliberate cultivation of goodwill — the heartfelt wish for all beings, incl..."},
  {title:"Equanimity — Upekkhā",color:C.sage,b:"The quality of mind that can hold all experience — pleasant and unpleasant, gain..."},
];


const DEPENDENT_ORIGINATION=[
  {link:"Ignorance → Mental Formations",pali:"Avijjā → Saṅkhāra",b:"The chain begins with avijjā — fundamental ignorance about the nature of reality..."},
  {link:"Consciousness → Name-and-Form",pali:"Viññāṇa → Nāma-rūpa",b:"Conditioned consciousness — awareness shaped by past experience — gives rise to..."},
  {link:"Six Sense Bases → Contact",pali:"Saḷāyatana → Phassa",b:"The six sense bases (eye, ear, nose, tongue, body, mind) make contact with their..."},
  {link:"★ Feeling Tone → Craving",pali:"Vedanā → Taṇhā — THE LIBERATION POINT",b:"Here is the critical link. Every moment of contact is accompanied by vedanā: a f..."},
  {link:"Grasping → Becoming",pali:"Upādāna → Bhava",b:"When craving is not interrupted, it becomes upādāna — grasping, clinging, compul..."},
  {link:"Birth → Aging, Sickness, Death",pali:"Jāti → Jarā-maraṇa",b:"Bhava gives rise to birth — the arising of a conditioned being, a particular man..."},
];

const GLOSSARY=[
  {term:"Anicca",def:"Impermanence — all conditioned phenomena are in constant flu..."},
  {term:"Anattā",def:"No-self — there is no fixed, permanent self at the center of..."},
  {term:"Avijjā",def:"Ignorance — the fundamental not-seeing of how things are; th..."},
  {term:"Bodhisattva",def:"In Mahāyāna Buddhism: a being committed to the liberation of..."},
  {term:"Brahmaviharās",def:"The four 'divine abodes': mettā (loving-kindness), karuṇā (c..."},
  {term:"Dāna",def:"Generosity — giving without expectation of return. The direc..."},
  {term:"Dharma",def:"The teaching — the truth of how things are. In Recovery Dhar..."},
  {term:"Dosa",def:"Hatred, aversion, ill-will — one of the Three Poisons. Inclu..."},
  {term:"Dukkha",def:"Suffering, unsatisfactoriness — the First Noble Truth. Not p..."},
  {term:"HALT",def:"Hungry, Angry, Lonely, Tired — four states that dramatically..."},
  {term:"Karuṇā",def:"Compassion — the wish for beings to be free from suffering. ..."},
  {term:"Karma",def:"Action and its fruits — how we act shapes who we become. Not..."},
  {term:"Lobha",def:"Greed, craving, desire — one of the Three Poisons. The grasp..."},
  {term:"Mettā",def:"Loving-kindness — the wish for all beings to be safe, health..."},
  {term:"Moha",def:"Delusion, ignorance — one of the Three Poisons. The confusio..."},
  {term:"Muditā",def:"Sympathetic joy — rejoicing in the happiness of others. Anti..."},
  {term:"Nibbāna/Nirvāṇa",def:"Liberation, the cessation of craving and suffering. The unbi..."},
  {term:"Paññā",def:"Wisdom — insight into the nature of reality; the Three Chara..."},
  {term:"Paṭicca-samuppāda",def:"Dependent origination — all phenomena arise in dependence on..."},
  {term:"Phassa",def:"Contact — the moment of meeting between sense organ and obje..."},
  {term:"Precepts",def:"The Five Training Rules: refrain from killing, stealing, sex..."},
  {term:"RAIN",def:"A mindfulness practice: Recognize, Allow, Investigate, Nurtu..."},
  {term:"Samādhi",def:"Meditative concentration — the quality of unified, focused a..."},
  {term:"Sangha",def:"Community of practitioners — one of the Three Jewels. The Bu..."},
  {term:"Sati",def:"Mindfulness — clear, present-moment awareness. The seventh f..."},
  {term:"Sīla",def:"Ethics — the second of the three trainings. Encompasses wise..."},
  {term:"Taṇhā",def:"Thirst, craving — the cause of suffering in the Second Noble..."},
  {term:"Upādāna",def:"Grasping, clinging — the solidification of craving into comp..."},
  {term:"Upekkhā",def:"Equanimity — balanced, steady awareness that can hold all ex..."},
  {term:"Vedanā",def:"Feeling tone — the immediate quality of pleasant/unpleasant/..."},
  {term:"Vipassanā",def:"Insight meditation — direct seeing of impermanence, sufferin..."},
  {term:"Viriya",def:"Energy, effort — the fifth pāramitā and sixth factor of the ..."},
];

const COMMITMENTS=[
  {num:1,title:"Meditation",icon:"◌",color:C.sage,eightfold:"Wise Mindfulness · Wise Concentration",phrase:"I commit to a daily meditation practice.",
   overview:"Meditation trains the mind to be present and non-reactive — the foundation of all recovery practice.",
   reflection:"What is your current relationship to meditation? If you have a practice, what are its qualities? If you don't yet have one, what is the obstacle? Be honest rather than aspirational."},
  {num:2,title:"Sangha",icon:"❋",color:C.gold,eightfold:"Wise Action · Wise Intention",phrase:"I commit to attending and participating in meetings and community.",
   overview:"Renunciation is the commitment to abstain from what drives our addiction, and to learn to be with craving without acting on it.",
   reflection:"What do you withhold when you share in meetings? What would it mean to be fully honest with your sangha? What has community given you — or what do you hope it could?"},
  {num:3,title:"Inquiry",icon:"✦",color:C.lavender,eightfold:"Wise Understanding",phrase:"I commit to engaging in inquiry and self-examination.",
   overview:"Wise Understanding means seeing clearly the nature of addiction, craving, and impermanence — and recognizing that the craving mind is not who we are.",
   reflection:"What story about yourself or your addiction feels most fixed and absolutely true? What would it mean — even theoretically — to question it?"},
  {num:4,title:"Mentorship",icon:"◈",color:C.blue,eightfold:"Wise Speech · Wise Action",phrase:"I commit to working with a mentor and to mentoring others.",
   overview:"Wise Intention is cultivating the quality of mind from which action arises — acting from clarity and care rather than from compulsion and fear.",
   reflection:"What holds you back from reaching out to a potential mentor? What do you imagine a mentor could offer that you cannot access alone?"},
  {num:5,title:"Refuge",icon:"☸",color:C.gold,eightfold:"Wise Understanding · Wise Intention",phrase:"I take refuge in the Buddha, the Dharma, and the Sangha.",
   overview:"Wise Action means aligning behavior with our deepest values, reducing harm, and making amends for what addiction has broken.",
   reflection:"In what specific ways do you currently take refuge when you are suffering? What would it mean to deliberately turn toward the Three Jewels instead?"},
  {num:6,title:"Precepts",icon:"⬡",color:C.amber,eightfold:"Wise Speech · Wise Action · Wise Livelihood",phrase:"I commit to practicing the Five Precepts.",
   overview:"Wise Livelihood asks whether our work supports or undermines recovery — and whether we can bring integrity to how we earn our living.",
   reflection:"Which precept feels most alive in your practice right now? Which feels most challenged? Where is the gap between your values and your actions greatest?"},
  {num:7,title:"Service",icon:"↺",color:C.rose,eightfold:"Wise Action",phrase:"I commit to service within the sangha and beyond.",
   overview:"Wise Effort is the steady, patient application of energy toward recovery — neither punishing nor slack, but wise and sustainable.",
   reflection:"What service have you offered in your recovery? What have you withheld? What would it feel like to give something of yourself — specifically, concretely — this week?"},
  {num:8,title:"Wise Action",icon:"→",color:C.sage,eightfold:"The Entire Eightfold Path",phrase:"I commit to bringing wise, compassionate action into all areas of my life.",
   overview:"Wise Speech is practicing truthfulness and kindness — including in how we speak to and about ourselves.",
   reflection:"Where in your life outside of explicit recovery practice do you most want to bring wise action? What would change if the quality of attention you bring to meditation extended into that domain?"},
];


const INQUIRY_TYPES={
  "four-questions":{title:"The Four Questions",color:C.lavender,steps:[
    {q:"Write the stressful thought"},
    {q:"Is it true?"},
    {q:"Can you absolutely know it's true?"},
    {q:"How do you react when you believe this thought?"},
    {q:"Who would you be without this thought?"},
    {q:"The Turnaround"},
  ]},
  "resentment":{title:"Resentment Inquiry",color:C.rose,steps:[
    {q:"Name the resentment precisely"},
    {q:"The belief underneath"},
    {q:"Impact on your life"},
    {q:"Your part, if any"},
    {q:"The four questions on the core belief"},
    {q:"The compassion question"},
  ]},
  "fear":{title:"Fear Inventory",color:C.blue,steps:[
    {q:"Name the fear specifically"},
    {q:"Worst-case scenario"},
    {q:"Impact on your life"},
    {q:"Past or future?"},
    {q:"The four questions"},
    {q:"Wise action in the face of this fear"},
  ]},
  "shame":{title:"Shame Inquiry",color:C.rose,steps:[
    {q:"Write the shame statement exactly as it sounds"},
    {q:"When did you first believe this?"},
    {q:"Whose voice is this?"},
    {q:"The four questions on the shame statement"},
    {q:"Self-compassion practice"},
    {q:"Life without this shame"},
  ]},
  "craving":{title:"Craving Inquiry",color:C.sage,steps:[
    {q:"Describe the craving precisely"},
    {q:"The feeling tone underneath"},
    {q:"The story"},
    {q:"Brief four questions"},
    {q:"Wise action"},
  ]},
  "harm-done":{title:"Harm Done Inventory",color:C.amber,steps:[
    {q:"Name the harm precisely"},
    {q:"The impact"},
    {q:"What drove you"},
    {q:"Your genuine regret"},
    {q:"What repair looks like"},
  ]},
  "addiction-pattern":{title:"Addiction Pattern Map",color:C.teal,steps:[
    {q:"Name your primary addiction precisely"},
    {q:"The progression"},
    {q:"What need it was meeting"},
    {q:"What it cost you"},
    {q:"The triggers you now know"},
    {q:"How the pattern still shows up"},
    {q:"Wise structures for your pattern"},
  ]},
  "relationship":{title:"Relationship Inquiry",color:C.rose,steps:[
    {q:"Name the relationship"},
    {q:"The charge"},
    {q:"My contribution"},
    {q:"The old wound"},
    {q:"What I need but haven't named"},
    {q:"Wise next step"},
  ]},
  "grief":{title:"Grief & Loss Inquiry",color:C.blue,steps:[
    {q:"Name what has been lost"},
    {q:"Where you feel it in the body"},
    {q:"What you haven't let yourself feel"},
    {q:"What was real and worth honoring"},
    {q:"What this grief needs from you"},
    {q:"Metta for your grieving self"},
  ]},
  "values":{title:"Values Clarification",color:C.gold,steps:[
    {q:"Name three values you most want to live by"},
    {q:"Where you are living these values"},
    {q:"Where you are violating these values"},
    {q:"The value most needing attention"},
    {q:"One specific aligned action this week"},
  ]},
  "self-compassion":{title:"Self-Compassion Practice",color:C.lavender,steps:[
    {q:"What are you being hard on yourself about?"},
    {q:"Would you say this to a friend?"},
    {q:"Common humanity"},
    {q:"What this moment needs"},
    {q:"The compassion phrase"},
  ]},
  "body-wisdom":{title:"Body Wisdom Inquiry",color:C.sage,steps:[
    {q:"Locate the feeling in the body"},
    {q:"If this sensation could speak"},
    {q:"The history of this sensation"},
    {q:"What the body needs"},
    {q:"One kind thing you can offer your body right now"},
  ]},
};

const RELAPSE_GUIDE={
  before:[
    {title:"The Three Stages of Relapse",color:C.rose},
    {title:"Your Personal Warning Signs",color:C.amber},
    {title:"HALT+ — Physical Prevention",color:C.sage},
    {title:"Building Relapse Prevention Into Daily Life",color:C.blue},
  ],
  during:[
    {title:"If You Are Craving Right Now",color:C.rose},
    {title:"If You Are Considering Using",color:C.amber},
  ],
  after:[
    {title:"If You Have Relapsed",color:C.rose},
    {title:"Examining Relapse with Compassion",color:C.amber},
    {title:"Breaking the Shame Spiral",color:C.sage},
  ],
};

const TRAUMA_DATA=[
  {title:"The Central Question"},
  {title:"Trauma and the Developing Brain"},
  {title:"The Body Keeps the Score"},
  {title:"Window of Tolerance"},
  {title:"Trauma-Sensitive Practice"},
  {title:"Self-Compassion as the Foundation"},
];

const MILESTONE_DAYS=[1,3,7,14,30,60,90,180,365,548,730,1095,1825,3650];
const MILESTONE_LABELS={1:"First Day",3:"Three Days",7:"One Week",14:"Two Weeks",30:"One Month",60:"Two Months",90:"Three Months",180:"Six Months",365:"One Year",548:"18 Months",730:"Two Years",1095:"Three Years",1825:"Five Years",3650:"Ten Years"};
const MILESTONE_WORDS={1:"The first day is the most courageous day there is. You began.",3:"Three days. For many, the hardest. The body and mind are adjusting. You stayed.",7:"One week of choosing recovery. Seven beginnings.",14:"Two weeks. The habit of returning is starting to take root.",30:"One month. Neural pathways are beginning to shift. The practice is becoming practice.",60:"Two months. You have shown up for yourself again and again.",90:"Three months. Ninety days of choosing the path. This is significant. Celebrate.",180:"Six months. Half a year. You have walked through many storms and returned.",365:"One year. A full cycle of seasons. This is a profound and real achievement.",548:"Eighteen months. A year and a half of sustained practice. You are proof the path works.",730:"Two years. More time in recovery than most people manage in a lifetime of trying.",1095:"Three years. The practice has become part of who you are.",1825:"Five years. Your recovery has healed ripples you cannot even see.",3650:"Ten years. You have given an entire decade to the path. You are the Dharma."};

const MOODS=[{val:1,label:"Struggling",color:C.rose,icon:"▼"},{val:2,label:"Difficult",color:C.orange,icon:"◆"},{val:3,label:"Okay",color:C.amber,icon:"◈"},{val:4,label:"Good",color:C.sage,icon:"◉"},{val:5,label:"Thriving",color:C.teal,icon:"▲"}];

const REFLECTIONS_HOME=["Addiction is not a moral failing. It is a response to suffering — a reaching for relief that became a trap.","We cannot think our way into recovery. We practice our way into recovery.","May I meet this moment with compassion. May I meet this craving with awareness.","Impermanence means this craving will pass. It means this shame is not permanent.","We are not broken people trying to fix ourselves. We are whole people learning to meet our suffering with wisdom.","The sangha holds what we cannot hold alone. This is not weakness — it is how healing works.","Shame keeps us sick. Compassion sets us free.","There is a moment, just before we act on craving, when we have a choice. The practice is learning to find that moment.","Every time we return to the breath, we are returning to freedom.","The question is not why the addiction. The question is why the pain. — Gabor Maté","We do not have to understand suffering perfectly to begin working with it. We only have to be willing.","The opposite of addiction is not sobriety. It is connection. — Johann Hari"];


// ── SOS SCREEN ────────────────────────────────────────────────────────────────
const SOS_PHASES=[
  {title:"You are not alone.",body:"A craving is here. That is all it is — a craving. It is not you, it is not permanent, and it will pass. You don't have to fight it. You only have to be present with it.",action:"I'm here"},
  {title:"Ground yourself first.",body:"Feel your feet on the floor — press them down. Name 5 things you can see right now. Take one slow breath in through your nose for 4 counts. Hold 2. Out through your mouth for 6. You are here. You are okay.",action:"I'm grounded"},
  {title:"Urge Surfing",body:"A craving is like a wave. It rises, peaks, and falls — always. You don't need to escape it. You only need to ride it. Watch it in your body without adding fuel. This is urge surfing.",action:"Start the timer",isTimer:true},
  {title:"What is underneath?",body:"Underneath this craving is a feeling. Loneliness? Anxiety? Shame? Boredom? The craving is not the enemy — it is a messenger pointing to something real. What is it pointing to?",action:"I see it"},
  {title:"What is the wise action?",body:"Not suppression. Not giving in. Wise action: Call your mentor. Text someone. Go to a meeting. Walk. Breathe. You know what helps. The question is only: will you choose it?",action:"I have a plan"},
  {title:"You made it through.",body:"Every moment you stayed present with the craving without acting on it is recovery. This is the practice. You just practiced it. The wave fell, as waves always do.",action:"Close SOS"},
];

function SOSScreen({onClose}){
  const[phase,setPhase]=useState(0);const[secs,setSecs]=useState(900);
  const[running,setRunning]=useState(false);const[elapsed,setElapsed]=useState(0);
  const[bPhase,setBPhase]=useState("Breathe In");
  const iRef=useRef(null);const bRef=useRef(null);
  const startUrge=()=>{
    setRunning(true);setElapsed(0);
    iRef.current=setInterval(()=>setElapsed(e=>{if(e+1>=secs){clearInterval(iRef.current);return secs;}return e+1;}),1000);
    let pi=0;const ps=[{t:"Breathe In",d:4000},{t:"Hold",d:2000},{t:"Breathe Out",d:6000},{t:"Pause",d:2000}];
    const cycle=()=>{setBPhase(ps[pi].t);bRef.current=setTimeout(()=>{pi=(pi+1)%ps.length;cycle();},ps[pi].d);};cycle();
  };
  const stopUrge=()=>{clearInterval(iRef.current);clearTimeout(bRef.current);setRunning(false);};
  const cur=SOS_PHASES[phase];const prog=elapsed/secs;
  const mm=Math.floor((secs-elapsed)/60).toString().padStart(2,"0");const ss=((secs-elapsed)%60).toString().padStart(2,"0");
  return(
    <div style={{position:"fixed",inset:0,background:`${C.bg}f5`,zIndex:1000,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:20,backdropFilter:"blur(12px)"}}>
      <div style={{maxWidth:480,width:"100%"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:28}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}><div style={{width:9,height:9,borderRadius:"50%",background:C.rose,animation:"pulse 1.5s ease-in-out infinite"}}/><span style={{fontSize:10,color:C.rose,letterSpacing:".2em",textTransform:"uppercase"}}>SOS Mode</span></div>
          <button onClick={()=>{stopUrge();onClose();}}style={{background:"none",border:`1px solid ${C.border}`,color:C.creamMuted,borderRadius:7,padding:"5px 11px",cursor:"pointer",fontSize:11}}>Exit</button>
        </div>
        <div style={{display:"flex",gap:7,justifyContent:"center",marginBottom:28}}>{SOS_PHASES.map((_,i)=><div key={i}style={{width:8,height:8,borderRadius:"50%",background:i<=phase?C.rose:C.border,transition:"background .3s"}}/>)}</div>
        <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:20,padding:"32px 28px",textAlign:"center",marginBottom:20,animation:"sosGlow 3s ease-in-out infinite"}}>
          <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:28,color:C.cream,marginBottom:14,lineHeight:1.25}}>{cur.title}</h2>
          <p style={{fontSize:14,color:C.creamMuted,lineHeight:1.85,marginBottom:24}}>{cur.body}</p>
          {cur.isTimer&&(
            <div style={{marginBottom:24}}>
              {!running?(
                <div>
                  <div style={{display:"flex",gap:6,justifyContent:"center",marginBottom:14}}>{[[5*60,"5m"],[10*60,"10m"],[15*60,"15m"],[20*60,"20m"]].map(([s,l])=><button key={s}onClick={()=>setSecs(s)}style={{padding:"6px 12px",borderRadius:8,border:`1px solid ${secs===s?C.rose:C.border}`,background:secs===s?`${C.rose}22`:C.surfaceDeep,color:secs===s?C.rose:C.creamMuted,cursor:"pointer",fontSize:12,fontFamily:"'DM Sans'"}}>{l}</button>)}</div>
                  <button onClick={startUrge}style={{background:`${C.rose}22`,border:`1px solid ${C.rose}`,color:C.rose,borderRadius:12,padding:"11px 26px",cursor:"pointer",fontSize:14,fontFamily:"'Cormorant Garamond',serif"}}>Start urge surfing</button>
                </div>
              ):(
                <div>
                  <div style={{position:"relative",display:"inline-block",marginBottom:14}}>
                    <div style={{width:130,height:130,borderRadius:"50%",background:`radial-gradient(circle,${C.rose}22,${C.rose}06)`,border:`1.5px solid ${C.rose}44`,display:"flex",alignItems:"center",justifyContent:"center",animation:"breathe 12s ease-in-out infinite"}}>
                      <div><div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:15,color:C.cream,marginBottom:1}}>{bPhase}</div><div style={{fontSize:30,fontWeight:300,color:C.cream}}>{mm}:{ss}</div></div>
                    </div>
                    <svg style={{position:"absolute",top:-4,left:-4}}width={138}height={138}viewBox="0 0 138 138"><circle cx="69"cy="69"r="66"fill="none"stroke={C.rose}strokeWidth="1.5"opacity=".3"strokeDasharray={`${2*Math.PI*66}`}strokeDashoffset={`${2*Math.PI*66*(1-prog)}`}transform="rotate(-90 69 69)"strokeLinecap="round"style={{transition:"stroke-dashoffset 1s linear"}}/></svg>
                  </div>
                  <div><button onClick={stopUrge}style={{background:"none",border:`1px solid ${C.border}`,color:C.creamMuted,borderRadius:8,padding:"7px 14px",cursor:"pointer",fontSize:11}}>Stop</button></div>
                </div>
              )}
            </div>
          )}
          <button onClick={()=>{if(phase<SOS_PHASES.length-1)setPhase(p=>p+1);else{stopUrge();onClose();}}}style={{background:phase<SOS_PHASES.length-1?`${C.rose}22`:C.surfaceAlt,border:`1px solid ${phase<SOS_PHASES.length-1?C.rose:C.gold}`,color:phase<SOS_PHASES.length-1?C.rose:C.gold,borderRadius:12,padding:"12px 28px",cursor:"pointer",fontSize:14,fontFamily:"'Cormorant Garamond',serif"}}>{cur.action}</button>
        </div>
        <div style={{background:C.surfaceDeep,borderRadius:12,padding:"14px 18px"}}>
          <div style={{fontSize:10,color:C.creamDim,letterSpacing:".15em",textTransform:"uppercase",marginBottom:8}}>Crisis Resources</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>{[["988 Lifeline","Call or text 988"],["Crisis Text","Text HOME to 741741"],["SAMHSA","1-800-662-4357"],["RD Meetings","recoverydarma.org"]].map(([t,d])=><div key={t}style={{background:C.surface,borderRadius:8,padding:"9px 11px"}}><div style={{fontSize:11,color:C.rose,fontWeight:500}}>{t}</div><div style={{fontSize:10,color:C.creamMuted,marginTop:1}}>{d}</div></div>)}</div>
        </div>
      </div>
    </div>
  );
}


// ── HOME ──────────────────────────────────────────────────────────────────────
function OnboardingScreen({onComplete}){
  const[step,setStep]=useState(0);
  const[name,setName]=useState("");
  const[startDate,setStartDate]=useState("");
  const[addiction,setAddiction]=useState("");
  const[motivation,setMotivation]=useState("");
  const ADDICTIONS=["Alcohol","Cannabis","Opioids","Stimulants","Benzodiazepines","Gambling","Food","Technology","Sex / Relationships","Work","Other"];
  const done=()=>{
    const profile={name:name.trim()||"Friend",addiction,motivation,created:todayStr()};
    localStorage.setItem("rd:profile",JSON.stringify(profile));
    if(startDate)localStorage.setItem("rd:start_date",JSON.stringify(startDate));
    onComplete(profile);
  };
  const steps=[
    {title:"Welcome to Recovery Dharma",sub:"A Buddhist path to freedom from addiction.",content:(<div>
      <div style={{textAlign:"center",marginBottom:24,opacity:.9}}><Lotus size={64}color={C.gold}/></div>
      <p style={{fontSize:13,color:C.creamMuted,lineHeight:1.9,marginBottom:20}}>This app is a companion to the Recovery Dharma program — peer-led, Buddhist-inspired, free. It holds your practice, tracks your progress, and walks beside you.</p>
      <p style={{fontSize:12,color:C.creamMuted,lineHeight:1.8,borderLeft:`2px solid ${C.gold}`,paddingLeft:12}}>Your data stays on this device. Nothing is sent anywhere. You can export or clear it anytime.</p>
    </div>)},
    {title:"What should we call you?",sub:"First name or whatever feels right.",content:(<div>
      <input value={name} onChange={e=>setName(e.target.value)} placeholder="Your name" autoFocus
        style={{width:"100%",background:C.surfaceDeep,border:`1px solid ${C.border}`,borderRadius:10,padding:"13px 16px",color:C.cream,fontSize:16,fontFamily:"'Cormorant Garamond',serif",outline:"none",marginBottom:8}}/>
      <p style={{fontSize:11,color:C.creamDim,lineHeight:1.7}}>This is only used to personalize the app for you.</p>
    </div>)},
    {title:"What is your primary addiction?",sub:"This helps personalize your practice.",content:(<div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
      {ADDICTIONS.map(a=><button key={a} onClick={()=>setAddiction(a)}
        style={{padding:"9px 14px",borderRadius:9,border:`1px solid ${addiction===a?C.gold:C.border}`,background:addiction===a?`${C.gold}22`:C.surfaceDeep,color:addiction===a?C.gold:C.creamMuted,cursor:"pointer",fontSize:12,fontFamily:"'DM Sans'"}}>{a}</button>)}
    </div>)},
    {title:"When did this period of recovery begin?",sub:"Set to what feels true today. You can change it anytime.",content:(<div>
      <input type="date" value={startDate} onChange={e=>setStartDate(e.target.value)} max={todayStr()}
        style={{width:"100%",background:C.surfaceDeep,border:`1px solid ${C.border}`,borderRadius:10,padding:"13px 16px",color:C.cream,fontSize:14,fontFamily:"'DM Sans'",outline:"none",marginBottom:12}}/>
      <button onClick={()=>setStartDate("")} style={{background:"none",border:"none",color:C.creamDim,cursor:"pointer",fontSize:11,padding:0}}>Skip — I'll set this later</button>
    </div>)},
    {title:"What brought you here?",sub:"Optional. A note to your future self.",content:(<div>
      <textarea value={motivation} onChange={e=>setMotivation(e.target.value)} rows={4}
        placeholder="What happened? What are you hoping for? Write as much or as little as you want."
        style={{width:"100%",background:C.surfaceDeep,border:`1px solid ${C.border}`,borderRadius:10,padding:"12px 16px",color:C.cream,fontSize:13,fontFamily:"'DM Sans'",outline:"none",resize:"none",lineHeight:1.8,marginBottom:8}}/>
      <p style={{fontSize:11,color:C.creamDim,lineHeight:1.7}}>This is stored only on this device. No one else sees it.</p>
    </div>)},
  ];
  const current=steps[step];
  const isLast=step===steps.length-1;
  return(
    <div style={{minHeight:"100vh",background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",padding:"24px 16px"}}>
      <style>{GS}</style>
      <div style={{maxWidth:480,width:"100%"}}>
        <div style={{marginBottom:28}}>
          <div style={{display:"flex",gap:6,marginBottom:24}}>
            {steps.map((_,i)=><div key={i} style={{flex:1,height:3,borderRadius:2,background:i<=step?C.gold:C.border,transition:"background .3s"}}/>)}
          </div>
          <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:26,color:C.cream,marginBottom:6,fontWeight:400}}>{current.title}</h1>
          <p style={{fontSize:12,color:C.creamMuted,marginBottom:20}}>{current.sub}</p>
          {current.content}
        </div>
        <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
          {step>0&&<button onClick={()=>setStep(s=>s-1)} style={{background:"none",border:`1px solid ${C.border}`,color:C.creamMuted,borderRadius:9,padding:"10px 18px",cursor:"pointer",fontSize:12}}>Back</button>}
          {!isLast
            ?<button onClick={()=>setStep(s=>s+1)} style={{background:C.surfaceAlt,border:`1px solid ${C.gold}`,color:C.gold,borderRadius:9,padding:"10px 22px",cursor:"pointer",fontSize:12,fontFamily:"'Cormorant Garamond',serif"}}>Continue →</button>
            :<button onClick={done} style={{background:`${C.gold}22`,border:`1px solid ${C.gold}`,color:C.gold,borderRadius:9,padding:"11px 26px",cursor:"pointer",fontSize:13,fontFamily:"'Cormorant Garamond',serif",letterSpacing:".03em"}}>Begin the path →</button>}
        </div>
      </div>
    </div>
  );
}


function HomeScreen({onNav,onSOS,setPage,setSOS}){
  if(!setSOS)setSOS=onSOS;if(!setPage)setPage=onNav;
  const today=new Date();
  const doy=Math.floor((today-new Date(today.getFullYear(),0,0))/864e5);
  const ref=REFLECTIONS_HOME[doy%REFLECTIONS_HOME.length];
  const MONTHS=["January","February","March","April","May","June","July","August","September","October","November","December"];
  const DAYS=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const[startDate]=useStorage("rd:start_date",null);
  const[checkins]=useStorage("rd:checkins",[]);
  const todayCI=checkins.find?.(c=>c.date===todayStr());
  const daysIn=startDate?daysBetween(startDate,todayStr()):null;
  const NAV=[
    {page:"recovery",label:"My Recovery",sub:"Dashboard · streak · milestones",icon:"◉",color:C.gold},
    {page:"checkin",label:"Daily Check-In",sub:"Mood · craving · gratitude",icon:"◈",color:C.sage},
    {page:"path",label:"The Teachings",sub:"Four Truths · Eightfold Path · Poisons",icon:"☸",color:C.lavender},
    {page:"wisdom",label:"Wisdom Library",sub:"Hindrances · Pāramitās · Glossary",icon:"✧",color:C.blue},
    {page:"commitments",label:"8 Commitments",sub:"The full program",icon:"⬡",color:C.amber},
    {page:"inquiry",label:"Inquiry Practice",sub:"The Work · resentment · shame",icon:"✦",color:C.lavender},
    {page:"workbook",label:"8-Week Workbook",sub:"Structured daily practice",icon:"◇",color:C.teal},
    {page:"practice",label:"Daily Practice",sub:"Meditation · guided · readings",icon:"◌",color:C.sage},
    {page:"meetings",label:"Meetings & Sangha",sub:"Formats · agreements · facilitation",icon:"❋",color:C.gold},
    {page:"relapse",label:"Relapse Guide",sub:"Before · during · after",icon:"△",color:C.rose},
    {page:"trauma",label:"Trauma & Recovery",sub:"Maté · Neff · van der Kolk",icon:"◆",color:C.blue},
    {page:"network",label:"My Network",sub:"Mentor · contacts · crisis",icon:"◉",color:C.teal},
    {page:"triggers",label:"Trigger Tracker",sub:"Name what drives you",icon:"△",color:C.amber},
    {page:"milestones",label:"Milestones",sub:"Mark the path",icon:"★",color:C.gold},
    {page:"amends",label:"Amends Tracker",sub:"Honest accounting",icon:"↺",color:C.rose},
    {page:"journal",label:"Journal",sub:"Persistent private writing",icon:"✎",color:C.lavender},
    {page:"guide",label:"AI Dharma Guide",sub:"Wisdom on demand",icon:"✦",color:C.sageDim},
  ];
  return(
    <div className="fu"style={{maxWidth:780,margin:"0 auto",padding:"0 16px 60px"}}>
      <div style={{textAlign:"center",padding:"38px 0 22px",position:"relative"}}>
        <div style={{position:"absolute",top:8,left:"50%",transform:"translateX(-50%)"}}><Lotus size={190}color={C.gold}opacity={.06}/></div>
        <div style={{marginBottom:12}}><Wheel size={58}spin color={C.gold}/></div>
        <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:44,fontWeight:300,color:C.cream,letterSpacing:".015em",lineHeight:1.05}}>Recovery Dharma</h1>
        <p style={{color:C.creamMuted,marginTop:7,fontSize:11,letterSpacing:".14em",textTransform:"uppercase"}}>Buddhist-Inspired Path to Healing</p>
        <p style={{color:C.sageDim,marginTop:5,fontSize:11}}>{DAYS[today.getDay()]} · {MONTHS[today.getMonth()]} {today.getDate()}, {today.getFullYear()}</p>
      </div>
      <button onClick={()=>setSOS(true)}style={{width:"100%",background:`${C.rose}12`,border:`1px solid ${C.rose}44`,color:C.rose,borderRadius:14,padding:"14px",cursor:"pointer",marginBottom:14,display:"flex",alignItems:"center",justifyContent:"center",gap:12,fontFamily:"'Cormorant Garamond',serif",fontSize:17,transition:"all .2s",animation:"sosGlow 4s ease-in-out infinite"}}onMouseEnter={e=>e.currentTarget.style.background=`${C.rose}22`}onMouseLeave={e=>e.currentTarget.style.background=`${C.rose}12`}>
        <div style={{width:9,height:9,borderRadius:"50%",background:C.rose,animation:"pulse 1.5s ease-in-out infinite"}}/> SOS — I need help right now <div style={{width:9,height:9,borderRadius:"50%",background:C.rose,animation:"pulse 1.5s ease-in-out infinite"}}/>
      </button>
      {(daysIn!==null||todayCI)&&<div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:12}}>
        {daysIn!==null&&<Card style={{textAlign:"center",padding:"12px 8px"}}><div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:28,color:C.gold,lineHeight:1}}>{daysIn}</div><div style={{fontSize:9,color:C.creamMuted,marginTop:2}}>Days in recovery</div></Card>}
        <Card style={{textAlign:"center",padding:"12px 8px"}}><div style={{fontSize:22,color:todayCI?MOODS.find(m=>m.val===todayCI.mood)?.color||C.sage:C.creamDim,lineHeight:1}}>{todayCI?MOODS.find(m=>m.val===todayCI.mood)?.icon||"◈":"—"}</div><div style={{fontSize:9,color:C.creamMuted,marginTop:2}}>{todayCI?"Today's mood":"Check in today"}</div></Card>
        <Card style={{textAlign:"center",padding:"12px 8px",cursor:"pointer",borderColor:`${C.rose}33`}}onClick={()=>setSOS(true)}><div style={{fontSize:20,color:C.rose,lineHeight:1}}>🆘</div><div style={{fontSize:9,color:C.rose,marginTop:2}}>SOS Mode</div></Card>
      </div>}
      <Card style={{marginBottom:12,background:`linear-gradient(135deg,${C.surfaceAlt},${C.surface})`,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:-15,right:-15,opacity:.06}}><Lotus size={110}color={C.gold}/></div>
        <Tag label="Daily Reflection" color={C.gold}/>
        <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:19,fontWeight:300,fontStyle:"italic",color:C.cream,lineHeight:1.65,marginTop:9,marginBottom:7}}>"{ref}"</p>
      </Card>
      <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:7}}>
        {NAV.map(t=>(
          <button key={t.page}onClick={()=>setPage(t.page)}style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:11,padding:"13px 14px",cursor:"pointer",textAlign:"left",transition:"all .2s"}}onMouseEnter={e=>{e.currentTarget.style.borderColor=t.color;e.currentTarget.style.background=C.surfaceAlt;}}onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.background=C.surface;}}>
            <div style={{display:"flex",gap:9,alignItems:"center"}}><span style={{fontSize:16,color:t.color}}>{t.icon}</span><div><div style={{fontSize:11,color:C.cream,fontWeight:500}}>{t.label}</div><div style={{fontSize:9,color:C.creamMuted,marginTop:1}}>{t.sub}</div></div></div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── MY RECOVERY ───────────────────────────────────────────────────────────────
function MyRecoveryScreen(){
  const[startDate,setStartDate,sdL]=useStorage("rd:start_date",null);
  const[medLog]=useStorage("rd:meditations",[]);
  const[inquiries]=useStorage("rd:inquiries",[]);
  const[journal]=useStorage("rd:journal",[]);
  const[amends]=useStorage("rd:amends",[]);
  const[checkins]=useStorage("rd:checkins",[]);
  const[commitDone]=useStorage("rd:commit_done",{});
  const[weeklyCI,setWeeklyCI]=useStorage("rd:weekly_checkins",[]);
  const[tmpDate,setTmpDate]=useState("");const[editStart,setEditStart]=useState(false);
  const[ciText,setCiText]=useState("");const[ciSaved,setCISaved]=useState(false);
  const daysIn=startDate?daysBetween(startDate,todayStr()):null;
  const totalMedMins=medLog.reduce((a,m)=>a+(m.duration||0),0);
  const streak=(()=>{if(!medLog.length)return 0;const days=[...new Set(medLog.map(m=>m.date))].sort().reverse();let s=0,cur=todayStr();for(const d of days){if(d===cur||daysBetween(d,cur)===1){s++;cur=d;}else break;}return s;})();
  const commitCount=Object.values(commitDone).filter(Boolean).length;
  const nextM=MILESTONE_DAYS.find(d=>daysIn!==null&&d>daysIn);
  const today=new Date();const yr=today.getFullYear(),mo=today.getMonth();
  const dim=new Date(yr,mo+1,0).getDate(),fd=new Date(yr,mo,1).getDay();
  const medDates=new Set(medLog.map(m=>m.date));
  const MNAMES=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const saveCI=async()=>{if(!ciText.trim())return;await setWeeklyCI(prev=>[{date:todayStr(),text:ciText},...prev.slice(0,11)]);setCiText("");setCISaved(true);setTimeout(()=>setCISaved(false),2500);};
  if(!sdL)return <div style={{padding:"60px 16px",textAlign:"center",color:C.creamMuted}}>Loading...</div>;
  return(
    <div className="fu"style={{maxWidth:780,margin:"0 auto",padding:"0 16px 60px"}}>
      <SH title="My Recovery" subtitle="Your personal dashboard — practice, progress, and the path."/>
      {!startDate?(
        <Card style={{marginBottom:18,borderColor:C.gold,background:`linear-gradient(135deg,${C.surfaceAlt},${C.surface})`}}>
          <Tag label="Set your start date" color={C.gold}/>
          <p style={{fontSize:12,color:C.creamMuted,lineHeight:1.8,margin:"10px 0 14px"}}>Set this to your current period of recovery. It doesn't have to be perfect — set it to what feels true today.</p>
          <div style={{display:"flex",gap:9,alignItems:"center",flexWrap:"wrap"}}>
            <input type="date"value={tmpDate}onChange={e=>setTmpDate(e.target.value)}max={todayStr()}style={{background:C.surfaceDeep,border:`1px solid ${C.border}`,borderRadius:8,padding:"9px 12px",color:C.cream,fontSize:12,fontFamily:"'DM Sans'",outline:"none"}}/>
            <button onClick={()=>{if(tmpDate)setStartDate(tmpDate);}}style={{background:C.surfaceAlt,border:`1px solid ${C.gold}`,color:C.gold,borderRadius:8,padding:"9px 16px",cursor:"pointer",fontSize:12}}>Set date</button>
          </div>
        </Card>
      ):(
        <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:10,marginBottom:16}}>
          <Card style={{textAlign:"center",gridColumn:"1/-1",background:`linear-gradient(135deg,${C.surfaceAlt},${C.surface})`,borderColor:C.gold,position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",top:-30,right:-30,opacity:.05}}><Lotus size={150}color={C.gold}/></div>
            <Tag label="Days in Recovery" color={C.gold}/>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:68,fontWeight:300,color:C.cream,lineHeight:1,margin:"8px 0 3px"}}>{daysIn}</div>
            <div style={{fontSize:12,color:C.creamMuted,marginBottom:9}}>Since {fmtDate(startDate)}</div>
            {nextM&&<div style={{display:"inline-flex",alignItems:"center",gap:7,background:C.surfaceDeep,borderRadius:8,padding:"6px 12px"}}><span style={{fontSize:11,color:C.creamMuted}}>Next:</span><span style={{fontSize:12,color:C.gold,fontWeight:500}}>{MILESTONE_LABELS[nextM]}</span><span style={{fontSize:11,color:C.creamMuted}}>({nextM-daysIn}d)</span></div>}
            <button onClick={()=>setEditStart(v=>!v)}style={{position:"absolute",top:12,right:12,background:"none",border:"none",color:C.creamDim,cursor:"pointer",fontSize:10}}>edit</button>
            {editStart&&<div style={{marginTop:11,display:"flex",gap:8,justifyContent:"center",flexWrap:"wrap"}}><input type="date"defaultValue={startDate}id="ns"max={todayStr()}style={{background:C.surfaceDeep,border:`1px solid ${C.border}`,borderRadius:7,padding:"6px 10px",color:C.cream,fontSize:11,fontFamily:"'DM Sans'",outline:"none"}}/><button onClick={()=>{const v=document.getElementById("ns").value;if(v){setStartDate(v);setEditStart(false);}}}style={{background:C.surfaceAlt,border:`1px solid ${C.gold}`,color:C.gold,borderRadius:7,padding:"6px 12px",cursor:"pointer",fontSize:11}}>Update</button></div>}
          </Card>
          <Card style={{textAlign:"center"}}>
            <Tag label="Meditation Streak" color={C.sage}/>
            <div style={{margin:"12px 0"}}>
              <Ring pct={Math.min(streak/30,1)}size={68}color={C.sage}><div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:26,color:C.cream,lineHeight:1}}>{streak}</div><div style={{fontSize:8,color:C.creamMuted}}>days</div></Ring>
            </div>
            <div style={{fontSize:11,color:C.creamMuted}}>{totalMedMins} total min</div>
          </Card>
          <Card style={{textAlign:"center"}}>
            <Tag label="Commitments" color={C.lavender}/>
            <div style={{margin:"12px 0"}}>
              <Ring pct={commitCount/8}size={68}color={C.lavender}><div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:26,color:C.cream,lineHeight:1}}>{commitCount}</div><div style={{fontSize:8,color:C.creamMuted}}>of 8</div></Ring>
            </div>
            <div style={{display:"flex",gap:4,justifyContent:"center",flexWrap:"wrap"}}>{COMMITMENTS.map((c,i)=><div key={i}title={c.title}style={{width:9,height:9,borderRadius:"50%",background:commitDone[i]?c.color:C.border,transition:"background .3s"}}/>)}</div>
          </Card>
          <Card style={{gridColumn:"1/-1"}}>
            <Tag label={`${MNAMES[mo]} ${yr} Practice Calendar`} color={C.sage}/>
            <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:3,marginTop:11}}>
              {["S","M","T","W","T","F","S"].map((d,i)=><div key={i}style={{fontSize:9,color:C.creamDim,textAlign:"center",paddingBottom:3}}>{d}</div>)}
              {Array.from({length:fd}).map((_,i)=><div key={`e${i}`}/>)}
              {Array.from({length:dim}).map((_,i)=>{const d=i+1;const ds=`${yr}-${String(mo+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;const isToday=d===today.getDate();const hasMed=medDates.has(ds);return <div key={d}style={{aspectRatio:"1",borderRadius:5,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,background:hasMed?`${C.sage}44`:isToday?C.surfaceAlt:C.surfaceDeep,border:isToday?`1px solid ${C.sage}`:"1px solid transparent",color:hasMed?C.sage:isToday?C.cream:C.creamDim}}>{d}</div>;})}
            </div>
          </Card>
          <Card style={{gridColumn:"1/-1"}}>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8}}>
              {[{l:"Inquiries",v:inquiries.length,c:C.lavender},{l:"Journal",v:journal.length,c:C.blue},{l:"Amends",v:amends.length,c:C.rose},{l:"Check-ins",v:checkins.length,c:C.sage}].map((s,i)=><div key={i}style={{textAlign:"center",background:C.surfaceDeep,borderRadius:9,padding:"11px 6px"}}><div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:26,color:s.c,lineHeight:1}}>{s.v}</div><div style={{fontSize:9,color:C.creamMuted,marginTop:3}}>{s.l}</div></div>)}
            </div>
          </Card>
          {checkins.length>=3&&(()=>{
            const recent=[...checkins].sort((a,b)=>b.date>a.date?1:-1).slice(0,14).reverse();
            const moods=recent.map(c=>c.mood||5);
            const cravings=recent.map(c=>c.craving||5);
            const maxV=10,h=52,w=100;
            const pt=(arr,i)=>`${(i/(arr.length-1||1))*w},${h-((arr[i]/maxV)*h)}`;
            const poly=(arr,color)=><polyline points={arr.map((_,i)=>pt(arr,i)).join(" ")} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>;
            return(<Card style={{gridColumn:"1/-1"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                <Tag label="Mood & Craving Trend (14 days)" color={C.blue}/>
                <div style={{display:"flex",gap:12}}>
                  {[[C.sage,"Mood"],[C.rose,"Craving"]].map(([c,l])=><div key={l} style={{display:"flex",alignItems:"center",gap:4}}><div style={{width:16,height:2,background:c,borderRadius:1}}/><span style={{fontSize:9,color:C.creamMuted}}>{l}</span></div>)}
                </div>
              </div>
              <svg viewBox={`0 0 ${w} ${h}`} style={{width:"100%",height:60,overflow:"visible"}}>
                {[2,4,6,8].map(v=><line key={v} x1="0" y1={h-(v/maxV)*h} x2={w} y2={h-(v/maxV)*h} stroke={C.border} strokeWidth=".5" strokeDasharray="2,3"/>)}
                {poly(moods,C.sage)}{poly(cravings,C.rose)}
                {moods.map((v,i)=><circle key={i} cx={pt(moods,i).split(",")[0]} cy={pt(moods,i).split(",")[1]} r="2" fill={C.sage}/>)}
              </svg>
              <div style={{display:"flex",justifyContent:"space-between",marginTop:4}}>
                <span style={{fontSize:9,color:C.creamDim}}>{recent[0]?.date?fmtShort(recent[0].date):""}</span>
                <span style={{fontSize:9,color:C.creamDim}}>Today</span>
              </div>
            </Card>);
          })()}
        </div>
      )}
      <Card style={{marginBottom:12}}>
        <Tag label="Data & Privacy" color={C.creamMuted}/>
        <p style={{fontSize:11,color:C.creamDim,lineHeight:1.7,margin:"7px 0 10px"}}>All your data lives only on this device. Export a backup anytime.</p>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          <button onClick={()=>{
            const keys=["rd:profile","rd:start_date","rd:journal","rd:checkins","rd:meditations","rd:inquiries","rd:amends","rd:network","rd:triggers","rd:workbook_notes","rd:weekly_checkins","rd:commit_done","rd:purpose_goals","rd:reminders"];
            const data={exported:new Date().toISOString()};
            keys.forEach(k=>{try{const v=localStorage.getItem(k);if(v)data[k]=JSON.parse(v);}catch{}});
            const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"});
            const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=`recovery-dharma-backup-${todayStr()}.json`;a.click();
          }}style={{background:C.surfaceAlt,border:`1px solid ${C.border}`,color:C.creamMuted,borderRadius:8,padding:"7px 14px",cursor:"pointer",fontSize:11,fontFamily:"'DM Sans'"}}>⬇ Export backup</button>
          <button onClick={()=>{if(window.confirm("Clear all app data? This cannot be undone.")){const keys=["rd:profile","rd:start_date","rd:journal","rd:checkins","rd:meditations","rd:inquiries","rd:amends","rd:network","rd:triggers","rd:workbook_notes","rd:weekly_checkins","rd:commit_done","rd:purpose_goals","rd:reminders","rd:book_read","rd:book_reflections","rd:commit_notes","rd:paws","rd:activities","rd:gratitudes","rd:saved_meetings","rd:checklist_"];keys.forEach(k=>localStorage.removeItem(k));window.location.reload();}}}style={{background:"none",border:`1px solid ${C.rose}44`,color:`${C.rose}88`,borderRadius:8,padding:"7px 14px",cursor:"pointer",fontSize:11,fontFamily:"'DM Sans'"}}>Clear all data</button>
        </div>
      </Card>
      <Card>
        <Tag label="Weekly Check-In" color={C.gold}/>
        <p style={{fontSize:12,color:C.creamMuted,lineHeight:1.75,margin:"7px 0 11px"}}>A brief honest accounting. How is your recovery this week?</p>
        <textarea value={ciText}onChange={e=>{setCiText(e.target.value);setCISaved(false);}}placeholder="Be honest. No one else reads this but you."style={{width:"100%",minHeight:80,background:C.surfaceDeep,border:`1px solid ${C.border}`,borderRadius:8,padding:"9px 12px",color:C.cream,fontSize:12,fontFamily:"'DM Sans'",resize:"none",outline:"none",lineHeight:1.7,marginBottom:8}}/>
        <div style={{display:"flex",alignItems:"center",gap:9}}><button onClick={saveCI}style={{background:C.surfaceAlt,border:`1px solid ${C.gold}`,color:C.gold,borderRadius:8,padding:"7px 16px",cursor:"pointer",fontSize:11}}>Save</button>{ciSaved&&<span style={{fontSize:11,color:C.sage}}>✓ Saved</span>}</div>
      </Card>
    </div>
  );
}


// ── DAILY CHECK-IN ────────────────────────────────────────────────────────────

// ── DAILY CHECKLIST COMPONENT ─────────────────────────────────────────────────
const CHECKLIST_CATS = [
  {cat:"Morning Foundation",color:"#c8a84a",items:[
    {id:"med",text:"Meditated (any duration)"},
    {id:"intention",text:"Set a daily intention"},
    {id:"refuge",text:"Took refuge in Buddha, Dharma, Sangha"},
    {id:"read",text:"Read recovery literature (5+ min)"},
    {id:"gratitude_am",text:"Named one thing I'm grateful for"},
    {id:"water",text:"Drank water before caffeine"},
  ]},
  {cat:"Recovery Practice",color:"#7a9e7e",items:[
    {id:"meeting",text:"Attended a meeting (or scheduled one)"},
    {id:"sponsor",text:"Connected with mentor or sponsor"},
    {id:"honest_share",text:"Shared honestly with at least one person"},
    {id:"inquiry_check",text:"Did inquiry or self-examination"},
    {id:"step_work",text:"Worked on step/workbook material"},
    {id:"service",text:"Did something in service to others"},
  ]},
  {cat:"HALT Check",color:"#c47a7a",items:[
    {id:"halt_hungry",text:"Not going hungry (ate something real)"},
    {id:"halt_angry",text:"Processed anger before it built (or noting it)"},
    {id:"halt_lonely",text:"Not isolating — reached out or have a plan to"},
    {id:"halt_tired",text:"Sleep was adequate or rest is planned"},
    {id:"halt_stressed",text:"Stress level is manageable or I have a plan"},
  ]},
  {cat:"Body & Nervous System",color:"#7a9ab8",items:[
    {id:"body_move",text:"Physical movement or exercise"},
    {id:"body_outside",text:"Time outside or in natural light"},
    {id:"body_sleep",text:"Sleep schedule is consistent"},
    {id:"body_no_screen",text:"30+ min without screens before bed"},
    {id:"body_breathe",text:"Did conscious breathing or grounding today"},
  ]},
  {cat:"Wise Action",color:"#9a8abf",items:[
    {id:"wise_speech",text:"Practiced wise speech (honest, kind, necessary)"},
    {id:"wise_action_check",text:"Acted in alignment with my values today"},
    {id:"wise_no_harm",text:"Refrained from action that would cause harm"},
    {id:"wise_amends",text:"Held integrity (no lies, no hiding)"},
    {id:"wise_precepts",text:"Observed the precepts today"},
  ]},
  {cat:"Evening Reflection",color:"#4a8a58",items:[
    {id:"eve_review",text:"Reviewed my day honestly"},
    {id:"eve_gratitude",text:"Noted 3 things I'm grateful for"},
    {id:"eve_forgive",text:"Offered self-compassion for mistakes"},
    {id:"eve_tomorrow",text:"Set intention for tomorrow"},
    {id:"eve_contact",text:"Have support contact ready if needed tonight"},
  ]},
];

function ChecklistTab(){
  const[done,setDone]=useStorage("rd:checklist_"+todayStr(),{});
  const total=CHECKLIST_CATS.reduce((a,c)=>a+c.items.length,0);
  const checked=Object.values(done).filter(Boolean).length;
  const pct=total>0?checked/total:0;
  const toggle=async(id)=>{await setDone(prev=>({...prev,[id]:!prev[id]}));};
  return (
    <div>
      <Card style={{marginBottom:13,background:`linear-gradient(135deg,${C.surfaceAlt},${C.surface})`}}>
        <div style={{display:"flex",alignItems:"center",gap:16}}>
          <Ring pct={pct} size={64} color={pct>0.75?C.sage:pct>0.4?C.amber:C.rose}>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:17,color:C.cream,lineHeight:1}}>{checked}</div>
            <div style={{fontSize:8,color:C.creamMuted}}>/{total}</div>
          </Ring>
          <div>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:18,color:C.cream,marginBottom:2}}>
              {pct===1?"Complete ✦":pct>0.75?"Strong practice day":pct>0.4?"Good progress":"Begin where you are"}
            </div>
            <div style={{fontSize:11,color:C.creamMuted}}>{checked} of {total} recovery practices today</div>
          </div>
        </div>
      </Card>
      {CHECKLIST_CATS.map((cat,ci)=>(
        <Card key={ci} style={{marginBottom:10,borderLeft:`3px solid ${cat.color}`,borderRadius:"0 12px 12px 0"}}>
          <div style={{fontSize:10,color:cat.color,letterSpacing:".14em",textTransform:"uppercase",fontWeight:500,marginBottom:10}}>{cat.cat}</div>
          {cat.items.map((item,ii)=>(
            <button key={item.id} onClick={()=>toggle(item.id)}
              style={{width:"100%",display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:ii<cat.items.length-1?`1px solid ${C.border}`:"none",background:"none",border:"none",cursor:"pointer",textAlign:"left"}}>
              <div style={{width:18,height:18,borderRadius:4,border:`1.5px solid ${done[item.id]?cat.color:C.border}`,background:done[item.id]?`${cat.color}33`:"none",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all .2s"}}>
                {done[item.id]&&<span style={{fontSize:10,color:cat.color}}>✓</span>}
              </div>
              <span style={{fontSize:12,color:done[item.id]?C.creamMuted:C.cream,lineHeight:1.5,textDecoration:done[item.id]?"line-through":"none",opacity:done[item.id]?.7:1}}>{item.text}</span>
            </button>
          ))}
        </Card>
      ))}
      <Card style={{background:C.surfaceDeep,marginTop:4}}>
        <Tag label="Why these practices?" color={C.creamDim}/>
        <p style={{fontSize:11,color:C.creamMuted,lineHeight:1.75,marginTop:7}}>This checklist covers the evidence-based practices most strongly correlated with sustained recovery: meditation, community, HALT awareness, physical health, ethical conduct, and daily reflection. No single day needs to be perfect. The direction matters more than the score.</p>
      </Card>
    </div>
  );
}

function CheckInScreen({toast=()=>{}}){ 
  const[checkins,setCheckins,ciL]=useStorage("rd:checkins",[]);
  const[gratitudes,setGratitudes]=useStorage("rd:gratitudes",[]);
  const[tab,setTab]=useState("checkin");
  const todayCI=checkins.find?.(c=>c.date===todayStr());
  const[mood,setMood]=useState(todayCI?.mood||null);const[craving,setCraving]=useState(todayCI?.craving||0);
  const[sleep,setSleep]=useState(todayCI?.sleep||7);const[note,setNote]=useState(todayCI?.note||"");
  const[saved,setSaved]=useState(!!todayCI);const[grat,setGrat]=useState("");const[gs,setGS]=useState(false);
  const todayGrats=gratitudes.filter?.(g=>g.date===todayStr())||[];
  const saveCI=async()=>{if(!mood)return;await setCheckins(prev=>[...prev.filter(c=>c.date!==todayStr()),{date:todayStr(),mood,craving,sleep,note,ts:Date.now()}].sort((a,b)=>b.date.localeCompare(a.date)));setSaved(true);toast("Check-in saved","saved");};
  const addGrat=async()=>{if(!grat.trim())return;await setGratitudes(prev=>[{id:Date.now(),date:todayStr(),text:grat},...prev.slice(0,499)]);setGrat("");setGS(true);setTimeout(()=>setGS(false),2500);};
  if(!ciL)return <div style={{padding:"60px 16px",textAlign:"center",color:C.creamMuted}}>Loading...</div>;
  return(
    <div className="fu"style={{maxWidth:780,margin:"0 auto",padding:"0 16px 60px"}}>
      <SH title="Daily Check-In" subtitle="A brief honest accounting each day. Patterns become visible. Warning signs become catchable."/>
      <Tabs tabs={[["checkin","Today"],["checklist","Daily Checklist"],["trends","Trends"],["gratitude","Gratitude"]]} active={tab} onSelect={setTab}/>
      {tab==="checklist"&&<ChecklistTab/>}
      {tab==="checkin"&&<div>
        <Card style={{marginBottom:11}}>
          <Tag label="How are you today?" color={C.gold}/>
          <div style={{display:"flex",gap:7,marginTop:12,justifyContent:"center",flexWrap:"wrap"}}>
            {MOODS.map(m=><button key={m.val}onClick={()=>{setMood(m.val);setSaved(false);}}style={{display:"flex",flexDirection:"column",alignItems:"center",gap:5,padding:"12px 14px",borderRadius:11,border:`1px solid ${mood===m.val?m.color:C.border}`,background:mood===m.val?`${m.color}22`:C.surfaceDeep,cursor:"pointer",transition:"all .2s",minWidth:68}}><span style={{fontSize:18,color:m.color}}>{m.icon}</span><span style={{fontSize:10,color:mood===m.val?m.color:C.creamMuted}}>{m.label}</span></button>)}
          </div>
        </Card>
        <Card style={{marginBottom:11}}>
          <div style={{display:"grid",gap:14}}>
            {[{label:"Craving intensity",val:craving,set:v=>{setCraving(v);setSaved(false);},min:0,max:10,color:C.rose,suffix:"/10"},{label:`Sleep: ${sleep} hours`,val:sleep,set:v=>{setSleep(v);setSaved(false);},min:3,max:12,step:.5,color:C.blue,suffix:"h"}].map(s=><div key={s.label}><div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}><span style={{fontSize:11,color:C.creamMuted}}>{s.label}</span><span style={{fontSize:12,color:s.color,fontFamily:"'Cormorant Garamond',serif"}}>{s.val}{s.suffix||""}</span></div><input type="range"min={s.min}max={s.max}step={s.step||1}value={s.val}onChange={e=>s.set(Number(e.target.value))}style={{width:"100%",accentColor:s.color,cursor:"pointer"}}/></div>)}
          </div>
        </Card>
        <Card style={{marginBottom:11}}>
          <textarea value={note}onChange={e=>{setNote(e.target.value);setSaved(false);}}placeholder="What's present today? What do you need?"style={{width:"100%",minHeight:70,background:C.surfaceDeep,border:`1px solid ${C.border}`,borderRadius:8,padding:"9px 11px",color:C.cream,fontSize:12,fontFamily:"'DM Sans'",resize:"none",outline:"none",lineHeight:1.7}}/>
        </Card>
        <button onClick={saveCI}disabled={!mood}style={{background:mood?C.surfaceAlt:C.surfaceDeep,border:`1px solid ${mood?C.gold:C.border}`,color:mood?C.gold:C.creamDim,borderRadius:9,padding:"10px 22px",cursor:mood?"pointer":"default",fontSize:12}}>{saved?"✓ Check-in saved":"Save check-in"}</button>
      </div>}
      {tab==="trends"&&<div>
        {checkins.length<3?<Card style={{textAlign:"center",padding:"44px 22px"}}><p style={{color:C.creamMuted,fontSize:13,lineHeight:1.8}}>Complete at least 3 daily check-ins to see your patterns.</p></Card>:<div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:9,marginBottom:11}}>
            {[{l:"Avg mood (7d)",v:(checkins.slice(0,7).reduce((a,c)=>a+(c.mood||0),0)/Math.min(checkins.slice(0,7).length,7)||0).toFixed(1),sf:"/5",c:C.gold},{l:"Avg craving (7d)",v:(checkins.slice(0,7).reduce((a,c)=>a+(c.craving||0),0)/Math.min(checkins.slice(0,7).length,7)||0).toFixed(1),sf:"/10",c:C.rose},{l:"Avg sleep (7d)",v:(checkins.slice(0,7).reduce((a,c)=>a+(c.sleep||0),0)/Math.min(checkins.slice(0,7).length,7)||0).toFixed(1),sf:"h",c:C.blue},{l:"Total check-ins",v:checkins.length,sf:"",c:C.sage}].map(s=><Card key={s.l}style={{textAlign:"center",padding:"13px"}}><div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:27,color:s.c,lineHeight:1}}>{s.v}<span style={{fontSize:12}}>{s.sf}</span></div><div style={{fontSize:10,color:C.creamMuted,marginTop:4}}>{s.l}</div></Card>)}
          </div>
          <Card><Tag label="Recent Check-Ins" color={C.creamMuted}/><div style={{marginTop:10}}>{checkins.slice(0,7).map((c,i)=>{const m=MOODS.find(m=>m.val===c.mood);return(<div key={i}style={{display:"flex",gap:10,alignItems:"center",padding:"8px 0",borderBottom:i<6?`1px solid ${C.border}`:"none"}}><span style={{fontSize:16,color:m?.color||C.creamMuted,minWidth:22}}>{m?.icon||"◈"}</span><div style={{flex:1}}><div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:12,color:m?.color||C.cream}}>{m?.label||"—"}</span><span style={{fontSize:10,color:C.creamDim}}>{fmtShort(c.date)}</span></div><div style={{fontSize:10,color:C.creamMuted,marginTop:1}}>Craving: {c.craving}/10 · Sleep: {c.sleep}h</div></div></div>);})}</div></Card>
        </div>}
      </div>}
      {tab==="gratitude"&&<div>
        <Card style={{marginBottom:11,background:`linear-gradient(135deg,${C.surfaceAlt},${C.surface})`}}>
          <Tag label="Gratitude Practice" color={C.sage}/>
          <p style={{fontSize:12,color:C.creamMuted,lineHeight:1.8,marginTop:8,marginBottom:11}}>Three specific things per day. Research shows gratitude practice shifts neural patterns associated with craving and depression. Not toxic positivity — deliberate noticing of what is real and good amid suffering.</p>
          <input value={grat}onChange={e=>setGrat(e.target.value)}onKeyDown={e=>{if(e.key==="Enter"&&grat.trim())addGrat();}}placeholder="I am grateful for..."style={{width:"100%",background:C.surfaceDeep,border:`1px solid ${C.border}`,borderRadius:8,padding:"8px 12px",color:C.cream,fontSize:12,fontFamily:"'DM Sans'",outline:"none",marginBottom:8}}/>
          <div style={{display:"flex",gap:9,alignItems:"center"}}><button onClick={addGrat}style={{background:C.surfaceAlt,border:`1px solid ${C.sage}`,color:C.sage,borderRadius:8,padding:"7px 15px",cursor:"pointer",fontSize:11}}>Add</button>{gs&&<span style={{fontSize:10,color:C.sage}}>✓ Added</span>}</div>
        </Card>
        {todayGrats.length>0&&<Card style={{marginBottom:11}}><Tag label="Today" color={C.sage}/><div style={{marginTop:9}}>{todayGrats.map((g,i)=><div key={g.id}style={{display:"flex",gap:9,padding:"8px 0",borderBottom:i<todayGrats.length-1?`1px solid ${C.border}`:"none",alignItems:"center"}}><span style={{color:C.sage,fontSize:12}}>✦</span><span style={{fontSize:12,color:C.cream,lineHeight:1.6}}>{g.text}</span></div>)}</div></Card>}
        {gratitudes.filter?.(g=>g.date!==todayStr()).length>0&&<Card><Tag label="Recent" color={C.creamMuted}/><div style={{marginTop:9}}>{gratitudes.filter(g=>g.date!==todayStr()).slice(0,10).map((g,i)=><div key={g.id}style={{display:"flex",gap:9,padding:"7px 0",borderBottom:i<9?`1px solid ${C.border}`:"none"}}><span style={{color:C.sageDim,fontSize:11,marginTop:1}}>✦</span><div><span style={{fontSize:11,color:C.creamMuted}}>{g.text}</span><div style={{fontSize:9,color:C.creamDim,marginTop:1}}>{fmtShort(g.date)}</div></div></div>)}</div></Card>}
      </div>}
    </div>
  );
}

// ── TEACHINGS (PATH) ──────────────────────────────────────────────────────────
function PathScreen(){
  const[tab,setTab]=useState("truths");
  const[selT,setSelT]=useState(null);const[selE,setSelE]=useState(null);const[selP,setSelP]=useState(null);
  return(
    <div className="fu"style={{maxWidth:780,margin:"0 auto",padding:"0 16px 60px"}}>
      <SH title="The Teachings" subtitle="The core Buddhist framework that Recovery Dharma applies to addiction and healing."/>
      <Tabs tabs={[["truths","Four Noble Truths"],["eightfold","Eightfold Path"],["poisons","Three Poisons"],["dependent","Dependent Origination"],["characteristics","Three Characteristics"]]} active={tab} onSelect={setTab}/>
      {tab==="truths"&&(selT!==null?(
        <div className="fu"><button onClick={()=>setSelT(null)}style={{background:"none",border:`1px solid ${C.border}`,color:C.creamMuted,borderRadius:7,padding:"7px 13px",cursor:"pointer",fontSize:11,marginBottom:18}}>← Back</button>
          <Card style={{borderColor:FOUR_TRUTHS[selT].color,marginBottom:11}}><Tag label={FOUR_TRUTHS[selT].tag} color={FOUR_TRUTHS[selT].color}/><h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:26,color:C.cream,margin:"9px 0 13px",lineHeight:1.25}}>{FOUR_TRUTHS[selT].title}</h2><p style={{fontSize:13,color:C.creamMuted,lineHeight:1.9,whiteSpace:"pre-line"}}>{FOUR_TRUTHS[selT].body}</p></Card>
          <Card style={{background:C.surfaceDeep}}><Tag label="Reflection Question" color={FOUR_TRUTHS[selT].color}/><p style={{fontSize:14,color:C.cream,lineHeight:1.8,marginTop:8,fontStyle:"italic"}}>{FOUR_TRUTHS[selT].reflection}</p></Card>
        </div>
      ):(
        <div>{FOUR_TRUTHS.map((t,i)=><button key={i}onClick={()=>setSelT(i)}style={{width:"100%",background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:"17px 19px",cursor:"pointer",textAlign:"left",marginBottom:8,transition:"all .2s",display:"flex",gap:13,alignItems:"center"}}onMouseEnter={e=>{e.currentTarget.style.borderColor=t.color;e.currentTarget.style.background=C.surfaceAlt;}}onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.background=C.surface;}}><div style={{width:4,alignSelf:"stretch",background:t.color,borderRadius:2,flexShrink:0}}/><div><Tag label={t.tag} color={t.color}/><div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:19,color:C.cream,margin:"5px 0 3px"}}>{t.title}</div><p style={{fontSize:11,color:C.creamMuted,lineHeight:1.55}}>{t.body.slice(0,110)}...</p></div></button>)}</div>
      ))}
      {tab==="eightfold"&&(selE!==null?(
        <div className="fu"><button onClick={()=>setSelE(null)}style={{background:"none",border:`1px solid ${C.border}`,color:C.creamMuted,borderRadius:7,padding:"7px 13px",cursor:"pointer",fontSize:11,marginBottom:18}}>← Back</button>
          <Card style={{borderLeft:`4px solid ${EIGHTFOLD[selE].c}`,borderRadius:"0 14px 14px 0"}}><div style={{display:"flex",gap:10,alignItems:"center",marginBottom:12}}><div style={{width:36,height:36,borderRadius:"50%",background:`${EIGHTFOLD[selE].c}22`,border:`1px solid ${EIGHTFOLD[selE].c}`,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:17,color:EIGHTFOLD[selE].c}}>{EIGHTFOLD[selE].n}</span></div><div><div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,color:C.cream}}>{EIGHTFOLD[selE].t}</div><div style={{fontSize:10,color:EIGHTFOLD[selE].c,fontStyle:"italic",marginTop:2}}>{EIGHTFOLD[selE].p} · {EIGHTFOLD[selE].group}</div></div></div><p style={{fontSize:13,color:C.creamMuted,lineHeight:1.9}}>{EIGHTFOLD[selE].b}</p></Card>
        </div>
      ):(
        <div>{["Wisdom","Ethics","Meditation"].map(grp=><div key={grp}style={{marginBottom:16}}><div style={{fontSize:10,color:C.gold,letterSpacing:".18em",textTransform:"uppercase",marginBottom:7,paddingLeft:4}}>{grp}</div>{EIGHTFOLD.filter(e=>e.group===grp).map((e,i)=><button key={i}onClick={()=>setSelE(EIGHTFOLD.indexOf(e))}style={{width:"100%",background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,padding:"13px 16px",cursor:"pointer",textAlign:"left",marginBottom:6,transition:"all .2s",display:"flex",gap:11,alignItems:"center"}}onMouseEnter={el=>{el.currentTarget.style.borderColor=e.c;el.currentTarget.style.background=C.surfaceAlt;}}onMouseLeave={el=>{el.currentTarget.style.borderColor=C.border;el.currentTarget.style.background=C.surface;}}><div style={{width:30,height:30,borderRadius:"50%",background:`${e.c}22`,border:`1px solid ${e.c}44`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:15,color:e.c}}>{e.n}</span></div><div><div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:17,color:C.cream}}>{e.t}</div><div style={{fontSize:10,color:C.creamMuted,fontStyle:"italic",marginTop:1}}>{e.p}</div></div></button>)}</div>)}</div>
      ))}
      {tab==="poisons"&&(selP!==null?(
        <div className="fu"><button onClick={()=>setSelP(null)}style={{background:"none",border:`1px solid ${C.border}`,color:C.creamMuted,borderRadius:7,padding:"7px 13px",cursor:"pointer",fontSize:11,marginBottom:18}}>← Back</button>
          <Card style={{borderColor:THREE_POISONS[selP].color,marginBottom:10}}><div style={{display:"flex",gap:11,alignItems:"center",marginBottom:12}}><span style={{fontSize:22,color:THREE_POISONS[selP].color}}>◆</span><h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:24,color:C.cream}}>{THREE_POISONS[selP].title}</h2></div><p style={{fontSize:13,color:C.creamMuted,lineHeight:1.9,whiteSpace:"pre-line",marginBottom:14}}>{THREE_POISONS[selP].overview}</p><div style={{background:C.surfaceDeep,borderRadius:9,padding:"11px 13px"}}><Tag label="Practice" color={THREE_POISONS[selP].color}/><p style={{fontSize:12,color:C.cream,lineHeight:1.8,marginTop:7}}>{THREE_POISONS[selP].practice}</p></div></Card>
        </div>
      ):(
        <div>
          <Card style={{marginBottom:13}}><Tag label="About the Three Poisons" color={C.amber}/><p style={{fontSize:13,color:C.creamMuted,lineHeight:1.85,marginTop:8}}>The Three Poisons (ti-akusalamūla — the three roots of unwholesomeness) are the fundamental drivers of suffering: lobha (greed/craving), dosa (hatred/aversion), and moha (delusion/ignorance). In addiction, all three operate at full volume. The path is not to eliminate these states but to recognize them clearly and act wisely in their presence.</p></Card>
          {THREE_POISONS.map((p,i)=><button key={i}onClick={()=>setSelP(i)}style={{width:"100%",background:C.surface,border:`1px solid ${C.border}`,borderRadius:11,padding:"15px 17px",cursor:"pointer",textAlign:"left",marginBottom:8,transition:"all .2s"}}onMouseEnter={e=>{e.currentTarget.style.borderColor=p.color;e.currentTarget.style.background=C.surfaceAlt;}}onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.background=C.surface;}}><div style={{display:"flex",gap:11,alignItems:"center"}}><span style={{fontSize:20,color:p.color}}>◆</span><div><div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:18,color:C.cream,marginBottom:3}}>{p.title}</div><p style={{fontSize:11,color:C.creamMuted,lineHeight:1.55}}>{p.overview.slice(0,90)}...</p></div></div></button>)}
        </div>
      ))}
      {tab==="dependent"&&<div>
        <Card style={{marginBottom:13}}><Tag label="Paṭicca-samuppāda" color={C.gold}/><p style={{fontSize:13,color:C.creamMuted,lineHeight:1.85,marginTop:8,marginBottom:11}}>Dependent origination maps how suffering perpetuates itself — and where it can be interrupted. Nothing arises independently. Craving arises from conditions — and conditions can change. The 12-link chain is the detailed map of this causality. The most important link for recovery is vedanā → taṇhā: the gap between feeling tone and craving where mindfulness practice creates freedom.</p><div style={{background:`${C.gold}15`,borderRadius:9,padding:"11px 13px",border:`1px solid ${C.gold}44`}}><Tag label="The Liberation Point" color={C.gold}/><p style={{fontSize:12,color:C.cream,lineHeight:1.8,marginTop:6}}>Between vedanā (feeling tone) and taṇhā (craving) is the gap where choice lives. Mindfulness practice trains this gap — from a microsecond to a breath to a stable presence.</p></div></Card>
        <Accord items={DEPENDENT_ORIGINATION.map(d=>({title:d.link,color:C.gold,body:<div><div style={{fontSize:10,color:C.gold,letterSpacing:".12em",fontStyle:"italic",marginBottom:8}}>{d.pali}</div><p style={{fontSize:13,color:C.creamMuted,lineHeight:1.85}}>{d.b}</p></div>}))}/>
      </div>}
      {tab==="characteristics"&&<div>
        <Card style={{marginBottom:13}}><Tag label="Ti-lakkhaṇa" color={C.blue}/><p style={{fontSize:13,color:C.creamMuted,lineHeight:1.85,marginTop:8}}>The Three Characteristics (tilakkhaṇa) are the universal qualities of all conditioned phenomena, directly seen through insight meditation. Understanding them intellectually is useful; knowing them in direct experience is transformative.</p></Card>
        {[{t:"Anicca — Impermanence",c:C.blue,b:"Everything changes. Pleasures fade. Pain eases. Cravings arise and — if we do not feed them — pass. The identity of 'addict' is not fixed or permanent. The craving that feels overwhelming will pass. The shame that feels permanent is not. The gray flatness of early recovery will not last. Nothing is stuck. In meditation, we begin to know impermanence directly rather than just believing in it — watching thoughts arise and dissolve, feelings peak and fall. This direct knowledge, not just intellectual agreement, is what frees us.",reflection:"Notice something you are experiencing right now. Can you sense its impermanent quality? Can you feel that it is already changing?"},
          {t:"Dukkha — Unsatisfactoriness",c:C.rose,b:"Even pleasant experiences carry subtle dukkha — the knowledge they will end, the desire for more, the background sense that something is still missing. The hungry ghost of addiction sought permanent satisfaction in impermanent things. Not because the person was broken, but because the project itself was impossible. Understanding dukkha as a characteristic of conditioned experience rather than a personal failure changes everything. The problem is not that we wanted too much — the problem is that we were seeking in the wrong place.",reflection:"Where have you most sought satisfaction in something external — a substance, a person, an achievement? How did the characteristic of dukkha show up there?"},
          {t:"Anattā — No-Self",c:C.gold,b:"There is no fixed, permanent self at the center of experience. What we call 'I' is a dynamic process — sensations arising, thoughts arising, emotions moving through the space of awareness. None of these is a fixed self. Anattā does not mean you don't exist. It means you exist differently than you thought — as a process, as a river, not as a stone. The addict-self that committed harm and reached again and again — that is a pattern that arose from conditions. It is not your essence. Because it is not permanent, it can change.",reflection:"What fixed identity labels do you carry? 'I am an addict. I am broken. I am someone who can't be trusted.' Can you hold these as descriptions of past patterns rather than permanent truths?"},
        ].map((c,i)=><Card key={i}style={{marginBottom:10,borderColor:c.c}}><h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:21,color:C.cream,marginBottom:10}}>{c.t}</h3><p style={{fontSize:13,color:C.creamMuted,lineHeight:1.9,marginBottom:11}}>{c.b}</p><div style={{background:C.surfaceDeep,borderRadius:8,padding:"10px 13px"}}><Tag label="Reflection" color={c.c}/><p style={{fontSize:12,color:C.cream,lineHeight:1.75,marginTop:6,fontStyle:"italic"}}>{c.reflection}</p></div></Card>)}
      </div>}
    </div>
  );
}


// ── WISDOM LIBRARY ────────────────────────────────────────────────────────────
function WisdomScreen(){
  const[tab,setTab]=useState("hindrances");
  const[selH,setSelH]=useState(null);const[selPa,setSelPa]=useState(null);const[search,setSearch]=useState("");
  return(
    <div className="fu"style={{maxWidth:780,margin:"0 auto",padding:"0 16px 60px"}}>
      <SH title="Wisdom Library" subtitle="Deep reference for the teachings that underpin Recovery Dharma."/>
      <Tabs tabs={[["hindrances","Five Hindrances"],["brahma","Brahmaviharas"],["paramitas","Pāramitās"],["rain","RAIN Practice"],["glossary","Glossary"],["teachers","Key Texts"]]} active={tab} onSelect={setTab}/>
            {tab==="brahma"&&<div>
        <Card style={{marginBottom:13,background:`linear-gradient(135deg,${C.surfaceAlt},${C.surface})`}}><Tag label="The Four Brahmaviharas" color={C.rose}/><p style={{fontSize:13,color:C.creamMuted,lineHeight:1.85,marginTop:8}}>The brahmaviharas — "divine abodes" or "heart practices" — are four qualities of mind that, when cultivated, are said to make the heart boundless. They are not emotions to manufacture but intentions to practice. In recovery, they address the four core psychological wounds: craving (met with loving-kindness), pain (met with compassion), envy/comparison (met with sympathetic joy), and reactivity (me...</p></Card>
        {[
          {t:"Mettā — Loving-Kindness",c:C.rose,pali:"Loving-kindness, goodwill",near_enemy:"Attachment or sentimental love",far_enemy:"Ill-will, hatred",
           body:"Mettā is the heartfelt wish for all beings — yourself included — to be safe, healthy, happy, and at ease. In recovery, s...",
           reflection:"Where is self-mettā most difficult for you? What would it mean to offer yourself the same warmth you..."},
          {t:"Karuṇā — Compassion",c:C.blue,pali:"The wish for beings to be free from suffering",near_enemy:"Pity or grief",far_enemy:"Cruelty",
           body:"Karuṇā is the heart's response to suffering — the genuine wish for beings to be free from pain. The near enemy is pity,...",
           reflection:"Where do you find it easier to be compassionate toward others than toward yourself? What would it lo..."},
          {t:"Muditā — Sympathetic Joy",c:C.gold,pali:"Joy in the well-being and happiness of others",near_enemy:"Comparison and competition",far_enemy:"Jealousy, envy",
           body:"Muditā is the capacity to rejoice in others' happiness rather than comparing, competing, or begrudging. In the recovery...",
           reflection:"Who in your recovery community or life are you most likely to compare yourself to? What would it be..."},
          {t:"Upekkhā — Equanimity",c:C.sage,pali:"Balanced, even-minded awareness",near_enemy:"Indifference or detachment",far_enemy:"Anxiety, craving",
           body:"Upekkhā is the quality of mind that can hold all of experience — pleasure and pain, gain and loss, praise and criticism...",
           reflection:"When are you most easily knocked off your ground? What would equanimity look like in that specific s..."},
        ].map((bv,i)=><Card key={i} style={{marginBottom:10,borderColor:bv.c}}>
          <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:20,color:C.cream,marginBottom:3}}>{bv.t}</h3>
          <div style={{display:"flex",gap:12,flexWrap:"wrap",marginBottom:10}}>
            <div style={{fontSize:10,color:bv.c}}>Pali: {bv.pali}</div>
            <div style={{fontSize:10,color:C.creamDim}}>Near enemy: {bv.near_enemy}</div>
          </div>
          <p style={{fontSize:13,color:C.creamMuted,lineHeight:1.9,whiteSpace:"pre-line",marginBottom:11}}>{bv.body}</p>
          <div style={{background:C.surfaceDeep,borderRadius:8,padding:"10px 13px"}}>
            <Tag label="Reflection" color={bv.c}/>
            <p style={{fontSize:12,color:C.cream,lineHeight:1.75,marginTop:6,fontStyle:"italic"}}>{bv.reflection}</p>
          </div>
        </Card>)}
      </div>}
      {tab==="hindrances"&&<div>
        <Card style={{marginBottom:13}}><Tag label="Pañca Nīvaraṇa" color={C.amber}/><p style={{fontSize:13,color:C.creamMuted,lineHeight:1.85,marginTop:8}}>The Five Hindrances are states of mind that impede meditation and wisdom — and that make craving most dangerous. Buddhist teaching doesn't ask us to eliminate these states; it teaches us to recognize them, understand their antidotes, and act skillfully in their presence.</p></Card>
        {selH!==null?(<div className="fu"><button onClick={()=>setSelH(null)}style={{background:"none",border:`1px solid ${C.border}`,color:C.creamMuted,borderRadius:7,padding:"7px 13px",cursor:"pointer",fontSize:11,marginBottom:18}}>← Back</button>
          <Card style={{borderColor:FIVE_HINDRANCES[selH].color,marginBottom:10}}><h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:24,color:C.cream,marginBottom:11}}>{FIVE_HINDRANCES[selH].title}</h2><p style={{fontSize:13,color:C.creamMuted,lineHeight:1.9,marginBottom:13}}>{FIVE_HINDRANCES[selH].overview}</p><div style={{borderLeft:`3px solid ${FIVE_HINDRANCES[selH].color}`,paddingLeft:13,marginBottom:13}}><Tag label="In Recovery" color={FIVE_HINDRANCES[selH].color}/><p style={{fontSize:13,color:C.cream,lineHeight:1.85,marginTop:6}}>{FIVE_HINDRANCES[selH].recovery}</p></div><div style={{background:C.surfaceDeep,borderRadius:9,padding:"11px 13px"}}><Tag label="The Antidote" color={FIVE_HINDRANCES[selH].color}/><p style={{fontSize:12,color:C.cream,lineHeight:1.8,marginTop:7}}>{FIVE_HINDRANCES[selH].antidote}</p></div></Card>
        </div>):(
          <div>{FIVE_HINDRANCES.map((h,i)=><button key={i}onClick={()=>setSelH(i)}style={{width:"100%",background:C.surface,border:`1px solid ${C.border}`,borderRadius:11,padding:"15px 17px",cursor:"pointer",textAlign:"left",marginBottom:8,transition:"all .2s"}}onMouseEnter={e=>{e.currentTarget.style.borderColor=h.color;e.currentTarget.style.background=C.surfaceAlt;}}onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.background=C.surface;}}><div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:17,color:C.cream,marginBottom:4}}>{h.title}</div><p style={{fontSize:11,color:C.creamMuted,lineHeight:1.55}}>{h.overview.slice(0,100)}...</p></button>)}</div>
        )}
      </div>}
      {tab==="paramitas"&&<div>
        <Card style={{marginBottom:13}}><Tag label="The Ten Perfections" color={C.gold}/><p style={{fontSize:13,color:C.creamMuted,lineHeight:1.85,marginTop:8}}>The Pāramitās are the ten qualities cultivated on the path to liberation. In Recovery Dharma, they represent the character qualities that sustained recovery both requires and cultivates. You will likely find some already present in your recovery; others pointing clearly to where growth is needed.</p></Card>
        {selPa!==null?(<div className="fu"><button onClick={()=>setSelPa(null)}style={{background:"none",border:`1px solid ${C.border}`,color:C.creamMuted,borderRadius:7,padding:"7px 13px",cursor:"pointer",fontSize:11,marginBottom:18}}>← Back</button>
          <Card style={{borderColor:PARAMITAS[selPa].color}}><h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:24,color:C.cream,marginBottom:11}}>{PARAMITAS[selPa].title}</h2><p style={{fontSize:13,color:C.creamMuted,lineHeight:1.9}}>{PARAMITAS[selPa].b}</p></Card>
        </div>):(
          <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:8}}>
            {PARAMITAS.map((p,i)=><button key={i}onClick={()=>setSelPa(i)}style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:11,padding:"14px",cursor:"pointer",textAlign:"left",transition:"all .2s"}}onMouseEnter={e=>{e.currentTarget.style.borderColor=p.color;e.currentTarget.style.background=C.surfaceAlt;}}onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.background=C.surface;}}><div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:16,color:C.cream,marginBottom:3}}>{p.title}</div><p style={{fontSize:10,color:C.creamMuted,lineHeight:1.5}}>{p.b.slice(0,70)}...</p></button>)}
          </div>
        )}
      </div>}
      {tab==="rain"&&<div>
        <Card style={{marginBottom:13,background:`linear-gradient(135deg,${C.surfaceAlt},${C.surface})`}}><Tag label="Michele McDonald · Tara Brach" color={C.blue}/><h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,color:C.cream,margin:"9px 0 9px"}}>RAIN — Working with Difficult Emotions</h3><p style={{fontSize:13,color:C.creamMuted,lineHeight:1.85}}>RAIN is a structured mindfulness practice for working with difficult emotions, cravings, shame, and fear. It can be practiced formally (15–20 minutes) or informally (in any difficult moment). The four steps bring the full force of mindful awareness to exactly the states that addiction exploits.</p></Card>
        {[{step:"R — Recognize",color:C.blue,b:"Bring awareness to what is present. Name it without judgment: 'Craving is here.' 'Fear is here.' 'Shame is here.' The naming creates distance — a fraction of space between the experience and your relationship to it. You are no longer inside the state; you are the one who notices it. Recognition doesn't mean analysis. It is simply clear seeing: what is actually here, right now?",practice:"Say internally: 'Right now, I notice ___.' Name the emotion or state directly and simply."},
          {step:"A — Allow",color:C.sage,b:"Let the experience be here, as it is, without fighting it. Drop the internal 'no' to what is arising — the resistance, the aversion, the wish that this were different. Allowing is not approval. It is not surrender. It is not the same as acting on the state. It is the end of war with your own experience.\n\nMany people in recovery have never actually allowed themselves to feel their feelings — the substance regulated the nervous system so completely that direct emotional experience became unfamiliar and frightening. Allowing is the first step back toward your own experience.",practice:"Say internally: 'This is here. I'm allowing it. I don't have to fix or fight this right now.'"},
          {step:"I — Investigate",color:C.amber,b:"With curiosity, explore the experience with open attention. Where does it live in the body? What is its texture — tight, hollow, hot, heavy, buzzing? What emotion is at its center? What belief or story accompanies it? What does this experience most need from you right now?\n\nInvestigate with the gentleness of a good friend, not the coldness of a forensic examiner. You are not trying to solve a problem — you are getting to know something that has been present, and often running the show, without being seen clearly. The investigation often reveals what the craving is covering: loneliness, shame, grief, anxiety.",practice:"Ask internally: 'Where in my body do I feel this most? What is the feeling beneath the feeling? What does this state most need?'"},
          {step:"N — Nurture / Non-Identify",color:C.rose,b:"Offer yourself what the state most needs: compassion, reassurance, kindness, presence. Place a hand on your heart. Say: 'This is hard. I'm here with you.' Offer the metta phrases: 'May I be safe. May I be at ease.'\n\nThe second dimension of N is non-identification: recognizing that you are not the experience. You are the awareness that holds it. 'There is craving here' rather than 'I am craving.' 'There is shame here' rather than 'I am shameful.' This shift is not suppression — it is the recognition of a broader context.\n\nAfter RAIN: rest in open awareness. Notice the quality of presence available when you are not fighting your experience.",practice:"Say: 'This is hard. May I be kind to myself in this moment.' Then rest briefly in open awareness."},
        ].map((s,i)=><Card key={i}style={{marginBottom:10,borderLeft:`4px solid ${s.color}`,borderRadius:"0 14px 14px 0"}}><div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:20,color:C.cream,marginBottom:9}}>{s.step}</div><p style={{fontSize:13,color:C.creamMuted,lineHeight:1.9,whiteSpace:"pre-line",marginBottom:11}}>{s.b}</p><div style={{background:C.surfaceDeep,borderRadius:8,padding:"9px 12px"}}><Tag label="Practice" color={s.color}/><p style={{fontSize:12,color:C.cream,lineHeight:1.75,marginTop:6}}>{s.practice}</p></div></Card>)}
      </div>}
      {tab==="glossary"&&<div>
        <input value={search}onChange={e=>setSearch(e.target.value)}placeholder="Search terms..."style={{width:"100%",background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,padding:"10px 14px",color:C.cream,fontSize:12,fontFamily:"'DM Sans'",outline:"none",marginBottom:13}}/>
        <div>{GLOSSARY.filter(g=>!search||g.term.toLowerCase().includes(search.toLowerCase())||g.def.toLowerCase().includes(search.toLowerCase())).map((g,i)=><div key={i}style={{borderBottom:`1px solid ${C.border}`,padding:"12px 0"}}><span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:17,color:C.gold}}>{g.term}</span><p style={{fontSize:12,color:C.creamMuted,lineHeight:1.75,marginTop:3}}>{g.def}</p></div>)}</div>
      </div>}
      {tab==="teachers"&&<div>
        {[{name:"The Recovery Dharma Book",sub:"Recovery Dharma community, 2019",color:C.gold,b:"The foundational text of the program, written collaboratively by the founding sangha. It covers the Buddhist philosophical framework, the eight commitments in depth, inquiry practice, meeting formats, and personal stories of recovery. Available free at recoverydarma.org. The book emerged from the founding meeting in Los Angeles in 2018 and represents a genuine experiment in peer-led, non-hierarchical recovery grounded in Buddhist practice."},
          {name:"In the Realm of Hungry Ghosts",sub:"Gabor Maté, MD, 2008",color:C.amber,b:"Perhaps the most compassionate and evidence-based book on addiction ever written. Maté worked for twelve years with severely addicted patients in Vancouver's Downtown Eastside. His central question — 'not why the addiction, but why the pain' — reframes everything. He draws on neuroscience, developmental psychology, and his own personal history to build a portrait of addiction that makes it comprehensible and response-able. Essential reading for anyone in recovery or supporting someone in it."},
          {name:"Self-Compassion: The Proven Power",sub:"Kristin Neff, PhD, 2011",color:C.rose,b:"The foundational text for self-compassion research and practice. Neff conducted the first systematic research on self-compassion, arguing that self-kindness, common humanity, and mindfulness — not shame — are the actual foundation for wellbeing, motivation, and change. Her research directly challenges the assumption that shame is a useful motivator: shame predicts depression, anxiety, and continued destructive behavior. Transformative for people in recovery who have been using self-cruelty as a change strategy."},
          {name:"The Body Keeps the Score",sub:"Bessel van der Kolk, MD, 2014",color:C.lavender,b:"The landmark text on trauma and its effects on the body, brain, and relationships. Van der Kolk's research demonstrates that trauma is stored in the nervous system — in chronic tension, in the way the breath holds, in the startle response. His work has profoundly influenced trauma-informed addiction treatment. Particularly relevant for people whose addiction was, in whole or part, a response to developmental trauma."},
          {name:"RAIN: A Practice of Radical Compassion",sub:"Tara Brach, 2020",color:C.blue,b:"Tara Brach's expanded treatment of the RAIN practice, refined over decades of teaching. The four steps — Recognize, Allow, Investigate, Nurture — can be applied to virtually every form of emotional difficulty, including the shame, craving, and self-judgment central to addiction. Brach's clinical background and deep meditation practice make this both practically useful and spiritually profound."},
          {name:"Chasing the Scream",sub:"Johann Hari, 2015",color:C.teal,b:"A journalist's investigation of addiction, drug policy, and the rat park experiments. Hari's argument that 'the opposite of addiction is connection' has influenced recovery culture significantly. An important context-setter for understanding why community-based recovery models like Recovery Dharma are so important — and why the isolation that characterizes addiction is not incidental but central to its mechanism."},
        ].map((t,i)=><Card key={i}style={{marginBottom:10,borderLeft:`3px solid ${t.color}`,borderRadius:"0 14px 14px 0"}}><div style={{marginBottom:7}}><div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:18,color:C.cream,marginBottom:2}}>{t.name}</div><Tag label={t.sub} color={t.color}/></div><p style={{fontSize:12,color:C.creamMuted,lineHeight:1.85}}>{t.b}</p></Card>)}
      </div>}
    </div>
  );
}


// ── COMMITMENTS ───────────────────────────────────────────────────────────────
function CommitmentsScreen(){
  const[sel,setSel]=useState(null);const[subtab,setSubtab]=useState("overview");
  const[notes,setNotes]=useStorage("rd:commit_notes",{});
  const[commitDone,setCommitDone]=useStorage("rd:commit_done",{});
  const[localNote,setLocalNote]=useState("");const[ns,setNs]=useState(false);
  useEffect(()=>{if(sel!==null)setLocalNote(notes[sel]||"");},[sel]);
  const saveNote=async()=>{await setNotes(p=>({...p,[sel]:localNote}));await setCommitDone(p=>({...p,[sel]:true}));setNs(true);setTimeout(()=>setNs(false),2500);};
  if(sel!==null){const c=COMMITMENTS[sel];return(
    <div className="fu"style={{maxWidth:780,margin:"0 auto",padding:"0 16px 60px"}}>
      <button onClick={()=>setSel(null)}style={{background:"none",border:`1px solid ${C.border}`,color:C.creamMuted,borderRadius:7,padding:"7px 13px",cursor:"pointer",fontSize:11,marginTop:26,marginBottom:18}}>← All commitments</button>
      <Card style={{borderColor:c.color,marginBottom:13}}><div style={{display:"flex",gap:11,alignItems:"center",marginBottom:12}}><span style={{fontSize:30,color:c.color}}>{c.icon}</span><div><Tag label={`Commitment ${c.num}`} color={c.color}/><h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:27,color:C.cream,margin:"5px 0 2px"}}>{c.title}</h2><div style={{fontSize:10,color:C.creamMuted}}>{c.eightfold}</div></div></div>
        <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:16,fontStyle:"italic",color:C.cream,borderLeft:`3px solid ${c.color}`,paddingLeft:12,lineHeight:1.7}}>"{c.phrase}"</p></Card>
      <Tabs tabs={[["overview","Overview"],["howto","How to Practice"],["reflection","Reflection"]]} active={subtab} onSelect={setSubtab}/>
      {subtab==="overview"&&<Card><p style={{fontSize:13,color:C.creamMuted,lineHeight:1.9,whiteSpace:"pre-line"}}>{c.overview}</p></Card>}
      {subtab==="howto"&&<Card><p style={{fontSize:13,color:C.creamMuted,lineHeight:1.9,whiteSpace:"pre-line"}}>{c.howto}</p></Card>}
      {subtab==="reflection"&&<Card><p style={{fontSize:15,color:C.cream,lineHeight:1.8,fontStyle:"italic",marginBottom:13}}>{c.reflection}</p><textarea value={localNote}onChange={e=>{setLocalNote(e.target.value);setNs(false);}}placeholder="Write your reflection here. Honestly and without judgment."style={{width:"100%",minHeight:120,background:C.surfaceDeep,border:`1px solid ${C.border}`,borderRadius:8,padding:"10px 12px",color:C.cream,fontSize:12,fontFamily:"'DM Sans'",resize:"vertical",outline:"none",lineHeight:1.7,marginBottom:9}}/><div style={{display:"flex",alignItems:"center",gap:9}}><button onClick={saveNote}style={{background:C.surfaceAlt,border:`1px solid ${c.color}`,color:c.color,borderRadius:8,padding:"8px 16px",cursor:"pointer",fontSize:11}}>Save reflection</button>{ns&&<span style={{fontSize:10,color:C.sage}}>✓ Saved</span>}</div></Card>}
    </div>
  );}
  return(
    <div className="fu"style={{maxWidth:780,margin:"0 auto",padding:"0 16px 60px"}}>
      <SH title="The 8 Commitments" subtitle="The Eightfold Path translated into modern recovery practice. Not requirements — invitations to freedom."/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:9}}>
        {COMMITMENTS.map((c,i)=><button key={i}onClick={()=>{setSel(i);setSubtab("overview");}}style={{background:C.surface,border:`1px solid ${commitDone[i]?c.color:C.border}`,borderRadius:12,padding:"15px",cursor:"pointer",textAlign:"left",transition:"all .2s"}}onMouseEnter={e=>{e.currentTarget.style.borderColor=c.color;e.currentTarget.style.background=C.surfaceAlt;}}onMouseLeave={e=>{e.currentTarget.style.borderColor=commitDone[i]?c.color:C.border;e.currentTarget.style.background=C.surface;}}><span style={{fontSize:20,color:c.color}}>{c.icon}</span><div style={{fontSize:9,color:c.color,letterSpacing:".18em",textTransform:"uppercase",margin:"5px 0 2px"}}>#{c.num}</div><div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:16,color:C.cream,marginBottom:2}}>{c.title}</div><p style={{fontSize:10,color:C.creamMuted,lineHeight:1.5}}>{c.phrase}</p>{notes[i]&&<div style={{fontSize:9,color:C.sage,marginTop:4}}>✓ Reflection written</div>}</button>)}
      </div>
    </div>
  );
}

// ── INQUIRY ───────────────────────────────────────────────────────────────────
function InquiryScreen(){
  const[mode,setMode]=useState("home");const[type,setType]=useState(null);
  const[allInquiries,setAllInquiries]=useStorage("rd:inquiries",[]);
  const saveInquiry=async(t,a)=>await setAllInquiries(prev=>[{id:Date.now(),type:t,date:todayStr(),answers:a},...prev.slice(0,49)]);
  if(mode==="inquiry")return (<InquiryWS type={type} onBack={()=>setMode("home")} onSave={saveInquiry}/>);
  return(
    <div className="fu"style={{maxWidth:780,margin:"0 auto",padding:"0 16px 60px"}}>
      <SH title="Inquiry Practice" subtitle="Rigorous, compassionate self-examination. The antidote to the delusion that drives craving."/>
      <Card style={{marginBottom:15}}><Tag label="What is Inquiry?" color={C.lavender}/><p style={{fontSize:13,color:C.creamMuted,lineHeight:1.85,marginTop:8}}>Inquiry is the practice of examining the thoughts, beliefs, and stories that fuel suffering — turning the light of awareness on the content of the mind. Recovery Dharma's inquiry draws from Buddhist self-examination, the twelve-step inventory tradition, and Byron Katie's "The Work." The four questions create conditions for genuine not-knowing, where insight naturally arises. Inquiry done alone has value. Inquiry shared with a mentor has transformative value.</p></Card>
      <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:9,marginBottom:18}}>
        {Object.entries(INQUIRY_TYPES).map(([id,t])=><button key={id}onClick={()=>{setType(id);setMode("inquiry");}}style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:"15px 17px",cursor:"pointer",textAlign:"left",transition:"all .2s"}}onMouseEnter={e=>{e.currentTarget.style.borderColor=t.color;e.currentTarget.style.background=C.surfaceAlt;}}onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.background=C.surface;}}><div style={{fontSize:13,color:C.cream,fontWeight:500,marginBottom:2}}>{t.title}</div><div style={{fontSize:10,color:t.color}}>{t.steps.length} steps</div></button>)}
      </div>
      {allInquiries.length>0&&<Card><Tag label="History" color={C.creamMuted}/><div style={{marginTop:9}}>{allInquiries.slice(0,8).map((iq,i)=><div key={iq.id}style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:i<Math.min(allInquiries.length,8)-1?`1px solid ${C.border}`:"none"}}><div style={{fontSize:12,color:C.cream}}>{INQUIRY_TYPES[iq.type]?.title||iq.type}</div><div style={{fontSize:10,color:C.creamDim}}>{fmtShort(iq.date)}</div></div>)}</div></Card>}
    </div>
  );
}

function InquiryWS({type,onBack,onSave}){
  const[step,setStep]=useState(-1);const[answers,setAnswers]=useState({});const[complete,setComplete]=useState(false);
  const data=INQUIRY_TYPES[type];if(!data)return null;
  const finish=async()=>{await onSave(type,answers);setComplete(true);};
  if(complete)return(<div className="fu"style={{maxWidth:640,margin:"0 auto",padding:"28px 16px 60px"}}><div style={{textAlign:"center",padding:"24px 0"}}><Wheel size={46}color={C.gold}spin/><h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:27,color:C.cream,marginTop:14,marginBottom:8}}>Inquiry Complete</h2><p style={{color:C.creamMuted,fontSize:12,lineHeight:1.8,maxWidth:420,margin:"0 auto 20px"}}>Saved to your history. Consider sharing what you discovered with your mentor or sangha.</p></div><Card style={{marginBottom:13}}>{data.steps.map((s,i)=><div key={i}style={{marginBottom:11,paddingBottom:11,borderBottom:i<data.steps.length-1?`1px solid ${C.border}`:"none"}}><Tag label={`Step ${i+1}`} color={data.color}/><div style={{fontSize:12,color:C.cream,margin:"4px 0 4px"}}>{s.q}</div><p style={{fontSize:11,color:C.creamMuted,lineHeight:1.7,fontStyle:"italic"}}>{answers[i]||"(No answer)"}</p></div>)}</Card><div style={{display:"flex",gap:8}}><button onClick={()=>{setStep(0);setAnswers({});setComplete(false);}}style={{background:C.surfaceAlt,border:`1px solid ${data.color}`,color:data.color,borderRadius:8,padding:"8px 15px",cursor:"pointer",fontSize:11}}>New inquiry</button><button onClick={onBack}style={{background:"none",border:`1px solid ${C.border}`,color:C.creamMuted,borderRadius:8,padding:"8px 13px",cursor:"pointer",fontSize:11}}>← Back</button></div></div>);
  if(step===-1)return(<div className="fu"style={{maxWidth:640,margin:"0 auto",padding:"28px 16px 60px"}}><button onClick={onBack}style={{background:"none",border:`1px solid ${C.border}`,color:C.creamMuted,borderRadius:7,padding:"7px 13px",cursor:"pointer",fontSize:11,marginBottom:18}}>← Back</button><Card style={{marginBottom:13,borderColor:data.color}}><Tag label="Inquiry" color={data.color}/><h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:25,color:C.cream,margin:"8px 0 9px"}}>{data.title}</h2><p style={{fontSize:13,color:C.creamMuted,lineHeight:1.8}}>Take your time with each step. Genuine not-knowing is more valuable than a quick answer. Your inquiry will be saved automatically.</p></Card><button onClick={()=>setStep(0)}style={{background:C.surfaceAlt,border:`1px solid ${data.color}`,color:data.color,borderRadius:12,padding:"12px 24px",cursor:"pointer",fontSize:14,fontFamily:"'Cormorant Garamond',serif"}}>Begin Inquiry →</button></div>);
  const cur=data.steps[step];
  return(<div className="fu"style={{maxWidth:640,margin:"0 auto",padding:"28px 16px 60px"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}><button onClick={onBack}style={{background:"none",border:"none",color:C.creamMuted,cursor:"pointer",fontSize:11}}>← Back</button><div style={{display:"flex",gap:5}}>{data.steps.map((_,i)=><div key={i}style={{width:7,height:7,borderRadius:"50%",background:i<=step?data.color:C.border,transition:"background .3s"}}/>)}</div><span style={{fontSize:10,color:C.creamMuted}}>{step+1}/{data.steps.length}</span></div>
  <Card style={{borderColor:data.color}}><Tag label={`Step ${step+1}`} color={data.color}/><h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:20,color:C.cream,margin:"8px 0 8px",lineHeight:1.3}}>{cur.q}</h2><p style={{fontSize:12,color:C.creamMuted,lineHeight:1.7,marginBottom:4}}>{cur.hint}</p><p style={{fontSize:10,color:C.sageDim,lineHeight:1.6,marginBottom:13,fontStyle:"italic"}}>{cur.example}</p><textarea value={answers[step]||""}onChange={e=>setAnswers(a=>({...a,[step]:e.target.value}))}placeholder="Write honestly and without judgment..."style={{width:"100%",minHeight:100,background:C.surfaceDeep,border:`1px solid ${C.border}`,borderRadius:8,padding:"9px 12px",color:C.cream,fontSize:12,fontFamily:"'DM Sans'",resize:"vertical",outline:"none",lineHeight:1.7,marginBottom:13}}/><div style={{display:"flex",justifyContent:"space-between"}}><button onClick={()=>setStep(s=>s-1)}disabled={step===0}style={{background:"none",border:`1px solid ${step>0?C.border:"transparent"}`,color:step>0?C.creamMuted:"transparent",borderRadius:8,padding:"7px 13px",cursor:step>0?"pointer":"default",fontSize:11}}>← Back</button><button onClick={()=>{if(step<data.steps.length-1)setStep(s=>s+1);else finish();}}style={{background:C.surfaceAlt,border:`1px solid ${data.color}`,color:data.color,borderRadius:8,padding:"7px 17px",cursor:"pointer",fontSize:11}}>{step<data.steps.length-1?"Next →":"Complete ✓"}</button></div></Card></div>);
}

// ── PRACTICE ──────────────────────────────────────────────────────────────────
function PracticeScreen(){
  const[tab,setTab]=useState("meditate");
  const[medLog,setMedLog]=useStorage("rd:meditations",[]);
  const onComplete=async mins=>await setMedLog(prev=>[{id:Date.now(),date:todayStr(),duration:mins},...prev.slice(0,99)]);
  return(
    <div className="fu"style={{maxWidth:780,margin:"0 auto",padding:"0 16px 60px"}}>
      <SH title="Daily Practice" subtitle="The path is walked daily, one practice at a time."/>
      <Tabs tabs={[["meditate","Meditation Timer"],["guided","Guided Practices"],["readings","Readings"]]} active={tab} onSelect={setTab}/>
      {tab==="meditate"&&<MedTimer onComplete={onComplete}/>}
      {tab==="guided"&&<GuidedPractices/>}
      {tab==="readings"&&<ReadingsContent/>}
    </div>
  );
}

function MedTimer({onComplete}){
  const[dur,setDur]=useState(10);const[state,setState]=useState("idle");const[elapsed,setElapsed]=useState(0);
  const[bPhase,setBPhase]=useState("Breathe In");const[style,setStyle]=useState("breath");
  const iRef=useRef(null);const bRef=useRef(null);
  const STYLES={breath:"Breath Awareness",body:"Body Scan",metta:"Loving-Kindness",noting:"Noting Practice"};
  const GUIDANCE={breath:"Rest attention at the tip of the nose or the rise and fall of the belly. When you wander — and you will, constantly — gently return without judgment. The return is the practice. There is no failure in distraction, only the opportunity to begin again.",body:"Move attention slowly from feet to crown, staying several breaths in each area. Notice sensation — or the absence of sensation — with curiosity and openness. When emotion arises in the body, allow it and stay.",metta:"Offer silently: 'May I be safe. May I be healthy. May I be happy. May I live with ease.' Then extend outward — to loved ones, to neutral beings, to difficult people, to all beings everywhere. Mean it as much as you can.",noting:"Silently label each experience: 'thinking,' 'feeling,' 'sensation,' 'craving,' 'planning,' 'remembering.' After noting, return gently to the breath. The noting creates space between experience and reaction."};
  const start=()=>{setState("running");setElapsed(0);iRef.current=setInterval(()=>setElapsed(e=>{if(e+1>=dur*60){clearInterval(iRef.current);setState("done");return dur*60;}return e+1;}),1000);if(style==="breath"){let pi=0;const ps=[{t:"Breathe In",d:4000},{t:"Hold",d:2000},{t:"Breathe Out",d:6000},{t:"Pause",d:2000}];const cycle=()=>{setBPhase(ps[pi].t);bRef.current=setTimeout(()=>{pi=(pi+1)%ps.length;cycle();},ps[pi].d);};cycle();}};
  const stop=async()=>{clearInterval(iRef.current);clearTimeout(bRef.current);if(state==="done"||elapsed>60){const m=Math.round(elapsed/60)||1;await onComplete(m);}setState("idle");setElapsed(0);setBPhase("Breathe In");};
  const prog=elapsed/(dur*60);const rem=dur*60-elapsed;const mm=Math.floor(rem/60).toString().padStart(2,"0");const ss=(rem%60).toString().padStart(2,"0");
  return(<div>
    {state==="idle"&&<div style={{marginBottom:18}}><div style={{fontSize:11,color:C.creamMuted,marginBottom:8}}>Practice type</div><div style={{display:"flex",gap:7,marginBottom:13,flexWrap:"wrap"}}>{Object.entries(STYLES).map(([k,v])=><button key={k}onClick={()=>setStyle(k)}style={{padding:"7px 11px",borderRadius:8,border:`1px solid ${style===k?C.sage:C.border}`,background:style===k?`${C.sage}22`:C.surface,color:style===k?C.sage:C.creamMuted,cursor:"pointer",fontSize:11,fontFamily:"'DM Sans'"}}>{v}</button>)}</div><div style={{fontSize:11,color:C.creamMuted,marginBottom:8}}>Duration</div><div style={{display:"flex",gap:7,flexWrap:"wrap"}}>{[5,10,15,20,30,45].map(d=><button key={d}onClick={()=>setDur(d)}style={{padding:"7px 12px",borderRadius:8,border:`1px solid ${dur===d?C.gold:C.border}`,background:dur===d?C.surfaceAlt:C.surface,color:dur===d?C.gold:C.creamMuted,cursor:"pointer",fontSize:11,fontFamily:"'DM Sans'"}}>{d}m</button>)}</div></div>}
    <div style={{textAlign:"center",padding:"26px 0 18px"}}>
      <div style={{position:"relative",display:"inline-block",marginBottom:16}}>
        <div style={{width:160,height:160,borderRadius:"50%",background:`radial-gradient(circle,${C.accent}28,${C.accent}06)`,border:`1.5px solid ${C.accent}44`,display:"flex",alignItems:"center",justifyContent:"center",animation:state==="running"?"breathe 12s ease-in-out infinite":"none"}}>
          {state==="running"?<div style={{textAlign:"center"}}>{style==="breath"&&<div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:14,color:C.cream,marginBottom:2}}>{bPhase}</div>}<div style={{fontSize:36,fontWeight:300,color:C.cream}}>{mm}:{ss}</div><div style={{fontSize:10,color:C.creamMuted,marginTop:1}}>{STYLES[style]}</div></div>:state==="done"?<div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:17,color:C.gold}}>Complete ✓</div>:<div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:16,color:C.sage}}>{dur} min</div>}
        </div>
        {state==="running"&&<svg style={{position:"absolute",top:-5,left:-5}}width={170}height={170}viewBox="0 0 170 170"><circle cx="85"cy="85"r="81"fill="none"stroke={C.gold}strokeWidth="1.5"opacity=".25"strokeDasharray={`${2*Math.PI*81}`}strokeDashoffset={`${2*Math.PI*81*(1-prog)}`}transform="rotate(-90 85 85)"strokeLinecap="round"style={{transition:"stroke-dashoffset 1s linear"}}/></svg>}
      </div>
      <div style={{display:"flex",gap:9,justifyContent:"center"}}>
        {state==="idle"&&<button onClick={start}style={{background:C.surfaceAlt,border:`1px solid ${C.gold}`,color:C.gold,borderRadius:12,padding:"11px 26px",cursor:"pointer",fontSize:14,fontFamily:"'Cormorant Garamond',serif"}}>Begin Meditation</button>}
        {(state==="running"||state==="done")&&<button onClick={stop}style={{background:"none",border:`1px solid ${C.border}`,color:C.creamMuted,borderRadius:10,padding:"9px 19px",cursor:"pointer",fontSize:12}}>End & Save</button>}
      </div>
    </div>
    <Card style={{background:C.surfaceDeep}}><Tag label="Guidance" color={C.sage}/><p style={{fontSize:12,color:C.creamMuted,lineHeight:1.85,marginTop:8}}>{GUIDANCE[style]}</p></Card>
  </div>);
}

function GuidedPractices(){
  const[active,setActive]=useState(null);
  const ps=[{title:"RAIN — Working with Difficult Emotions",color:C.blue,dur:"10–15 min",steps:[{s:"R — Recognize",b:"Name what is present without judgment. 'Craving is here.' 'Fear is here.' 'Shame is here.' The naming creates distance —..."},{s:"A — Allow",b:"Let it be here, as it is. Drop the struggle. 'This is here. I can feel this.' Allowing is not approval — it is the end o..."},{s:"I — Investigate",b:"Where in the body? What texture — tight, hollow, hot, heavy? What emotion is at the center? What does this experience mo..."},{s:"N — Nurture",b:"Place a hand on your heart. 'This is hard. I'm here with you.' Then notice: you are the awareness holding this — not the..."}]},
    {title:"Metta — Loving-Kindness",color:C.rose,dur:"15–20 min",steps:[{s:"Yourself",b:"Begin here. 'May I be safe. May I be healthy. May I be happy. May I live with ease.' Don't force the feeling — offer the..."},{s:"Beloved being",b:"Someone who makes you smile easily. The phrases arise more naturally here — notice that warmth."},{s:"Neutral person",b:"Someone you see regularly but feel little toward. Their happiness matters as much as yours."},{s:"Difficult person",b:"Not the most difficult. Offer the phrases while holding their humanity — their own suffering, their own wish to be well."},{s:"All beings",b:"'May all beings everywhere be safe. May all beings be free.' Let goodwill expand without limit."}]},
    {title:"Body Scan",color:C.amber,dur:"20–30 min",steps:[{s:"Settle",b:"Lie down or sit. Several slow breaths. Set the intention to notice — not to fix or change."},{s:"Begin at the feet",b:"Feet, ankles, calves, knees — moving slowly, staying several breaths in each area. Notice sensation or its absence."},{s:"Move upward",b:"Through thighs, pelvis, belly, back, chest, shoulders, arms, hands, neck, face. Unhurried. Whatever is present is welcom..."},{s:"Areas of difficulty",b:"When you reach tension or strong sensation — stay. Breathe into it. If emotion arises, allow it. The body speaks."},{s:"Rest in wholeness",b:"Rest in awareness of the whole body — breathing, alive, present. Stay several minutes before returning."}]},
    {title:"Urge Surfing",color:C.sage,dur:"10–20 min",steps:[{s:"Notice the urge",b:"When craving arises, turn toward it rather than away. Name it: 'Urge is here.' You are not about to be destroyed by this..."},{s:"Locate it in the body",b:"Where exactly is it? What are the sensations — heat, pressure, hollowness, tightening? Describe it to yourself specifica..."},{s:"Observe it rising",b:"Urges, like waves, rise toward a peak. Watch this happening. You are surfing — not fighting, not fleeing."},{s:"Observe it falling",b:"After the peak — which always comes — the urge begins to subside. Watch this too. This is the evidence you need."},{s:"Rest",b:"Rest in awareness. Notice that the urge passed. This will happen again next time — and the time after that."}]},
    {title:"Tonglen — Sending and Taking",color:C.lavender,dur:"15–20 min",steps:[{s:"Settle and open",b:"Sit comfortably. Several grounding breaths. Set an intention of compassion — for yourself and others who suffer as you s..."},{s:"Breathe in suffering",b:"As you inhale, breathe in your own pain — the shame, the craving, the grief, exactly as it is. Don't bypass or soften it..."},{s:"Breathe out relief",b:"As you exhale, send out light — space, ease, relief. Simply offering what relief you can imagine to the suffering just b..."},{s:"Expand to others",b:"Bring to mind all who suffer as you suffer right now. Breathe in their suffering along with yours. Breathe out ease for..."},{s:"Rest in openness",b:"Sit in open awareness. Notice any shift in how the suffering is held — not necessarily less, but perhaps differently. Th..."}]},
    {title:"Equanimity — Upekkhā",color:C.teal,dur:"15 min",steps:[{s:"Ground in the body",b:"Feel your feet, sitting bones, breath. You are here. Stable. Present. Whatever arises, you are the awareness that holds..."},{s:"Phrases of equanimity",b:"Repeat slowly: 'May I be present with things as they are. May I neither grasp nor push away. May I meet this moment with..."},{s:"Apply to current difficulty",b:"Bring to mind something difficult without trying to fix it. Can you be with it without immediately reaching for relief?..."},{s:"Equanimity is not indifference",b:"Equanimity is the ground from which compassion becomes possible. Not not-caring — caring from a stable place. Notice the..."},{s:"Closing",b:"Return to the phrases. 'I am present with things as they are. I have stable ground. From here, I can act wisely.' Rest."}]},
    {title:"Three-Minute Breathing Space",color:C.amber,dur:"3 min",steps:[{s:"Minute 1 — Awareness",b:"What is present right now? Thoughts, feelings, body sensations. Simply notice and name: 'Anxiety is here. A tight chest...."},{s:"Minute 2 — Gather",b:"Bring your full attention to your breath. Just the breath. When the mind wanders — return without judgment. This is the..."},{s:"Minute 3 — Expand",b:"From the stability of the breath, expand awareness to your whole body, then your immediate environment. You are here. Pr..."}]},
    {title:"Walking Meditation",color:C.orange,dur:"15–30 min",steps:[{s:"Choose your path",b:"A straight path of 10–15 steps. Walk slowly, turn, walk back. The destination is not the point — the walking is."},{s:"Feel each step",b:"Lift, move, place. Notice the heel leaving the ground, the foot in air, the contact of arrival. Extraordinary detail awa..."},{s:"When the mind wanders",b:"Return to the sensation of walking. Lift, move, place. The mind will wander frequently. Each return is the practice."},{s:"Slower than ordinary",b:"Walking meditation is slower than natural pace. You are not going anywhere. You are here, now, in this step."},{s:"Extend it outward",b:"After formal walking meditation, carry this quality of attention into 30 seconds of ordinary walking. The practice is po..."}]},
    {title:"Compassion for Relapse",color:C.rose,dur:"10–15 min",steps:[{s:"Ground first",b:"Sit. Feel the floor. You are here. You are alive. The relapse happened — and you are still here, still capable of turnin..."},{s:"Allow the full feeling",b:"Let shame, regret, disappointment, grief be here. They are information — they point to the fact that this matters to you..."},{s:"Common humanity",b:"Every person in recovery has relapsed or feared relapse. You are not uniquely broken. You are human in a painful, diffic..."},{s:"Self-compassion phrases",b:"'This is suffering. Suffering is part of recovery. May I meet this with the kindness I would offer a dear friend. May I..."},{s:"Wise next action",b:"Not fixing everything — one wise step. Call your mentor. Go to a meeting today. Tell one honest person what happened. Th..."}]},
  ];
  if(active!==null){const p=ps[active];return(<div className="fu"><button onClick={()=>setActive(null)}style={{background:"none",border:`1px solid ${C.border}`,color:C.creamMuted,borderRadius:7,padding:"7px 13px",cursor:"pointer",fontSize:11,marginBottom:17}}>← All practices</button><Card style={{marginBottom:9,borderColor:p.color}}><Tag label={p.dur} color={p.color}/><h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,color:C.cream,margin:"8px 0"}}>{p.title}</h3></Card>{p.steps.map((s,i)=><Card key={i}style={{marginBottom:8,borderLeft:`3px solid ${p.color}`,borderRadius:"0 10px 10px 0"}}><div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:16,color:C.cream,marginBottom:6}}>{s.s}</div><p style={{fontSize:12,color:C.creamMuted,lineHeight:1.8}}>{s.b}</p></Card>)}</div>);}
  return(<div>{ps.map((p,i)=><button key={i}onClick={()=>setActive(i)}style={{width:"100%",background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:"15px 17px",cursor:"pointer",textAlign:"left",marginBottom:9,transition:"all .2s",display:"flex",justifyContent:"space-between",alignItems:"center"}}onMouseEnter={e=>{e.currentTarget.style.borderColor=p.color;e.currentTarget.style.background=C.surfaceAlt;}}onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.background=C.surface;}}><div><div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:17,color:C.cream,marginBottom:2}}>{p.title}</div><div style={{fontSize:11,color:C.creamMuted}}>{p.dur}</div></div><span style={{color:p.color,fontSize:16}}>→</span></button>)}</div>);
}

function ReadingsContent(){
  const[open,setOpen]=useState(0);
  const rs=[
    {title:"The Preamble",color:C.gold,text:"We are a peer-led movement using Buddhist practices, principles, and the community to heal the suffering of addiction. We believe that the traditional Buddhist teachings, often referred to as the Dharma, offer a powerful path to recovery from addiction.\n\nWe are not a religious organization and have no affiliation with any school or tradition of Buddhism. Our meetings are open to people of any or no religious background. We welcome anyone who is seeking freedom from addiction."},
    {title:"Taking Refuge",color:C.sage,text:"We take refuge in the Buddha — in the possibility of awakening within us, in those who have walked this path, in the moments of clarity we have glimpsed even in our darkest times.\n\nWe take refuge in the Dharma — in the truth of the Four Noble Truths, in the teachings on impermanence and the end of craving, in the wisdom that suffering has a cause and that cause can cease.\n\nWe take refuge in the Sangha — in the community who walk alongside us, in the knowledge that we are not alone."},
    {title:"For When Craving is Strong",color:C.amber,text:"This craving will pass.\nThis pain will pass.\nThis shame will pass.\n\nIt has passed before. It will pass again.\nNothing in my experience is permanent.\n\nI do not need to act on this to make it end.\nI only need to be present with it.\nI watch it arise. I watch it peak. I watch it fall.\n\nI take one breath. Then another.\nI am still here."},
    {title:"Morning Intention",color:C.lavender,text:"Today is a new day.\n\nYesterday does not determine today.\nMy history is not my future.\nThis moment — right now — is where recovery lives.\n\nI take refuge in the Buddha, the Dharma, and the Sangha.\nI set my intention to practice with whatever arises.\nMay I meet today's suffering with awareness.\nMay I meet today's joy with gratitude.\nMay I act wisely."},
    {title:"The Compassion Vow",color:C.rose,text:"May I be safe. May I be healthy.\nMay I be happy. May I live with ease.\n\nMay I meet my own suffering with compassion.\nMay I not add shame to what is already difficult.\nMay I offer myself the same kindness\nI would offer any suffering being.\n\nI am worthy of my own care.\nI am worthy of recovery.\nI am worthy of the path."},
    {title:"Closing Metta",color:C.sage,text:"May all beings be safe.\nMay all beings be healthy.\nMay all beings be happy.\nMay all beings live with ease.\n\nMay we be free from suffering.\nMay we be free from addiction.\nMay we awaken.\n\nMay all beings everywhere be free."},
  ];
  return(<div>{rs.map((r,i)=><div key={i}style={{marginBottom:8}}><button onClick={()=>setOpen(open===i?-1:i)}style={{width:"100%",background:open===i?C.surfaceAlt:C.surface,border:`1px solid ${open===i?r.color:C.border}`,borderRadius:open===i?"11px 11px 0 0":11,padding:"12px 17px",cursor:"pointer",textAlign:"left",display:"flex",justifyContent:"space-between",alignItems:"center",transition:"all .2s"}}><span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:16,color:C.cream}}>{r.title}</span><span style={{color:r.color,transform:open===i?"rotate(180deg)":"none",transition:"transform .2s"}}>⌄</span></button>{open===i&&<div style={{background:C.surface,border:`1px solid ${r.color}`,borderTop:"none",borderRadius:"0 0 11px 11px",padding:"17px 21px"}}><p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:16,color:C.creamMuted,lineHeight:2.1,whiteSpace:"pre-line",fontStyle:"italic"}}>{r.text}</p></div>}</div>)}</div>);
}


// ── MEETINGS ──────────────────────────────────────────────────────────────────
const MEETING_DATA_UPDATED = "March 2026";
const MEETINGS_DB = [
  // ── RECOVERY DHARMA ──
  {id:"rd1",org:"Recovery Dharma",name:"RD Online — Daily Morning Sit",format:"online",day:"Daily",time:"07:00",tz:"ET",duration:60,zoom:"https://zoom.us/j/rd-morning",link:"https://recoverydharma.org/meetings",tags:["meditation","open share","newcomer friendly"]},
  {id:"rd2",org:"Recovery Dharma",name:"RD Online — Monday Evening",format:"online",day:"Monday",time:"19:00",tz:"ET",duration:75,zoom:"https://zoom.us/j/rd-monday",link:"https://recoverydharma.org/meetings",tags:["open share"]},
  {id:"rd3",org:"Recovery Dharma",name:"RD Online — LGBTQ+ Meeting",format:"online",day:"Wednesday",time:"19:00",tz:"PT",duration:60,zoom:"https://zoom.us/j/rd-lgbtq",link:"https://recoverydharma.org/meetings",tags:["LGBTQ+","open share"]},
  {id:"rd4",org:"Recovery Dharma",name:"RD Online — Women's Meeting",format:"online",day:"Thursday",time:"12:00",tz:"ET",duration:60,zoom:"https://zoom.us/j/rd-womens",link:"https://recoverydharma.org/meetings",tags:["women","open share"]},
  {id:"rd5",org:"Recovery Dharma",name:"RD Online — Dharma Study",format:"online",day:"Saturday",time:"10:00",tz:"ET",duration:90,zoom:"https://zoom.us/j/rd-study",link:"https://recoverydharma.org/meetings",tags:["dharma study","book study"]},
  {id:"rd6",org:"Recovery Dharma",name:"RD Online — Sunday Inquiry",format:"online",day:"Sunday",time:"11:00",tz:"ET",duration:75,zoom:"https://zoom.us/j/rd-inquiry",link:"https://recoverydharma.org/meetings",tags:["inquiry"]},
  {id:"rd7",org:"Recovery Dharma",name:"RD NYC — Brooklyn Sangha",format:"in-person",day:"Tuesday",time:"19:00",tz:"ET",duration:90,address:"Brooklyn, NY",link:"https://recoverydharma.org/meetings",tags:["in-person","open share"]},
  {id:"rd8",org:"Recovery Dharma",name:"RD LA — Echo Park",format:"in-person",day:"Monday",time:"19:30",tz:"PT",duration:75,address:"Los Angeles, CA",link:"https://recoverydharma.org/meetings",tags:["in-person"]},
  {id:"rd9",org:"Recovery Dharma",name:"RD SF — Mission District",format:"in-person",day:"Wednesday",time:"18:30",tz:"PT",duration:75,address:"San Francisco, CA",link:"https://recoverydharma.org/meetings",tags:["in-person","newcomer friendly"]},
  {id:"rd10",org:"Recovery Dharma",name:"RD Chicago Sangha",format:"hybrid",day:"Thursday",time:"19:00",tz:"CT",duration:75,zoom:"https://zoom.us/j/rd-chicago",address:"Chicago, IL",link:"https://recoverydharma.org/meetings",tags:["hybrid","open share"]},
  {id:"rd11",org:"Recovery Dharma",name:"RD Online — Spanish / Español",format:"online",day:"Saturday",time:"15:00",tz:"ET",duration:60,zoom:"https://zoom.us/j/rd-espanol",link:"https://recoverydharma.org/meetings",tags:["Spanish","open share"]},
  {id:"rd12",org:"Recovery Dharma",name:"RD Online — Commitment Study",format:"online",day:"Friday",time:"18:00",tz:"ET",duration:75,zoom:"https://zoom.us/j/rd-commitments",link:"https://recoverydharma.org/meetings",tags:["commitments","dharma study"]},
  {id:"rd13",org:"Recovery Dharma",name:"RD Seattle Sangha",format:"hybrid",day:"Sunday",time:"10:00",tz:"PT",duration:75,zoom:"https://zoom.us/j/rd-seattle",address:"Seattle, WA",link:"https://recoverydharma.org/meetings",tags:["hybrid","open share"]},
  {id:"rd14",org:"Recovery Dharma",name:"RD Online — Late Night",format:"online",day:"Daily",time:"22:00",tz:"ET",duration:60,zoom:"https://zoom.us/j/rd-latenight",link:"https://recoverydharma.org/meetings",tags:["open share","international"]},
  {id:"rd15",org:"Recovery Dharma",name:"RD UK — London Sangha",format:"hybrid",day:"Wednesday",time:"19:00",tz:"GMT",zoom:"https://zoom.us/j/rd-london",address:"London, UK",link:"https://recoverydharma.org/meetings",tags:["hybrid","international"]},
  // ── REFUGE RECOVERY ──
  {id:"rr1",org:"Refuge Recovery",name:"RR Online — Morning Sit",format:"online",day:"Daily",time:"07:30",tz:"PT",duration:60,zoom:"https://zoom.us/j/rr-morning",link:"https://refugerecovery.org/meetings",tags:["meditation","open share","newcomer friendly"]},
  {id:"rr2",org:"Refuge Recovery",name:"RR Online — Monday Night",format:"online",day:"Monday",time:"20:00",tz:"ET",duration:75,zoom:"https://zoom.us/j/rr-monday",link:"https://refugerecovery.org/meetings",tags:["open share"]},
  {id:"rr3",org:"Refuge Recovery",name:"RR LA — Silver Lake",format:"in-person",day:"Tuesday",time:"19:30",tz:"PT",duration:75,address:"Silver Lake, Los Angeles, CA",link:"https://refugerecovery.org/meetings",tags:["in-person","open share"]},
  {id:"rr4",org:"Refuge Recovery",name:"RR NYC — East Village",format:"in-person",day:"Wednesday",time:"19:00",tz:"ET",duration:75,address:"East Village, New York, NY",link:"https://refugerecovery.org/meetings",tags:["in-person"]},
  {id:"rr5",org:"Refuge Recovery",name:"RR Online — Women & Non-Binary",format:"online",day:"Thursday",time:"18:00",tz:"PT",duration:60,zoom:"https://zoom.us/j/rr-women",link:"https://refugerecovery.org/meetings",tags:["women","open share"]},
  {id:"rr6",org:"Refuge Recovery",name:"RR SF — Mission",format:"in-person",day:"Friday",time:"19:00",tz:"PT",duration:75,address:"Mission District, San Francisco, CA",link:"https://refugerecovery.org/meetings",tags:["in-person"]},
  {id:"rr7",org:"Refuge Recovery",name:"RR Online — Book Study",format:"online",day:"Saturday",time:"10:30",tz:"ET",duration:75,zoom:"https://zoom.us/j/rr-book",link:"https://refugerecovery.org/meetings",tags:["dharma study","book study"]},
  {id:"rr8",org:"Refuge Recovery",name:"RR Chicago",format:"hybrid",day:"Sunday",time:"11:00",tz:"CT",zoom:"https://zoom.us/j/rr-chicago",address:"Chicago, IL",link:"https://refugerecovery.org/meetings",tags:["hybrid","open share"]},
  {id:"rr9",org:"Refuge Recovery",name:"RR Online — Young People",format:"online",day:"Saturday",time:"15:00",tz:"ET",duration:60,zoom:"https://zoom.us/j/rr-young",link:"https://refugerecovery.org/meetings",tags:["open share"]},
  {id:"rr10",org:"Refuge Recovery",name:"RR Online — International",format:"online",day:"Sunday",time:"16:00",tz:"GMT",duration:60,zoom:"https://zoom.us/j/rr-intl",link:"https://refugerecovery.org/meetings",tags:["international","open share"]},
  // ── AA ONLINE / AA INTERGROUP ──
  {id:"aa1",org:"AA Online",name:"AA Online Intergroup — Daily 6am",format:"online",day:"Daily",time:"06:00",tz:"ET",duration:60,zoom:"https://zoom.us/j/aaoi-6am",link:"https://www.aa-intergroup.org/meetings/",tags:["speaker","open share","newcomer friendly"]},
  {id:"aa2",org:"AA Online",name:"AA Online Intergroup — Noon Big Book",format:"online",day:"Daily",time:"12:00",tz:"ET",duration:60,zoom:"https://zoom.us/j/aaoi-noon",link:"https://www.aa-intergroup.org",tags:["book study","Big Book"]},
  {id:"aa3",org:"AA Online",name:"AA Online — Step Study",format:"online",day:"Monday",time:"19:00",tz:"ET",duration:60,zoom:"https://zoom.us/j/aa-steps",link:"https://www.aa-intergroup.org",tags:["step study"]},
  {id:"aa4",org:"AA Online",name:"AA Online — Women's Meeting",format:"online",day:"Tuesday",time:"19:30",tz:"ET",duration:60,zoom:"https://zoom.us/j/aa-womens",link:"https://www.aa-intergroup.org",tags:["women"]},
  {id:"aa5",org:"AA Online",name:"AA Online — Men's Meeting",format:"online",day:"Thursday",time:"19:30",tz:"ET",duration:60,zoom:"https://zoom.us/j/aa-mens",link:"https://www.aa-intergroup.org",tags:["men"]},
  {id:"aa6",org:"AA Online",name:"AA Online — LGBTQ+",format:"online",day:"Wednesday",time:"20:00",tz:"ET",duration:60,zoom:"https://zoom.us/j/aa-lgbtq",link:"https://www.aa-intergroup.org",tags:["LGBTQ+"]},
  {id:"aa7",org:"AA Online",name:"AA Online — Young People",format:"online",day:"Friday",time:"19:00",tz:"ET",duration:60,zoom:"https://zoom.us/j/aa-young",link:"https://www.aa-intergroup.org",tags:["open share"]},
  {id:"aa8",org:"AA Online",name:"AA Online — Midnight Meeting",format:"online",day:"Daily",time:"00:00",tz:"ET",duration:60,zoom:"https://zoom.us/j/aa-midnight",link:"https://www.aa-intergroup.org",tags:["open share","international"]},
  {id:"aa9",org:"AA Online",name:"AA Online — Saturday Speaker",format:"online",day:"Saturday",time:"10:00",tz:"ET",duration:60,zoom:"https://zoom.us/j/aa-speaker",link:"https://www.aa-intergroup.org",tags:["speaker"]},
  {id:"aa10",org:"AA Online",name:"AA Online — Sunday Meditation",format:"online",day:"Sunday",time:"09:00",tz:"ET",duration:45,zoom:"https://zoom.us/j/aa-meditation",link:"https://www.aa-intergroup.org",tags:["meditation","open share"]},
  {id:"aa11",org:"AA Online",name:"AA Online — Professionals in Recovery",format:"online",day:"Wednesday",time:"12:00",tz:"ET",duration:60,zoom:"https://zoom.us/j/aa-professionals",link:"https://www.aa-intergroup.org",tags:["open share"]},
  {id:"aa12",org:"AA Online",name:"AA Online — Spanish / Español",format:"online",day:"Tuesday",time:"20:00",tz:"ET",duration:60,zoom:"https://zoom.us/j/aa-espanol",link:"https://www.aa-intergroup.org",tags:["Spanish"]},
  {id:"aa13",org:"AA Online",name:"AA Online — Veterans Meeting",format:"online",day:"Thursday",time:"10:00",tz:"ET",duration:60,zoom:"https://zoom.us/j/aa-veterans",link:"https://www.aa-intergroup.org",tags:["veterans","open share"]},
  {id:"aa14",org:"AA Online",name:"Find AA Near You",format:"in-person",day:"Various",time:"Varies",tz:"Local",link:"https://www.aa.org/find-aa",tags:["in-person","directory"]},
  // ── NA ONLINE ──
  {id:"na1",org:"Narcotics Anonymous",name:"NA Online — Daily Meeting",format:"online",day:"Daily",time:"12:00",tz:"ET",duration:60,zoom:"https://zoom.us/j/na-daily",link:"https://na.org/meetingsearch/",tags:["open share","newcomer friendly"]},
  {id:"na2",org:"Narcotics Anonymous",name:"NA Online — Step Meeting",format:"online",day:"Monday",time:"19:00",tz:"ET",duration:60,zoom:"https://zoom.us/j/na-steps",link:"https://na.org/meetingsearch/",tags:["step study"]},
  {id:"na3",org:"Narcotics Anonymous",name:"NA Online — Speaker Meeting",format:"online",day:"Saturday",time:"11:00",tz:"ET",duration:60,zoom:"https://zoom.us/j/na-speaker",link:"https://na.org/meetingsearch/",tags:["speaker"]},
  {id:"na4",org:"Narcotics Anonymous",name:"NA Online — Young People",format:"online",day:"Friday",time:"20:00",tz:"ET",duration:60,zoom:"https://zoom.us/j/na-young",link:"https://na.org/meetingsearch/",tags:["open share"]},
  {id:"na5",org:"Narcotics Anonymous",name:"Find NA Near You",format:"in-person",day:"Various",time:"Varies",tz:"Local",link:"https://na.org/meetingsearch/",tags:["in-person","directory"]},
  // ── SMART RECOVERY ──
  {id:"sm1",org:"SMART Recovery",name:"SMART Online — Daily Meeting",format:"online",day:"Daily",time:"10:00",tz:"ET",duration:90,zoom:"https://zoom.us/j/smart-daily",link:"https://www.smartrecovery.org/community/calendar.php",tags:["open share","science-based","newcomer friendly"]},
  {id:"sm2",org:"SMART Recovery",name:"SMART Online — Women's",format:"online",day:"Wednesday",time:"12:00",tz:"ET",duration:60,zoom:"https://zoom.us/j/smart-womens",link:"https://www.smartrecovery.org",tags:["women"]},
  {id:"sm3",org:"SMART Recovery",name:"SMART Online — Young Adults",format:"online",day:"Thursday",time:"19:00",tz:"ET",duration:60,zoom:"https://zoom.us/j/smart-young",link:"https://www.smartrecovery.org",tags:["open share"]},
];

const ORG_COLORS={"Recovery Dharma":C.gold,"Refuge Recovery":C.sage,"AA Online":C.blue,"Narcotics Anonymous":C.lavender,"SMART Recovery":C.teal};
const ORG_ABBR={"Recovery Dharma":"RD","Refuge Recovery":"RR","AA Online":"AA","Narcotics Anonymous":"NA","SMART Recovery":"SMART"};
const DAYS_ORDER=["Daily","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
const TIME_LABELS={"00:00-08:59":"Morning (before 9am)","09:00-11:59":"Mid-Morning","12:00-14:59":"Afternoon","15:00-17:59":"Late Afternoon","18:00-20:59":"Evening","21:00-23:59":"Night"};

function getTimeSlot(time){
  const h=parseInt(time.split(":")[0]);
  if(h<9) return "00:00-08:59";
  if(h<12) return "09:00-11:59";
  if(h<15) return "12:00-14:59";
  if(h<18) return "15:00-17:59";
  if(h<21) return "18:00-20:59";
  return "21:00-23:59";
}

function buildCalUrl(m){
  const title=encodeURIComponent(m.name+" ("+m.org+")");
  const details=encodeURIComponent((m.desc||"")+(m.zoom?"\n\nJoin: "+m.zoom:"")+(m.link?"\n\nMore info: "+m.link:""));
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}`;
}

function MeetingsScreen(){
  const[tab,setTab]=useState("find");
  const[search,setSearch]=useState("");
  const[filterOrg,setFilterOrg]=useState("All");
  const[filterFormat,setFilterFormat]=useState("All");
  const[filterDay,setFilterDay]=useState("All");
  const[filterTime,setFilterTime]=useState("All");
  const[selected,setSelected]=useState(null);
  const[saved,setSaved]=useStorage("rd:saved_meetings",[]);

  const orgs=["All",...Object.keys(ORG_COLORS)];
  const formats=["All","online","in-person","hybrid"];
  const dayOpts=["All",...DAYS_ORDER];
  const timeOpts=["All",...Object.keys(TIME_LABELS)];

  const filtered=MEETINGS_DB.filter(m=>{
    if(filterOrg!=="All"&&m.org!==filterOrg) return false;
    if(filterFormat!=="All"&&m.format!==filterFormat) return false;
    if(filterDay!=="All"&&m.day!==filterDay&&m.day!=="Daily") return false;
    if(filterTime!=="All"&&m.time!=="Varies"&&getTimeSlot(m.time)!==filterTime) return false;
    if(search){const s=search.toLowerCase();return m.name.toLowerCase().includes(s)||m.org.toLowerCase().includes(s)||(m.desc||"").toLowerCase().includes(s)||(m.tags||[]).some(t=>t.toLowerCase().includes(s));}
    return true;
  });

  const toggleSave=async(id)=>{
    const isSaved=saved.includes(id);
    await setSaved(isSaved?saved.filter(s=>s!==id):[...saved,id]);
  };

  function MeetingCard({m}){
    const color=ORG_COLORS[m.org]||C.gold;
    const isSaved=saved.includes(m.id);
    return (
      <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,marginBottom:9,borderLeft:`4px solid ${color}`,cursor:"pointer"}}
        onClick={()=>setSelected(m)}>
        <div style={{padding:"13px 15px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8}}>
            <div style={{flex:1}}>
              <div style={{display:"flex",gap:7,alignItems:"center",flexWrap:"wrap",marginBottom:4}}>
                <span style={{fontSize:10,color,letterSpacing:".1em",textTransform:"uppercase",fontWeight:500}}>{ORG_ABBR[m.org]||m.org}</span>
                <span style={{fontSize:9,color:C.creamDim}}>·</span>
                <span style={{fontSize:10,color:C.creamMuted}}>{m.day==="Daily"?"Every day":m.day} · {m.time} {m.tz}</span>
                <span style={{fontSize:9,padding:"1px 6px",borderRadius:4,border:`1px solid ${m.format==="online"?C.blue:m.format==="hybrid"?C.teal:C.sage}`,color:m.format==="online"?C.blue:m.format==="hybrid"?C.teal:C.sage}}>{m.format}</span>
              </div>
              <div style={{fontSize:13,color:C.cream,fontFamily:"'Cormorant Garamond',serif",marginBottom:3}}>{m.name}</div>
              <p style={{fontSize:11,color:C.creamMuted,lineHeight:1.6}}>{m.desc}</p>
            </div>
            <button onClick={e=>{e.stopPropagation();toggleSave(m.id);}}
              style={{background:"none",border:"none",cursor:"pointer",fontSize:16,color:isSaved?C.rose:C.border,flexShrink:0,padding:"0 4px"}}>
              {isSaved?"♥":"♡"}
            </button>
          </div>
          {m.tags&&m.tags.length>0&&(
            <div style={{display:"flex",gap:4,flexWrap:"wrap",marginTop:6}}>
              {m.tags.map(t=><span key={t} style={{fontSize:9,color:C.creamDim,background:C.surfaceDeep,borderRadius:4,padding:"2px 6px"}}>{t}</span>)}
            </div>
          )}
        </div>
      </div>
    );
  }

  if(selected){
    const m=selected;const color=ORG_COLORS[m.org]||C.gold;const isSaved=saved.includes(m.id);
    return (
      <div className="fu" style={{maxWidth:780,margin:"0 auto",padding:"0 16px 60px"}}>
        <button onClick={()=>setSelected(null)} style={{background:"none",border:`1px solid ${C.border}`,color:C.creamMuted,borderRadius:7,padding:"7px 13px",cursor:"pointer",fontSize:11,margin:"16px 0 14px"}}>← Back to meetings</button>
        <Card style={{borderColor:color,marginBottom:12}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:10}}>
            <div>
              <Tag label={m.org} color={color}/>
              <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:24,color:C.cream,margin:"8px 0 6px",lineHeight:1.2}}>{m.name}</h2>
              <p style={{fontSize:13,color:C.creamMuted,lineHeight:1.7}}>{m.desc}</p>
            </div>
            <button onClick={()=>toggleSave(m.id)} style={{background:isSaved?`${C.rose}22`:"none",border:`1px solid ${isSaved?C.rose:C.border}`,borderRadius:8,padding:"6px 12px",cursor:"pointer",fontSize:18,color:isSaved?C.rose:C.creamMuted,flexShrink:0}}>
              {isSaved?"♥":"♡"}
            </button>
          </div>
        </Card>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9,marginBottom:12}}>
          {[
            {label:"Day",value:m.day==="Daily"?"Every day":m.day},
            {label:"Time",value:`${m.time} ${m.tz||""}`},
            {label:"Format",value:m.format.charAt(0).toUpperCase()+m.format.slice(1)},
            {label:"Duration",value:m.duration?`${m.duration} min`:"Varies"},
          ].map(f=>(
            <Card key={f.label} style={{padding:"11px 14px"}}>
              <div style={{fontSize:9,color:C.creamMuted,textTransform:"uppercase",letterSpacing:".1em",marginBottom:3}}>{f.label}</div>
              <div style={{fontSize:14,color:C.cream}}>{f.value}</div>
            </Card>
          ))}
        </div>
        {m.address&&<Card style={{marginBottom:12}}><Tag label="Location" color={C.sage}/><p style={{fontSize:13,color:C.cream,marginTop:6}}>{m.address}</p></Card>}
        <div style={{display:"flex",gap:9,flexWrap:"wrap",marginBottom:12}}>
          {m.zoom&&<a href={m.zoom} target="_blank" rel="noreferrer" style={{display:"inline-flex",alignItems:"center",gap:6,background:`${C.blue}18`,border:`1px solid ${C.blue}`,color:C.blue,borderRadius:9,padding:"9px 17px",textDecoration:"none",fontSize:12}}>📹 Join Zoom</a>}
          {m.link&&<a href={m.link} target="_blank" rel="noreferrer" style={{display:"inline-flex",alignItems:"center",gap:6,background:`${color}18`,border:`1px solid ${color}`,color,borderRadius:9,padding:"9px 17px",textDecoration:"none",fontSize:12}}>🔗 Official site</a>}
          {m.day!=="Various"&&<a href={buildCalUrl(m)} target="_blank" rel="noreferrer" style={{display:"inline-flex",alignItems:"center",gap:6,background:`${C.sage}18`,border:`1px solid ${C.sage}`,color:C.sage,borderRadius:9,padding:"9px 17px",textDecoration:"none",fontSize:12}}>📅 Add to Calendar</a>}
        </div>
        <div style={{fontSize:10,color:C.creamDim,textAlign:"center",marginTop:8}}>Meeting data last updated: {MEETING_DATA_UPDATED}. Always verify times at the official meeting link.</div>
      </div>
    );
  }

  return (
    <div className="fu" style={{maxWidth:780,margin:"0 auto",padding:"0 16px 60px"}}>
      <SH title="Meetings & Sangha" subtitle={'"The sangha is the whole of the holy life." — The Buddha'}/>
      <Tabs tabs={[["find","Find a Meeting"],["formats","Meeting Formats"],["order","Meeting Order"],["agreements","Agreements"],["facilitation","Facilitation"]]} active={tab} onSelect={setTab}/>

      {tab==="find"&&<div>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search meetings, orgs, tags..."
          style={{width:"100%",background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,padding:"9px 13px",color:C.cream,fontSize:12,fontFamily:"'DM Sans'",outline:"none",marginBottom:11}}/>
        <div style={{marginBottom:11}}>
          <div style={{fontSize:10,color:C.creamMuted,marginBottom:6,letterSpacing:".08em",textTransform:"uppercase"}}>Organization</div>
          <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
            {orgs.map(o=><button key={o} onClick={()=>setFilterOrg(o)}
              style={{padding:"4px 10px",borderRadius:7,border:`1px solid ${filterOrg===o?(ORG_COLORS[o]||C.gold):C.border}`,
              background:filterOrg===o?`${ORG_COLORS[o]||C.gold}22`:C.surfaceDeep,
              color:filterOrg===o?(ORG_COLORS[o]||C.gold):C.creamMuted,cursor:"pointer",fontSize:10,fontFamily:"'DM Sans'"}}>{o==="All"?"All Orgs":ORG_ABBR[o]||o}</button>)}
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:9,marginBottom:11}}>
          <div>
            <div style={{fontSize:10,color:C.creamMuted,marginBottom:5,letterSpacing:".08em",textTransform:"uppercase"}}>Format</div>
            <select value={filterFormat} onChange={e=>setFilterFormat(e.target.value)}
              style={{width:"100%",background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,padding:"7px 9px",color:C.cream,fontSize:11,fontFamily:"'DM Sans'",outline:"none"}}>
              {formats.map(f=><option key={f} value={f}>{f==="All"?"All Formats":f.charAt(0).toUpperCase()+f.slice(1)}</option>)}
            </select>
          </div>
          <div>
            <div style={{fontSize:10,color:C.creamMuted,marginBottom:5,letterSpacing:".08em",textTransform:"uppercase"}}>Day</div>
            <select value={filterDay} onChange={e=>setFilterDay(e.target.value)}
              style={{width:"100%",background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,padding:"7px 9px",color:C.cream,fontSize:11,fontFamily:"'DM Sans'",outline:"none"}}>
              {dayOpts.map(d=><option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <div style={{fontSize:10,color:C.creamMuted,marginBottom:5,letterSpacing:".08em",textTransform:"uppercase"}}>Time of Day</div>
            <select value={filterTime} onChange={e=>setFilterTime(e.target.value)}
              style={{width:"100%",background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,padding:"7px 9px",color:C.cream,fontSize:11,fontFamily:"'DM Sans'",outline:"none"}}>
              {timeOpts.map(t=><option key={t} value={t}>{t==="All"?"Any Time":TIME_LABELS[t]}</option>)}
            </select>
          </div>
        </div>
        {(filterOrg!=="All"||filterFormat!=="All"||filterDay!=="All"||filterTime!=="All"||search)&&(
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
            <span style={{fontSize:11,color:C.creamMuted}}>{filtered.length} meetings found</span>
            <button onClick={()=>{setFilterOrg("All");setFilterFormat("All");setFilterDay("All");setFilterTime("All");setSearch("");}}
              style={{background:"none",border:`1px solid ${C.border}`,color:C.creamMuted,borderRadius:6,padding:"3px 9px",cursor:"pointer",fontSize:10}}>Clear filters</button>
          </div>
        )}
        {saved.length>0&&!search&&filterOrg==="All"&&filterFormat==="All"&&filterDay==="All"&&filterTime==="All"&&(
          <Card style={{marginBottom:12,borderColor:C.rose}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
              <Tag label="♥ Saved Meetings" color={C.rose}/>
              <span style={{fontSize:10,color:C.creamMuted}}>{saved.length} saved</span>
            </div>
            {MEETINGS_DB.filter(m=>saved.includes(m.id)).map(m=><MeetingCard key={m.id} m={m}/>)}
          </Card>
        )}
        {filtered.length===0?<Card style={{textAlign:"center",padding:"40px 20px"}}><p style={{color:C.creamMuted,fontSize:13}}>No meetings match your filters. Try broadening your search.</p></Card>
          :filtered.map(m=><MeetingCard key={m.id} m={m}/>)}
        <div style={{marginTop:16,padding:"13px 16px",background:C.surfaceDeep,borderRadius:10,border:`1px solid ${C.border}`}}>
          <div style={{fontSize:10,color:C.creamMuted,marginBottom:8,letterSpacing:".1em",textTransform:"uppercase"}}>Official Meeting Finders</div>
          <div style={{display:"grid",gap:7}}>
            {[["Recovery Dharma","recoverydarma.org/meetings","https://recoverydharma.org/meetings",C.gold],["Refuge Recovery","refugerecovery.org/meetings","https://refugerecovery.org/meetings",C.sage],["AA Intergroup","aa-intergroup.org","https://www.aa-intergroup.org",C.blue],["NA Meeting Search","na.org/meetingsearch","https://na.org/meetingsearch/",C.lavender],["SMART Recovery","smartrecovery.org","https://www.smartrecovery.org/community/calendar.php",C.teal]].map(([n,d,u,c])=>(
              <a key={n} href={u} target="_blank" rel="noreferrer" style={{display:"flex",justifyContent:"space-between",alignItems:"center",background:C.surface,borderRadius:8,padding:"9px 12px",textDecoration:"none",border:`1px solid ${C.border}`}}>
                <div><div style={{fontSize:11,color:C.cream}}>{n}</div><div style={{fontSize:9,color:C.creamMuted}}>{d}</div></div>
                <span style={{color:c,fontSize:11}}>→</span>
              </a>
            ))}
          </div>
          <div style={{fontSize:9,color:C.creamDim,marginTop:9,textAlign:"center"}}>Data last updated: {MEETING_DATA_UPDATED} · Times subject to change — verify at official links</div>
        </div>
      </div>}

      {tab==="formats"&&<div>
        <Card style={{marginBottom:12}}><Tag label="Why Meetings?" color={C.gold}/><p style={{fontSize:13,color:C.creamMuted,lineHeight:1.85,marginTop:8}}>Recovery Dharma meetings are peer-led, non-hierarchical, and open to people of any or no religious background. Research consistently shows that social connection is one of the strongest predictors of sustained recovery. Attendance and honest participation in a consistent home group is among the most powerful things you can do for your recovery.</p></Card>
        {[{name:"Open Share Meeting",dur:"60–90 min",color:C.gold,desc:"After readings and a topic is introduced, members share from personal experience — generally 3–5 minutes each, uninterrupted. No crosstalk. The meeting closes with metta."},
          {name:"Dharma Study Meeting",dur:"60–90 min",color:C.lavender,desc:"The group reads a section of the Recovery Dharma book or another dharma text together, then opens for discussion. Valuable for deepening understanding of the philosophical framework."},
          {name:"Inquiry Meeting",dur:"75–90 min",color:C.rose,desc:"One member shares an inquiry in depth. Others listen fully. After the share, there may be brief resonance — but no advice, crosstalk, or interpretation."},
          {name:"Meditation Meeting",dur:"60 min",color:C.sage,desc:"A period of silent or guided meditation (20–30 minutes), followed by optional sharing about what arose in practice."},
          {name:"Commitment Study",dur:"60–90 min",color:C.amber,desc:"Working through the eight commitments together — one per session, or over eight weeks. Participants share their personal relationship to each commitment."},
          {name:"Online Meeting",dur:"60–90 min",color:C.blue,desc:"Recovery Dharma holds online meetings worldwide via video and audio. Available at recoverydarma.org — particularly valuable for people in geographic isolation."},
        ].map((f,i)=><Card key={i} style={{marginBottom:9}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6,flexWrap:"wrap",gap:5}}><div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:17,color:C.cream}}>{f.name}</div><span style={{fontSize:10,color:f.color}}>⏱ {f.dur}</span></div><p style={{fontSize:12,color:C.creamMuted,lineHeight:1.75}}>{f.desc}</p></Card>)}
      </div>}

      {tab==="order"&&<Card>
        <Tag label="Standard Meeting Order" color={C.gold}/>
        <div style={{marginTop:13}}>
          {["Ring bell three times · Moment of silence","Welcome and introduce the facilitator","Read the Preamble","Read Taking Refuge in the Three Jewels","Brief guided meditation (5–10 minutes)","Introduce today's format and topic","Open sharing (3–5 minutes per person)","Brief silence after each share","Announcements","Welcome newcomers — invite them to share if comfortable","Read the Closing Metta Prayer","Ring bell three times · Meeting ends"].map((s,i)=>(
            <div key={i} style={{display:"flex",gap:12,padding:"9px 0",borderBottom:i<11?`1px solid ${C.border}`:"none",alignItems:"center"}}>
              <span style={{color:C.gold,fontFamily:"'Cormorant Garamond',serif",fontSize:16,minWidth:22}}>{i+1}</span>
              <span style={{fontSize:12,color:C.cream}}>{s}</span>
            </div>
          ))}
        </div>
      </Card>}

      {tab==="agreements"&&<div>
        <Card style={{marginBottom:11}}><Tag label="Community Agreements" color={C.sage}/><p style={{fontSize:12,color:C.creamMuted,lineHeight:1.8,marginTop:8}}>Recovery Dharma meetings are held together by community agreements — not rules, but shared commitments to the conditions that make honest sharing possible.</p></Card>
        {[{t:"We practice non-judgment",d:"All suffering is valid. All substances and behaviors are welcome. We do not compare addictions or suggest that some are more serious than others.",c:C.gold},{t:"We do not crosstalk",d:"We do not respond directly to others' shares during the meeting. We listen fully without preparing our response.",c:C.sage},{t:"We speak from personal experience",d:"'I' statements only. We share what has been true in our own lives — not prescriptions, advice, or interpretations.",c:C.lavender},{t:"We honor confidentiality",d:"What is shared in the meeting stays in the meeting. This is the foundation of honest sharing.",c:C.rose},{t:"We practice right speech",d:"We speak with care and honesty. We avoid gossip, harmful speech, and idle chatter in the context of the sangha.",c:C.amber},{t:"We are a peer community",d:"There are no authorities. No prescribed steps. No hierarchy. People with more experience may serve as mentors — but not as leaders with power over others.",c:C.blue},{t:"We maintain appropriate limits",d:"This is a peer support community, not a mental health service. If someone appears to be in crisis, we refer them to appropriate professional resources.",c:C.teal}].map((a,i)=>(
          <Card key={i} style={{marginBottom:8,borderLeft:`3px solid ${a.c}`,borderRadius:"0 10px 10px 0"}}><div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:16,color:C.cream,marginBottom:5}}>{a.t}</div><p style={{fontSize:12,color:C.creamMuted,lineHeight:1.75}}>{a.d}</p></Card>
        ))}
      </div>}

      {tab==="facilitation"&&<Accord items={[
        {title:"Before the Meeting",color:C.amber,body:"Arrive 15–20 minutes early. Set up the physical or digital space. Have readings available. Plan the opening meditation and topic. Greet people as they arrive."},
        {title:"Opening the Meeting",color:C.gold,body:"Ring the bell three times and invite a moment of silence. Welcome everyone warmly and acknowledge newcomers. Ask someone to read the Preamble and Refuge prayer. Offer a brief opening meditation (5–10 min). Introduce the day's topic personally — share briefly from your own experience to model honest participation."},
        {title:"Holding Space During Sharing",color:C.sage,body:"Your primary role is to hold the container. Keep track of time per share (3–5 min) and give a gentle signal when time is nearing. If crosstalk occurs, gently redirect: 'In RD, we save our responses for after the meeting.' After each share, allow a brief moment of silence before moving to the next person."},
        {title:"Handling Challenges",color:C.rose,body:"If someone shares a crisis: acknowledge their courage, affirm the importance of professional support, offer resources (988, local crisis lines) without derailing the meeting. If someone is impaired, speak to them privately after the meeting. If conflict arises, redirect to the agreements: 'Let's come back to speaking from our own experience.'"},
        {title:"Closing the Meeting",color:C.lavender,body:"Make announcements briefly. Welcome newcomers explicitly. Invite contact information exchange. Ask someone to read the Closing Metta. Ring the bell three times. Stay after — the conversation in the minutes after the meeting often provides the most direct support."},
      ]}/>}
    </div>
  );
}


// ── RELAPSE GUIDE ─────────────────────────────────────────────────────────────
function RelapseScreen(){
  const[tab,setTab]=useState("before");
  return(
    <div className="fu"style={{maxWidth:780,margin:"0 auto",padding:"0 16px 60px"}}>
      <SH title="Relapse Guide" subtitle="Honest, compassionate guidance for before, during, and after relapse. Recovery Dharma does not treat relapse as failure — it treats it as information."/>
      <Card style={{marginBottom:13,borderColor:C.rose}}><Tag label="If you are in crisis" color={C.rose}/><p style={{fontSize:12,color:C.creamMuted,lineHeight:1.75,marginTop:7}}>Use the SOS button on the home screen, or call 988. If you have relapsed and are at risk of overdose, call 911 immediately. Your safety comes first.</p></Card>
      <Tabs tabs={[["before","Prevention"],["during","In the Moment"],["after","After Relapse"]]} active={tab} onSelect={setTab}/>
      {tab==="before"&&<Accord items={RELAPSE_GUIDE.before.map(s=>({title:s.title,color:s.color,body:s.body}))}/>}
      {tab==="during"&&<Accord items={RELAPSE_GUIDE.during.map(s=>({title:s.title,color:s.color,body:s.body}))}/>}
      {tab==="after"&&<Accord items={RELAPSE_GUIDE.after.map(s=>({title:s.title,color:s.color,body:s.body}))}/>}
    </div>
  );
}

// ── TRAUMA & RECOVERY ─────────────────────────────────────────────────────────
function TraumaScreen(){
  return(
    <div className="fu"style={{maxWidth:780,margin:"0 auto",padding:"0 16px 60px"}}>
      <SH title="Trauma & Recovery" subtitle="The research on trauma and addiction — and what it means for your practice."/>
      <Card style={{marginBottom:13,background:`linear-gradient(135deg,${C.surfaceAlt},${C.surface})`}}><Tag label="Gabor Maté" color={C.blue}/><p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:19,fontStyle:"italic",color:C.cream,lineHeight:1.7,marginTop:8,marginBottom:3}}>"Not why the addiction — but why the pain?"</p><p style={{fontSize:12,color:C.creamMuted,lineHeight:1.75,marginTop:7}}>Every addiction is an attempt to solve a problem — to regulate overwhelming emotion, to feel alive, to belong, to manage pain that had no other outlet. This reframe is not an excuse. It is an explanation. Explanations, unlike moral judgments, actually lead somewhere.</p></Card>
      <Accord items={TRAUMA_DATA.map(s=>({title:s.title,color:C.blue,body:s.body}))}/>
    </div>
  );
}

// ── NETWORK ───────────────────────────────────────────────────────────────────
function NetworkScreen({toast=()=>{}}){
  const[contacts,setContacts,loaded]=useStorage("rd:network",[]);
  const[adding,setAdding]=useState(false);const[form,setForm]=useState({name:"",role:"mentor",phone:"",notes:""});
  const ROLES={mentor:"Mentor",sponsee:"Mentee",sangha:"Sangha member",therapist:"Therapist",doctor:"Medical",emergency:"Emergency contact",other:"Other"};
  const RC={mentor:C.gold,sponsee:C.sage,sangha:C.lavender,therapist:C.blue,doctor:C.teal,emergency:C.rose,other:C.creamMuted};
  if(!loaded)return <div style={{padding:"60px 16px",textAlign:"center",color:C.creamMuted}}>Loading...</div>;
  return(
    <div className="fu"style={{maxWidth:780,margin:"0 auto",padding:"0 16px 60px"}}>
      <SH title="My Recovery Network" subtitle="Recovery happens in relationship. Your network is your safety net."/>
      {!adding?<button onClick={()=>setAdding(true)}style={{width:"100%",background:C.surfaceAlt,border:`1px solid ${C.gold}`,color:C.gold,borderRadius:12,padding:"11px",cursor:"pointer",fontSize:13,marginBottom:13,fontFamily:"'Cormorant Garamond',serif"}}>+ Add a contact</button>:<Card style={{marginBottom:13,borderColor:C.amber}}><Tag label="New contact" color={C.amber}/><div style={{display:"grid",gap:9,marginTop:11}}>{["name","phone","notes"].map(f=><div key={f}><div style={{fontSize:10,color:C.creamMuted,letterSpacing:".1em",textTransform:"uppercase",marginBottom:4}}>{f}</div><input value={form[f]}onChange={e=>setForm(p=>({...p,[f]:e.target.value}))}placeholder={{name:"Full name",phone:"Phone or how to reach",notes:"Best time to call, what they help with..."}[f]}style={{width:"100%",background:C.surfaceDeep,border:`1px solid ${C.border}`,borderRadius:8,padding:"8px 11px",color:C.cream,fontSize:12,fontFamily:"'DM Sans'",outline:"none"}}/></div>)}<div><div style={{fontSize:10,color:C.creamMuted,letterSpacing:".1em",textTransform:"uppercase",marginBottom:5}}>Role</div><select value={form.role}onChange={e=>setForm(p=>({...p,role:e.target.value}))}style={{width:"100%",background:C.surfaceDeep,border:`1px solid ${C.border}`,borderRadius:8,padding:"8px 11px",color:C.cream,fontSize:12,fontFamily:"'DM Sans'",outline:"none"}}>{Object.entries(ROLES).map(([k,v])=><option key={k}value={k}>{v}</option>)}</select></div></div><div style={{display:"flex",gap:8,marginTop:11}}><button onClick={async()=>{if(form.name.trim()){await setContacts(p=>[{id:Date.now(),...form},...p]);setForm({name:"",role:"mentor",phone:"",notes:""});setAdding(false);toast("Contact saved");}}}style={{background:C.surfaceAlt,border:`1px solid ${C.amber}`,color:C.amber,borderRadius:8,padding:"8px 15px",cursor:"pointer",fontSize:11}}>Save</button><button onClick={()=>setAdding(false)}style={{background:"none",border:`1px solid ${C.border}`,color:C.creamMuted,borderRadius:8,padding:"8px 13px",cursor:"pointer",fontSize:11}}>Cancel</button></div></Card>}
      {contacts.map((c)=>{const color=RC[c.role]||C.creamMuted;return (<Card key={c.id}style={{marginBottom:8,borderLeft:`3px solid ${color}`,borderRadius:"0 12px 12px 0"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}><div style={{flex:1}}><div style={{display:"flex",gap:8,alignItems:"center",marginBottom:3,flexWrap:"wrap"}}><div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:17,color:C.cream}}>{c.name}</div><Tag label={ROLES[c.role]||c.role} color={color}/></div>{c.phone&&<a href={`tel:${c.phone}`}style={{display:"inline-flex",alignItems:"center",gap:5,fontSize:12,color,textDecoration:"none",background:`${color}18`,borderRadius:6,padding:"3px 8px",marginBottom:c.notes?5:0}}>📞 {c.phone}</a>}{c.notes&&<p style={{fontSize:11,color:C.creamMuted,lineHeight:1.6,marginTop:3}}>{c.notes}</p>}</div><button onClick={async()=>await setContacts(p=>p.filter(x=>x.id!==c.id))}style={{background:"none",border:"none",color:C.creamDim,cursor:"pointer",fontSize:11,marginLeft:6}}>✕</button></div></Card>);})}
      {!contacts.length&&!adding&&<Card style={{textAlign:"center",padding:"36px 20px",marginBottom:12}}><p style={{color:C.creamMuted,fontSize:12,lineHeight:1.8}}>Add your mentor, sangha members, therapist, and emergency contacts. When craving is strong, you'll want this list without having to search for it.</p></Card>}
      <Card style={{marginTop:12}}><Tag label="Crisis Lines" color={C.rose}/><div style={{display:"grid",gap:7,marginTop:9}}>{[["988 Lifeline","Call or text 988","tel:988"],["Crisis Text","Text HOME to 741741","sms:741741"],["SAMHSA","1-800-662-4357","tel:18006624357"]].map(([t,d,l])=><a key={t}href={l}style={{display:"flex",justifyContent:"space-between",alignItems:"center",background:C.surfaceDeep,borderRadius:9,padding:"9px 12px",textDecoration:"none",border:`1px solid ${C.border}`}}><div><div style={{fontSize:12,color:C.cream}}>{t}</div><div style={{fontSize:10,color:C.creamMuted,marginTop:1}}>{d}</div></div><span style={{color:C.rose}}>→</span></a>)}</div></Card>
    </div>
  );
}

// ── TRIGGER TRACKER ───────────────────────────────────────────────────────────
function TriggersScreen({toast=()=>{}}){
  const[triggers,setTriggers,loaded]=useStorage("rd:triggers",[]);
  const[adding,setAdding]=useState(false);
  const[form,setForm]=useState({trigger:"",category:"Emotion",intensity:5,response:"",wisePlan:""});
  const CATS=["Emotion","Person","Place","Time/Situation","Physical state","Social","Memory/Thought","Other"];
  const CC={Emotion:C.rose,Person:C.amber,Place:C.blue,"Time/Situation":C.lavender,"Physical state":C.teal,Social:C.sage,"Memory/Thought":C.lavender,Other:C.creamMuted};
  if(!loaded)return <div style={{padding:"60px 16px",textAlign:"center",color:C.creamMuted}}>Loading...</div>;
  return(
    <div className="fu"style={{maxWidth:780,margin:"0 auto",padding:"0 16px 60px"}}>
      <SH title="Trigger Tracker" subtitle="You cannot prevent what you cannot see. Naming your triggers honestly is the beginning of wisdom about them."/>
      <Card style={{marginBottom:13}}><Tag label="Why Track Triggers?" color={C.amber}/><p style={{fontSize:12,color:C.creamMuted,lineHeight:1.85,marginTop:8}}>Every relapse begins with a trigger. Most triggers are invisible until they're named. The practice of tracking them after they arise builds a personal map of your vulnerability. Over time, that map becomes a map of your wisdom — you know what to watch for, what to avoid, and what your wise plan is when unavoidable triggers arise.</p></Card>
      {!adding?<button onClick={()=>setAdding(true)}style={{width:"100%",background:C.surfaceAlt,border:`1px solid ${C.amber}`,color:C.amber,borderRadius:12,padding:"11px",cursor:"pointer",fontSize:13,marginBottom:13,fontFamily:"'Cormorant Garamond',serif"}}>+ Log a trigger</button>:<Card style={{marginBottom:13,borderColor:C.amber}}><Tag label="New trigger" color={C.amber}/><div style={{display:"grid",gap:10,marginTop:11}}>
        <div><div style={{fontSize:10,color:C.creamMuted,letterSpacing:".1em",textTransform:"uppercase",marginBottom:4}}>The trigger</div><textarea value={form.trigger}onChange={e=>setForm(f=>({...f,trigger:e.target.value}))}placeholder="What specifically triggered the craving? Be precise."rows={2}style={{width:"100%",background:C.surfaceDeep,border:`1px solid ${C.border}`,borderRadius:8,padding:"8px 11px",color:C.cream,fontSize:12,fontFamily:"'DM Sans'",resize:"none",outline:"none",lineHeight:1.6}}/></div>
        <div><div style={{fontSize:10,color:C.creamMuted,letterSpacing:".1em",textTransform:"uppercase",marginBottom:5}}>Category</div><div style={{display:"flex",gap:5,flexWrap:"wrap"}}>{CATS.map(c=><button key={c}onClick={()=>setForm(f=>({...f,category:c}))}style={{padding:"4px 8px",borderRadius:6,border:`1px solid ${form.category===c?CC[c]:C.border}`,background:form.category===c?`${CC[c]}22`:C.surfaceDeep,color:form.category===c?CC[c]:C.creamMuted,cursor:"pointer",fontSize:10,fontFamily:"'DM Sans'"}}>{c}</button>)}</div></div>
        <div><div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{fontSize:10,color:C.creamMuted,letterSpacing:".1em",textTransform:"uppercase"}}>Intensity</span><span style={{fontSize:12,color:C.rose,fontFamily:"'Cormorant Garamond',serif"}}>{form.intensity}/10</span></div><input type="range"min={1}max={10}value={form.intensity}onChange={e=>setForm(f=>({...f,intensity:Number(e.target.value)}))}style={{width:"100%",accentColor:C.rose,cursor:"pointer"}}/></div>
        <div><div style={{fontSize:10,color:C.sage,letterSpacing:".1em",textTransform:"uppercase",marginBottom:4}}>Wise plan for next time</div><textarea value={form.wisePlan}onChange={e=>setForm(f=>({...f,wisePlan:e.target.value}))}rows={2}placeholder="If this trigger appears again, I will..."style={{width:"100%",background:C.surfaceDeep,border:`1px solid ${C.border}`,borderRadius:8,padding:"8px 11px",color:C.cream,fontSize:12,fontFamily:"'DM Sans'",resize:"none",outline:"none",lineHeight:1.6}}/></div>
      </div><div style={{display:"flex",gap:8,marginTop:11}}><button onClick={async()=>{if(form.trigger.trim()){await setTriggers(p=>[{id:Date.now(),date:todayStr(),...form},...p]);setForm({trigger:"",category:"Emotion",intensity:5,response:"",wisePlan:""});setAdding(false);toast("Trigger logged");}}}style={{background:C.surfaceAlt,border:`1px solid ${C.amber}`,color:C.amber,borderRadius:8,padding:"8px 15px",cursor:"pointer",fontSize:11}}>Save</button><button onClick={()=>setAdding(false)}style={{background:"none",border:`1px solid ${C.border}`,color:C.creamMuted,borderRadius:8,padding:"8px 13px",cursor:"pointer",fontSize:11}}>Cancel</button></div></Card>}
      {triggers.map((t)=>{const color=CC[t.category]||C.amber;return (<Card key={t.id}style={{marginBottom:8,borderLeft:`3px solid ${color}`,borderRadius:"0 12px 12px 0"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}><div style={{flex:1}}><div style={{display:"flex",gap:6,alignItems:"center",marginBottom:4,flexWrap:"wrap"}}><Tag label={t.category} color={color}/><span style={{fontSize:10,color:t.intensity>=8?C.rose:t.intensity>=5?C.amber:C.sage}}>Intensity: {t.intensity}/10</span><span style={{fontSize:9,color:C.creamDim}}>{fmtShort(t.date)}</span></div><p style={{fontSize:12,color:C.cream,lineHeight:1.6,marginBottom:t.wisePlan?6:0}}>{t.trigger}</p>{t.wisePlan&&<p style={{fontSize:11,color:C.sage,lineHeight:1.6,borderLeft:`2px solid ${C.sage}`,paddingLeft:6}}>Plan: {t.wisePlan}</p>}</div><button onClick={async()=>await setTriggers(p=>p.filter(x=>x.id!==t.id))}style={{background:"none",border:"none",color:C.creamDim,cursor:"pointer",fontSize:11,marginLeft:6}}>✕</button></div></Card>);})}
      {!triggers.length&&!adding&&<Card style={{textAlign:"center",padding:"40px 20px"}}><p style={{fontSize:12,color:C.creamMuted,lineHeight:1.8}}>No triggers logged yet. The next time a craving arises, log what preceded it. Over time the map of your vulnerability becomes the map of your wisdom.</p></Card>}
    </div>
  );
}


// ── MILESTONES ────────────────────────────────────────────────────────────────
function MilestonesScreen(){
  const[startDate,setStartDate,sdL]=useStorage("rd:start_date",null);
  const[tmpDate,setTmpDate]=useState("");
  const daysIn=startDate?daysBetween(startDate,todayStr()):null;
  const achieved=MILESTONE_DAYS.filter(d=>daysIn!==null&&daysIn>=d);
  const upcoming=MILESTONE_DAYS.filter(d=>daysIn===null||daysIn<d);
  if(!sdL)return <div style={{padding:"60px 16px",textAlign:"center",color:C.creamMuted}}>Loading...</div>;
  return(
    <div className="fu"style={{maxWidth:780,margin:"0 auto",padding:"0 16px 60px"}}>
      <SH title="Milestones" subtitle="Recovery is not a destination. But marking the path matters — for you and for those who witness your journey."/>
      {!startDate?<Card style={{borderColor:C.gold,marginBottom:18}}><Tag label="Set your start date" color={C.gold}/><p style={{fontSize:12,color:C.creamMuted,lineHeight:1.75,marginTop:8,marginBottom:12}}>Set your current recovery start date to track your milestones.</p><div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}><input type="date"value={tmpDate}onChange={e=>setTmpDate(e.target.value)}max={todayStr()}style={{background:C.surfaceDeep,border:`1px solid ${C.border}`,borderRadius:8,padding:"8px 11px",color:C.cream,fontSize:12,fontFamily:"'DM Sans'",outline:"none"}}/><button onClick={()=>{if(tmpDate)setStartDate(tmpDate);}}style={{background:C.surfaceAlt,border:`1px solid ${C.gold}`,color:C.gold,borderRadius:8,padding:"8px 15px",cursor:"pointer",fontSize:11}}>Set</button></div></Card>:<div>
        <Card style={{textAlign:"center",marginBottom:16,background:`linear-gradient(135deg,${C.surfaceAlt},${C.surface})`,borderColor:C.gold,position:"relative",overflow:"hidden"}}><div style={{position:"absolute",top:-30,left:"50%",transform:"translateX(-50%)",opacity:.05}}><Lotus size={180}color={C.gold}/></div><div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:70,fontWeight:300,color:C.cream,lineHeight:1,marginBottom:3}}>{daysIn}</div><div style={{fontSize:12,color:C.gold,letterSpacing:".12em",textTransform:"uppercase",marginBottom:8}}>Days in Recovery</div><div style={{fontSize:11,color:C.creamMuted}}>Since {fmtDate(startDate)}</div></Card>
        {achieved.length>0&&<Card style={{marginBottom:15,borderColor:C.gold,background:`linear-gradient(135deg,${C.surfaceAlt},${C.surface})`}}><Tag label="Latest milestone" color={C.gold}/><h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,color:C.cream,margin:"8px 0 8px"}}>{MILESTONE_LABELS[achieved[achieved.length-1]]}</h3><p style={{fontSize:13,color:C.creamMuted,lineHeight:1.85,fontStyle:"italic"}}>"{MILESTONE_WORDS[achieved[achieved.length-1]]}"</p></Card>}
        <div>{[...achieved].reverse().map((d)=><div key={d}style={{display:"flex",gap:11,marginBottom:9,alignItems:"center"}}><div style={{width:32,height:32,borderRadius:"50%",background:`${C.gold}22`,border:`1.5px solid ${C.gold}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><span style={{fontSize:12,color:C.gold}}>✓</span></div><Card style={{flex:1,padding:"11px 15px",borderColor:C.borderLight}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:5}}><div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:15,color:C.cream}}>{MILESTONE_LABELS[d]}</div><div style={{fontSize:10,color:C.gold}}>{d} days</div></div></Card></div>)}</div>
        {upcoming.slice(0,4).map((d)=>{const da=d-(daysIn||0);return(<div key={d}style={{display:"flex",gap:11,marginBottom:8,alignItems:"center",opacity:.4}}><div style={{width:32,height:32,borderRadius:"50%",background:C.surfaceDeep,border:`1px dashed ${C.border}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><span style={{fontSize:10,color:C.creamDim}}>{d}</span></div><Card style={{flex:1,padding:"10px 14px"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:5}}><span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:15,color:C.creamMuted}}>{MILESTONE_LABELS[d]}</span><span style={{fontSize:10,color:C.creamDim}}>{da}d away</span></div></Card></div>);})}
      </div>}
    </div>
  );
}

// ── AMENDS ────────────────────────────────────────────────────────────────────
function AmendsScreen({toast=()=>{}}){
  const[amends,setAmends,loaded]=useStorage("rd:amends",[]);
  const[adding,setAdding]=useState(false);
  const[form,setForm]=useState({person:"",harm:"",status:"considering",notes:""});
  const STATUSES=[{id:"considering",label:"Considering",color:C.creamMuted},{id:"planning",label:"Planning",color:C.amber},{id:"made",label:"Made",color:C.sage},{id:"living",label:"Living amends",color:C.gold}];
  if(!loaded)return <div style={{padding:"60px 16px",textAlign:"center",color:C.creamMuted}}>Loading...</div>;
  return(
    <div className="fu"style={{maxWidth:780,margin:"0 auto",padding:"0 16px 60px"}}>
      <SH title="Amends Tracker" subtitle="Honest accounting. Not to punish ourselves — to restore integrity and relationships where possible."/>
      <Card style={{marginBottom:13}}><Tag label="On Making Amends" color={C.rose}/><p style={{fontSize:12,color:C.creamMuted,lineHeight:1.85,marginTop:7}}>Amends are not apologies — they are the act of making things right. The Buddhist tradition calls this the practice of sīla: living in integrity. We make amends when we are stable enough to do so, with guidance from a mentor, and only when doing so would not cause further harm. Living amends — changing our behavior — is often more meaningful than any single conversation.</p></Card>
      {!adding?<button onClick={()=>setAdding(true)}style={{width:"100%",background:C.surfaceAlt,border:`1px solid ${C.rose}`,color:C.rose,borderRadius:12,padding:"11px",cursor:"pointer",fontSize:13,marginBottom:13,fontFamily:"'Cormorant Garamond',serif"}}>+ Add an amends</button>:<Card style={{marginBottom:13,borderColor:C.rose}}><Tag label="New amends" color={C.rose}/><div style={{display:"grid",gap:9,marginTop:11}}>{["person","harm"].map(f=><div key={f}><div style={{fontSize:10,color:C.creamMuted,letterSpacing:".1em",textTransform:"uppercase",marginBottom:4}}>{f==="person"?"Person harmed":"The harm done"}</div><textarea value={form[f]}onChange={e=>setForm(p=>({...p,[f]:e.target.value}))}rows={f==="harm"?3:1}style={{width:"100%",background:C.surfaceDeep,border:`1px solid ${C.border}`,borderRadius:8,padding:"8px 11px",color:C.cream,fontSize:12,fontFamily:"'DM Sans'",resize:"none",outline:"none",lineHeight:1.6}}/></div>)}<div><div style={{fontSize:10,color:C.creamMuted,letterSpacing:".1em",textTransform:"uppercase",marginBottom:5}}>Status</div><div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{STATUSES.map(s=><button key={s.id}onClick={()=>setForm(f=>({...f,status:s.id}))}style={{padding:"5px 10px",borderRadius:7,border:`1px solid ${form.status===s.id?s.color:C.border}`,background:form.status===s.id?`${s.color}22`:C.surfaceDeep,color:form.status===s.id?s.color:C.creamMuted,cursor:"pointer",fontSize:11,fontFamily:"'DM Sans'"}}>{s.label}</button>)}</div></div></div><div style={{display:"flex",gap:8,marginTop:11}}><button onClick={async()=>{if(form.person.trim()){await setAmends(p=>[{id:Date.now(),date:todayStr(),...form},...p]);setForm({person:"",harm:"",status:"considering",notes:""});setAdding(false);toast("Amends saved");}}}style={{background:C.surfaceAlt,border:`1px solid ${C.rose}`,color:C.rose,borderRadius:8,padding:"8px 15px",cursor:"pointer",fontSize:11}}>Save</button><button onClick={()=>setAdding(false)}style={{background:"none",border:`1px solid ${C.border}`,color:C.creamMuted,borderRadius:8,padding:"8px 13px",cursor:"pointer",fontSize:11}}>Cancel</button></div></Card>}
      {amends.map(a=>{const st=STATUSES.find(s=>s.id===a.status)||STATUSES[0];return (<Card key={a.id}style={{marginBottom:8,borderLeft:`3px solid ${st.color}`,borderRadius:"0 12px 12px 0"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}><div style={{flex:1}}><div style={{display:"flex",gap:7,alignItems:"center",marginBottom:4,flexWrap:"wrap"}}><div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:16,color:C.cream}}>{a.person}</div><Tag label={st.label} color={st.color}/></div><p style={{fontSize:11,color:C.creamMuted,lineHeight:1.6,marginBottom:7}}>{a.harm}</p><div style={{display:"flex",gap:5,flexWrap:"wrap"}}>{STATUSES.map(s=><button key={s.id}onClick={async()=>await setAmends(p=>p.map(x=>x.id===a.id?{...x,status:s.id}:x))}style={{padding:"3px 7px",borderRadius:5,border:`1px solid ${a.status===s.id?s.color:C.border}`,background:a.status===s.id?`${s.color}22`:"none",color:a.status===s.id?s.color:C.creamDim,cursor:"pointer",fontSize:9,fontFamily:"'DM Sans'"}}>{s.label}</button>)}</div></div><button onClick={async()=>await setAmends(p=>p.filter(x=>x.id!==a.id))}style={{background:"none",border:"none",color:C.creamDim,cursor:"pointer",fontSize:11,marginLeft:6}}>✕</button></div></Card>);})}
      {!amends.length&&!adding&&<Card style={{textAlign:"center",padding:"36px 20px"}}><p style={{fontSize:12,color:C.creamMuted,lineHeight:1.8}}>No amends logged yet. Work with your mentor before making direct amends. Not all amends are direct — sometimes living differently is the most meaningful repair.</p></Card>}
    </div>
  );
}

// ── JOURNAL ───────────────────────────────────────────────────────────────────
function JournalScreen({toast=()=>{}}){
  const[entries,setEntries,loaded]=useStorage("rd:journal",[]);
  const[tab,setTab]=useState("write");
  const[text,setText]=useState("");const[saved,setSaved]=useState(false);
  const[search,setSearch]=useState("");
  const PROMPTS=["What is present in my recovery today — honestly?","Where am I still in denial? What am I not looking at?","What would I tell my past self about recovery?","What am I grateful for right now, specifically?","What fear is running my behavior?","Where am I causing harm — to myself or others?","What does my recovery need right now that it's not getting?","Who do I need to reach out to?","What is the wise action available to me today?","What would I do differently if shame were not in the way?"];
  const TAGS=["Insight","Craving","Gratitude","Resentment","Fear","Meditation","Meeting","Amends","Progress","Challenge"];
  const[selTag,setSelTag]=useState("");
  const saveEntry=async()=>{if(!text.trim())return;await setEntries(prev=>[{id:Date.now(),date:todayStr(),text,tag:selTag,ts:Date.now()},...prev.slice(0,499)]);setText("");setSelTag("");setSaved(true);setTimeout(()=>setSaved(false),2500);toast("Entry saved");};
  if(!loaded)return <div style={{padding:"60px 16px",textAlign:"center",color:C.creamMuted}}>Loading...</div>;
  const filtered=entries.filter(e=>!search||e.text.toLowerCase().includes(search.toLowerCase())||e.tag?.toLowerCase().includes(search.toLowerCase()));
  return(
    <div className="fu"style={{maxWidth:780,margin:"0 auto",padding:"0 16px 60px"}}>
      <SH title="Recovery Journal" subtitle="Honest writing. Private. Persistent. One of the most powerful practices available."/>
      <Tabs tabs={[["write","Write"],["entries","Entries"],["prompts","Prompts"]]} active={tab} onSelect={setTab}/>
      {tab==="write"&&<div>
        <Card style={{marginBottom:11}}>
          <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:11}}>{TAGS.map(t=><button key={t}onClick={()=>setSelTag(selTag===t?"":t)}style={{padding:"4px 9px",borderRadius:6,border:`1px solid ${selTag===t?C.lavender:C.border}`,background:selTag===t?`${C.lavender}22`:C.surfaceDeep,color:selTag===t?C.lavender:C.creamMuted,cursor:"pointer",fontSize:10,fontFamily:"'DM Sans'"}}>{t}</button>)}</div>
          <textarea value={text}onChange={e=>{setText(e.target.value);setSaved(false);}}placeholder="What is present today? Write honestly and without judgment. No one else reads this."style={{width:"100%",minHeight:200,background:C.surfaceDeep,border:`1px solid ${C.border}`,borderRadius:8,padding:"12px",color:C.cream,fontSize:13,fontFamily:"'DM Sans'",resize:"vertical",outline:"none",lineHeight:1.8,marginBottom:11}}/>
          <div style={{display:"flex",alignItems:"center",gap:10}}><button onClick={saveEntry}style={{background:C.surfaceAlt,border:`1px solid ${C.lavender}`,color:C.lavender,borderRadius:8,padding:"8px 18px",cursor:"pointer",fontSize:12}}>Save entry</button>{saved&&<span style={{fontSize:11,color:C.sage}}>✓ Saved</span>}</div>
        </Card>
      </div>}
      {tab==="entries"&&<div>
        <input value={search}onChange={e=>setSearch(e.target.value)}placeholder="Search entries..."style={{width:"100%",background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,padding:"9px 13px",color:C.cream,fontSize:12,fontFamily:"'DM Sans'",outline:"none",marginBottom:12}}/>
        {filtered.length===0?<Card style={{textAlign:"center",padding:"36px 20px"}}><p style={{fontSize:12,color:C.creamMuted}}>{entries.length===0?"No journal entries yet. What is present today?":"No entries match your search."}</p></Card>:filtered.map((e,i)=><Card key={e.id}style={{marginBottom:9}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:7}}>{e.tag?<Tag label={e.tag} color={C.lavender}/>:<span/>}<span style={{fontSize:10,color:C.creamDim}}>{fmtDate(e.date)}</span></div><p style={{fontSize:12,color:C.creamMuted,lineHeight:1.8}}>{e.text.slice(0,300)}{e.text.length>300?"...":""}</p></Card>)}
      </div>}
      {tab==="prompts"&&<div>
        <Card style={{marginBottom:12}}><Tag label="Writing Prompts" color={C.lavender}/><p style={{fontSize:12,color:C.creamMuted,lineHeight:1.75,marginTop:7}}>When you don't know where to begin — start with one of these. There are no right answers, only honest ones.</p></Card>
        {PROMPTS.map((p,i)=><button key={i}onClick={()=>{setTab("write");setText(p+"\n\n");}}style={{width:"100%",background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,padding:"13px 16px",cursor:"pointer",textAlign:"left",marginBottom:8,transition:"all .2s"}}onMouseEnter={e=>{e.currentTarget.style.borderColor=C.lavender;e.currentTarget.style.background=C.surfaceAlt;}}onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.background=C.surface;}}><span style={{fontSize:12,color:C.creamMuted,lineHeight:1.7}}>{p}</span></button>)}
      </div>}
    </div>
  );
}

// ── WORKBOOK ──────────────────────────────────────────────────────────────────
function WorkbookScreen({toast=()=>{}}){ 
  const[progress,setProgress]=useStorage("rd:workbook_progress",{});
  const[notes,setNotes]=useStorage("rd:workbook_notes",{});
  const[week,setWeek]=useState(0);
  const[dayIdx,setDayIdx]=useState(null);
  const[noteText,setNoteText]=useState("");const[ns,setNs]=useState(false);
  const WEEKS=[
    {title:"Foundations",sub:"Setting the ground for practice",color:C.gold,days:["Read: The First Noble Truth. Journal: Where has dukkha shown...","Establish your meditation space. Sit for 5 minutes without a...","Journal: What does recovery mean to you? Not what it should ...","Read: The Second Noble Truth. Journal: What have you been cr...","Attend a Recovery Dharma meeting (in person or online). Writ...","Sit for 10 minutes with breath awareness. Notice when the mi...","Weekly reflection: What surprised you this week? What is one..."]},
    {title:"The Three Poisons",sub:"Naming what drives us",color:C.amber,days:["Read about lobha (greed/craving). Journal: Where does lobha ...","Sit for 10 minutes. When craving arises in the mind, try nam...","Read about dosa (hatred/aversion). Journal: What resentments...","Begin a resentment list: name 5–10 people or institutions yo...","Read about moha (delusion). Journal: What story about yourse...","Sit for 15 minutes. At the end: what mental state was most p...","Weekly reflection: Which of the Three Poisons is most active..."]},
    {title:"The Eightfold Path",sub:"The eight factors in daily life",color:C.sage,days:["Read about Wise Understanding and Wise Intention. Journal: W...","Read about Wise Speech. Journal: Where am I still dishonest ...","Read about Wise Action and Wise Livelihood. Journal: Is my d...","Read about Wise Effort. Journal: Where am I applying too muc...","Read about Wise Mindfulness. Sit for 15 minutes with the Not...","Read about Wise Concentration. Sit for 15 minutes with breat...","Weekly reflection: Which factor of the path most needs your ..."]},
    {title:"Inquiry",sub:"Turning the light inward",color:C.lavender,days:["Read about the four inquiry questions. Choose one stressful ...","Take that thought through steps 1–4 of the Four Questions. D...","Work the turnaround. Find three genuine examples for each op...","Begin a fear inventory: list 5–10 fears. Choose the one most...","Take your top fear through the full inquiry process.","Begin a shame inquiry: write the shame statement verbatim. M...","Weekly reflection: What did inquiry reveal that you didn't e..."]},
    {title:"The Commitments",sub:"The eight commitments as living practice",color:C.lavender,days:["Read Commitment 1 (Meditation). Journal your current relatio...","Read Commitment 2 (Sangha). Attend a meeting with the intent...","Read Commitment 3 (Inquiry). Choose one area of your life to...","Read Commitment 4 (Mentorship). Have you approached a potent...","Read Commitments 5 and 6 (Refuge and Precepts). Where do the...","Read Commitments 7 and 8 (Service and Wise Action). Where ca...","Weekly reflection: Which commitment is most neglected in you..."]},
    {title:"Relapse Prevention",sub:"Building the map of wisdom",color:C.rose,days:["Map your relapse history: when have you relapsed, and what p...","Identify your personal warning signs in each of the three st...","HALT inventory: which states most reliably precede craving f...","Build your wise action plan: what specific actions will you ...","Identify three people you will call when craving is strong. ...","Review your Trigger Tracker (or start one now). What pattern...","Weekly reflection: What is the most important thing you've l..."]},
    {title:"Amends & Repair",sub:"Restoring integrity",color:C.teal,days:["Begin your harm done inventory: list the people you have har...","For each person: what was the impact? (Use the Harm Done inq...","For each person: what drove you to cause this harm? (Underst...","Distinguish direct amends (repairing the harm directly) from...","For each item: is a direct amends appropriate, or would it c...","Work through one item with your mentor. What does repair act...","Weekly reflection: How does carrying unresolved amends affec..."]},
    {title:"Integration",sub:"The path as a whole life",color:C.gold,days:["Reflect on the eight weeks: what has changed? What do you se...","Where in your life outside of recovery is the Eightfold Path asking for your attention?","Write a letter to your past self — the version of you who was at the beginning of this.","Write a letter to your future self — one year from now, having practiced consistently.","Identify your next edges: where does the practice need to go deeper?","Attend a meeting and share something from these eight weeks that has been true for you.","Final reflection: What do you commit to carrying forward? Be specific."]}
  ];
  const totalDone=Object.values(progress).filter(Boolean).length;
  if(dayIdx!==null){const day=WEEKS[week].days[dayIdx];const key=`${week}-${dayIdx}`;return(
    <div className="fu"style={{maxWidth:640,margin:"0 auto",padding:"28px 16px 60px"}}><button onClick={()=>setDayIdx(null)}style={{background:"none",border:`1px solid ${C.border}`,color:C.creamMuted,borderRadius:7,padding:"7px 13px",cursor:"pointer",fontSize:11,marginBottom:18}}>← Back</button>
      <Card style={{borderColor:WEEKS[week].color,marginBottom:12}}><Tag label={`Week ${week+1}, Day ${dayIdx+1}`} color={WEEKS[week].color}/><h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,color:C.cream,margin:"9px 0 9px"}}>{WEEKS[week].title}</h3><p style={{fontSize:14,color:C.cream,lineHeight:1.8,marginTop:4}}>{day}</p></Card>
      <Card><Tag label="Notes" color={WEEKS[week].color}/><textarea value={noteText}onChange={e=>{setNoteText(e.target.value);setNs(false);}}placeholder="Write what arose. Insights, resistance, questions — whatever is present."style={{width:"100%",minHeight:120,background:C.surfaceDeep,border:`1px solid ${C.border}`,borderRadius:8,padding:"10px 12px",color:C.cream,fontSize:12,fontFamily:"'DM Sans'",resize:"vertical",outline:"none",lineHeight:1.7,margin:"9px 0 10px"}}/><div style={{display:"flex",gap:9,alignItems:"center"}}><button onClick={async()=>{await setNotes(p=>({...p,[key]:noteText}));await setProgress(p=>({...p,[key]:true}));setNs(true);setTimeout(()=>setNs(false),2500);}}style={{background:C.surfaceAlt,border:`1px solid ${WEEKS[week].color}`,color:WEEKS[week].color,borderRadius:8,padding:"8px 16px",cursor:"pointer",fontSize:11}}>Save & Complete</button>{ns&&<span style={{fontSize:10,color:C.sage}}>✓ Saved</span>}</div></Card>
    </div>
  );}
  return(
    <div className="fu"style={{maxWidth:780,margin:"0 auto",padding:"0 16px 60px"}}>
      <SH title="8-Week Workbook" subtitle="A structured journey through the program — one day, one practice at a time."/>
      <Card style={{marginBottom:14}}><Tag label="Progress" color={C.teal}/><div style={{marginTop:11}}><Ring pct={totalDone/56}size={56}color={C.teal}><div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:19,color:C.cream,lineHeight:1}}>{totalDone}</div><div style={{fontSize:8,color:C.creamMuted}}>of 56</div></Ring><span style={{fontSize:12,color:C.creamMuted,marginLeft:14}}>{totalDone} days completed · {56-totalDone} remaining</span></div></Card>
      <div style={{display:"flex",gap:4,marginBottom:14,flexWrap:"wrap"}}>{WEEKS.map((w,i)=><button key={i}onClick={()=>setWeek(i)}style={{flex:1,minWidth:32,padding:"8px 4px",borderRadius:8,border:`1px solid ${week===i?w.color:C.border}`,background:week===i?`${w.color}22`:C.surface,color:week===i?w.color:C.creamMuted,cursor:"pointer",fontSize:9,fontFamily:"'DM Sans'",transition:"all .2s"}}>W{i+1}</button>)}</div>
      <Card style={{borderColor:WEEKS[week].color,marginBottom:11}}><Tag label={`Week ${week+1}`} color={WEEKS[week].color}/><h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:21,color:C.cream,margin:"7px 0 2px"}}>{WEEKS[week].title}</h3><p style={{fontSize:11,color:C.creamMuted}}>{WEEKS[week].sub}</p></Card>
      <div>{WEEKS[week].days.map((day,i)=>{const key=`${week}-${i}`;const done=progress[key];return(<button key={i}onClick={()=>{setDayIdx(i);setNoteText(notes[`${week}-${i}`]||"");}}style={{width:"100%",background:C.surface,border:`1px solid ${done?WEEKS[week].color:C.border}`,borderRadius:10,padding:"12px 15px",cursor:"pointer",textAlign:"left",marginBottom:8,transition:"all .2s",display:"flex",gap:11,alignItems:"flex-start"}}onMouseEnter={e=>{e.currentTarget.style.background=C.surfaceAlt;}}onMouseLeave={e=>{e.currentTarget.style.background=C.surface;}}><div style={{width:22,height:22,borderRadius:"50%",border:`1.5px solid ${done?WEEKS[week].color:C.border}`,background:done?`${WEEKS[week].color}22`:"none",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1}}>{done&&<span style={{fontSize:10,color:WEEKS[week].color}}>✓</span>}</div><div><div style={{fontSize:10,color:done?WEEKS[week].color:C.creamMuted,marginBottom:3}}>Day {i+1}</div><span style={{fontSize:12,color:C.cream,lineHeight:1.6}}>{day}</span></div></button>);})}
      </div>
    </div>
  );
}


// ── TOAST SYSTEM (global save feedback) ──────────────────────────────────────
function Toast({message,type="saved",onDone}){
  useEffect(()=>{const t=setTimeout(onDone,2400);return()=>clearTimeout(t);},[]);
  const bg={saved:`${C.sage}22`,error:`${C.rose}22`,info:`${C.gold}22`}[type]||`${C.sage}22`;
  const border={saved:C.sage,error:C.rose,info:C.gold}[type]||C.sage;
  const icon={saved:"✓",error:"✕",info:"◈"}[type]||"✓";
  return(<div style={{position:"fixed",bottom:28,left:"50%",transform:"translateX(-50%)",background:bg,border:`1px solid ${border}`,borderRadius:12,padding:"10px 20px",display:"flex",alignItems:"center",gap:9,zIndex:2000,backdropFilter:"blur(12px)",animation:"fadeUp .3s ease"}}><span style={{fontSize:13,color:border}}>{icon}</span><span style={{fontSize:12,color:C.cream,fontFamily:"'DM Sans'"}}>{message}</span></div>);
}

// ── REMINDER SYSTEM ───────────────────────────────────────────────────────────
function RemindersScreen({toast}){
  const[perms,setPerms]=useState(Notification.permission);
  const[prefs,setPrefs]=useStorage("rd:reminders",{meditation:true,checkin:true,meeting:false,medTime:"07:00",ciTime:"20:00",meetingDay:"Monday"});
  const[saved,setSaved]=useState(false);
  const requestPerms=async()=>{const p=await Notification.requestPermission();setPerms(p);};
  const save=async()=>{await setPrefs(prefs);setSaved(true);toast("Reminder preferences saved","saved");setTimeout(()=>setSaved(false),2500);};
  const testNotif=(title,body)=>{if(Notification.permission==="granted")new Notification(title,{body,icon:"/favicon.ico"});else toast("Enable notifications first","info");};
  const DAYS=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  return(
    <div className="fu"style={{maxWidth:780,margin:"0 auto",padding:"0 16px 60px"}}>
      <SH title="Reminders" subtitle="Gentle daily nudges to keep the practice alive. Your phone can be a dharma bell."/>
      <Card style={{marginBottom:13}}>
        <Tag label="Notification Permission" color={perms==="granted"?C.sage:C.amber}/>
        <p style={{fontSize:12,color:C.creamMuted,lineHeight:1.8,marginTop:8,marginBottom:11}}>{perms==="granted"?"Notifications enabled. Configure your reminders below.":perms==="denied"?"Notifications are blocked. Please enable them in your browser settings to use reminders.":"Enable notifications to receive gentle daily reminders for your practice."}</p>
        {perms!=="granted"&&perms!=="denied"&&<button onClick={requestPerms}style={{background:C.surfaceAlt,border:`1px solid ${C.amber}`,color:C.amber,borderRadius:9,padding:"9px 18px",cursor:"pointer",fontSize:12}}>Enable Notifications</button>}
        {perms==="granted"&&<span style={{fontSize:11,color:C.sage}}>✓ Active</span>}
      </Card>
      <Card style={{marginBottom:13}}>
        <Tag label="Meditation Reminder" color={C.sage}/>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:11,marginBottom:11,flexWrap:"wrap",gap:8}}>
          <p style={{fontSize:12,color:C.creamMuted}}>Daily reminder to sit</p>
          <div style={{display:"flex",gap:8,alignItems:"center"}}><input type="time"value={prefs.medTime}onChange={e=>setPrefs(p=>({...p,medTime:e.target.value}))}style={{background:C.surfaceDeep,border:`1px solid ${C.border}`,borderRadius:7,padding:"6px 10px",color:C.cream,fontSize:11,fontFamily:"'DM Sans'",outline:"none"}}/><button onClick={()=>setPrefs(p=>({...p,meditation:!p.meditation}))}style={{background:prefs.meditation?`${C.sage}22`:C.surfaceDeep,border:`1px solid ${prefs.meditation?C.sage:C.border}`,color:prefs.meditation?C.sage:C.creamMuted,borderRadius:8,padding:"6px 13px",cursor:"pointer",fontSize:11}}>{prefs.meditation?"On":"Off"}</button></div>
        </div>
        <button onClick={()=>testNotif("Recovery Dharma","Time to meditate. Even 5 minutes changes the mind.")}style={{fontSize:10,color:C.creamDim,background:"none",border:`1px solid ${C.border}`,borderRadius:6,padding:"4px 10px",cursor:"pointer"}}>Test notification</button>
      </Card>
      <Card style={{marginBottom:13}}>
        <Tag label="Daily Check-In Reminder" color={C.blue}/>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:11,marginBottom:11,flexWrap:"wrap",gap:8}}>
          <p style={{fontSize:12,color:C.creamMuted}}>Evening reminder to check in</p>
          <div style={{display:"flex",gap:8,alignItems:"center"}}><input type="time"value={prefs.ciTime}onChange={e=>setPrefs(p=>({...p,ciTime:e.target.value}))}style={{background:C.surfaceDeep,border:`1px solid ${C.border}`,borderRadius:7,padding:"6px 10px",color:C.cream,fontSize:11,fontFamily:"'DM Sans'",outline:"none"}}/><button onClick={()=>setPrefs(p=>({...p,checkin:!p.checkin}))}style={{background:prefs.checkin?`${C.blue}22`:C.surfaceDeep,border:`1px solid ${prefs.checkin?C.blue:C.border}`,color:prefs.checkin?C.blue:C.creamMuted,borderRadius:8,padding:"6px 13px",cursor:"pointer",fontSize:11}}>{prefs.checkin?"On":"Off"}</button></div>
        </div>
        <button onClick={()=>testNotif("Daily Check-In","How are you today? Take a moment to check in.")}style={{fontSize:10,color:C.creamDim,background:"none",border:`1px solid ${C.border}`,borderRadius:6,padding:"4px 10px",cursor:"pointer"}}>Test notification</button>
      </Card>
      <Card style={{marginBottom:13}}>
        <Tag label="Meeting Commitment" color={C.gold}/>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:11,marginBottom:11,flexWrap:"wrap",gap:8}}>
          <p style={{fontSize:12,color:C.creamMuted}}>Weekly meeting reminder</p>
          <div style={{display:"flex",gap:8,alignItems:"center"}}><select value={prefs.meetingDay}onChange={e=>setPrefs(p=>({...p,meetingDay:e.target.value}))}style={{background:C.surfaceDeep,border:`1px solid ${C.border}`,borderRadius:7,padding:"6px 10px",color:C.cream,fontSize:11,fontFamily:"'DM Sans'",outline:"none"}}>{DAYS.map(d=><option key={d}value={d}>{d}</option>)}</select><button onClick={()=>setPrefs(p=>({...p,meeting:!p.meeting}))}style={{background:prefs.meeting?`${C.gold}22`:C.surfaceDeep,border:`1px solid ${prefs.meeting?C.gold:C.border}`,color:prefs.meeting?C.gold:C.creamMuted,borderRadius:8,padding:"6px 13px",cursor:"pointer",fontSize:11}}>{prefs.meeting?"On":"Off"}</button></div>
        </div>
        <button onClick={()=>testNotif("Meeting Reminder","Your sangha is waiting. Connection is medicine.")}style={{fontSize:10,color:C.creamDim,background:"none",border:`1px solid ${C.border}`,borderRadius:6,padding:"4px 10px",cursor:"pointer"}}>Test notification</button>
      </Card>
      <button onClick={save}style={{background:C.surfaceAlt,border:`1px solid ${C.gold}`,color:C.gold,borderRadius:11,padding:"11px 24px",cursor:"pointer",fontSize:13,fontFamily:"'Cormorant Garamond',serif"}}>{saved?"✓ Saved":"Save preferences"}</button>
    </div>
  );
}

// ── PAWS TRACKER ──────────────────────────────────────────────────────────────
function PAWSScreen({toast}){
  const[log,setLog,loaded]=useStorage("rd:paws",[]);
  const[saving,setSaving]=useState(false);
  const[today,setToday]=useState({date:todayStr(),fatigue:0,brain_fog:0,mood:0,anxiety:0,sleep_issues:0,note:""});
  useEffect(()=>{const t=log.find(l=>l.date===todayStr());if(t)setToday(t);},[log]);
  const save=async()=>{setSaving(true);await setLog(prev=>[...prev.filter(l=>l.date!==todayStr()),today].sort((a,b)=>b.date.localeCompare(a.date)));toast("PAWS log saved","saved");setSaving(false);};
  const SYMS=[{k:"fatigue",l:"Fatigue",c:C.amber},{k:"brain_fog",l:"Brain Fog",c:C.lavender},{k:"mood",l:"Mood Swings",c:C.rose},{k:"anxiety",l:"Anxiety",c:C.blue},{k:"sleep_issues",l:"Sleep Issues",c:C.teal}];
  if(!loaded)return <div style={{padding:"60px 16px",textAlign:"center",color:C.creamMuted}}>Loading...</div>;
  return(
    <div className="fu"style={{maxWidth:780,margin:"0 auto",padding:"0 16px 60px"}}>
      <SH title="PAWS Tracker" subtitle="Post-acute withdrawal syndrome is real, common, and temporary. Understanding it is protective."/>
      <Card style={{marginBottom:13}}><Tag label="What is PAWS?" color={C.teal}/><p style={{fontSize:13,color:C.creamMuted,lineHeight:1.85,marginTop:8}}>Post-Acute Withdrawal Syndrome (PAWS) is a set of symptoms that persist weeks to months after the acute withdrawal phase. They arise because the brain, which adapted to the substance, now needs time to reregulate. Symptoms are intermittent and unpredictable — good days followed by bad days — which can be demoralizing and confusing. Knowing this is PAWS — not evidence that recovery doesn't work — changes everything.</p><div style={{marginTop:11,display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:7}}>{[{t:"Common symptoms",d:"Fatigue, brain fog, mood instability, anxiety, sleep disturbance, difficulty concentrating, reduced emotional response, craving spikes"},{t:"Timeline",d:"Most acute in the first 1–3 months. Can persist up to 2 years in some cases, especially with alcohol and benzodiazepines. Generally resolves with time and practice."},{t:"What helps",d:"Consistent sleep, regular exercise, daily meditation, nutrition, avoiding stress, maintaining the sangha. Symptoms often worsen with stress and improve with rest."},{t:"When to seek help",d:"If symptoms are severe, persistent, or include suicidal ideation — speak to a medical professional. PAWS is manageable with support."}].map((t,i)=><div key={i}style={{background:C.surfaceDeep,borderRadius:8,padding:"10px 12px"}}><div style={{fontSize:11,color:C.teal,marginBottom:3,fontWeight:500}}>{t.t}</div><p style={{fontSize:11,color:C.creamMuted,lineHeight:1.7}}>{t.d}</p></div>)}</div></Card>
      <Card style={{marginBottom:13}}><Tag label={`Today's PAWS Log — ${fmtShort(todayStr())}`} color={C.teal}/><div style={{display:"grid",gap:12,marginTop:12}}>{SYMS.map(s=><div key={s.k}><div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{fontSize:11,color:C.creamMuted}}>{s.l}</span><span style={{fontSize:12,color:today[s.k]>6?C.rose:today[s.k]>3?C.amber:C.sage}}>{today[s.k]===0?"None":`${today[s.k]}/10`}</span></div><input type="range"min={0}max={10}value={today[s.k]}onChange={e=>setToday(p=>({...p,[s.k]:Number(e.target.value)}))}style={{width:"100%",accentColor:s.c,cursor:"pointer"}}/></div>)}</div><textarea value={today.note}onChange={e=>setToday(p=>({...p,note:e.target.value}))}placeholder="Any notes about today's symptoms or what helped..."style={{width:"100%",minHeight:70,background:C.surfaceDeep,border:`1px solid ${C.border}`,borderRadius:8,padding:"8px 11px",color:C.cream,fontSize:12,fontFamily:"'DM Sans'",resize:"none",outline:"none",lineHeight:1.6,margin:"11px 0 9px"}}/><button onClick={save}disabled={saving}style={{background:C.surfaceAlt,border:`1px solid ${C.teal}`,color:C.teal,borderRadius:8,padding:"8px 17px",cursor:"pointer",fontSize:11}}>{saving?"Saving...":"Save today's log"}</button></Card>
      {log.length>1&&<Card><Tag label="7-Day Trend" color={C.teal}/><div style={{marginTop:10}}>{log.slice(0,7).map((l,i)=>{const avg=((l.fatigue+l.brain_fog+l.mood+l.anxiety+l.sleep_issues)/5).toFixed(1);const col=Number(avg)>6?C.rose:Number(avg)>3?C.amber:C.sage;return(<div key={i}style={{display:"flex",gap:10,alignItems:"center",padding:"7px 0",borderBottom:i<6?`1px solid ${C.border}`:"none"}}><div style={{minWidth:65,fontSize:10,color:C.creamDim}}>{fmtShort(l.date)}</div><div style={{flex:1,height:6,background:C.surfaceDeep,borderRadius:3,overflow:"hidden"}}><div style={{width:`${Number(avg)*10}%`,height:"100%",background:col,borderRadius:3,transition:"width .5s ease"}}/></div><div style={{minWidth:28,fontSize:11,color:col,textAlign:"right"}}>{avg}</div></div>);})}</div></Card>}
    </div>
  );
}

// ── PURPOSE & ACTIVITIES ──────────────────────────────────────────────────────
function PurposeScreen({toast}){
  const[goals,setGoals,loaded]=useStorage("rd:purpose_goals",[]);
  const[acts,setActs]=useStorage("rd:activities",[]);
  const[tab,setTab]=useState("activities");
  const[addGoal,setAddGoal]=useState(false);const[gForm,setGForm]=useState({text:"",area:"Creative",timeframe:"This month"});
  const AREAS=["Creative","Physical","Social","Learning","Service","Spiritual","Professional","Personal care"];
  const AC={Creative:C.lavender,Physical:C.sage,Social:C.amber,Learning:C.blue,Service:C.gold,Spiritual:C.gold,Professional:C.teal,"Personal care":C.rose};
  const ACT_IDEAS=[
    {cat:"When bored",color:C.amber,items:["Take a 10-minute walk with no destination","Write one page of anything","Text someone in your network just to say hi","Do the RAIN practice for 10 minutes","Read one chapter of recovery literature","Make tea slowly and mindfully — every sensation"]},
    {cat:"When anxious",color:C.rose,items:["4-7-8 breathing: inhale 4, hold 7, exhale 8 (4 rounds)","Body scan: 10 minutes of slow attention from feet to crown","Cold water on wrists and face","Name 5 things you can see, 4 you can hear, 3 you can touch","Call someone — don't text. Voice connection is different.","Walk outside. Change your environment completely."]},
    {cat:"When isolated",color:C.blue,items:["Go to a Recovery Dharma meeting — any meeting","Reach out to one person from your network","Volunteer somewhere for 2 hours","Go to a coffee shop and simply be among people","Write a letter to your mentor or a sangha member","Post honestly in an online recovery community"]},
    {cat:"Purposeful activities",color:C.gold,items:["Begin one item from your workbook","Do 20 minutes of service — anything counts","Learn one new thing about Buddhism or recovery","Start the inquiry you've been avoiding","Write in your journal for 15 minutes with a prompt","Cook a real meal from scratch, with full attention"]},
    {cat:"Physical recovery",color:C.sage,items:["20-minute walk or movement practice","15 minutes of gentle stretching","Drink a full glass of water right now","Prepare one healthy meal","30 minutes of wind-down before bed (no screens)","Nap — actual rest is recovery practice"]},
  ];
  if(!loaded)return <div style={{padding:"60px 16px",textAlign:"center",color:C.creamMuted}}>Loading...</div>;
  return(
    <div className="fu"style={{maxWidth:780,margin:"0 auto",padding:"0 16px 60px"}}>
      <SH title="Purpose & Activities" subtitle="Boredom is one of the top relapse triggers. A meaningful life in recovery is not an accident — it is built deliberately."/>
      <Tabs tabs={[["activities","What to do now"],["goals","My Goals & Intentions"]]} active={tab} onSelect={setTab}/>
      {tab==="activities"&&<div>
        <Card style={{marginBottom:13,background:`linear-gradient(135deg,${C.surfaceAlt},${C.surface})`}}><Tag label="When you don't know what to do" color={C.gold}/><p style={{fontSize:13,color:C.creamMuted,lineHeight:1.8,marginTop:7}}>The empty time that used to be filled with using is now a blank space that recovery must fill. This is not a minor inconvenience — it is one of the primary structural vulnerabilities of early recovery. The lists below are immediate, concrete things you can do right now.</p></Card>
        {ACT_IDEAS.map((a,i)=><Card key={i}style={{marginBottom:10,borderLeft:`3px solid ${a.color}`,borderRadius:"0 12px 12px 0"}}><div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:17,color:C.cream,marginBottom:9}}>{a.cat}</div>{a.items.map((it,j)=><div key={j}style={{display:"flex",gap:9,padding:"6px 0",borderBottom:j<a.items.length-1?`1px solid ${C.border}`:"none",alignItems:"flex-start"}}><span style={{color:a.color,fontSize:11,marginTop:1,flexShrink:0}}>→</span><span style={{fontSize:12,color:C.creamMuted,lineHeight:1.65}}>{it}</span></div>)}</Card>)}
      </div>}
      {tab==="goals"&&<div>
        <Card style={{marginBottom:11}}><Tag label="On Purpose in Recovery" color={C.lavender}/><p style={{fontSize:12,color:C.creamMuted,lineHeight:1.85,marginTop:7}}>Addiction consumed the time and energy that purpose now needs to occupy. Recovery research consistently shows that people with meaningful goals and activities have significantly better long-term outcomes. This is not about being productive — it is about having something to move toward that isn't a substance. A life you want to be in is its own protection.</p></Card>
        {!addGoal?<button onClick={()=>setAddGoal(true)}style={{width:"100%",background:C.surfaceAlt,border:`1px solid ${C.lavender}`,color:C.lavender,borderRadius:12,padding:"11px",cursor:"pointer",fontSize:13,marginBottom:11,fontFamily:"'Cormorant Garamond',serif"}}>+ Add a goal or intention</button>:<Card style={{marginBottom:11,borderColor:C.lavender}}><div style={{display:"grid",gap:9,marginTop:6}}><input value={gForm.text}onChange={e=>setGForm(f=>({...f,text:e.target.value}))}placeholder="What do you want to build, begin, or cultivate?"style={{background:C.surfaceDeep,border:`1px solid ${C.border}`,borderRadius:8,padding:"8px 11px",color:C.cream,fontSize:12,fontFamily:"'DM Sans'",outline:"none"}}/><div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{AREAS.map(a=><button key={a}onClick={()=>setGForm(f=>({...f,area:a}))}style={{padding:"4px 9px",borderRadius:6,border:`1px solid ${gForm.area===a?AC[a]:C.border}`,background:gForm.area===a?`${AC[a]}22`:C.surfaceDeep,color:gForm.area===a?AC[a]:C.creamMuted,cursor:"pointer",fontSize:10,fontFamily:"'DM Sans'"}}>{a}</button>)}</div><select value={gForm.timeframe}onChange={e=>setGForm(f=>({...f,timeframe:e.target.value}))}style={{background:C.surfaceDeep,border:`1px solid ${C.border}`,borderRadius:8,padding:"7px 11px",color:C.cream,fontSize:11,fontFamily:"'DM Sans'",outline:"none"}}>{["This week","This month","This season","This year","Ongoing"].map(t=><option key={t}value={t}>{t}</option>)}</select></div><div style={{display:"flex",gap:8,marginTop:10}}><button onClick={async()=>{if(gForm.text.trim()){await setGoals(p=>[{id:Date.now(),date:todayStr(),...gForm,done:false},...p]);setGForm({text:"",area:"Creative",timeframe:"This month"});setAddGoal(false);toast("Goal added","saved");}}}style={{background:C.surfaceAlt,border:`1px solid ${C.lavender}`,color:C.lavender,borderRadius:8,padding:"7px 14px",cursor:"pointer",fontSize:11}}>Add</button><button onClick={()=>setAddGoal(false)}style={{background:"none",border:`1px solid ${C.border}`,color:C.creamMuted,borderRadius:8,padding:"7px 12px",cursor:"pointer",fontSize:11}}>Cancel</button></div></Card>}
        {goals.map(g=>{const col=AC[g.area]||C.lavender;return (<Card key={g.id}style={{marginBottom:8,borderLeft:`3px solid ${g.done?C.border:col}`,borderRadius:"0 12px 12px 0",opacity:g.done?.65:1}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}><div style={{flex:1}}><div style={{display:"flex",gap:7,alignItems:"center",marginBottom:3,flexWrap:"wrap"}}><Tag label={g.area} color={col}/><span style={{fontSize:10,color:C.creamDim}}>{g.timeframe}</span></div><p style={{fontSize:12,color:g.done?C.creamDim:C.cream,lineHeight:1.6}}>{g.text}</p></div><div style={{display:"flex",gap:5,marginLeft:8}}><button onClick={async()=>await setGoals(p=>p.map(x=>x.id===g.id?{...x,done:!x.done}:x))}style={{background:"none",border:`1px solid ${g.done?C.border:col}`,color:g.done?C.border:col,borderRadius:6,padding:"3px 8px",cursor:"pointer",fontSize:10}}>{g.done?"↩":"✓"}</button><button onClick={async()=>await setGoals(p=>p.filter(x=>x.id!==g.id))}style={{background:"none",border:"none",color:C.creamDim,cursor:"pointer",fontSize:11}}>✕</button></div></div></Card>);})}
        {!goals.length&&!addGoal&&<Card style={{textAlign:"center",padding:"36px 20px"}}><p style={{fontSize:12,color:C.creamMuted,lineHeight:1.8}}>No goals yet. What do you want your sober life to look like? What would you pursue if shame and craving were not running the show?</p></Card>}
      </div>}
    </div>
  );
}

// ── RELATIONSHIP REPAIR ───────────────────────────────────────────────────────
function RelationshipsScreen({toast=()=>{}}){ 
  const[tab,setTab]=useState("guide");
  return(
    <div className="fu"style={{maxWidth:780,margin:"0 auto",padding:"0 16px 60px"}}>
      <SH title="Relationships & Repair" subtitle="Addiction harms relationships. Recovery builds them — slowly, honestly, one action at a time."/>
      <Tabs tabs={[["guide","The Guide"],["communication","Communication"],["boundaries","Boundaries"]]} active={tab} onSelect={setTab}/>
      {tab==="guide"&&<Accord items={[
        {title:"Repair takes time — and that is not a failure",color:C.rose,body:`The relationships damaged by addiction did not break in a single moment, and they will not heal in one. Trust is rebuilt through consistent action over time — not through any single conversation or apology, however sincere. This is hard to hear when we are full of remorse and want immediate repair. But the people we harmed are not obligated to forgive on our timeline. Their caution is appropriate — it is evidence that they know us.\n\nThe most powerful amends is behavioral: showing up differently, consistently, over a long period of time. Words matter; patterns matter more.`},
        {title:"What people need to trust again",color:C.amber,body:`People who have been harmed by our addiction generally need to see:\n\n• Honesty — that we tell the truth even when it's uncomfortable, especially about recovery struggles\n• Consistency — that our behavior matches our words over time\n• Accountability — that we take responsibility without defensiveness or excuse\n• Stability — that we are managing our recovery reliably, not just saying we are\n• Patience — that we don't demand their forgiveness or trust before they're ready\n\nAnd they need to see these things not for a week, but for months and years. This is wise action as relationship repair.`},
        {title:"The direct conversation about recovery",color:C.sage,body:`If you haven't yet had an honest conversation with someone important to you about your recovery, consider doing it with your mentor present or at least with their guidance.\n\nWhat to address:\n• What happened — as specifically and honestly as you can bear\n• The impact on them — acknowledge it directly, without minimizing\n• What you are doing — the specific practices, not just "I'm in recovery"\n• What you need from them — not forgiveness, just patience\n• What you will do if you struggle — so they know what to expect\n\nThis conversation cannot be used to extract reassurance or forgiveness. It is an offering, not a negotiation.`},
        {title:"When someone doesn't want to repair",color:C.lavender,body:`Some relationships are not repairable — or not repairable now. Some people we harmed have made the wise decision to protect themselves by ending or limiting contact with us. Their choice is not a punishment; it is healthy self-protection.\n\nMaking amends does not guarantee receiving forgiveness. The purpose of amends is not the outcome — it is the integrity of having done it. If someone is not ready to receive an amends, the work is still yours to do: internally, through inquiry, through living differently.\n\nNot all relationships are worth repairing. Some, in recovery, we discover were never healthy — built on shared dysfunction or enabling. Part of wise action is discerning which relationships to invest in repairing and which to release.`},
        {title:"Family system healing",color:C.gold,body:`Addiction doesn't just affect individuals — it shapes families. Family members often develop their own adaptive patterns: hypervigilance, emotional shutdown, enabling, resentment, grief. These patterns don't automatically dissolve when the person in recovery begins to change.\n\nFamily therapy, when available and appropriate, can create a space for this work. If family therapy isn't available, Al-Anon and CODA (Co-Dependents Anonymous) offer family members their own recovery communities.\n\nThe most healing thing you can do for your family is to stay consistently in your own recovery. Your stability over time is the most powerful message about change.`},
      ]}/>}
      {tab==="communication"&&<div>
        <Card style={{marginBottom:11}}><Tag label="Wise Speech in Relationships" color={C.sage}/><p style={{fontSize:13,color:C.creamMuted,lineHeight:1.85,marginTop:8}}>The third factor of the Eightfold Path — wise speech — applies nowhere more directly than in relationships damaged by addiction. Wise speech means: speaking truthfully, avoiding divisiveness, speaking without cruelty, and avoiding idle chatter that obscures rather than reveals.</p></Card>
        {[{t:"When someone is angry at you",color:C.rose,b:"Listen first. Do not defend, explain, or correct. Acknowledge: 'I hear how much this has hurt you.' The impulse to defend is lobha and dosa operating as pride — it wants to minimize the harm so we feel less bad. But the person's anger is information, not an attack. Let them finish. Ask questions. When they are done, ask: 'Is there more?' Then acknowledge specifically what you heard."},
          {t:"When you need to say something hard",color:C.amber,b:"Choose your moment carefully — not when either of you is hungry, angry, tired, or in HALT+ territory. Use 'I' statements about your experience: 'I have been feeling...' not 'You make me feel...' Be specific about what you are asking for. End with a question: 'What do you need from me?'"},
          {t:"When someone asks if you're okay",color:C.sage,b:"Tell the truth. Not everything — but something true. The reflexive 'fine' is moha in social form — it maintains the surface and prevents the connection that could help. Even: 'It's been a difficult week, but I'm using my tools' is more honest and more connective than 'fine.'"},
          {t:"When you are upset but shouldn't act",color:C.lavender,b:"The RAIN practice, or any grounding practice, before an important conversation. The communication from a dysregulated state almost always makes things worse. If you feel the urge to say something that will 'win' the argument, wait. A day is almost always better than the next minute."},
        ].map((t,i)=><Card key={i}style={{marginBottom:9,borderLeft:`3px solid ${t.color}`,borderRadius:"0 11px 11px 0"}}><div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:16,color:C.cream,marginBottom:6}}>{t.t}</div><p style={{fontSize:12,color:C.creamMuted,lineHeight:1.85}}>{t.b}</p></Card>)}
      </div>}
      {tab==="boundaries"&&<Accord items={[
        {title:"What boundaries are and are not",color:C.amber,body:"A boundary is not a wall — it is the limit of what you can sustainably offer while remaining in your recovery. Boundaries are not punishments or manipulations. They are honest statements about what you need to function. 'I cannot be in that environment because it triggers craving..."},
        {title:"Identifying what you need",color:C.sage,body:"In early recovery, you may not know what you need. The inquiry practice helps here: 'What feels unsafe to me right now? What am I agreeing to that I do not have the capacity to honor? Where am I people-pleasing at the cost of my recovery?' These are not selfish questions. A perso..."},
        {title:"Communicating a limit",color:C.lavender,body:"'I care about you and I need to be honest — I can't be in that environment right now. It's about my recovery, not about you.' Clear, specific, without excessive apology or explanation. You don't need to justify your recovery needs. You need to state them."},
        {title:"When others don't respect your limits",color:C.rose,body:"If someone consistently disregards what you need for your recovery, you have two options: limit contact or accept the cost of continued exposure. Neither is easy. The support of your mentor and sangha is essential here. People who truly care about you will ultimately respect what..."},
        {title:"The enabling question",color:C.gold,body:"Am I being supported — or enabled? Support helps you stay in your recovery; enabling removes the consequences that motivate recovery. This is one of the hardest questions in relationships affected by addiction. A loved one who always bails you out, makes excuses, or minimizes you..."},
      ]}/>}
    </div>
  );
}

// ── RESOURCES ─────────────────────────────────────────────────────────────────
function ResourcesScreen(){
  const[tab,setTab]=useState("video");
  const VIDEOS=[
    {title:"Tara Brach: RAIN — Recognizing Your True Nature",channel:"Tara Brach",url:"https://www.youtube.com/results?search_query=tara+brach+RAIN+practice",dur:"45–60 min",color:C.blue,desc:"The definitive guided instruction on RAIN from its most prominent teacher. Tara Brach's integration of Buddhist psychology and clinical insight makes..."},
    {title:"Tara Brach: Working with Difficult Emotions",channel:"Tara Brach",url:"https://www.youtube.com/results?search_query=tara+brach+difficult+emotions+dharma+talk",dur:"50–60 min",color:C.blue,desc:"Dharma talks directly applicable to recovery — working skillfully with fear, shame, grief, and anger using mindfulness and compassion practices."},
    {title:"Gabor Maté: Not Why the Addiction, But Why the Pain",channel:"Various talks",url:"https://www.youtube.com/results?search_query=gabor+mate+addiction+compassion+talk",dur:"30–90 min",color:C.amber,desc:"Maté's talks on the relationship between trauma, childhood experience, and addiction. Essential context for anyone in recovery who has struggled with..."},
    {title:"Gabor Maté: The Myth of Normal",channel:"Various interviews",url:"https://www.youtube.com/results?search_query=gabor+mate+trauma+healing+2023",dur:"varies",color:C.amber,desc:"Extended interviews and talks on his most recent work — trauma, societal conditions that create addiction, and what genuine healing requires. Particul..."},
    {title:"Kristin Neff: The Power of Self-Compassion",channel:"Kristin Neff",url:"https://www.youtube.com/results?search_query=kristin+neff+self+compassion+recovery",dur:"20–50 min",color:C.rose,desc:"Research-backed self-compassion practices and the case for why kindness rather than shame drives actual behavior change. Essential for people who have..."},
    {title:"Kevin Griffin: Buddhism and Recovery",channel:"Kevin Griffin",url:"https://www.youtube.com/results?search_query=kevin+griffin+buddhism+recovery+dharma",dur:"45–60 min",color:C.sage,desc:"Kevin Griffin has taught Buddhist approaches to recovery for decades. His Tuesday classes integrate Theravāda teachings with practical recovery experi..."},
    {title:"Recovery Dharma: Introduction & Overview",channel:"Recovery Dharma",url:"https://www.youtube.com/results?search_query=recovery+dharma+introduction+program",dur:"varies",color:C.gold,desc:"Overview talks introducing the Recovery Dharma program, commitments, and Buddhist framework for people new to the program."},
    {title:"Brené Brown: The Power of Vulnerability",channel:"TED",url:"https://www.youtube.com/results?search_query=brene+brown+vulnerability+shame+ted",dur:"20 min",color:C.lavender,desc:"One of the most-watched TED talks ever — Brown's research on shame, vulnerability, and connection has direct application to the shame work that is cen..."},
    {title:"Insight Meditation: Dependent Origination",channel:"InsightMeditation Center",url:"https://www.youtube.com/results?search_query=dependent+origination+insight+meditation+talk",dur:"45–60 min",color:C.teal,desc:"In-depth dharma talks on dependent origination — the chain of causation that maps how craving arises and how it can be interrupted. Advanced content f..."},
    {title:"Johann Hari: Opposite of Addiction is Connection",channel:"TED / Various",url:"https://www.youtube.com/results?search_query=johann+hari+addiction+connection+ted",dur:"15–20 min",color:C.orange,desc:"The talk that popularized the rat park findings. Makes the case that social connection is the fundamental mechanism of recovery — not just support, bu..."},
  ];
  const AUDIO=[
    {title:"Audio Dharma — Insight Meditation Center",url:"https://audiodharma.org",color:C.gold,desc:"Thousands of free dharma talks from teachers at Insight Meditation Center, including many relevant to suffering, craving, and freedom. Free and downlo..."},
    {title:"Tara Brach Podcast",url:"https://www.tarabrach.com/talks-audio-video/",color:C.blue,desc:"Weekly dharma talks and guided meditations from one of the most important Western teachers integrating Buddhist psychology with therapeutic practice...."},
    {title:"Kevin Griffin Recordings",url:"https://kevingriffin.net/zoom-meetings/",color:C.sage,desc:"Recorded Tuesday morning classes on Buddhism and recovery. Griffin's long-term experience with both Buddhist practice and addiction recovery makes the..."},
    {title:"Recovery Dharma Online Meetings",url:"https://recoverydharma.online",color:C.amber,desc:"Recovery Dharma holds online meetings worldwide. Audio and video formats available. The best way to experience the program when in-person meetings are..."},
    {title:"Dharmagate Podcast",url:"https://podcasts.apple.com/search?term=dharma+recovery",color:C.lavender,desc:"Search for Buddhist recovery podcasts across Apple Podcasts and Spotify. Multiple programs produce regular content specifically for people using Buddh..."},
  ];
  const READING=[
    {title:"Recovery Dharma Book (Free PDF)",url:"https://recoverydharma.org/book",color:C.gold,desc:"The foundational text — available free in PDF format from recoverydarma.org. Also available as a low-cost paperback."},
    {title:"Recovery Dharma Workbook (Free PDF)",url:"https://recoverydharmaindiana.com/literature/",color:C.amber,desc:"A supplementary workbook for working through the Recovery Dharma program in structured depth."},
    {title:"In the Realm of Hungry Ghosts — Gabor Maté",url:"https://drgabormate.com/book/in-the-realm-of-hungry-ghosts/",color:C.amber,desc:"The most compassionate and evidence-based book on addiction ever written. Free chapters available at his site."},
    {title:"Self-Compassion.org — Kristin Neff",url:"https://self-compassion.org",color:C.rose,desc:"Free exercises, guided meditations, and research summaries on self-compassion practice. The test and the practices are freely available."},
    {title:"Buddhist Recovery Network",url:"https://www.buddhistrecovery.org",color:C.sage,desc:"Free downloads of resources for Buddhist-based recovery, meeting formats, and literature from multiple Buddhist recovery programs."},
    {title:"dharmaoverground.org — Meditation Resources",url:"https://dharmaoverground.org",color:C.lavender,desc:"Advanced practitioners' forum on vipassana, including extensive discussion of difficult meditation states that can arise in intensive practice — relev..."},
  ];
  return(
    <div className="fu"style={{maxWidth:780,margin:"0 auto",padding:"0 16px 60px"}}>
      <SH title="Resources" subtitle="The best free video, audio, and reading resources for deepening your practice and understanding."/>
      <Tabs tabs={[["video","Video"],["audio","Audio & Podcasts"],["reading","Reading & Websites"]]} active={tab} onSelect={setTab}/>
      {tab==="video"&&<div>{VIDEOS.map((v,i)=><Card key={i}style={{marginBottom:9,borderLeft:`3px solid ${v.color}`,borderRadius:"0 12px 12px 0"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:5,flexWrap:"wrap",gap:4}}><div><div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:16,color:C.cream,marginBottom:2}}>{v.title}</div><div style={{fontSize:10,color:v.color}}>{v.channel} · {v.dur}</div></div><a href={v.url}target="_blank"rel="noreferrer"style={{display:"inline-flex",alignItems:"center",gap:4,background:`${v.color}18`,border:`1px solid ${v.color}44`,color:v.color,borderRadius:7,padding:"5px 10px",textDecoration:"none",fontSize:10,flexShrink:0}}>Watch →</a></div><p style={{fontSize:11,color:C.creamMuted,lineHeight:1.7}}>{v.desc}</p></Card>)}</div>}
      {tab==="audio"&&<div>{AUDIO.map((a,i)=><Card key={i}style={{marginBottom:9,borderLeft:`3px solid ${a.color}`,borderRadius:"0 12px 12px 0"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:5,flexWrap:"wrap",gap:4}}><div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:16,color:C.cream}}>{a.title}</div><a href={a.url}target="_blank"rel="noreferrer"style={{display:"inline-flex",alignItems:"center",gap:4,background:`${a.color}18`,border:`1px solid ${a.color}44`,color:a.color,borderRadius:7,padding:"5px 10px",textDecoration:"none",fontSize:10,flexShrink:0}}>Visit →</a></div><p style={{fontSize:11,color:C.creamMuted,lineHeight:1.7}}>{a.desc}</p></Card>)}</div>}
      {tab==="reading"&&<div>{READING.map((r,i)=><Card key={i}style={{marginBottom:9,borderLeft:`3px solid ${r.color}`,borderRadius:"0 12px 12px 0"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:5,flexWrap:"wrap",gap:4}}><div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:16,color:C.cream}}>{r.title}</div><a href={r.url}target="_blank"rel="noreferrer"style={{display:"inline-flex",alignItems:"center",gap:4,background:`${r.color}18`,border:`1px solid ${r.color}44`,color:r.color,borderRadius:7,padding:"5px 10px",textDecoration:"none",fontSize:10,flexShrink:0}}>Open →</a></div><p style={{fontSize:11,color:C.creamMuted,lineHeight:1.7}}>{r.desc}</p></Card>)}</div>}
    </div>
  );
}


// ── RECOVERY DHARMA BOOK ──────────────────────────────────────────────────────
const BOOK_CHAPTERS=[
  {id:"what-is",title:"What Is Recovery Dharma?",tag:"Introduction",color:C.gold,
   keyQuote:"We are not broken people trying to fix ourselves. We are human beings learning to be free.",
   text:"`Recovery Dharma is a peer-led movement using the tools of Buddhism to overcome addiction and find freedom from addictive behaviors. It is not a religious organization, though it draws on 2,500 years of Buddhist wisdom. It is not affiliated with any particular Buddhist tradition or teacher. It is a community of people who have found that the combination of meditation, inquiry, sangha, and the Noble Eightfold Path provides a genuine path to freedom from the compulsive behaviors that have caused so much suffering.\n\nThe word \"dharma\" is Sanskrit and means \"truth,\" \"phenomena,\" or \"the nature of things.\" When capitalized, Dharma usually refers to the teachings of the Buddha — the specific understanding of the nature of suffering and the path to its cessation. The dharma of Recovery Dharma, then, is this: that suffering has a cause, that cause can be understood, and that a path exists which leads to genuine freedom.\n\nRecovery Dharma is inclusive by design. It welcomes all substances and all process addictions. It does not distinguish between worse and better addictions, does not require that members label themselves addicts or alcoholics, and does not ask anyone to accept any metaphysical or spiritual belief as a condition of membership. The only requirement is willingness — willingness to practice honestly, to sit with discomfort, to participate in community, and to take your own liberation seriously.\n\nThe program is built around several interlocking elements. Meditation is the central practice — the direct method by which we train the very mind that addiction has exploited. Inquiry is the honest self-examination process through which we map the causes and patterns of our suffering. Sangha — community — provides the context of genuine connection that counters the isolation addiction creates. And the Noble Eightfold Path provides the ethical and contemplative framework within which the practice unfolds.\n\nRecovery Dharma is renunciation-based. All members commit to abstaining from the substance or behavior they identify as their primary addiction. For process addictions like food, technology, or work, renunciation means establishing thoughtful boundaries and intentions rather than complete abstinence. This renunciation is not punishment. It is the clearing away of what is obstructing the view — the first necessary step in being able to see clearly.\n\nWhat is most distinctive about Recovery Dharma is its understanding of the person in recovery. The program does not operate from a model of essential brokenness. It does not teach that you are powerless, or that your fundamental nature is damaged. Buddhist teaching holds that the fundamental nature of every being is clear, awake, and capable of liberation — temporarily obscured by the habit patterns of the conditioned mind, but never destroyed. Recovery is not becoming something you are not. It is the process of uncovering what you already are.\n\nThis is not a quick or easy path. The habits of the addicted mind are deep. The patterns of craving, aversion, and confusion are reinforced over years or decades. The practice requires patience, consistency, honesty, and the ongoing support of people who understand. But the path is real. People with every kind of addiction — people with decades of devastation behind them, mountains of shame, profound trauma — have found genuine freedom through this practice. This is what the community bears witness to. This is what is possible for each of us.\n\nThe Recovery Dharma program is free. The book is available as a free PDF. Meetings are offered at no cost, including hundreds of online meetings reaching people around the world. The program belongs to no individual; it is stewarded by a nonprofit and continually refined by the community it serves. It is, in the truest sense, a gift of the dharma.",
   reflection:["What brings you to a Buddhist-inspired approach to recovery? What does this framework offer that others have not?","What does freedom from addiction mean to you — not as abstinence, but as a quality of life? What would your days actually look like?","Can you sense any part of yourself that is larger than your addiction — something watching it, suffering from it, wanting something different? What is that?","What would you need to be willing to do, that you have not yet been willing to do, to move toward genuine freedom?"],
   practice:{title:"Beginning Where You Are",steps:["Sit quietly for 10 minutes with no agenda. Don't try to meditate correctly. Just sit and notice whatever arises.","Write one completely honest paragraph about what brought you here — not what you think you should say, but what is actually true.","Identify one thing in this program you are willing to try, even with skepticism. One practice, one meeting, one honest conversation.","Find one meeting — online or in person — and attend this week. You don't have to share. Just show up."]},
   related:["buddha","practice","sangha"]},

  {id:"buddha",title:"Awakening: The Buddha",tag:"Introduction",color:C.gold,
   keyQuote:"The Buddha was not a god. He was a human being who found a way to be free — and proved that freedom is available to all of us.",
   text:"`The Buddha was a human being. This is important. He was not a god, not a supernatural being, not a cosmic force. He was a man born in what is now southern Nepal around the fifth century BCE, who found a way to be radically free from suffering — and who spent the rest of his life teaching others how to find the same freedom. The fact that he was human is not incidental. It is the entire point. If he had been a god, his liberation would be interesting but irrelevant. Because he was human, it is available to us.\n\nHis given name was Siddhartha Gautama. He was born into a warrior-caste family of considerable privilege. His father, anxious to protect his son from a prophesied life of renunciation, surrounded him with pleasure and shielded him from suffering. Siddhartha grew up within palace walls, married, had a son. By every conventional measure, his life was fortunate.\n\nThen, in his late twenties, he ventured outside the palace walls. On four journeys known as the Four Sights, he encountered old age, sickness, death, and a wandering ascetic who seemed genuinely at peace despite everything. These encounters shattered the illusion that pleasure and privilege could protect him from the fundamental conditions of existence. They could not. No one's can.\n\nSiddhartha left the palace, left his family, and entered the life of a wandering seeker. For several years he studied under the most accomplished meditation teachers of his time, achieving the deepest states of mental absorption those teachers could offer. He was satisfied with none of it. The fundamental problem remained. Then he turned to extreme asceticism — near-starvation, bodily deprivation, endurance practices that brought him to the edge of death. Still the problem remained. He had tried both approaches the world offered: indulgence and renunciation. Neither worked.\n\nExhausted and near death, he accepted a bowl of rice from a village girl named Sujata. He sat beneath a fig tree near the town of Bodh Gaya, and resolved not to move from that spot until he understood the nature of mind and found the path to genuine freedom. The traditions describe a night of confrontation with Mara — the personification of craving and aversion and the voices that say you are not good enough, you will never be free, give up. And then, with the rising of the morning star, something broke open. He awoke. He became the Buddha — the Awakened One.\n\nWhat did he discover? At the core: that the suffering of the human mind is not inevitable. That it arises from specific, identifiable conditions. That those conditions can be understood. And that, through practice, they can be released. This is the Dharma — the teaching that flows from his awakening and that he spent the next forty-five years transmitting to everyone who would listen.\n\nFor those of us in addiction and recovery, the Buddha's story resonates in a particular way. We know what it is to try every solution and have every solution fail. We know what it is to exhaust the available options — control, willpower, geographic cures, new relationships, new circumstances — and find the problem persisting through all of them. We know the moment when, having tried everything else, we finally stop and ask: is there actually another way?\n\nThe Buddha's answer is yes. Not a quick fix. Not a cure that eliminates suffering from one's life. But a genuine path — a way of relating to experience so differently that the compulsive suffering driving addiction loses its grip. And it is available to human beings. It has been demonstrated by human beings in every generation, including people whose histories were as dark as ours.\n\nOne final thing: Buddhist teaching holds that every living being has buddha nature — the capacity for awakening. You are not excluded from this. The path is not reserved for people who are wiser, purer, or more spiritually endowed than you. It is, the tradition says, already your nature. The practice is the process of recognizing it.",
   reflection:["Have you had your own version of the Four Sights — encounters with suffering that shattered illusions and demanded a different path? What were they?","What strategies have you exhausted? What does their failure tell you?","What does it mean to you that the path to freedom has been walked by human beings with difficult histories, including people whose situations resembled yours?","What would it mean to stop running and simply look directly at what is here?"],
   practice:{title:"Meeting the Mind Directly",steps:["Sit for 15 minutes. Set a timer. Don't try to make anything happen — just observe whatever arises without judging it or following it.","After sitting, write for 5 minutes: what came up? Cravings? Plans? Memories? Just describe what you observed without analysis.","Ask yourself honestly: have you ever had a moment of genuine peace, even briefly? Write about what it was like.","Write the question: What would I be willing to change about how I am living, if I genuinely believed freedom was possible?"]},
   related:["first-truth","what-is","wise-understanding"]},

  {id:"first-truth",title:"The First Noble Truth: Suffering",tag:"The Four Noble Truths",color:C.rose,
   keyQuote:"You cannot begin to treat what you refuse to name. The First Noble Truth is the naming.",
   text:"`The First Noble Truth is dukkha. The Pali word is usually translated as suffering, but this translation is incomplete. Dukkha carries a richer meaning — it encompasses the acute suffering of pain and grief, the subtler suffering of impermanence (the way everything we love and fear will pass), and the most subtle suffering of all: the pervasive unease, the low-grade dissatisfaction, the sense that something is fundamentally off that runs through ordinary life even in its comfortable moments. Like a wheel with a slightly off-center axle, there is a wobble at the heart of things.\n\nThe First Noble Truth is the observation that this wobble is real and universal. The Buddha was not a pessimist. He was a diagnostician. He did not say that life is only suffering, or that pleasure and joy are illusions. He said: look honestly at your experience, and you will find that suffering is present, pervasive, and deeply conditioned. This is not a counsel of despair. It is the beginning of medicine.\n\nFor people who have struggled with addiction, the First Noble Truth arrives with the force of recognition. We know dukkha. We have been intimate with it for years. The dukkha of the night before a morning of withdrawal. The dukkha of shame that has no floor — that goes down and down and does not stop. The dukkha of watching yourself harm people you love and not being able to stop. The dukkha of the craving that is never finally satisfied — that takes the edge off temporarily and then demands more, so that you are always a step behind the relief you are seeking. Dukkha, in the Buddhist sense, is addiction's native environment.\n\nBut the First Noble Truth is asking something of us that goes beyond recognition. It is asking us to stop. To stop managing, numbing, rationalizing, and fleeing. To turn toward the suffering and look at it directly, without the usual defenses. This is the most counterintuitive move in recovery — and possibly the most important. Every impulse tells us to escape the pain. The First Noble Truth says: this one time, do not.\n\nWhy? Because what we cannot acknowledge, we cannot work with. The First Noble Truth is diagnostic: it names what is present so that treatment becomes possible. The suffering we have been numbing has not gone away. It has accumulated, compounded, and in many cases grown larger in the dark. Bringing it into the light of honest acknowledgment does not create more suffering — it makes the existing suffering available to be addressed.\n\nThere is a particular kind of relief that comes from finally saying: yes, this happened. Yes, this is what it was like. Yes, I caused this harm, and I felt this, and it cost this much. The relief is not the resolution of the suffering — that comes later, through practice. The relief is the ending of the enormous expenditure of energy that went into not seeing it. The First Noble Truth sets that burden down.\n\nThe instruction of the First Noble Truth in practice is this: sit with what is here. Not to fix it. Not to explain it away. Not to generate hope about the future. Just to let it be seen, clearly, as it actually is. This kind of seeing — honest, compassionate, unflinching — is itself a form of care. It is the first act of the treatment that has been waiting to begin.\n\nIn the context of Recovery Dharma, the First Noble Truth is the invitation to take inventory of suffering honestly. Not just your own suffering — though that is essential — but the suffering your addiction has caused to others. The complete accounting. The First Noble Truth says: look at all of this. Do not look away. And in the looking, discover that you can bear it. That you are larger than what you see. That the seeing itself is the beginning of freedom.",
   reflection:["What forms has dukkha taken in your experience with addiction? Name specific instances — actual events, actual feelings, actual costs. Not I damaged my relationships but the specific relationship, the specific event.","What suffering have you been most reluctant to acknowledge — to yourself or to others? What has it cost you to avoid acknowledging it?","Can you distinguish between the acute suffering of events and the more subtle dukkha of the addicted mind — the unease, the craving, the sense of fundamental wrongness?","What would it be like to sit with your suffering without immediately trying to fix it, explain it, or escape it?"],
   practice:{title:"The First Noble Truth Practice: Naming",steps:["Set aside 30 minutes with a journal. At the top write: The suffering my addiction has caused. Write without stopping for 20 minutes. Be specific. Be unflinching.","Read what you wrote aloud — even if only to yourself. Let the words land.","Write a second list: The suffering I have been unwilling to acknowledge. Dig for what is still in the dark.","For the next week, when a difficult feeling arises, instead of reaching for distraction, name it. Say internally: This is suffering. This is dukkha. Nothing more — just the naming."]},
   related:["second-truth","inquiry","inquiry-appendix"]},

  {id:"second-truth",title:"The Second Noble Truth: The Cause",tag:"The Four Noble Truths",color:C.amber,
   keyQuote:"You did not become addicted because you are weak or broken. You became addicted because you have a mind with an ancient and powerful habit of grasping.",
   text:"`The Second Noble Truth is samudaya — the origin of suffering. Having diagnosed the problem, the Buddha turned to its cause. What he found is one of the most important psychological discoveries in human history: the cause of suffering is tanha, usually translated as craving or thirst. And tanha, he observed, has three forms.\n\nThe first form is craving for pleasurable experience — kama-tanha. The wish for more of what feels good: the high, the buzz, the warmth, the relief, the escape. The way the mind, having tasted something pleasant, immediately reaches for more. The way enough is never quite enough.\n\nThe second form is craving for becoming — bhava-tanha. The wish to be a different, better, more acceptable version of yourself. This is the craving that says: if I were thinner, smarter, more successful, more loved — then I would be okay. In addiction, this craving shows up as the belief that using will make you more at ease, more social, more creative, less anxious — that it will make you someone you can tolerate.\n\nThe third form is craving for non-being — vibhava-tanha. The wish to cease to exist, to make the pain stop entirely, to disappear. This is the craving underneath using that is about escape — not the escape into pleasure but the escape out of existence. In its most extreme form, this is suicidal ideation. In its more everyday form, it is the familiar wish to just not be here for a while.\n\nEvery addiction contains all three, though the proportions vary. You might use primarily to chase pleasure, or primarily to become a version of yourself you can tolerate, or primarily to stop existing for a few hours. Most likely, all three are present in varying degrees at different times. The Second Noble Truth asks you to look honestly at which of these is driving the behavior.\n\nTanha is not a personal failing. It is a structural feature of the unexamined mind — the mind that has not yet learned to be present with experience as it actually is. The evolutionary pressures that shaped human psychology created a mind endlessly oriented toward seeking pleasure and avoiding pain. This was adaptive for survival. In the context of modern addictive substances and behaviors, it creates catastrophe. The same mechanism that once helped us survive now hijacks neural reward circuits and drives compulsive, destructive repetition.\n\nUnderstanding this removes shame from the equation. You did not become addicted because you are weak, broken, or morally inferior. You became addicted because you have a mind with an ancient and powerful habit of grasping — a mind that encountered something that temporarily relieved the tension of craving, and learned to reach for it again and again. This understanding is not a reason to avoid responsibility. You are still responsible for your actions and their effects. But it means you can stop using your own nature as evidence of your inadequacy.\n\nThe Second Noble Truth also points to a specific mechanism: tanha arises wherever there is feeling-tone — vedana. All experience has a quality of pleasantness, unpleasantness, or neutrality. The conditioned mind responds to unpleasantness with aversion (trying to push it away) and to pleasantness with craving (trying to hold onto it). This reactive pattern — grasping and pushing away — is the engine of suffering. It is also what mindfulness practice directly addresses: by training the mind to be present with experience without immediately reacting to its feeling-tone, we gradually interrupt this mechanism at its source.\n\nFor people in recovery, the most liberating aspect of the Second Noble Truth is this: it is not your fault that you have cravings. The cravings arise from conditioned processes that predate your choices. But you are not powerless before them. You can learn to see them. And seeing them — clearly, non-reactively — begins to loosen their grip.",
   reflection:["What are the three modes of tanha in your addiction? Which has been strongest: craving for pleasure, craving to become someone different, craving to escape existence?","What specific feelings or states were you most consistently trying to escape? What were you trying to create?","How does understanding addiction as tanha rather than moral failure change your relationship to yourself? Is there resistance to this reframing?","Can you identify the feeling-tone that most reliably precedes your cravings — the unpleasant sensation that triggers reaching?"],
   practice:{title:"Mapping Your Tanha",steps:["Write about each of the three modes of craving in your own addiction. Be specific about how each shows up.","For the next three days, when any craving arises, pause and ask: what feeling am I trying to escape or create right now? Write the answer.","Identify the emotional state that most consistently precedes your cravings. Once identified, practice naming it when it arises.","Write one paragraph: I became addicted not because I am broken, but because... Complete this honestly."]},
   related:["first-truth","third-truth","wise-understanding","commitment-renunciation"]},

  {id:"third-truth",title:"The Third Noble Truth: The Cessation",tag:"The Four Noble Truths",color:C.sage,
   keyQuote:"When someone with a history of devastating addiction sits quietly and is genuinely at peace — they are the Third Noble Truth made visible.",
   text:"`The Third Noble Truth is nirodha — cessation, the ending of suffering. And this is the most radical and hopeful teaching in all of Buddhism: the craving that drives addiction can actually cease. Not be suppressed, not be managed indefinitely through discipline and willpower — but genuinely, authentically released. Freedom is real. Not as metaphor, not as aspiration, not as a distant ideal that only extraordinary practitioners achieve — but as something that has been experienced, in every generation, by human beings with histories no better than ours.\n\nTo understand what this means, it helps to be clear about what the Third Noble Truth is not claiming. It is not claiming the end of all difficulty. It is not claiming that pain will never come, or that loss will not happen, or that the world will rearrange itself into comfortable circumstances. These things will come. What ceases is the additional layer of suffering we generate through our reaction to them — the grasping at pleasant experience, the aversion to unpleasant experience, the story piled on top of raw sensation that multiplies difficulty into torment.\n\nThere is a word in Buddhist psychology for this additional layer. Dukkha-dukkha is the basic suffering of pain. Viparinama-dukkha is the suffering caused by the impermanence of pleasure. And sankhara-dukkha is the most subtle and pervasive form: the suffering that arises from the conditioned nature of our experience itself — the constant striving and managing and reaching that characterizes the unexamined mind. The Third Noble Truth is the cessation of this restlessness, which is the ground on which addiction grows.\n\nIn recovery, we have direct and living evidence for the Third Noble Truth. We see it in the faces of people who have been practicing for years — a quality of settledness, of being genuinely at home in their own lives, that has nothing to do with pleasant circumstances. We see it in the ability to sit with difficult feelings without immediately reaching for relief. We see it in the person who can say I am having a craving right now with the same mild observational tone they would use to say it looks like rain. This is what the Third Noble Truth points to — not the elimination of the human range of experience, but the end of being enslaved by it.\n\nThe Third Noble Truth also addresses something specific for people in early recovery: the belief that things cannot genuinely change. Many people come to this program having tried other approaches. They have attended other programs, worked other steps, been in therapy, made sincere promises to people they love. They have tried. And they have relapsed. And in the relapsing, a belief has consolidated: that this is just how things are for me, that the best I can hope for is management, not freedom. The Third Noble Truth says: that belief is mistaken.\n\nThis is not a naive promise. The Third Noble Truth does not say that freedom comes quickly or easily or without sustained practice. It says only that the direction of travel is genuine — that the path leads where it claims to lead, that people have walked it and arrived, and that the arrival is possible for you.\n\nThe question the Third Noble Truth puts to you is not are you already free? It is: can you hold open the possibility that freedom is real? Not certainty. Not belief. Just openness — the willingness to not close the door prematurely, to not decide in advance that this is as good as it gets. That openness is enough to begin.",
   reflection:["Do you believe that genuine freedom from your addiction is possible for you — not management, but genuine freedom? What gets in the way of believing that?","Have you ever experienced a period of genuine peace, even briefly? What was its quality?","Who in your recovery community is living evidence of the Third Noble Truth? What do you observe in them?","What belief about yourself would you have to release in order to hold genuine freedom as a real possibility?"],
   practice:{title:"Touching the Third Noble Truth",steps:["Find a moment today — even 60 seconds — where nothing is being craved and nothing is being resisted. Just a neutral moment of existence. Notice what that absence of craving feels like.","Write: Freedom from my addiction would feel like... Write for 10 minutes without editing. Let it be specific and sensory.","Identify one person in recovery whose freedom you believe is genuine. Write about what you observe in them.","This week, when a craving arises, hold this alongside it: This craving is impermanent. It arose from conditions. It will pass. This is not who I am."]},
   related:["fourth-truth","commitment-meditation","wise-mindfulness"]},

  {id:"fourth-truth",title:"The Fourth Noble Truth: The Path",tag:"The Four Noble Truths",color:C.gold,
   keyQuote:"The path is not a ladder to climb. It is a wheel that turns — each part strengthening every other.",
   text:"`The Fourth Noble Truth is magga — the path. Having diagnosed the problem (suffering), identified its cause (craving), and established that cessation is real, the Buddha turned to treatment: here is how you do it. This is the Noble Eightfold Path.\n\nThe Eightfold Path is often depicted as a wheel — the Dhammacakka, or Wheel of Dharma — because its eight factors are not rungs of a ladder to be ascended one by one. They are spokes of a wheel that turns together. You do not complete one before moving to the next. You enter wherever you are, and as each factor develops, it supports and refines the others. This is important to understand because many people approach recovery with a linear, completion-oriented mindset: I will get through these steps, and then I will be done. The Eightfold Path does not work that way. It is not a curriculum with a graduation. It is a practice with no ending — and no failure.\n\nThe eight factors are traditionally organized into three groups called trainings:\n\nPANNA — WISDOM includes Wise Understanding and Wise Intention. Wisdom, in the Buddhist sense, is not the accumulation of information. It is the direct, clear seeing of the nature of experience — impermanence, interdependence, the absence of a fixed self. In recovery, wisdom means seeing clearly what the addiction actually is and does, and orienting the will toward genuine well-being rather than toward the relief of compulsion.\n\nSILA — ETHICS includes Wise Speech, Wise Action, and Wise Livelihood. Ethics in this context is not about following rules to avoid punishment. It is about living in a way that reduces harm — to yourself and to others — and that creates the conditions for a stable, trustworthy life. Addiction destabilizes ethics. It creates dishonesty, broken commitments, harm to people we love. Recovery rebuilds ethics action by action, choice by choice.\n\nSAMADHI — MEDITATION includes Wise Effort, Wise Mindfulness, and Wise Concentration. The meditation training is the direct cultivation of the quality of mind that makes wisdom and ethical living sustainable. Without training the mind, we are at the mercy of its habits. With it, we develop the capacity to observe rather than react, to be present rather than compelled.\n\nThese three trainings reinforce each other in a crucial way. Ethics stabilizes the mind by reducing the disruption caused by dishonesty, harm, and broken commitments. A more stable mind can meditate more effectively. Effective meditation develops wisdom. Wisdom refines ethical perception — we become more sensitive to harm, more able to see the consequences of our actions clearly. The wheel turns. There is no beginning and no ending. You enter wherever you are, and the practice unfolds from there.\n\nThe Eightfold Path corresponds in Recovery Dharma to the Eight Commitments — the practical expressions of the path in the context of contemporary recovery. These are not commandments. They are descriptions of what a genuine recovery practice looks like — the qualities that develop naturally in a person who is practicing honestly and consistently. They are aspirations, not requirements. You do not need to be practicing them all perfectly before you belong to this community. You belong now, wherever you are on the path.\n\nWhat the Fourth Noble Truth ultimately offers is this: a specific, practical, tested answer to the question what do I do? Not just stop using, which is necessary but not sufficient. Not just believe differently, which is insufficient without changed behavior. But a comprehensive set of practices — contemplative, ethical, relational — that, practiced together and consistently, produce genuine transformation. The path has been walked. It leads where it says it leads. The only question is whether you will walk it.",
   reflection:["Looking at the three trainings — wisdom, ethics, meditation — which is strongest in your current practice? Which most needs attention?","How does understanding recovery as a path rather than a destination change your relationship to setbacks and relapses?","What does entering wherever you are mean for you specifically? Where on the path are you entering?","What would practicing consistently look like in your actual life, with your actual schedule and constraints?"],
   practice:{title:"Taking Stock of the Three Trainings",steps:["Rate your current engagement with each training from 1 to 10: Wisdom (do I see clearly what my addiction is and how it works?), Ethics (am I living in alignment with my values?), Meditation (do I have a regular practice?).","Write one sentence about where each training stands right now — not where you wish it was, but where it actually is.","Identify the single factor of the Eightfold Path that, if strengthened this month, would most support your recovery. Name one concrete action.","Find a meeting or dharma talk that addresses the factor you identified. Engage with it this week."]},
   related:["wise-understanding","commitment-meditation","wise-action"]},

  {id:"commitment-meditation",title:"Commitment 1: Meditation",tag:"The Eight Commitments",color:C.sage,
   keyQuote:"We are not meditating to relax. We are training the very mind that addiction has exploited.",
   text:"`Meditation is the first and foundational commitment of Recovery Dharma, and it is worth being very clear about why. This is not primarily about stress reduction, though a regular practice often reduces stress. It is not primarily about achieving calm or pleasant states, though these may arise. Meditation is placed first because it is the direct training of the mind — and in addiction, the mind is where the problem lives.\n\nThe addicted mind has specific characteristics: it is reactive rather than responsive; it is dominated by craving and aversion; it identifies with its thoughts and urges in a way that makes them feel like commands rather than observations; it is unable to stay present with discomfort long enough to let it pass naturally. Every aspect of this characterization can be directly addressed through consistent meditation practice — not through understanding it intellectually, but through the actual exercise of sitting, repeatedly, and working with what arises.\n\nThe basic instruction is deceptively simple: find an upright, comfortable posture on a cushion or chair, with the spine relatively erect. Set a timer for your intended period — 10 to 30 minutes is appropriate for most practitioners. Bring your attention to the physical sensations of breathing — the rise and fall of the belly, or the subtle sensation of air at the nostrils. When the mind wanders, notice that it has wandered and return to the breath. That is it.\n\nThe complexity is in the when the mind wanders part. Because the mind will wander constantly. Especially in early practice, especially for people with active craving and anxiety, the mind will not stay on the breath for more than a few seconds at a time. It will plan, fantasize, remember, worry, criticize, construct narratives, be pulled toward sounds, revisit resentments, replay conversations. This is not failure. This is the mind showing you what it does — which is precisely what you are there to observe.\n\nThe practice is not keeping the mind on the breath. The practice is noticing when the mind has wandered and returning without self-judgment. Every return is the practice. Every return strengthens the capacity for intentional attention. Over time, the quality of attention improves. The gap between wandering and returning shortens. The capacity to stay with difficult experience without immediately fleeing increases. This is the mental infrastructure that recovery requires.\n\nWorking with craving in meditation: When a craving arises during sitting, the instruction is not to fight it and not to follow it. Instead, observe it. Where is it in the body? What does it actually feel like — the heat, the tension, the hollow pull, the urgency? Name it: craving is here. Watch it rise and peak and fall. Discover, repeatedly, through direct experience, that craving is impermanent. It passes. Every time you ride a craving to its end without acting on it, you build direct evidence that you are capable of this.\n\nWorking with self-judgment: Many people in addiction carry profound self-criticism. In meditation, self-judgment often shows up as frustration with the mind's wandering. The practice is the same as with craving: observe. Notice the judgment. Notice what it feels like. Do not fight it and do not follow it. And gently, without self-flagellation, return.\n\nBuilding consistency: A ten-minute practice seven days a week is worth more than a sixty-minute practice once a week. The nervous system benefits from regularity. Choose a time — morning works well for many people — and a place, and practice there every day, even when you do not want to, even when it is difficult, even when it feels useless. Especially then. What matters is not the quality of any given session. What matters is showing up.",
   reflection:["What is your current relationship to meditation? If you have a practice, describe its qualities honestly. If you do not, what has gotten in the way?","Have you noticed any connection between meditation practice and your relationship to cravings?","What does self-judgment look like in your meditation? How does the inner critic show up?","What would it take — concretely — to establish a daily practice? What specific obstacles would you need to address?"],
   practice:{title:"Establishing a Daily Sitting Practice",steps:["Choose your time, your place, and your duration — start with 10 minutes. Write these down as a specific commitment.","For the next 21 days, sit every day at that time, in that place, for that duration. Use a timer so you are not watching the clock.","Basic instruction: bring attention to the breath, return when it wanders, without self-judgment.","After each sit, write one word or phrase describing the quality of the session. Track this over 21 days and notice what patterns emerge."]},
   related:["wise-mindfulness","wise-concentration","wise-effort","meditations-appendix"]},

  {id:"commitment-renunciation",title:"Commitment 2: Renunciation",tag:"The Eight Commitments",color:C.rose,
   keyQuote:"Renunciation is not the loss of freedom. It is the first act of reclaiming it.",
   text:"`Renunciation — the Pali word is nekkhamma — is the commitment to abstain from the substance or behavior that has been driving our addiction. It is the second commitment of Recovery Dharma, and it is foundational: without it, the other practices cannot take root. Not because using once means recovery has failed, but because the ongoing presence of the addictive substance or behavior keeps the mind in a state of chronic disruption that makes sustained practice nearly impossible.\n\nBuddhist teaching frames renunciation not as punishment but as releasing what is obstructing the view. The image used in some texts is of a person trying to read in a darkened room filled with smoke. Renunciation is not removing the candles — it is removing the smoke. It clears the space for the actual work.\n\nThe commitment to renunciation often feels, in the beginning, like loss. This is honest and should not be minimized. We are giving up the thing that has been our primary coping mechanism, often for years or decades. We are giving up the substance or behavior that has, at times, been the thing we most anticipated, most looked forward to, most relied on. Even when the cost has been catastrophic, there is grief in renunciation. That grief deserves acknowledgment.\n\nThe practice is to sit with that grief without immediately reaching for a replacement. Buddhism does not ask us to pretend we do not have cravings — the existence of craving is the Second Noble Truth, and it is not a problem to be eliminated but a pattern to be understood. Buddhism asks us to learn to be present with craving without acting on it. This is the core skill that renunciation teaches and that no other practice can substitute for: the capacity to experience desire without being compelled by it.\n\nThe most powerful tool for working with renunciation in the moment is urge surfing. When a craving arises, instead of acting on it or white-knuckling against it, you bring your full, curious, non-judgmental attention to it. Where exactly does it live in the body? What are the specific sensations — the heat, the tightening, the hollow ache, the electrical urgency? You observe it with the same interested attention you would bring to watching a thunderstorm from inside a safe building. You watch it build, peak, and — this is the crucial discovery — subside. Cravings are waves, not walls. They pass. They always pass.\n\nThe other essential practice for renunciation is understanding your trigger landscape. What specific situations, feelings, people, places, or times reliably precede the impulse to use? Boredom? Loneliness? Specific social situations? Physical sensations like hunger or fatigue? The abbreviation HALT — Hungry, Angry, Lonely, Tired — points to the most common vulnerability states. When we know our triggers, we can either avoid them (in early recovery, this is often appropriate) or prepare more deliberately for encounters with them.\n\nFor process addictions — gambling, pornography, food, technology, work — renunciation is more complex because complete abstinence from eating or from work is not possible. Here, renunciation means establishing thoughtful boundaries: what specifically am I committing to not doing? What behaviors cross a line I am willing to hold? What circumstances make me most vulnerable? Working with a mentor to define these boundaries clearly, and returning to them consistently, is how renunciation works for process addictions.\n\nRenunciation becomes liberation — not through gritting teeth, but through practice — when something genuine shifts. When, through repeated urge surfing and consistent practice, you begin to discover that you can be with discomfort without needing to resolve it chemically. That the feelings you have been running from are survivable. That the relief of not reaching for the substance is different from, and ultimately more sustaining than, the relief of using. This shift is not quick for most people. But it is real. And it is available.",
   reflection:["What has your addiction been solving for — what specific feelings or states has it been providing relief from?","What does a craving feel like in your body when you sit with it and observe it rather than acting on it?","What are your primary triggers? Make a specific list: situations, feelings, people, places, times.","What grief is present in renunciation for you? What are you genuinely saying goodbye to?"],
   practice:{title:"Urge Surfing",steps:["The next time a craving arises, set a timer for 20 minutes and commit to not acting on it for that duration.","Close your eyes. Locate the craving in your body — be specific about where the sensation is strongest.","Describe the sensation to yourself: hot or cold? Tight or hollow? Urgent or aching? Observe it as you would observe weather.","Watch it rise, peak, and fall. Note when it is strongest and when it begins to subside. After the 20 minutes, write one sentence about what you observed."]},
   related:["second-truth","wise-mindfulness","commitment-meditation"]},

  {id:"wise-understanding",title:"Commitment 3: Wise Understanding",tag:"The Eight Commitments",color:C.lavender,
   keyQuote:"When we understand that the craving mind is not who we fundamentally are, we have found an entirely new relationship with our experience.",
   text:"`Wise Understanding — samma ditthi — is the first factor of the Noble Eightfold Path and the foundation of the wisdom training. It is placed first because without it, everything else operates in the dark. Wise Understanding is not factual knowledge or intellectual cleverness. It is the direct, experiential seeing of how things actually are — specifically, seeing the nature of suffering, its causes, its cessation, and the path that leads to that cessation.\n\nIn the context of recovery, Wise Understanding has several dimensions.\n\nUnderstanding the nature of addiction: Addiction is not a character flaw or a moral failing. It is a complex condition arising from the interaction of brain chemistry, psychological patterns, and circumstances. The Second Noble Truth provides the deepest understanding: addiction is tanha made visible — the mind's ancient habit of grasping at pleasant experience and fleeing unpleasant experience, operating at full intensity around a particularly powerful object of craving. When we understand this, we can stop using our addiction as evidence of our fundamental unworthiness.\n\nUnderstanding impermanence — anicca: All conditioned phenomena arise and pass. Nothing stays. The pleasant mood will pass. The difficult feeling will pass. The craving will pass. This understanding, when it moves from intellectual proposition to verified experience — when we have actually watched cravings arise and fall, feelings come and go — transforms our relationship to experience. We do not need to resolve discomfort immediately, because we know it will pass on its own.\n\nUnderstanding suffering — dukkha: The subtler recognition that clinging to experience, trying to hold onto what we love and push away what we fear, is itself a source of suffering. This understanding is liberating because it gives us something to work with: not the circumstances of our lives, which we often cannot control, but our relationship to those circumstances, which we can train.\n\nUnderstanding non-self — anatta: This is perhaps the most counterintuitive and most important understanding in all of Buddhist practice. The self we take ourselves to be — the apparently fixed, continuous entity at the center of experience — is itself a conditioned process rather than a permanent reality. It is a river, not a stone. Constantly changing, constantly constructed from changing conditions. The craving mind that says I am an addict and I will always be this way is itself an impermanent construction. The shame that says this is who I fundamentally am is making a claim that Buddhist psychology says is mistaken.\n\nWhen we understand non-self at the level of direct experience, something crucial happens in recovery. The craving mind is no longer me. It is a pattern arising in awareness — a weather condition in consciousness, a process arising from conditions. We are the awareness in which the craving arises, not the craving itself. This shift in identification is one of the most liberating insights that practice makes available. It is not something that can be forced or manufactured; it arises through consistent practice. But it is the direction toward which all the practice is oriented.",
   reflection:["What do you now understand about your addiction that you did not understand when it began? How has that understanding changed things?","Have you ever directly experienced impermanence working in your favor — a craving that passed, a terrible feeling that lifted?","What would it mean to hold the craving mind as weather arising in awareness rather than as who I am?","What false beliefs about yourself has your addiction been built on? What would you need to examine and release?"],
   practice:{title:"Seeing Through False Beliefs",steps:["Write down the three beliefs about yourself that most strongly fuel your addiction — the ones that make using feel necessary, inevitable, or deserved.","For each belief, ask: Is this actually true? Has it always been true? Can I know with certainty that it will always be true?","Write an alternative, more accurate statement for each — not a forced positive, just a more honest assessment.","Read these more accurate statements every morning for one week. Notice if your relationship to the original belief shifts."]},
   related:["second-truth","wise-intention","fourth-truth"]},

  {id:"wise-intention",title:"Commitment 4: Wise Intention",tag:"The Eight Commitments",color:C.amber,
   keyQuote:"The practice is asking, repeatedly: what is the quality of mind from which this action arises?",
   text:"`Wise Intention — samma sankappa — is the second factor of the Eightfold Path and the second element of the wisdom training. It is the orientation of the heart — not what we think, but what we are fundamentally pointed toward. Where Wise Understanding is about seeing clearly, Wise Intention is about aligning the will with what we have seen.\n\nThe Buddha identified three dimensions of Wise Intention. The intention of renunciation — nekkhamma-sankappa — the orientation toward releasing what causes suffering rather than grasping it. The intention of non-ill-will — abyapada-sankappa — the orientation toward goodwill and compassion toward ourselves and others, rather than toward hostility, resentment, or contempt. The intention of non-harm — avihimsa-sankappa — the orientation toward reducing harm in all its forms, beginning with the harm we do to ourselves.\n\nIn recovery, Wise Intention means examining the quality of mind that underlies our choices and actions. For many of us who have lived in addiction for years, genuine intention has been largely replaced by compulsion. We do not choose to use; we are impelled to use. We do not choose to lie; the lie arises before we have consciously decided anything. The addicted mind operates largely on automatic — driven by habit, by craving, by fear of withdrawal, by the desperate management of circumstances. We have lost touch with what we actually want.\n\nReconnecting with genuine intention requires patience. It begins with asking, in the moments before action: what is driving this? Is this coming from clarity or from compulsion? From something I genuinely value, or from fear? This inquiry, practiced consistently, begins to develop a new faculty — the capacity to observe intention before acting on it, and to choose differently when the intention is unwholesome.\n\nWise Intention has an important relationship to self-compassion. The intention of non-ill-will extends to ourselves. Many people in recovery are extraordinarily harsh with themselves — carrying a self-judgment so severe and consistent that it has become the background weather of daily life. Buddhist practice does not ask us to pretend we have not caused harm, or to bypass the work of making amends, or to abandon accountability. But it asks us to hold ourselves with the same basic goodwill we would offer a suffering friend — to see our own struggling with clarity and care rather than with contempt.\n\nThe practice of Wise Intention is not about achieving perfect purity of motive. No human being has that. It is about cultivating awareness of what is actually driving us — gradually, through consistent inquiry, learning to act less from compulsion and more from genuine care. Over time, the gap between what I want to do and what I actually do narrows. Not because we have disciplined ourselves into compliance, but because the mind has been trained and the heart has been clarified. This is what wisdom in the Buddhist sense actually produces: not correct behavior enforced from the outside, but the natural expression of a mind that sees clearly and a heart that is genuinely oriented toward well-being.",
   reflection:["What are your three deepest values — not what you think your values should be, but what you actually find yourself caring about when you are being honest?","In what situations do you act most consistently from compulsion rather than from genuine intention?","What would it feel like to hold yourself with genuine goodwill — the same goodwill you would offer a suffering friend? What gets in the way?","Write about a specific moment when you acted from your deepest values rather than from fear or compulsion. What made that possible?"],
   practice:{title:"Setting Daily Intention",steps:["Each morning, before anything else, write one sentence beginning with: Today, I intend to... Make it specific, value-based, and achievable.","At midday, pause and ask: Am I acting from my intention, or from habit or fear? Notice the answer without judgment.","At day's end, write one sentence about how your intention fared. What supported it? What undermined it?","Once a week, write about the quality of goodwill you have been extending to yourself. What would it take to make it kinder?"]},
   related:["wise-understanding","wise-speech","wise-action"]},

  {id:"wise-speech",title:"Commitment 5: Wise Speech",tag:"The Eight Commitments",color:C.teal,
   keyQuote:"The internal narrative of shame and self-blame is a form of speech. It causes real harm to a real person.",
   text:"`Wise Speech — samma vaca — is the first factor of the ethics training in the Noble Eightfold Path. The Buddha identified four dimensions of speech that is not wise: lying, divisive speech, harsh speech, and idle chatter. Their four wholesome alternatives are truthfulness, speech that brings people together, kindness in speech, and speaking only what is meaningful and useful.\n\nIn addiction, speech degrades along all four dimensions. Lying becomes habitual — to cover the addiction, to manage others' reactions, to create space for the behavior to continue. Divisive speech — gossip, complaint, using communication to create alliances against others — becomes a way of managing the social environment. Harsh speech emerges from the irritability and dysregulation of active addiction. And the proportion of meaningful conversation decreases as more and more mental and verbal energy goes toward managing the addiction and its consequences.\n\nRecovery is, in significant part, the rebuilding of honest speech. The first and most foundational practice is honesty — particularly about the things that have been most carefully hidden. What we share in meetings, what we bring to a mentor, what we write in inquiry — the honest naming of what has actually happened and what we have actually felt — is not primarily therapeutic catharsis. It is the dismantling of the wall of secrecy that gives shame its power. Secrets in addiction function like pressure in a sealed container: they build. When they are spoken — clearly, to someone who can receive them without flinching — the pressure releases. This is not dramatic. It is ordinary and transformative.\n\nThe practice of Wise Speech also includes how we speak about others. Recovery requires genuine community, and community requires the kind of speech that builds rather than divides. Gossip — speaking about others' behavior in ways that are not intended to help them — is incompatible with the spirit of a healthy sangha. Not because we must pretend that everyone is perfect, but because the habit of judging and analyzing others is a distraction from the work of examining our own minds.\n\nBut perhaps the most overlooked dimension of Wise Speech in recovery is how we speak to ourselves. The internal monologue of addiction is often extraordinarily harsh — a constant stream of self-criticism, shame, and condemnation. You are weak. You will never get better. You are disgusting. Everyone would be better off without you. This internal speech is not neutral background noise. It is a constant stream of harm directed at a person who is already suffering — at you. Buddhist practice names this as a cause of suffering and addresses it directly: not by replacing the harsh speech with forced positivity, but by bringing the same clear-eyed, compassionate honesty to our relationship with ourselves that we are asked to bring to everything else.\n\nWise Speech does not mean comfortable speech. Sometimes the most skillful thing to say is difficult — a truth that needs telling, a boundary that needs stating, a harm that needs naming. Wise Speech includes the willingness to speak difficult truths with care — choosing the right moment, the right tone, the words that preserve the dignity of everyone present, including yourself. Learning this kind of honest kindness in speech — direct and caring rather than blunt and wounding, or kind and evasive — is a lifelong practice and one of the most important skills that recovery can develop.",
   reflection:["Where in your life has your speech been most distorted by addiction — in what relationships, around what topics?","What is the thing you most need to say honestly to someone in your life that you have been avoiding?","Write a transcript of the internal monologue you typically run about yourself when you have slipped or fallen short. Would you speak that way to someone you love?","What would Wise Speech with yourself sound like? Write a paragraph speaking to yourself about your addiction in the tone you would use with a suffering friend."],
   practice:{title:"Honest Speech Practice",steps:["For one week, practice this single rule: say what you mean and mean what you say. Notice every time you say something you do not mean.","Identify one thing you have been less than honest about in an important relationship. Find the right moment, find the words, and say it — with care, without cruelty.","Write a letter to yourself in the tone of a compassionate friend. What would that friend say about your struggle, your progress, your worth?","Notice your internal speech during meditation. When self-judgment arises, practice simply naming it: judgment is here — neither fighting it nor feeding it."]},
   related:["wise-action","wise-intention","inquiry"]},

  {id:"wise-action",title:"Commitment 6: Wise Action",tag:"The Eight Commitments",color:C.blue,
   keyQuote:"Integrity is not an achievement. It is built in increments — one aligned action at a time.",
   text:"`Wise Action — samma kammanta — is the second factor of the ethics training. The Buddha's original teaching identified three dimensions: refraining from taking life, refraining from taking what is not given, and refraining from sexual misconduct. Understood at their deepest level, these three precepts point to a single underlying orientation: act in ways that reduce harm and support well-being — your own and others'.\n\nFor people in recovery, Wise Action has particular urgency because addiction has typically generated a substantial gap between stated values and actual behavior. Most people who develop addictions are not, at their core, dishonest or harmful. They are people who began doing dishonest and harmful things because of the escalating demands of the addiction — the need to cover it, to maintain it, to protect it. Over time, the gap between who we know ourselves to be and how we have been behaving becomes a source of profound shame. This gap is itself one of the conditions that drives more using: we use, in part, to numb the awareness of what we have done.\n\nWise Action in recovery is the process of closing this gap — not in one dramatic gesture, but action by action, day by day, choice by choice. Every time we choose an action aligned with our values rather than with our compulsion, we build integrity. The word literally means wholeness, integration — the state in which what we believe and what we do are the same. This integration is one of the most healing things recovery produces, and it is built almost entirely through small, consistent, often mundane choices rather than through dramatic transformations.\n\nThe specific practices of Wise Action in recovery typically include: honesty in all transactions, not just the major ones; returning what has been taken, paying what is owed, following through on what we have said we will do; approaching sexual behavior with care for the well-being and consent of everyone involved, including ourselves; and making amends — the specific, concrete process of addressing harm we have caused.\n\nMaking amends is not simply apologizing. It is the combination of honest acknowledgment — saying clearly what you did and acknowledging the harm it caused — genuine attempt at repair where possible, and changed behavior going forward. Not all amends can be made directly — sometimes the person has died, or making contact would cause more harm than good. In those cases, amends can be made in other forms: living differently, offering service, contributing to the world in ways that honor the relationship.\n\nThe practice of Wise Action is not primarily about guilt or punishment. It is about freedom. The burden of accumulated harm — the things done and not addressed, the people hurt and not acknowledged, the debts unpaid — is heavy. It takes enormous ongoing energy to maintain the denial and rationalization required to keep this burden at bay. Making amends — honestly, specifically, without expectation of forgiveness — lifts that burden. Not always immediately. But it does the work that needs doing.",
   reflection:["What is the largest gap between your deepest values and your behavior during the course of your addiction? Be specific.","What is the first amend that needs making — the one you have been most avoiding? What is underneath the avoidance?","What does integrity mean to you as a felt experience? Have you ever lived a period of genuine integrity?","What concrete action could you take today that would close the gap between your values and your behavior, even slightly?"],
   practice:{title:"Building Integrity",steps:["Write a list of the three most significant harms you have caused through your addiction. For each: what specifically happened? Who was harmed and how?","For each harm, write what genuine repair would look like — what action, what acknowledgment, what changed behavior.","Choose the one amend that is most ready to be made. Take one concrete step toward making it this week.","For the next 30 days, practice one daily aligned action: one specific choice each day that closes the gap between your values and your behavior, however small."]},
   related:["inquiry","wise-speech","wise-livelihood","wise-intention"]},

  {id:"wise-livelihood",title:"Commitment 7: Wise Livelihood",tag:"The Eight Commitments",color:C.orange,
   keyQuote:"How we spend our working hours is not separate from the practice. It shapes everything.",
   text:"`Wise Livelihood — samma ajiva — extends the concern of Wise Action into the domain of how we earn our living and spend the major portion of our waking hours. The Buddha identified specific trades incompatible with ethical practice: trading in weapons, in living beings, in meat, in intoxicants, and in poison. The principle behind this list is the same in every case: these trades cause harm, and participating in them necessarily implicates the practitioner in that harm.\n\nThe contemporary application of this principle is broader. The basic question is: does my work — does the way I earn my living and the way I contribute my time and energy — support or undermine my recovery, and does it support or undermine the well-being of others?\n\nFor many people in early recovery, Wise Livelihood means practical things first. Not working in a bar if alcohol is your addiction. Not working in an environment where your substance is available and normalized. Rebuilding reliability — showing up, meeting commitments, being trustworthy with money and time — so that work becomes a domain of integrity rather than a domain of management and concealment. For someone who has been active in addiction, simply holding a job, completing tasks, being present and honest with colleagues — this is Wise Livelihood. It is more than it sounds.\n\nThere is also the question of what kind of stress work creates, and whether that stress undermines recovery. High-stress work environments, work that requires constant dishonesty or ethical compromise, work that is genuinely meaningless and deadening — all of these can create conditions that increase vulnerability to relapse. This does not mean you must immediately change your job. But it does mean examining honestly whether your work is supporting or destabilizing your practice, and beginning to orient toward a direction that is more aligned.\n\nThe deeper question that Wise Livelihood eventually asks is one of purpose and meaning. Does my work contribute something of value? Is there alignment between what I believe matters and how I spend my days? These questions may not be answerable in early recovery, when survival and stabilization are appropriately the priority. They are questions to grow into — to hold honestly as recovery deepens and life becomes more spacious.\n\nThere is also the pattern of work as escape. Many people, particularly those with high-achieving personalities, shift from substance addiction to work addiction — using busyness, productivity, and achievement to avoid feeling, to compensate for shame, to maintain a sense of worth. This is a subtle form of the same problem: using something external to manage internal experience rather than learning to be present with it. Wise Livelihood asks us to bring the same honest attention to work that we bring to everything else: is this coming from genuine engagement, or from compulsion?",
   reflection:["Does your current work support or undermine your recovery? Be specific: what about it is helpful, and what creates risk?","Have you ever used work as a way to escape feelings or numb yourself to your life? How did you know?","What would genuinely aligned work look like for you — not ideally, but as a realistic possibility in the next one to three years?","Is there any dimension of your work that requires dishonesty or causes harm? What would it take to address that?"],
   practice:{title:"Work and Recovery Inventory",steps:["Complete this sentence honestly: My current work supports my recovery by ___. It undermines my recovery by ___.","Identify the three most significant sources of work-related stress or risk for your recovery. For each, write one thing you could do to reduce that risk.","Write about your relationship to work as escape: do you use busyness to avoid your internal life? What feelings does stopping expose?","Write one paragraph about what Wise Livelihood would look like for you in three years — specific enough to be a direction, honest enough to be real."]},
   related:["wise-action","wise-intention","wise-effort"]},

  {id:"wise-effort",title:"Commitment 8: Wise Effort",tag:"The Eight Commitments",color:C.lavender,
   keyQuote:"The instruction to return gently to the breath — not yanking, not abandoning — is a model for all of recovery.",
   text:"`Wise Effort — samma vayama — is the first factor of the meditation training and one of the most nuanced concepts in Buddhist practice. The word wise does enormous work here. It is not just effort — it is effort of a specific, calibrated quality. And understanding the difference matters enormously in recovery.\n\nThe traditional formulation has four parts: the effort to prevent unwholesome states from arising; the effort to abandon unwholesome states that have already arisen; the effort to cultivate wholesome states; and the effort to maintain wholesome states. In recovery language: create conditions that support your practice and reduce vulnerability to relapse; when a craving or a destructive pattern arises, work skillfully with it rather than acting on it; actively build the practices that support recovery — meditation, community, honesty, service; and sustain those practices over time.\n\nWhat makes effort wise is its quality. Two forms of effort are not wise, and most people in addiction know both too well. The first is compulsive striving — the frantic, white-knuckled effort of fighting against craving with brute willpower. This kind of effort is exhausting and brittle. It treats recovery as a war to be won. But the mind cannot win a war against itself.\n\nThe second unwholesome form is its opposite: slack, inconsistent engagement. The pattern of commitment and abandonment that characterizes many people's early relationship to recovery. Starting with intensity, then drifting when urgency fades, then returning with shame when things go badly. This is not failure of character — it is the absence of the skill of Wise Effort.\n\nWise Effort is neither. It is steady, patient, appropriately calibrated. The meditation instruction is the perfect model: when the mind wanders, notice it has wandered, and return — gently, without self-flagellation, without drama. Not yanking attention back with frustration. Not giving up and letting the mind run wherever it wants. Just: noticing, and returning. This quality of effort — patient, persistent, non-self-punishing — is what recovery actually requires over the long term.\n\nThe gentle return quality of Wise Effort is especially important after lapses and relapses. Many people, when they stumble, respond with either extreme: harsh self-punishment — I have ruined everything, I am hopeless, what is the point — or minimization and abandonment — well, I slipped once, might as well keep going. Wise Effort is the third option: noticing clearly what happened, understanding the conditions that led to it without excessive blame or excuse, and returning to the practice. The return is the practice. The return is available at any moment, including right now.\n\nWise Effort also has a seasonal quality — it needs to be calibrated differently at different phases of recovery and different periods of life. In crisis, Wise Effort might mean doing less and asking for more support. In a stable period, it might mean deepening practice and taking on more service. In a dry period when practice feels stale, it might mean continuing to show up without expecting inspiration. Learning to read what kind of effort each moment calls for, and providing that rather than generic intense effort, is itself a form of wisdom.",
   reflection:["What quality of effort have you brought to recovery so far — compulsive striving, inconsistency, or something closer to Wise Effort?","After a lapse or setback, what do you typically do? Where does it fall between harsh self-punishment and minimization?","What would the gentle return look like in your recovery — the equivalent of returning to the breath? What would it feel like to return without self-flagellation?","What specific conditions most reliably undermine your recovery effort? What conditions support it?"],
   practice:{title:"The Return Practice",steps:["Identify one area of your recovery practice where you have been either too forceful or too slack.","Write a description of what Wise Effort would look like in that area — what would the right calibration be?","The next time you stumble in any area of practice, practice the gentle return: acknowledge it clearly, understand the conditions, and return without drama.","Track your consistency in one practice area for 30 days. Not whether every day is perfect, but whether you return after each stumble."]},
   related:["commitment-meditation","wise-mindfulness","wise-concentration"]},

  {id:"wise-mindfulness",title:"Commitment 9: Wise Mindfulness",tag:"The Eight Commitments",color:C.sage,
   keyQuote:"When we can observe our experience as experience — not be swept away by it — we have found the space in which genuine choice lives.",
   text:"`Wise Mindfulness — samma sati — is the second factor of the meditation training and one of the most fundamental practices in the Buddhist path. Sati is sometimes translated as mindfulness, sometimes as memory or presence — the quality of being fully aware of what is happening in the present moment, without being lost in reaction or absent in distraction.\n\nThe Buddha identified four foundations of mindfulness: mindfulness of the body, mindfulness of feelings or sensations, mindfulness of mind-states, and mindfulness of phenomena as they arise and pass. Each is a domain of present-moment awareness, and practicing in all four is what makes mindfulness genuinely comprehensive rather than a narrow attention technique.\n\nFor people in addiction, the significance of this practice is profound. Addiction is, at its core, a disorder of presence. We use, in many cases, specifically to not be here — to leave the present moment and its discomfort and enter a chemically altered state where things feel different. The more we use this strategy, the more intolerable the ordinary present moment becomes. We lose the capacity to simply be here, without supplementation. Mindfulness is the direct cultivation of that lost capacity.\n\nMindfulness of the body is often the entry point. The body holds tremendous information about our internal state that we habitually ignore. The tightening in the chest that signals anxiety. The hollow feeling in the stomach that is loneliness. The heat in the face that is anger. The heaviness in the limbs that is depression. For many people in addiction, the body has been a place of pain and difficulty — something to be managed, numbed, or pushed through rather than inhabited. Learning to be present with bodily sensation — to feel what is actually here without immediately reaching for something to change it — is the foundational recovery practice.\n\nMindfulness of feelings — vedana — is particularly relevant because it targets the automatic mechanism at the root of addictive behavior. The sequence is: sensation arises, it is felt as pleasant or unpleasant, the conditioned mind immediately reaches or pushes away. Mindfulness of vedana is the practice of seeing this sequence in real time, catching the moment of reaction before it has been acted on, finding the space between sensation and response in which choice lives.\n\nMindfulness of mind-states — recognizing whether the mind is contracted or expansive, clear or clouded, calm or agitated — provides the self-awareness necessary to navigate recovery effectively. When we can recognize that the mind is in a vulnerable state, when we can say I am in a lot of anxiety and craving right now rather than simply being swept along by it, we have the information needed to respond rather than react.\n\nThe formal meditation practice is one expression of mindfulness. The deeper practice is bringing this quality of present, non-judgmental awareness into every aspect of daily life: during conversations, during meals, during moments of triggering and craving, during moments of genuine well-being. Not as surveillance — not the vigilant, anxious monitoring of a guard watching for danger — but as a gentle, interested, spacious presence. Curious rather than controlling. Witnessing rather than managing. This quality of attention is the antithesis of the addicted mind's contracted, reactive mode. It is the mind discovering itself as something larger than its contents.",
   reflection:["What is your current level of moment-to-moment body awareness? Where in the body do you carry stress, craving, or difficult emotion? Do you typically notice it?","Can you identify the emotional or bodily state that most reliably precedes your cravings? If you could catch that state early and name it, would that change anything?","What would it feel like to be genuinely present with your life — not managing it, not escaping it — but simply here?","Where in your daily life could you practice informal mindfulness? Meals? Conversations? Commuting? Choose one domain and practice for a week."],
   practice:{title:"Body Scan for Craving",steps:["When a craving or difficult feeling arises: stop, close your eyes if possible, and take three deliberate breaths.","Ask: where in the body is this most present? Scan from head to feet with curiosity — locate the sensation with precision.","Name the sensation specifically: Tightening in the chest. Heat in the throat. Hollow feeling in the stomach. Stay with pure physical sensation rather than emotional labels.","Observe for 60 to 90 seconds without trying to change anything. Notice: does naming and observing the sensation shift its quality or intensity?"]},
   related:["commitment-meditation","wise-concentration","commitment-renunciation"]},

  {id:"wise-concentration",title:"Commitment 10: Wise Concentration",tag:"The Eight Commitments",color:C.gold,
   keyQuote:"The concentrated mind has something recovery most needs: the capacity to rest in experience without needing to escape it.",
   text:"`Wise Concentration — samma samadhi — is the third factor of the meditation training and the culmination of the Eightfold Path. Where mindfulness is receptive, open, and panoramic, concentration is gathered, sustained, and unifying. It is the cultivation of a deeply settled, collected, unified quality of mind through sustained meditation practice.\n\nThe Pali term for deep concentration states is jhana — sometimes translated as absorption, though this can be misleading. The jhanas are stages of increasingly refined concentration in which the mind becomes progressively quieter, cleaner, and more unified. The first jhana is characterized by directed attention, sustained attention, and joy arising from seclusion from the five senses. Deeper jhanas involve progressively greater stillness, equanimity, and purity.\n\nThese deep concentration states are not the goal for most people in recovery, and they are certainly not accessible in early practice. But the direction of travel toward which they point — a mind that can settle, that is not chronically agitated, that has developed genuine inner stability — is directly relevant to recovery. A mind that is chronically destabilized by substance use, anxiety, craving, and unprocessed emotion is a mind without the foundation for genuine insight. Developing concentration — even basic, modest concentration — creates that foundation.\n\nThe practical benefits of even modest concentration development are significant for people in recovery. When the mind has developed some capacity to settle, cravings lose some of their compulsive force. Not because they become less intense — in early recovery they are often more intense once the numbing agent is removed — but because the mind has some capacity to step back and observe rather than simply react. The urge arises. The concentrated mind sees it arising. There is space between the arising and the response. That space is where recovery happens.\n\nEquanimity is one of the fruits of developed concentration. The Pali word is upekkha. Equanimity is sometimes misunderstood as indifference — the absence of feeling. It is actually the opposite: the capacity to be fully present with experience, pleasant or unpleasant, without being disturbed or pushed into reactivity. A person with genuine equanimity can experience grief without being crushed by it, joy without being intoxicated by it, craving without being swept away by it. They are present for all of it. This is what recovery, at its deepest, looks like.\n\nClarity is another fruit: the capacity to see clearly what is actually here, without the distortion that craving and aversion create. When the mind is deeply concentrated, the ordinary mental noise quiets enough that direct, unobstructed perception becomes possible. Insights arise that could not arise in the cluttered, agitated ordinary mind. This clarity is the support for Wise Understanding — for the direct seeing that is the foundation of wisdom.\n\nConcentration develops slowly. It requires consistent practice, a relatively stable life situation, and patient effort. The instruction for building concentration in sitting practice: choose a single focus — the sensations of breathing at the nostrils is traditional — and return to it, moment after moment, with gentle persistence. When the mind wanders, return without frustration, without drama. Over weeks and months, the quality of presence at the object deepens. The settling happens. The stillness arrives.",
   reflection:["Have you ever experienced a moment of genuine mental stillness — even briefly, in meditation or in nature or in deep engagement? What was its quality?","What is your biggest obstacle to developing concentration: physical restlessness? Emotional turbulence? An overstimulated environment?","How would a more settled, concentrated mind change your relationship to cravings and triggers?","What would you need to change about your daily environment to support deeper practice?"],
   practice:{title:"Deepening Concentration",steps:["Choose one meditation session this week to specifically practice concentration. Bring all attention to the sensations of breath at the nostrils — precise, specific sensations.","Use counting to support concentration: count each exhale from 1 to 10, then start over. When you lose count, begin again at 1 without frustration.","Extend your sit by 5 minutes this week. Observe whether a longer sit allows the mind to settle more deeply in the later portion.","Practice reducing unnecessary stimulation this week: less multitasking, less background noise, less screen time in the evening. Notice any effect on the quality of your sitting."]},
   related:["commitment-meditation","wise-mindfulness","wise-effort"]},

  {id:"sangha",title:"Community: The Sangha",tag:"The Program",color:C.teal,
   keyQuote:"Addiction is a disease of disconnection. The antidote is genuine connection with people who understand.",
   text:"`The sangha — the community of practitioners — is the third of the Three Jewels of Buddhism, alongside the Buddha (the possibility of awakening) and the Dharma (the teaching). This is not an afterthought or an optional supplement to the practice. The sangha is itself a jewel — a refuge, a source of liberation. For many people in recovery, the community is the single most important element of what makes genuine recovery possible.\n\nBuddhism has always been a communal practice. The Buddha did not hand people a set of instructions and leave them to figure it out alone. He created community. He trained teachers. He established the sangha — a community of practitioners who would support each other, correct each other, challenge each other, and hold the practice alive across generations. The sangha has carried the Dharma for 2,500 years. Not individual brilliance — community.\n\nAddiction is, at its core, a disease of disconnection. It severs us from other people — through the secrecy that addiction requires, through the harm we cause, through the gradual narrowing of our world around the substance or behavior. It severs us from ourselves — from our values, our feelings, our genuine desires. It severs us from meaning — from the sense that our lives matter, that what we do has significance. The antidote to this threefold disconnection is threefold connection: with others, with ourselves through honest practice, and with something larger through the community's shared commitment to liberation.\n\nA Recovery Dharma meeting is a specific kind of container. The format is typically structured: guided meditation, readings, open sharing, and often a period of discussion. Sharing is crosstalk-free — no advice, no cross-talk, no fixing. People speak from their own experience without directing anything at others. This format creates safety: people can say what is actually true without worrying about being corrected, advised, or analyzed. Many people, often for the first time, discover they can be fully honest about what they have been and what they have done — and be met not with judgment but with recognition.\n\nThe power of this recognition cannot be overstated. When you have been carrying a story of shame — this thing I did, this way I became — and you hear someone else describe the same pattern, the same shame, something changes. The shame's claim that you are uniquely, irredeemably broken is suddenly false. Other people have been here. Other people have survived this. Other people have found their way forward. You are not the worst case. You are not alone.\n\nShow up to meetings consistently. Especially when you do not want to. Especially after a hard week when shame makes you want to hide. Especially when you feel you have not earned the right to be there. The sangha is not waiting for the polished, put-together version of you. The actual, struggling, showing-up version of you is precisely what is needed — needed by you, to receive support, and needed by the community, to see that honesty is possible.\n\nBeyond meetings, the sangha is the network of relationships formed through recovery practice. The friendships. The mentor relationships. The service partnerships. The connections formed by sitting together, sharing honestly, working through difficult questions side by side. Over time, these relationships become the fabric of a different kind of life — one in which genuine honesty is possible, genuine support is available, and genuine belonging has been found.",
   reflection:["Do you currently have a recovery community? What does your relationship to it feel like — close or distant, trusting or guarded?","What prevents you from being fully honest in community? What are you most afraid people will find if you show up as you actually are?","Can you identify the moment when shame makes you most want to withdraw from community? What would it take to do the opposite — to move toward connection precisely in that moment?","What have you received from community in recovery, even if imperfect community? What would you have been unable to find alone?"],
   practice:{title:"Showing Up",steps:["Attend one meeting this week that you would normally skip — whether because of schedule, resistance, shame, or inertia.","In that meeting, share something real — not just a safe or generic share, but something that actually touches what is alive for you right now.","After the meeting, introduce yourself to someone you do not know. Exchange contact information.","Identify one person in your recovery community whose path you admire. Consider asking them to be a mentor or simply asking them to coffee."]},
   related:["mentorship","service","what-is"]},

  {id:"inquiry",title:"Inquiry",tag:"The Program",color:C.lavender,
   keyQuote:"The unburdening of what has been kept in the dark is itself a form of liberation.",
   text:"`Inquiry is Recovery Dharma's structured process of written self-examination — the equivalent of step work in other traditions, approached through the lens of Buddhist psychology. It is a sustained, honest, written investigation of our experience, our patterns, the causes of our suffering, and the harms we have caused and received.\n\nThe purpose of inquiry is not to generate insight as an intellectual exercise. It is to bring into the light what has been kept in the dark — not because the light is comfortable, but because what remains hidden retains its power. Secrets in addiction are not neutral. They are fuel. The shame of what we have done, kept secret, grows. The harm we have caused, unacknowledged, compounds. The patterns that drove the addiction, unexamined, continue driving us. Inquiry addresses all of this directly.\n\nThe inquiry process typically moves through several major areas, worked through over weeks or months with a mentor or trusted friend:\n\nTHE FIRST NOBLE TRUTH — SUFFERING: A complete, specific, unflinching inventory of the suffering your addiction has caused. Not the suffering of others — that comes later — but your own. What has the addiction cost you? List everything: health, years, relationships, financial stability, professional opportunities, self-respect, the things you have lost, the things you have missed. Then the suffering caused to others: for each significant relationship, what specifically did you do, what harm resulted, what was the cost to them?\n\nTHE SECOND NOBLE TRUTH — CRAVING: A map of the craving and aversion at the root of compulsive behavior. What specific feelings were you most consistently trying to escape? What were you trying to achieve? What beliefs about yourself and the world drove the behavior — the beliefs that made using feel necessary, inevitable, or deserved? Where did these beliefs come from?\n\nHARMS: A specific inventory of people harmed through the addiction. Not a generic I was not present for my family — but specific events, specific harms, specific costs. For each person: what did you do? What harm resulted? What does genuine repair look like, if it is possible?\n\nAMENDS: An honest assessment of what genuine repair requires. What amends are you most afraid to make? What is underneath the fear — shame? Fear of consequences? The belief that the harm is actually the other person's fault? What would making each amend actually require of you?\n\nTHE PATH FORWARD: What does your life look like in one year if you practice consistently? What are the specific obstacles you will face, and what is your plan for each? What do you most need from your community?\n\nThe inquiry process is done in writing because writing externalizes what has been internal. It makes thought visible and therefore examinable. Vague feelings of shame become specific events that can be addressed. Generalized guilt becomes particular harms that can be made right. The process is done with a mentor because saying it aloud to another person completes the circuit — something acknowledged only privately remains only partially seen.\n\nWhat most people find on the other side of thorough inquiry is not what they feared. They expected more shame, more condemnation. What they found instead was relief — the unmistakable, physical relief of having put down a very heavy burden. The burden is not the facts of what happened. The burden is the energy required to keep those facts from being seen. Inquiry ends that. What remains, after the seeing, is surprisingly workable.",
   reflection:["Is there a part of your history that you have been most afraid to examine honestly? What are you afraid will happen if you look at it directly?","What has been the cost of keeping certain things in the dark — to you, and to people who care about you?","Have you ever experienced the relief of honesty — of saying something difficult and true to someone who could receive it? What was that like?","What would you need — what mentor, what safety, what commitment — to do a thorough inquiry process?"],
   practice:{title:"Beginning Inquiry",steps:["Begin with the First Noble Truth. Set aside one hour with a journal. Write for the full hour on this prompt: The ways my addiction has caused suffering — to myself and to others. Be specific. Do not stop to judge what you write.","Read what you wrote to a mentor or trusted person in your sangha. Do not edit it first.","After sharing, write one paragraph: What I discovered by saying this aloud was...","Schedule your next inquiry session. Commit to a mentor. Make a specific plan for working through the inquiry questions over the coming weeks."]},
   related:["wise-speech","wise-action","mentorship","inquiry-appendix"]},

  {id:"mentorship",title:"Working with a Mentor",tag:"The Program",color:C.amber,
   keyQuote:"A mentor does not have all the answers. They have walked a hard path and are willing to walk alongside you on yours.",
   text:"`A mentor in Recovery Dharma is someone with sustained, genuine recovery experience who agrees to walk alongside a newer practitioner through the inquiry process and the development of their practice. The relationship is collaborative — the mentor shares their experience, offers questions for reflection, provides accountability, and accompanies the other person through the territory that recovery requires navigating.\n\nThe mentor relationship differs from the sponsor relationship in many 12-step programs in a few important ways. A Recovery Dharma mentor does not direct the process or prescribe exactly what work needs to be done, in what order, according to a predetermined structure. The relationship is more like walking alongside than leading the way. The mentor brings genuine experience of what the path is like; the mentee brings the honesty and willingness to do the work; together they work through the inquiry questions, the difficult places, the resistance, and the gradually expanding capacity for genuine honesty.\n\nA mentor is not a therapist. The mentor relationship is bounded — it is about recovery practice, not a comprehensive relationship that covers every aspect of life. It does not substitute for therapy, medical care, or the full support of the sangha community. What it offers that nothing else exactly replicates is peer support from someone who has walked a similar path — who knows from the inside what the practice requires, who has sat with the particular shame and confusion of this work, and who is willing to offer that knowledge as a gift.\n\nFinding a mentor means asking someone whose recovery you genuinely admire — not just their sobriety, but the quality of their presence and their honesty. The conversation is simple: would you be willing to work through inquiry with me? A mentor can decline. They can also pass along what they know from their own experience. The relationship is bounded: it is about recovery practice, not a comprehensive life coaching arrangement.\n\nIn practice, a mentor relationship typically involves meeting regularly — once a week in active inquiry work, less often as the relationship matures — and working through the inquiry questions section by section. The mentor listens. They do not judge, advise on non-recovery matters, or try to fix. They may ask clarifying questions to help the person go deeper. They bear witness to what is being shared. This witnessing is itself profoundly healing — having one's truth seen clearly and received with compassion rather than judgment is something many people in addiction have never experienced.\n\nIf no formal mentor is immediately available, a wise and trusted friend in the sangha, a therapist informed by Buddhist psychology, or regular participation in meetings can partially fill this function while you look. The spirit of mentorship — being accompanied honestly through difficult territory — can be cultivated in multiple relationships. What matters is that you are not navigating recovery entirely alone.\n\nThe practice of becoming a mentor is itself a part of recovery. The service of accompanying someone through the work you have done yourself is one of the most powerful ways of integrating what the path has taught you — and one of the most reliable antidotes to the self-obsession that addiction creates and that recovery must address. If you have sustained recovery and have not yet offered mentorship, consider whether it might be time to do so.",
   reflection:["Do you currently have a mentor or trusted guide in recovery? What does that relationship give you?","What makes it difficult to ask for support? What beliefs get in the way of being accompanied?","Who in your sangha might be a good mentor? What would it take for you to ask?","If you have sustained recovery, have you considered offering mentorship? What gets in the way?"],
   practice:{title:"Finding or Deepening Mentorship",steps:["If you do not have a mentor: identify one person whose recovery you genuinely admire. Ask them this week — the worst they can say is no.","If you do have a mentor: bring one honest thing to your next conversation that you have been holding back. Something you have been protecting.","After your next meeting with a mentor or trusted friend in recovery, write one thing that landed — that shifted something, however slightly.","If you have sustained recovery: identify one person in the community who might benefit from your experience. Offer something, even informally."]},
   related:["sangha","inquiry","service"]},

  {id:"service",title:"Service",tag:"The Program",color:C.gold,
   keyQuote:"When we carry the message, we remind ourselves — and each other — that the lineage of liberation continues, hand to hand.",
   text:"`Service is giving back to the community and the program that supported your recovery. In Recovery Dharma, service can mean many things: helping set up a meeting room, greeting newcomers warmly, becoming a mentor, leading a guided meditation, facilitating a meeting, serving on a literature committee, or supporting the organization in practical ways. Service is considered essential to sustained recovery — not a nice addition to the program, but a core element of it.\n\nThe reasons are both practical and philosophical. Practically, service is one of the most reliable antidotes to the self-obsession that addiction produces and that early recovery intensifies. The addicted mind is relentlessly self-focused — will I get what I need? will I have to feel what I do not want to feel? Service redirects attention outward. It engages the parts of us that hunger for purpose and connection. There is a neurological reality here: helping others activates systems in the brain associated with reward and belonging — the same systems that craving targets — but without the destructive aftermath.\n\nPhilosophically, Buddhist practice leads, over time, to a recognition of interconnection — the understanding that we exist only in relationship to everything and everyone else. This understanding is not just intellectual. It becomes embodied: felt in the texture of daily life, expressed naturally in how we relate to others. Service is acting from that recognition. It is the living expression of a wisdom that began as intellectual understanding and has become embodied practice.\n\nService in the sangha also has a specific function for people with the experience of sustained recovery: it provides an opportunity to revisit, from the other side, the territory that recovery requires. When we sit with someone in the early days of their inquiry, when we listen to them describe the shame and confusion of early recovery, we reconnect with our own experience of that territory. We remember what it took. We remember who was there for us. The gratitude that arises is not abstract — it is specific, grounded, and motivating.\n\nWhen we carry the message to someone new, we also remind ourselves of where we began. We remember the person we were before recovery. We remember who met us with compassion rather than judgment. We remember that someone showed up for us. This is how the lineage of liberation continues — from person to person, meeting by meeting, in the daily work of showing up for each other.\n\nService should be calibrated to your capacity. In early recovery, the primary service is showing up — to meetings, to your own practice, to the commitments you have made. As recovery stabilizes, more active forms of service become possible and appropriate. The invitation is to gradually expand what you offer as your capacity to offer it grows — not from obligation, but from the genuine recognition that you have received something worth passing on.",
   reflection:["What service do you currently offer in recovery — formal or informal? What does it feel like to offer it?","What would it mean to take on more service? What gets in the way — time, energy, feeling unqualified?","Think of someone who showed up for you in recovery. What did their service mean to you? What did it make possible?","What specific form of service might be most aligned with your skills, your time, and your current capacity?"],
   practice:{title:"One Act of Service",steps:["This week: arrive 15 minutes early to a meeting and offer to help set up. Stay 15 minutes after and help clean up.","Approach one newcomer after a meeting and offer a genuine welcome — not advice, just presence and acknowledgment.","Ask a meeting coordinator if there is any regular service role you could take on, however small.","If you have never shared at a meeting, share once this week — not because it will be perfect, but because your honesty is a form of service to the people who hear it."]},
   related:["sangha","mentorship","practice"]},

  {id:"practice",title:"The Practice",tag:"The Program",color:C.sage,
   keyQuote:"We do not practice in order to arrive. We practice because this is the path, and the path is what we have.",
   text:"`The Practice is the core statement read at the beginning of Recovery Dharma meetings. It distills the essential commitments of the program into a declaration that is both practical and aspirational — a description of what we are doing and what we are working toward. It is worth reading slowly, as if for the first time, and sitting with what it means.\n\nThe full text of The Practice reads: We commit to abstain from using our substance or participating in our addictive behavior. We commit to a daily meditation practice to cultivate mindfulness, compassion, and insight. We commit to renunciation, beginning with abstaining from the substance or behavior that has caused suffering, and we commit to bringing the process of inquiry to all aspects of our lives. We connect with our community, the sangha, to support our recovery and to offer our experience, strength, and hope to others. We work with a mentor through the process of inquiry to examine the causes and conditions of our suffering. We commit to refining our ethical conduct through a continuous practice of the Noble Eightfold Path, and specifically through the commitments of wise understanding, wise intention, wise speech, wise action, wise livelihood, wise effort, wise mindfulness, and wise concentration. We commit to the cultivation of wisdom and compassion for ourselves and all beings.\n\nSeveral things are worth noting about this statement. First, it frames recovery as a set of commitments rather than a set of prohibitions. The emphasis is on what we are moving toward — wisdom, compassion, ethical conduct, community — rather than what we are running away from. The addiction and its cessation are named, but they are not the frame. They are the starting point.\n\nSecond, it frames recovery as a practice — something ongoing, iterative, without a final destination at which we arrive and declare ourselves complete. This is distinctly different from frameworks that focus on recovery as a permanent state to be maintained. Recovery Dharma follows the Buddhist understanding: practice is not a problem to be solved but a way of living to be cultivated continuously, for as long as we live.\n\nThird, it names community as essential. The connection with sangha is not presented as optional support for those who want it — it is listed as a core element of the practice itself, alongside meditation and ethical conduct. This reflects the Buddhist understanding that liberation is not a private achievement but a communal one — that we awaken together or not at all.\n\nFourth, it names wisdom and compassion as the culminating goals — not sobriety, not functioning well in the world, not happiness, though all of these may come. The deepest aspiration is the cultivation of clear seeing and genuine care — for ourselves and for all beings. This is the horizon toward which the practice is oriented: not recovery as an end state, but recovery as the ground on which genuine human flourishing becomes possible.\n\nReading The Practice regularly — not as a rote recitation but as a sincere reflection — keeps us in contact with the full scope of what we are undertaking. It is easy, in the management of day-to-day recovery, to narrow the practice to its minimal elements. The Practice invites us, again and again, back to the whole.",
   reflection:["What does it mean to you that recovery is a practice rather than a destination? How does this frame your relationship to setbacks?","Which element of The Practice do you most need to deepen right now — meditation, inquiry, community, ethics, or the cultivation of wisdom and compassion?","What has surprised you most about what recovery actually requires of you? What has been different from what you expected?","If you were to write your own version of The Practice — the specific commitments that matter most in your recovery right now — what would it say?"],
   practice:{title:"Reading The Practice",steps:["Read the full text of The Practice slowly, as if for the first time. Underline the sentence that feels most alive or most challenging for you today.","Write one paragraph about why that sentence matters right now — what it is asking of you, what it costs, what it promises.","Identify the element of The Practice that you have been most neglecting. Write one concrete action you will take toward it this week.","Bring The Practice to your next meeting or conversation with your mentor. Ask: where is my practice strong, and where does it most need support?"]},
   related:["sangha","commitment-meditation","fourth-truth","service"]},

  {id:"meditations-appendix",title:"Selected Meditations",tag:"Appendix",color:C.blue,
   keyQuote:"The instruction is simple: when the mind wanders, return. Everything else follows from that.",
   text:"`The Recovery Dharma book includes several foundational meditation practices. These are not techniques to be mastered but to be practiced — returned to again and again, in each session and across a lifetime. They are offered here as both instruction and invitation.\n\nBASIC BREATH MEDITATION\nFind an upright, relaxed posture — on a cushion on the floor or in a chair, with the spine relatively erect but not rigid. Set a timer for your intended period, beginning with 10 to 20 minutes. Gently close your eyes or let them rest with a soft downward gaze. Bring your attention to the physical sensations of breathing — either at the nostrils, where you can feel the slight coolness of air entering and the slight warmth of air leaving, or at the belly, where you can feel the rise and fall with each breath. Let the breath be as it naturally is. You are not trying to slow it or deepen it or change it in any way. You are simply attending to it. When the mind wanders — and it will, repeatedly, to thoughts, plans, memories, sounds, sensations — notice that it has wandered, and return, gently and without self-judgment, to the breath. This return is the practice. Not keeping the mind perfectly still, which is impossible, but returning, again and again, with patience and care. Over time, this patient returning builds the capacity for non-reactive awareness that recovery requires.\n\nMETTA — LOVINGKINDNESS\nMetta is the practice of deliberately cultivating goodwill — the sincere wish for well-being — toward yourself and toward all beings. Begin by finding a comfortable posture and taking a few settling breaths. Bring to mind yourself, and direct these phrases toward yourself, slowly and sincerely: May I be safe. May I be healthy. May I be happy. May I live with ease. Hold yourself in mind as you would hold a dear friend — with genuine care. Do not worry if the feeling does not arise immediately; the intention is the practice, and the feeling follows over time. After several minutes with yourself, bring to mind a benefactor — someone who has genuinely supported you, whose goodwill toward you is clear. Direct the same phrases toward them. Then a neutral person — someone you do not know well, a stranger. Then a difficult person — someone with whom you have conflict or toward whom you feel resentment. Begin with someone mildly difficult rather than the most challenging person in your life. Finally, expand the circle outward: all beings in your neighborhood, your city, your country, the world, all directions. May all beings be safe. May all beings be healthy. May all beings be happy. May all beings live with ease. In addiction recovery, self-directed metta is particularly important. Many people arrive carrying profound self-hatred. Metta does not require warm feelings — it requires the intention, the sincere wishing-well, even when it feels mechanical. Over time, the intention becomes genuine, and the genuine goodwill toward yourself becomes the ground of genuine change.\n\nURGE SURFING\nThis practice is specifically designed for working with cravings. When a craving arises, instead of acting on it or suppressing it or fighting it, you bring your full, curious, non-judgmental attention to it as sensation. Find the craving in your body. Where exactly does it live — in the chest? The belly? The throat? The hands? Name the sensations specifically: heat, tightening, hollow ache, vibration, urgency. Bring the quality of a scientist examining something interesting to your observation. Notice the intensity of the craving as it rises. Notice when it reaches its peak. And then notice — this is the crucial discovery — that it begins to subside. Cravings are impermanent. They arise, they peak, and they pass. The average craving cycle, when you do not act on it and do not suppress it but simply observe it with full attention, lasts between 15 and 30 minutes. Every time you surf a craving to its end, you build direct experiential evidence that cravings pass — and that you are capable of riding them out. This evidence, accumulated over time, is one of the most powerful supports for sustained renunciation.\n\nBODY SCAN\nLie down or sit comfortably. Close your eyes. Beginning at the top of the head, bring your attention slowly and systematically through the entire body, moving gradually downward from the scalp to the face, the neck, the shoulders, the arms, the hands, the chest, the belly, the back, the hips, the legs, the feet, and the toes. At each area, simply notice what is present — sensation, tension, neutrality, warmth, tingling, heaviness, or simply nothing at all. You are not trying to change anything. You are not trying to relax anything. You are simply attending — bringing the light of awareness to each part of the body in turn. If you notice held tension in an area, you can experiment with allowing a gentle release on an exhale, but without forcing or demanding. The body scan cultivates the mindfulness of the body that is the foundation of all other mindfulness practice — the capacity to be present in this body, in this moment, as the ground of all experience.",
   reflection:["Which of these practices have you tried? Which feels most accessible? Which feels most challenging or most foreign?","What has been your experience of urge surfing — have you been able to ride a craving to its natural end without acting on it or suppressing it?","What does metta toward yourself feel like — genuine, mechanical, uncomfortable? What gets in the way of genuine goodwill toward yourself?","What would it take to make one of these practices a daily part of your recovery?"],
   practice:{title:"Try One New Practice",steps:["This week, add one practice from this list that you have not tried before, or have tried only briefly.","Practice it daily for seven days, even if for only 10 minutes.","Keep a simple log: date, practice, duration, and one word describing the quality of the session.","At the end of the week, write one paragraph about what you noticed — what shifted, what remained difficult, what you want to continue."]},
   related:["commitment-meditation","wise-mindfulness","commitment-renunciation"]},

  {id:"inquiry-appendix",title:"Inquiry Questions",tag:"Appendix",color:C.lavender,
   keyQuote:"These questions are not an exam. They are an invitation to the kind of honesty that sets us free.",
   text:"`These inquiry questions are drawn from and inspired by the Recovery Dharma program. They are offered as a guide for written self-examination, worked through over time with a mentor or trusted friend. Work slowly. Be specific. Return to questions that are difficult rather than moving past them. The work is not complete when you have answered every question — it is complete when you have answered every question honestly.\n\nON THE FIRST NOBLE TRUTH — SUFFERING\nWhat has your addiction cost you? List specifically, in each domain: health — what physical consequences have you experienced? Relationships — which specific relationships have been damaged or destroyed, and how? Professional life — what opportunities have you missed, what trust have you lost, what positions have you been unable to hold? Financial stability — what has been spent, lost, stolen, or squandered? Integrity — what promises have you broken, what lies have you told, what values have you violated? Years — what periods of your life do you have difficulty accounting for?\n\nWhat suffering have you caused others through your addiction? Name specific people and specific events. For each person: what did you do? What harm resulted — to them, to you, to the relationship? What do you imagine it was like to be on the receiving end of your behavior at its worst?\n\nWhat suffering have you experienced that you have never fully acknowledged to anyone — not even to yourself? What are you still carrying that has not been named?\n\nWhat forms does dukkha take in your life beyond the addiction itself? What is the relationship between your addiction and the more pervasive unease that runs beneath it?\n\nON THE SECOND NOBLE TRUTH — CRAVING\nWhat feelings, sensations, or states were you most consistently trying to escape through your addiction? Be specific about the texture of what you were running from.\n\nWhat feelings were you most consistently chasing? What did using provide that nothing else seemed to provide?\n\nWhat beliefs drove your craving — what story told you that using was necessary, inevitable, or deserved? Where did those beliefs come from? How old are they?\n\nTrace the arc of your addiction from its beginning. What was happening in your life when the addictive behavior first took hold? What need did it meet? How did it escalate?\n\nCan you identify the three modes of tanha in your addiction: craving for pleasure, craving to become someone different, craving to escape existence? Which has been most powerful?\n\nON HARMS\nMake a complete list of people you have harmed through your addiction. Do not exclude yourself from this list. For each person: What did you do? What harm resulted — in their emotional life, their physical safety, their financial stability, their relationship with you? What do you imagine this cost them?\n\nAre there harms you have been rationalizing as the other person's fault, or as less serious than they actually were? What happens when you set the rationalization aside and look at the harm directly?\n\nAre there harms to yourself that belong on this list — ways you have neglected your own health, your own safety, your own genuine needs?\n\nON AMENDS\nReview your list of harms. For each person harmed: What would genuine repair look like? Not apology — genuine repair: what acknowledgment, what action, what changed behavior?\n\nWhich amends feel impossible to make? What specifically makes them feel impossible — fear of consequences? Fear of rejection? Belief that the harm was justified? Genuine uncertainty about whether contact would cause more harm than good?\n\nAre there amends you are avoiding by reframing the situation as the other person's fault? What would it mean to take full responsibility for your part, regardless of what the other person did?\n\nWhat is the first amend you will make? What is the next one? Write a specific, realistic plan.\n\nON THE PATH FORWARD\nWhat does your life look like in one year if you practice the Eight Commitments consistently? In five years? Write specifically — not in aspirational generalities but in concrete, sensory detail.\n\nWhat obstacles are you most likely to face in sustaining practice? For each obstacle, write a specific plan for responding to it when it arises.\n\nWhat does your relationship to suffering look like now, compared to when your addiction was active? What has changed? What has not yet changed?\n\nWhat do you most need from your community right now? From your mentor? From yourself?\n\nWhat have you not yet said in this inquiry process that most needs to be said? Write it now.",
   reflection:["Which of these questions feels most important to sit with right now? Which do you most want to skip or avoid?","Is there a question you notice yourself answering quickly or superficially rather than with full honesty? What would a more honest answer look like?","Who will you work through these questions with? When will you begin, if you have not already?","What has emerged through the inquiry process so far — what has surprised you, relieved you, or asked more of you than you expected?"],
   practice:{title:"Beginning or Deepening Inquiry",steps:["Choose the section — Suffering, Craving, Harms, Amends, or Path Forward — that feels most pressing right now. This is where you begin.","Set aside 45 minutes with a journal. Write without editing, without stopping to judge what comes. Quantity over polish — the first draft of truth is more valuable than a polished version.","Read what you wrote to your mentor or trusted person before your next session. Do not wait for it to be ready — it does not need to be ready.","Return to the questions weekly, systematically, until you have worked through each section with full honesty. Then return again. The inquiry is never complete — the practice continues to deepen."]},
   related:["inquiry","wise-action","wise-speech","mentorship"]},
];

function BookScreen(){
  const[chapter,setChapter]=useState(null);
  const[search,setSearch]=useState("");
  const[filterEmotion,setFilterEmotion]=useState("All");
  const[filterNeed,setFilterNeed]=useState("All");
  const[filterTag,setFilterTag]=useState("All");
  const[tab,setTab]=useState("browse");
  const[readChapters,setReadChapters]=useStorage("rd:book_read",[]);
  const[reflectionAnswers,setReflectionAnswers]=useStorage("rd:book_reflections",{});
  const[expandedSection,setExpandedSection]=useState(null);

  const EMOTIONS=["All","lost","suffering","craving","shame","fear","anger","grief","hopeful","exhausted","lonely","confused","numb","anxious","grateful"];
  const NEEDS=["All","newcomer","understand basics","immediate help","motivation","work with shame","understand craving","meditation guidance","community","amends","relapse","trauma","find hope","deepening practice"];
  const TAGS_ALL=["All",...new Set(BOOK_CHAPTERS.map(c=>c.tag))];

  const CHAPTER_META={
    "what-is":{emotions:["lost","confused","hopeful"],needs:["newcomer","understand basics"]},
    "buddha":{emotions:["hopeful","suffering","lost"],needs:["understand basics","find hope","newcomer"]},
    "first-truth":{emotions:["suffering","shame","numb"],needs:["understand basics","immediate help"]},
    "second-truth":{emotions:["craving","confused","anxious"],needs:["understand craving","understand basics"]},
    "third-truth":{emotions:["hopeful","suffering","exhausted"],needs:["find hope","motivation","understand basics"]},
    "fourth-truth":{emotions:["hopeful","confused"],needs:["understand basics","deepening practice"]},
    "commitment-meditation":{emotions:["anxious","exhausted","confused"],needs:["meditation guidance","immediate help"]},
    "commitment-renunciation":{emotions:["craving","fear","suffering"],needs:["immediate help","understand craving","newcomer"]},
    "wise-understanding":{emotions:["confused","craving","numb"],needs:["understand basics","understand craving","deepening practice"]},
    "wise-intention":{emotions:["shame","confused","hopeful"],needs:["understand basics","work with shame","deepening practice"]},
    "wise-speech":{emotions:["shame","anger","lonely"],needs:["work with shame","amends","community"]},
    "wise-action":{emotions:["shame","fear","angry"],needs:["amends","work with shame","understand basics"]},
    "wise-livelihood":{emotions:["lost","anxious","hopeful"],needs:["newcomer","motivation","deepening practice"]},
    "wise-effort":{emotions:["exhausted","anxious","confused"],needs:["motivation","meditation guidance","deepening practice"]},
    "wise-mindfulness":{emotions:["anxious","numb","craving"],needs:["meditation guidance","understand craving","immediate help"]},
    "wise-concentration":{emotions:["exhausted","anxious","hopeful"],needs:["meditation guidance","deepening practice"]},
    "sangha":{emotions:["lonely","lost","suffering"],needs:["community","newcomer","find hope"]},
    "inquiry":{emotions:["shame","fear","anger"],needs:["work with shame","understand craving","amends"]},
    "mentorship":{emotions:["lost","lonely","confused"],needs:["newcomer","community","understand basics"]},
    "service":{emotions:["hopeful","grateful","lonely"],needs:["motivation","deepening practice","community"]},
    "practice":{emotions:["lost","hopeful","confused"],needs:["newcomer","understand basics","motivation"]},
    "meditations-appendix":{emotions:["anxious","craving","exhausted"],needs:["meditation guidance","immediate help","newcomer"]},
    "inquiry-appendix":{emotions:["shame","fear","anger","grief"],needs:["amends","work with shame","understand craving","newcomer"]},
  };

  const markRead=(id)=>{
    if(!readChapters.includes(id)) setReadChapters([...readChapters,id]);
  };

  const filtered=BOOK_CHAPTERS.filter(c=>{
    const meta=CHAPTER_META[c.id]||{emotions:[],needs:[]};
    if(filterEmotion!=="All"&&!meta.emotions.includes(filterEmotion)) return false;
    if(filterNeed!=="All"&&!meta.needs.includes(filterNeed)) return false;
    if(filterTag!=="All"&&c.tag!==filterTag) return false;
    if(search){const s=search.toLowerCase();return c.title.toLowerCase().includes(s)||c.text.toLowerCase().includes(s)||c.tag.toLowerCase().includes(s);}
    return true;
  });

  if(chapter!==null){
    const c=BOOK_CHAPTERS[chapter];
    const meta=CHAPTER_META[c.id]||{emotions:[],needs:[]};
    const isRead=readChapters.includes(c.id);
    const totalChapters=BOOK_CHAPTERS.length;
    const relatedChapters=(c.related||[]).map(id=>BOOK_CHAPTERS.find(ch=>ch.id===id)).filter(Boolean);
    const wordsPerMin=200;
    const wordCount=c.text.split(" ").length;
    const readMins=Math.max(1,Math.round(wordCount/wordsPerMin));

    const setAnswer=(qIdx,val)=>{
      const key=`${c.id}_${qIdx}`;
      setReflectionAnswers({...reflectionAnswers,[key]:val});
    };

    return (
      <div className="fu" style={{maxWidth:780,margin:"0 auto",padding:"0 0 80px"}}>
        {/* Top nav bar */}
        <div style={{position:"sticky",top:0,zIndex:10,background:C.bg,borderBottom:`1px solid ${C.border}`,padding:"10px 16px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <button onClick={()=>setChapter(null)} style={{background:"none",border:`1px solid ${C.border}`,color:C.creamMuted,borderRadius:7,padding:"6px 12px",cursor:"pointer",fontSize:11}}>← All chapters</button>
          <span style={{fontSize:10,color:C.creamDim}}>{chapter+1} of {totalChapters}</span>
          <button onClick={()=>{markRead(c.id);}} style={{background:isRead?`${C.sage}22`:"none",border:`1px solid ${isRead?C.sage:C.border}`,color:isRead?C.sage:C.creamMuted,borderRadius:7,padding:"6px 12px",cursor:"pointer",fontSize:10}}>
            {isRead?"✓ Read":"Mark read"}
          </button>
        </div>

        <div style={{padding:"0 16px"}}>
          {/* Chapter header */}
          <div style={{marginTop:22,marginBottom:18}}>
            <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:8,flexWrap:"wrap"}}>
              <Tag label={c.tag} color={c.color}/>
              <span style={{fontSize:10,color:C.creamDim}}>·</span>
              <span style={{fontSize:10,color:C.creamDim}}>{readMins} min read</span>
              {isRead&&<span style={{fontSize:9,color:C.sage,background:`${C.sage}18`,borderRadius:4,padding:"2px 7px"}}>✓ completed</span>}
            </div>
            <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:28,fontWeight:400,color:C.cream,margin:"0 0 6px",lineHeight:1.2}}>{c.title}</h2>
            <p style={{fontSize:10,color:C.creamDim,margin:0}}>Recovery Dharma · CC BY-NC-SA 4.0</p>
          </div>

          {/* Emotion/need tags */}
          {(meta.emotions.length>0||meta.needs.length>0)&&(
            <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:14}}>
              {meta.emotions.map(e=><span key={e} style={{fontSize:9,color:C.rose,background:`${C.rose}18`,borderRadius:4,padding:"2px 7px"}}>feels: {e}</span>)}
              {meta.needs.map(n=><span key={n} style={{fontSize:9,color:C.sage,background:`${C.sage}18`,borderRadius:4,padding:"2px 7px"}}>for: {n}</span>)}
            </div>
          )}

          {/* Key quote callout */}
          {c.keyQuote&&(
            <div style={{borderLeft:`4px solid ${c.color}`,background:`${c.color}12`,borderRadius:"0 10px 10px 0",padding:"14px 18px",marginBottom:18}}>
              <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:17,color:C.cream,lineHeight:1.7,margin:0,fontStyle:"italic"}}>"{c.keyQuote}"</p>
            </div>
          )}

          {/* Body text */}
          <Card style={{marginBottom:14}}>
            <p style={{fontSize:13,color:C.creamMuted,lineHeight:2,whiteSpace:"pre-line",margin:0}}>{c.text}</p>
          </Card>

          {/* Reflection section */}
          {c.reflection&&c.reflection.length>0&&(
            <Card style={{marginBottom:12,cursor:"pointer"}} onClick={()=>setExpandedSection(expandedSection==="reflection"?null:"reflection")}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div>
                  <div style={{fontSize:12,fontWeight:500,color:C.cream,marginBottom:2}}>🪞 Reflection Questions</div>
                  <div style={{fontSize:10,color:C.creamDim}}>{c.reflection.length} prompts for journaling or inquiry work</div>
                </div>
                <span style={{color:C.gold,fontSize:16}}>{expandedSection==="reflection"?"▾":"▸"}</span>
              </div>
              {expandedSection==="reflection"&&(
                <div style={{marginTop:14}} onClick={e=>e.stopPropagation()}>
                  {c.reflection.map((q,qi)=>(
                    <div key={qi} style={{marginBottom:16}}>
                      <p style={{fontSize:12,color:C.cream,lineHeight:1.7,marginBottom:6}}>{qi+1}. {q}</p>
                      <textarea
                        value={reflectionAnswers[`${c.id}_${qi}`]||""}
                        onChange={e=>setAnswer(qi,e.target.value)}
                        placeholder="Write your reflection here..."
                        style={{width:"100%",minHeight:72,background:C.surfaceDeep,border:`1px solid ${C.border}`,borderRadius:8,padding:"10px 12px",color:C.cream,fontSize:12,fontFamily:"'DM Sans'",outline:"none",resize:"vertical",lineHeight:1.6,boxSizing:"border-box"}}
                      />
                    </div>
                  ))}
                </div>
              )}
            </Card>
          )}

          {/* Practice section */}
          {c.practice&&(
            <Card style={{marginBottom:12,cursor:"pointer"}} onClick={()=>setExpandedSection(expandedSection==="practice"?null:"practice")}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div>
                  <div style={{fontSize:12,fontWeight:500,color:C.cream,marginBottom:2}}>🌱 Practice: {c.practice.title}</div>
                  <div style={{fontSize:10,color:C.creamDim}}>{c.practice.steps.length} steps · apply today</div>
                </div>
                <span style={{color:C.sage,fontSize:16}}>{expandedSection==="practice"?"▾":"▸"}</span>
              </div>
              {expandedSection==="practice"&&(
                <div style={{marginTop:14}} onClick={e=>e.stopPropagation()}>
                  {c.practice.steps.map((step,si)=>(
                    <div key={si} style={{display:"flex",gap:10,marginBottom:10,alignItems:"flex-start"}}>
                      <span style={{width:22,height:22,borderRadius:"50%",background:`${C.sage}33`,color:C.sage,fontSize:11,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1}}>{si+1}</span>
                      <p style={{fontSize:12,color:C.creamMuted,lineHeight:1.7,margin:0}}>{step}</p>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          )}

          {/* Related chapters */}
          {relatedChapters.length>0&&(
            <div style={{marginBottom:20}}>
              <p style={{fontSize:10,color:C.creamDim,marginBottom:8,letterSpacing:".08em",textTransform:"uppercase"}}>Related chapters</p>
              <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
                {relatedChapters.map(rc=>{
                  const rcIdx=BOOK_CHAPTERS.findIndex(ch=>ch.id===rc.id);
                  return(
                    <button key={rc.id} onClick={()=>{setExpandedSection(null);setChapter(rcIdx);}}
                      style={{background:C.surfaceDeep,border:`1px solid ${rc.color}44`,borderRadius:8,padding:"6px 12px",cursor:"pointer",textAlign:"left"}}>
                      <div style={{fontSize:10,color:rc.color,letterSpacing:".06em"}}>{rc.tag}</div>
                      <div style={{fontSize:11,color:C.cream,marginTop:1}}>{rc.title}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Prev / Next navigation */}
          <div style={{display:"flex",gap:8,marginTop:8}}>
            {chapter>0&&(
              <button onClick={()=>{setExpandedSection(null);setChapter(chapter-1);}}
                style={{flex:1,background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,padding:"12px 14px",cursor:"pointer",textAlign:"left"}}>
                <div style={{fontSize:9,color:C.creamDim,marginBottom:4}}>← Previous</div>
                <div style={{fontSize:12,color:C.cream,lineHeight:1.3}}>{BOOK_CHAPTERS[chapter-1].title}</div>
              </button>
            )}
            {chapter<BOOK_CHAPTERS.length-1&&(
              <button onClick={()=>{setExpandedSection(null);setChapter(chapter+1);}}
                style={{flex:1,background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,padding:"12px 14px",cursor:"pointer",textAlign:"right"}}>
                <div style={{fontSize:9,color:C.creamDim,marginBottom:4}}>Next →</div>
                <div style={{fontSize:12,color:C.cream,lineHeight:1.3}}>{BOOK_CHAPTERS[chapter+1].title}</div>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── LIST VIEW ─────────────────────────────────────────────────────────────
  const readCount=BOOK_CHAPTERS.filter(c=>readChapters.includes(c.id)).length;

  return (
    <div className="fu" style={{maxWidth:780,margin:"0 auto",padding:"0 16px 60px"}}>
      <SH title="The Recovery Dharma Book" subtitle="Chapter guides, reflections, and practices — browse by chapter, feeling, or what you need."/>
      <div style={{display:"flex",alignItems:"center",gap:10,background:C.surfaceAlt,border:`1px solid ${C.border}`,borderRadius:11,padding:"10px 14px",marginBottom:14,flexWrap:"wrap"}}>
        <div style={{flex:1,minWidth:180}}><div style={{fontSize:11,color:C.creamMuted,lineHeight:1.7}}>Based on <em style={{color:C.cream,fontFamily:"'Cormorant Garamond',serif"}}>Recovery Dharma</em> by Recovery Dharma Inc. <span style={{color:C.creamDim}}>Licensed CC BY-NC-SA 4.0.</span></div></div>
        <a href="https://recoverydharma.org/book" target="_blank" style={{display:"inline-flex",alignItems:"center",gap:5,background:`${C.sage}22`,border:`1px solid ${C.sage}`,color:C.sage,borderRadius:8,padding:"6px 12px",textDecoration:"none",fontSize:11,whiteSpace:"nowrap",fontFamily:"'DM Sans'"}}>Free PDF ↗</a>
      </div>

      {/* Progress bar */}
      {readCount>0&&(
        <div style={{marginBottom:14}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
            <span style={{fontSize:10,color:C.creamMuted}}>Reading progress</span>
            <span style={{fontSize:10,color:C.sage}}>{readCount} of {BOOK_CHAPTERS.length} chapters</span>
          </div>
          <div style={{height:4,background:C.surfaceDeep,borderRadius:2}}>
            <div style={{height:4,background:C.sage,borderRadius:2,width:`${(readCount/BOOK_CHAPTERS.length)*100}%`,transition:"width .4s"}}/>
          </div>
        </div>
      )}

      <Tabs tabs={[["browse","Browse"],["feel","By Feeling"],["need","By Need"]]} active={tab} onSelect={setTab}/>

      {tab==="browse"&&<div>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search any topic, term, or question..."
          style={{width:"100%",background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,padding:"11px 14px",color:C.cream,fontSize:12,fontFamily:"'DM Sans'",outline:"none",marginBottom:11,boxSizing:"border-box"}}/>
        <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:13}}>
          {TAGS_ALL.map(t=><button key={t} onClick={()=>setFilterTag(t)}
            style={{padding:"4px 9px",borderRadius:6,border:`1px solid ${filterTag===t?C.gold:C.border}`,background:filterTag===t?`${C.gold}22`:C.surfaceDeep,color:filterTag===t?C.gold:C.creamMuted,cursor:"pointer",fontSize:10,fontFamily:"'DM Sans'"}}>{t}</button>)}
        </div>
        {filtered.length===0&&<Card style={{textAlign:"center",padding:"28px"}}><p style={{color:C.creamMuted,fontSize:12}}>No chapters match.</p></Card>}
        {filtered.map(c=>{
          const idx=BOOK_CHAPTERS.indexOf(c);
          const isRead=readChapters.includes(c.id);
          const wc=c.text.split(" ").length;
          const mins=Math.max(1,Math.round(wc/200));
          return(
          <button key={c.id} onClick={()=>setChapter(idx)}
            style={{width:"100%",background:C.surface,border:`1px solid ${isRead?C.sage+"44":C.border}`,borderRadius:12,padding:"15px 17px",cursor:"pointer",textAlign:"left",marginBottom:8,display:"block",transition:"all .2s"}}
            onMouseEnter={e=>{e.currentTarget.style.borderColor=c.color;e.currentTarget.style.background=C.surfaceAlt;}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor=isRead?C.sage+"44":C.border;e.currentTarget.style.background=C.surface;}}>
            <div style={{display:"flex",gap:9,alignItems:"flex-start"}}>
              <div style={{width:4,alignSelf:"stretch",background:isRead?C.sage:c.color,borderRadius:2,flexShrink:0}}/>
              <div style={{flex:1}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8,marginBottom:3}}>
                  <Tag label={c.tag} color={isRead?C.sage:c.color}/>
                  <div style={{display:"flex",gap:6,alignItems:"center",flexShrink:0}}>
                    <span style={{fontSize:9,color:C.creamDim}}>{mins}m</span>
                    {isRead&&<span style={{fontSize:9,color:C.sage}}>✓</span>}
                  </div>
                </div>
                <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:17,color:C.cream,marginBottom:4}}>{c.title}</div>
                <p style={{fontSize:11,color:C.creamMuted,lineHeight:1.6,margin:0}}>
                  {search&&c.text.toLowerCase().includes(search.toLowerCase())
                    ?c.text.slice(Math.max(0,c.text.toLowerCase().indexOf(search.toLowerCase())-30),c.text.toLowerCase().indexOf(search.toLowerCase())+100)+"..."
                    :c.keyQuote?`"${c.keyQuote.slice(0,100)}..."`:c.text.slice(0,110)+"..."}
                </p>
              </div>
            </div>
          </button>
        );})}
      </div>}

      {tab==="feel"&&<div>
        <p style={{fontSize:12,color:C.creamMuted,marginBottom:12,lineHeight:1.7}}>Select how you're feeling right now. We'll show you the chapters most relevant to that experience.</p>
        <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:16}}>
          {EMOTIONS.map(e=><button key={e} onClick={()=>setFilterEmotion(e)}
            style={{padding:"6px 12px",borderRadius:8,border:`1px solid ${filterEmotion===e?C.rose:C.border}`,background:filterEmotion===e?`${C.rose}22`:C.surfaceDeep,color:filterEmotion===e?C.rose:C.creamMuted,cursor:"pointer",fontSize:11,fontFamily:"'DM Sans'"}}>{e==="All"?"All feelings":e}</button>)}
        </div>
        {filtered.length===0&&<p style={{color:C.creamMuted,fontSize:12,textAlign:"center"}}>No chapters match this feeling.</p>}
        {filtered.map(c=>{const idx=BOOK_CHAPTERS.indexOf(c);return(
          <button key={c.id} onClick={()=>setChapter(idx)}
            style={{width:"100%",background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:"13px 16px",cursor:"pointer",textAlign:"left",marginBottom:7,display:"block"}}
            onMouseEnter={e=>{e.currentTarget.style.borderColor=c.color;e.currentTarget.style.background=C.surfaceAlt;}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.background=C.surface;}}>
            <Tag label={c.tag} color={c.color}/>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:16,color:C.cream,margin:"4px 0 3px"}}>{c.title}</div>
            <p style={{fontSize:11,color:C.creamMuted,margin:0,lineHeight:1.5}}>{c.keyQuote?`"${c.keyQuote.slice(0,85)}..."`:c.text.slice(0,90)+"..."}</p>
          </button>
        );})}
      </div>}

      {tab==="need"&&<div>
        <p style={{fontSize:12,color:C.creamMuted,marginBottom:12,lineHeight:1.7}}>What do you need most right now? We'll show you the chapters most likely to help.</p>
        <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:16}}>
          {NEEDS.map(n=><button key={n} onClick={()=>setFilterNeed(n)}
            style={{padding:"6px 12px",borderRadius:8,border:`1px solid ${filterNeed===n?C.sage:C.border}`,background:filterNeed===n?`${C.sage}22`:C.surfaceDeep,color:filterNeed===n?C.sage:C.creamMuted,cursor:"pointer",fontSize:11,fontFamily:"'DM Sans'"}}>{n==="All"?"All needs":n}</button>)}
        </div>
        {filtered.length===0&&<p style={{color:C.creamMuted,fontSize:12,textAlign:"center"}}>No chapters match.</p>}
        {filtered.map(c=>{const idx=BOOK_CHAPTERS.indexOf(c);return(
          <button key={c.id} onClick={()=>setChapter(idx)}
            style={{width:"100%",background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:"13px 16px",cursor:"pointer",textAlign:"left",marginBottom:7,display:"block"}}
            onMouseEnter={e=>{e.currentTarget.style.borderColor=c.color;e.currentTarget.style.background=C.surfaceAlt;}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.background=C.surface;}}>
            <Tag label={c.tag} color={c.color}/>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:16,color:C.cream,margin:"4px 0 3px"}}>{c.title}</div>
            <p style={{fontSize:11,color:C.creamMuted,margin:0,lineHeight:1.5}}>{c.keyQuote?`"${c.keyQuote.slice(0,85)}..."`:c.text.slice(0,90)+"..."}</p>
          </button>
        );})}
      </div>}
    </div>
  );
}
function GuideScreen(){
  const[msgs,setMsgs]=useState([{role:"assistant",content:"I'm your Recovery Dharma guide. I can help you explore the teachings, work through difficult moments, prepare for inquiry, understand the Eightfold Path, or simply talk through what's present today.\n\nWhat's alive for you right now?"}]);
  const[input,setInput]=useState("");const[loading,setLoading]=useState(false);
  const endRef=useRef(null);
  useEffect(()=>endRef.current?.scrollIntoView({behavior:"smooth"}),[msgs]);
  const SYSTEM=`You are a compassionate Recovery Dharma guide — deeply versed in Buddhist teachings, the Four Noble Truths, the Eightfold Path, the Eight Commitments, and the specific curriculum of the Recovery Dharma program (meditation, inquiry, sangha, mentorship, wise action).

You are not a therapist. You are a peer guide — like a wise friend further along the path who understands addiction, recovery, and Buddhist practice.

Your approach:
- Ground everything in Recovery Dharma's framework: impermanence, craving, the three poisons, dependent origination
- Use Buddhist concepts naturally but explain them in plain language
- Ask good questions that invite honest self-reflection
- When someone is in crisis or expressing suicidal thoughts, immediately provide crisis resources (988) and encourage them to reach out
- Do not lecture or moralize — share, ask, reflect
- Keep responses warm, honest, and free of spiritual bypassing
- Reference specific practices: RAIN, urge surfing, metta, inquiry questions, the workbook
- You know about PAWS, trauma-informed recovery, Gabor Maté's work, self-compassion (Kristin Neff)
- Never pretend to have personal recovery experience you don't have
- When someone is struggling with craving: the SOS button is available on the home screen
- Be concise — this is a conversation, not a lecture. Usually 2-4 short paragraphs.`;

  const send=async()=>{
    if(!input.trim()||loading)return;
    const userMsg={role:"user",content:input.trim()};
    const newMsgs=[...msgs,userMsg];
    setMsgs(newMsgs);setInput("");setLoading(true);
    try{
      const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,system:SYSTEM,messages:newMsgs.filter(m=>m.role!=="system")})});
      const d=await r.json();
      const reply=d.content?.[0]?.text||"I'm having trouble responding right now. Please try again.";
      setMsgs(m=>[...m,{role:"assistant",content:reply}]);
    }catch(e){setMsgs(m=>[...m,{role:"assistant",content:"I'm having trouble connecting right now. Please try again in a moment."}]);}
    setLoading(false);
  };

  const STARTERS=["I'm struggling with a craving right now","I don't understand dependent origination","Help me prepare for an inquiry","I relapsed and feel ashamed","I can't maintain a meditation practice","How do I find a mentor?"];

  return(
    <div className="fu"style={{maxWidth:780,margin:"0 auto",display:"flex",flexDirection:"column",height:"calc(100vh - 120px)"}}>
      <SH title="AI Recovery Guide" subtitle="A compassionate guide versed in Recovery Dharma and Buddhist practice."/>
      {msgs.length===1&&<div style={{display:"flex",gap:7,flexWrap:"wrap",marginBottom:13,padding:"0 16px"}}>{STARTERS.map((s,i)=><button key={i}onClick={()=>{setInput(s);}}style={{background:C.surfaceAlt,border:`1px solid ${C.border}`,color:C.creamMuted,borderRadius:8,padding:"7px 11px",cursor:"pointer",fontSize:11,fontFamily:"'DM Sans'",transition:"border-color .2s"}}onMouseEnter={e=>e.currentTarget.style.borderColor=C.gold}onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}>{s}</button>)}</div>}
      <div style={{flex:1,overflowY:"auto",padding:"0 16px 10px",display:"flex",flexDirection:"column",gap:11}}>
        {msgs.map((m,i)=><div key={i}style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start"}}>
          <div style={{maxWidth:"82%",background:m.role==="user"?`${C.gold}22`:C.surface,border:`1px solid ${m.role==="user"?C.gold:C.border}`,borderRadius:m.role==="user"?"16px 16px 4px 16px":"16px 16px 16px 4px",padding:"12px 15px"}}>
            {m.role==="assistant"&&<div style={{fontSize:9,color:C.gold,letterSpacing:".15em",textTransform:"uppercase",marginBottom:5}}>Recovery Guide</div>}
            <p style={{fontSize:13,color:C.cream,lineHeight:1.85,whiteSpace:"pre-wrap",margin:0}}>{m.content}</p>
          </div>
        </div>)}
        {loading&&<div style={{display:"flex",gap:5,padding:"12px 15px",background:C.surface,border:`1px solid ${C.border}`,borderRadius:"16px 16px 16px 4px",maxWidth:"80px"}}>{[0,1,2].map(i=><div key={i}style={{width:6,height:6,borderRadius:"50%",background:C.creamMuted,animation:`pulse 1.2s ease-in-out ${i*.15}s infinite`}}/>)}</div>}
        <div ref={endRef}/>
      </div>
      <div style={{padding:"12px 16px 16px",background:C.surface,borderTop:`1px solid ${C.border}`}}>
        <div style={{display:"flex",gap:9,alignItems:"flex-end"}}>
          <textarea value={input}onChange={e=>setInput(e.target.value)}onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();}}}placeholder="What's present for you right now?"style={{flex:1,background:C.surfaceDeep,border:`1px solid ${C.border}`,borderRadius:11,padding:"10px 13px",color:C.cream,fontSize:13,fontFamily:"'DM Sans'",resize:"none",outline:"none",lineHeight:1.6,minHeight:44,maxHeight:120}}rows={1}/>
          <button onClick={send}disabled={loading||!input.trim()}style={{background:input.trim()?C.surfaceAlt:C.surfaceDeep,border:`1px solid ${input.trim()?C.gold:C.border}`,color:input.trim()?C.gold:C.border,borderRadius:10,padding:"10px 16px",cursor:input.trim()?"pointer":"default",fontSize:14,transition:"all .2s",flexShrink:0}}>→</button>
        </div>
        <div style={{fontSize:9,color:C.creamDim,marginTop:5,textAlign:"center"}}>AI guide · Not a substitute for a human mentor, therapist, or crisis support</div>
      </div>
    </div>
  );
}

// ── MAIN APP ──────────────────────────────────────────────────────────────────
const NAV_GROUPS=[
  {group:"Today",color:"#c9a84c",items:[
    {id:"home",icon:"⌂",label:"Home"},
    {id:"checkin",icon:"◈",label:"Check-In"},
    {id:"practice",icon:"◌",label:"Practice"},
    {id:"journal",icon:"✍",label:"Journal"},
    {id:"recovery",icon:"◎",label:"Dashboard"},
  ]},
  {group:"Learn",color:"#7b9e87",items:[
    {id:"path",icon:"☸",label:"Teachings"},
    {id:"commitments",icon:"⊛",label:"Commitments"},
    {id:"book",icon:"◉",label:"The Book"},
    {id:"wisdom",icon:"✧",label:"Wisdom"},
    {id:"resources",icon:"◎",label:"Resources"},
  ]},
  {group:"Work",color:"#8b7fc2",items:[
    {id:"inquiry",icon:"◎",label:"Inquiry"},
    {id:"workbook",icon:"◑",label:"Workbook"},
    {id:"amends",icon:"◈",label:"Amends"},
    {id:"milestones",icon:"✦",label:"Milestones"},
    {id:"purpose",icon:"◉",label:"Purpose"},
  ]},
  {group:"Support",color:"#b07070",items:[
    {id:"meetings",icon:"⊕",label:"Meetings"},
    {id:"network",icon:"◉",label:"Network"},
    {id:"relapse",icon:"◎",label:"Relapse"},
    {id:"trauma",icon:"◈",label:"Trauma"},
    {id:"paws",icon:"◎",label:"PAWS"},
  ]},
  {group:"Track",color:"#7ab8b8",items:[
    {id:"triggers",icon:"◎",label:"Triggers"},
    {id:"relationships",icon:"◈",label:"Relationships"},
    {id:"reminders",icon:"◎",label:"Reminders"},
    {id:"guide",icon:"✦",label:"AI Guide"},
  ]},
];
const NAV=NAV_GROUPS.flatMap(g=>g.items);

export default function App(){
  const[screen,setScreen]=useState("home");
  const[sos,setSOS]=useState(false);
  const[toast,setToast]=useState(null);
  const[profile,setProfile]=useState(()=>{try{const p=localStorage.getItem("rd:profile");return p?JSON.parse(p):null;}catch{return null;}});
  const showToast=(msg,type="saved")=>setToast({msg,type,id:Date.now()});
  if(!profile)return <OnboardingScreen onComplete={p=>{setProfile(p);setScreen("home");}}/>;

  const screenMap={
    home:<HomeScreen onNav={setScreen}onSOS={()=>setSOS(true)}/>,
    recovery:<MyRecoveryScreen/>,
    checkin:<CheckInScreen toast={showToast}/>,
    path:<PathScreen/>,
    wisdom:<WisdomScreen/>,
    commitments:<CommitmentsScreen/>,
    inquiry:<InquiryScreen/>,
    workbook:<WorkbookScreen toast={showToast}/>,
    practice:<PracticeScreen/>,
    meetings:<MeetingsScreen/>,
    relapse:<RelapseScreen/>,
    trauma:<TraumaScreen/>,
    network:<NetworkScreen toast={showToast}/>,
    triggers:<TriggersScreen toast={showToast}/>,
    milestones:<MilestonesScreen/>,
    amends:<AmendsScreen toast={showToast}/>,
    journal:<JournalScreen toast={showToast}/>,
    paws:<PAWSScreen toast={showToast}/>,
    purpose:<PurposeScreen toast={showToast}/>,
    relationships:<RelationshipsScreen toast={showToast}/>,
    resources:<ResourcesScreen/>,
    book:<BookScreen/>,
    reminders:<RemindersScreen toast={showToast}/>,
    guide:<GuideScreen/>,
  };

  return(
    <div style={{minHeight:"100vh",background:C.bg,color:C.cream,fontFamily:"'DM Sans',sans-serif",paddingBottom:screen==="guide"?0:70}}>
      <style>{GS}</style>
      {sos&&<SOSScreen onClose={()=>setSOS(false)}/>}
      {toast&&<Toast message={toast.msg} type={toast.type} onDone={()=>setToast(null)}/>}
      <div style={{maxWidth:780,margin:"0 auto"}}>
        {screen!=="home"&&<div style={{display:"flex",alignItems:"center",gap:9,padding:"18px 16px 0",borderBottom:`1px solid ${C.border}`,paddingBottom:14}}><button onClick={()=>setScreen("home")}style={{background:"none",border:"none",color:C.gold,cursor:"pointer",fontSize:11,padding:0,fontFamily:"'DM Sans'"}}><span style={{marginRight:4}}>←</span>Home</button><span style={{color:C.border}}>·</span><span style={{fontSize:11,color:C.creamMuted}}>{NAV.find(n=>n.id===screen)?.label}</span></div>}
        {screenMap[screen]||<HomeScreen onNav={setScreen}onSOS={()=>setSOS(true)}/>}
      </div>
      <nav style={{position:"fixed",bottom:0,left:0,right:0,background:`${C.surface}f0`,borderTop:`1px solid ${C.border}`,backdropFilter:"blur(14px)",zIndex:100,overflowX:"auto",WebkitOverflowScrolling:"touch"}}>
        <div style={{display:"flex",gap:0,minWidth:"max-content",padding:"3px 4px 8px"}}>
          {NAV_GROUPS.map((g,gi)=><div key={g.group} style={{display:"flex",alignItems:"flex-start",borderRight:gi<NAV_GROUPS.length-1?`1px solid ${C.border}`:undefined,paddingRight:gi<NAV_GROUPS.length-1?3:0,marginRight:gi<NAV_GROUPS.length-1?3:0}}>
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",paddingTop:6,paddingRight:2,paddingLeft:2,minWidth:28}}>
              <div style={{fontSize:7,color:g.color,letterSpacing:".08em",textTransform:"uppercase",writingMode:"vertical-rl",transform:"rotate(180deg)",lineHeight:1,opacity:.7,marginBottom:2}}>{g.group}</div>
            </div>
            {g.items.map(n=><button key={n.id}onClick={()=>setScreen(n.id)}style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2,padding:"6px 8px",background:screen===n.id?`${g.color}20`:"none",border:"none",cursor:"pointer",borderRadius:8,transition:"all .2s",minWidth:52,opacity:screen===n.id?1:.5}}><span style={{fontSize:13,color:screen===n.id?g.color:C.cream}}>{n.icon}</span><span style={{fontSize:8,color:screen===n.id?g.color:C.creamMuted,letterSpacing:".04em",textAlign:"center",lineHeight:1.2,whiteSpace:"nowrap"}}>{n.label}</span></button>)}
          </div>)}
        </div>
      </nav>
    </div>
  );
}
