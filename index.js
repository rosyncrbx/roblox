const axios=require('axios').default;
const fs=require('fs');
const Start=require('child_process').execFileSync;
const Update=async()=>{
try{
let a=(await axios.get('http://setup.roblox.com/versionQTStudio').catch(e=>{})).data;
let b=(await axios.get('http://setup.roblox.com/version').catch(e=>{})).data;
let c=(await axios.get('http://setup.roblox.com/DeployHistory.txt').catch(e=>{})).data;
let d=(await axios.get(`http://setup.roblox.com/${a}-API-Dump.json`).catch(e=>{})).data;
let e;
let f;
if(!fs.existsSync('./StudioVersion.txt')){fs.writeFileSync('./StudioVersion.txt','')};if(!fs.existsSync('./ClientVersion.txt')){fs.writeFileSync('./ClientVersion.txt','')};if(!fs.existsSync('./DeployHistory.txt')){fs.writeFileSync('./DeployHistory.txt','')};
if(fs.readFileSync('./StudioVersion.txt').toString()!==a){
fs.writeFileSync('./StudioVersion.txt',a);
e=(await axios.get(`http://setup.roblox.com/${a}-RobloxStudio.zip`,{responseType:'stream'}).catch(e=>{})).data;
};
if(fs.readFileSync('./ClientVersion.txt').toString()!==b){
fs.writeFileSync('./ClientVersion.txt',b);
f=(await axios.get(`http://setup.roblox.com/${b}-RobloxApp.zip`,{responseType:'stream'}).catch(e=>{})).data;
};
if(fs.readFileSync('./DeployHistory.txt').toString()!==c){
fs.writeFileSync('./DeployHistory.txt',c);
};
(await new Promise((r)=>{
let cn=[];
let cp={};
for(let a of d.Classes){//Classes/Enums/Version\\
cn.push(a.Name);
let props={"Name":{"Category":"Primitive","Name":"string"}};
for(let b of a.Members){
if(b.MemberType=='Property'&&(b.Name!=='RobloxLocked')&&(b.Name!=='DataCost')&&(b.Name!=='ClassName')&&(b.Name!=='className')&&(b.Name!=='Parent')){
props[b.Name]=b.ValueType;
};
};
cp[a.Name]=props;
};
let raw={};
let raw2={};
let raw3={};
cn.forEach((a)=>{
raw[a]=cp[a];
if(a!=={}&&!(a.toLowerCase().includes('service')||a.toLowerCase().includes('provider'))){
raw2[a]=cp[a];
let raw4={};
for(let b in cp[a]){
raw4[b]=0;
};
if(a.includes('Part')){
for(let b in cp['BasePart']){
if(b!=='brickColor')raw4[b]=0;
};
};
if(a.includes('Script')){
for(let b in cp['BaseScript']){
raw4[b]=0;
};
};
raw3[a]=raw4;
};
});
/* Delete stuff from RoSync version */
delete raw3.Studio;
delete raw3.UserGameSettings;
delete raw3.FaceControls;
delete raw3.BasePart;
delete raw3.BaseScript;
delete raw3.Player.userId;
delete raw3.Mouse.target;
delete raw3.Bone.TransformedWorldCFrame;
delete raw3.Camera.CFrame;
delete raw3.Camera.CoordinateFrame;
delete raw3.Camera.Focus;
delete raw3.Camera.CoordinateFrame;
delete raw3.Camera.DiagonalFieldOfView;
delete raw3.Camera.MaxAxisFieldOfView;
delete raw3.Camera.NearPlaneZ;
/* Write */
fs.writeFileSync('./RoSync.json',JSON.stringify(raw3,null,4));
fs.writeFileSync('./RoSyncMin.json',JSON.stringify(raw3));
fs.writeFileSync('./BasicProperties.json',JSON.stringify(raw2,null,4));
fs.writeFileSync('./BasicPropertiesMin.json',JSON.stringify(raw2));
fs.writeFileSync('./Properties.json',JSON.stringify(raw,null,4));
fs.writeFileSync('./PropertiesMin.json',JSON.stringify(raw));
r();
}));
(await new Promise((r)=>{
if(!e)return(r());
let g=fs.createWriteStream('Studio.zip');
g.once('finish',()=>{
r();
});
e.pipe(g);
}));
if(e){
Start(`${__dirname}/Unzip.sh`);
fs.copyFileSync('./Studio/ReflectionMetadata.xml','./ReflectionMetadata.xml');
};
if(fs.existsSync('./Studio')){
fs.rmSync('./Studio',{recursive:true});
};
(await new Promise((r)=>{
if(!f)return(r());
let g=fs.createWriteStream('Client.zip');
g.once('finish',()=>{
r();
});
f.pipe(g);
}));
Start(`${__dirname}/Update.sh`,[a,b]);
console.log('Finished updating.');
}catch(e){ console.log(e)
console.log('Failed to update.');
};
};
setInterval(Update,600000);Update();
