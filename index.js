const Discord = require("discord.js");
require("dotenv").config()
const client = new Discord.Client();
const userManager = client.users;
let guild = undefined;
let numberKey = 3;
let tabRol = [];

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
  //guild = client.guilds.get("");
})

client.on("message", (msg) => {
    guild = msg.guild;
    const toSend = treat_message(msg);
    //msg.channel.send("Oui maître, pardon, désolé")
    if(toSend[0]){
        msg.channel.send(toSend[1]);
    }
})


function exchange_role(message,userToTake, userToReceive,firstMessage){
    if(userToTake === undefined || userToReceive === undefined){
        return [true,"The pseudo you gave is not defined.\n" +
        "Just read the fucking manual !"];
    }
    if(userToTake.user.id === userToReceive.user.id){
        return[true,"You are not Jzhu, you cannot multiply the keys !"];
    }
    let myname = userToTake.nickname
    if(myname == null){
        myname = userToTake.user.username
    }
    let rol = 0;
    for(let i=0; i<numberKey;i+=1){
        rol = message.guild.roles.cache.find(v=> v.name === "Keymaster"+String(i+1));
        if(userToTake.roles.cache.has(rol.id)){
            userToTake.roles.remove(rol);
            userToReceive.roles.add(rol);
            if(firstMessage){
                return [true,"Well played, you have just stolen the key from "+myname
                +".\n But remember, a great power comes with a great responsibility"];
            }else {
                return [true,"It's time for you to retire, you did a great job !\n"+
                "But remember, The idol of today pushes the hero of yesterday out of our recollection; and will, in turn, be supplanted by his successor of tomorrow."];
            }
        }
    }
    return [true,myname + " does not have a key"];
}

/*function f(u,idKeyReceiver){
    console.log(u.user.id+ "   "+idKeyReceiver)
    return u.user.id === idKeyReceiver
}*/

function treat_message(message){
    const cont = message.content
    let index = 0
    while(cont.charAt(index) === " "){
        index += 1
    }
    let ret = [-1,""]
    if(cont.substring(index,index+3) === "!km"){
        ret = get_action_from_message(message,index+4);
    }

    switch(ret[0]){
        case 0 :
            return [true,ret[1]];
        case -1 :
            return [false,""]
        case 1 :
            return [true, "This command does not exist. Need help ? Easy ! Just ask : \n"+
            "!km help"];
        default :
            return [false,""]
    }
}

function get_action_from_message(message,index){
    msg = message.content;
    while(msg.charAt(index) == " "){
        index += 1;
    }
    let user = 0;
    if(msg.substring(index, index+5) === "take "){
        index += 5;
        while(msg.charAt(index) === " "){
            index += 1;
        }
        idKeyReceiver = "";
        while(index < msg.length && msg.charAt(index) != " "){
            idKeyReceiver += msg.charAt(index);
            index += 1;
        }
        const idUser = getUserId(idKeyReceiver);
        const me = message.member;
        user = message.guild.members.cache.get(idUser);
        ret = exchange_role(message,user,me,true);
        if(!ret[0]){
            return[1,ret[1]];
        }
        else{
            return[0,ret[1]];
        }
    }
    if(msg.substring(index, index+5) === "give "){
        index += 5;
        while(msg.charAt(index) === " "){
            index += 1;
        }
        idKeyReceiver = "";
        while(index < msg.length && msg.charAt(index) != " "){
            idKeyReceiver += msg.charAt(index);
            index += 1;
        }
        const idUser = getUserId(idKeyReceiver);
        const me = message.member;
        user = message.guild.members.cache.get(idUser);
        ret = exchange_role(message,me,user,false);
        if(!ret[0]){
            return[1,ret[1]];
        }
        else{
            return[0,ret[1]];
        }
    }
    if(msg.substring(index, index+4) === "list"){
        index += 4;
        while(msg.charAt(index) === " "){
            index += 1;
        }
        let rol = 0
        let ret = "The venerable Keymasters are :\n"
        for(let i=0; i<numberKey; i+= 1){
            //console.log(message.guild.members.cache);
            rol = message.guild.roles.cache.find(v=> v.name === "Keymaster"+String(i+1));
            //const members =  message.guild.members.cache.filter(member => member.roles.cache.find(role => role == rol)).map(member => member.user.tag);
            const user = message.guild.members.cache.filter(member => member.roles.cache.find(role => role == rol));
            //user = message.guild.members.cache.find(u => console.log(u.username))//u => u.roles.cache.has(rol.id));//u => console.log(u.roles))//
            if(user == null){
                return [0,"Wait impatient, I'am answering your last demand. Keep calm and play video games !"];
            }
            myName = user.map(user => user.nickname)[0];
            if(myName == null){
                myName = user.map(user => user.user.username);
            }
            ret += myName + "\n"
        }
        return [0,ret]
    }
    if(msg.substring(index, index+3) === "tag"){
        index += 3;
        while(msg.charAt(index) === " "){
            index += 1;
        }
        let rol = 0;
        let ret = "Hey come over here :\n"
        for(let i=0; i<numberKey; i+= 1){
            rol = message.guild.roles.cache.find(v=> v.name === "Keymaster"+String(i+1));
            //const members =  message.guild.members.cache.filter(member => member.roles.cache.find(role => role == rol)).map(member => member.user.tag);
            const user = message.guild.members.cache.filter(member => member.roles.cache.find(role => role == rol));
            if(user == null){
                return [0,"Wait impatient, I'am answering your last demand. Keep calm and play video games !"];
            }
            ret += "<@"+user.map(user => user.id)[0]+">" + "\n"
        }
        return [0,ret]
    }
    if(msg.substring(index, index+11) === "initialize "){
        rolAdmin = message.guild.roles.cache.find(v=> v.name === "Admin");
        console.log(message.member.roles.cache.has(rolAdmin.id));
        if(!message.member.roles.cache.has(rolAdmin.id)){
            return [0,"You are not an admin. Don't try to fool me deceitful gamer !"];
        }
        index = index + 11;
        while(msg.charAt(index) === " "){
            index += 1;
        }
        let number = "";
        while(msg.charAt(index)>='0' && msg.charAt(index)<='9'){
            number += msg.charAt(index);
            index += 1;
        }
        numberKey = parseInt(number);
        const me = message.member;
        createRoles(me,message)
        return [-1,"Congratulations you got "+String(numberKey) + " keys !"];
    }
    if(msg.substring(index, index+4) === "help"){
        mess = ""
        mess += "If you want to ping the venerable Keymasters, just ask :\n";
        mess += "!km tag\n\n";
        mess += "If you want to see the revered Keymaster name, just ask : \n";
        mess += "!km list\n\n";
        mess += "If you have stolen the key from someone, tell us :\n";
        mess += "!km take \@pseudo \n\n";
        mess += "If you have given the key to someone, warn us :\n";
        mess += "!km give \@pseudo\n\n";
        mess += "If you want to initialize the Keymasters (only once by server) :\n";
        mess += "!km initialize 'number_of_key'\n";
        mess += "Note that last command requires admin privilege";
        return [0,mess]
    }
    return [1,user.user];
}

async function createRoles(me,message){
    tabRol = [];
    let rolCreated = 0
    for(let i=0; i<numberKey-1; i+=1){
        // Create a new role with data and a reason
        rolCreated = await guild.roles.create({data:{
            name: "Keymaster"+String(i+1),
            color: 'BLUE',
            reason: 'we needed a role for Keymasters'
        }})
        //.then(addToOne(me,message,i))
        .catch(console.error);
        me.roles.add(rolCreated);
    }
    rolCreated = await guild.roles.create({data:{
        name: "Keymaster"+String(numberKey),
        color: 'BLUE',
        reason: 'we needed a role for Keymasters'
    }})
    //.then(addToOne(me,message,i))
    .catch(console.error);
    me.roles.add(rolCreated).then(message.channel.send("Congratulations you got "+String(numberKey) + " keys !"));
}

function addToOne(me,message,j){
    tabRol.push(message.guild.roles.cache.find(v=> v.name === "Keymaster"+String(j+1)))
    //console.log(rol[j])
    me.roles.add(tabRol[j])
}

function getUserId(mess){
    let index = 0;
    if(mess.charAt(index) != "<" || mess.charAt(index+1) != "@"){
        return "";
    }
    while(mess.charAt(index)>'9' || mess.charAt(index)<'0') {
        index +=1;
    }
    return mess.substring(index,mess.length-1);
}

client.login(process.env.BOT_TOKEN);
