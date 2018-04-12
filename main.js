const Discord = require('discord.js');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('database.json')
const db = low(adapter);

db.defaults({xp: []}).write()

var bot = new Discord.Client();  //connection
var prefix = ("/");  // prefix


//connection bot (return log important!) + set game

bot.on('ready', () => {
    bot.user.setPresence({ game: { name: 'être en développement', type: 0}});
    console.log("Le Bot est Connecté !");
});
bot.login(process.env.TOKEN)

//add role + bienvenue

bot.on("guildMemberAdd", member => {
    let role = member.guild.roles.find("name", "mettre le nom du role exact voulue")
    member.guild.channel.find("name", "nom du channel ou le message va s'ouvrir").send(`:heart: ${member.user.username} vient de rejoindre le serveur E-Corp !`)
    member.addRole(role)
})

bot.on("guildMemberRemove", member => {
    member.guild.channel.find("name", "nom du channel ou le message va s'ouvrir").send(`:heart: ${member.user.username} vient de nous quitter :/ !`)
    
})



//message de test reply + commande embed + requete lbdd xp (return log important!)

bot.on('message', message => {

    var msgauthor = message.author.id;

    if(message.author.bot)return;

    if(!db.get("xp").find({user: msgauthor}).value()){
        db.get("xp").push({user: msgauthor, xp: 13}).write(); // nombre d'xp pour chaque message
    }else{
        var userxpdb = db.get("xp").filter({user: msgauthor}).find('xp').value();
        console.log(userxpdb);
        var userxp = Object.values(userxpdb)
        console.log(userxp);
        console.log(`Nombre d'xp : ${userxp[1]}`)

        db.get("xp").find({user: msgauthor}).assign({user: msgauthor, xp: userxp[1] += 13}).write(); // "fonction", qui ++ les nb c'xp
    }
 
    // embed quand on fait help

    if (message.content === prefix + "help"){
        var help_embed = new Discord.RichEmbed()
            .setColor('#97D4B3')
            .addField("Commande du bot !", " - /help : Afficher les commandes du bot !")
            .addField("Interaction", "a mettre : Le bot doit repondre !")
            .setFooter("ceci est la fin du embed !")
        message.channel.sendEmbed(help_embed);
        console.log('commande /help demandé');
    }


// embed Stat commande

    if (message.content === prefix + "xpstat"){
        var xp = db.get("xp").filter({user: msgauthor}).find('xp').value()
        var xpfinal = Object.values(xp);
        var xp_embed = new Discord.RichEmbed()
            .setColor('#97D4B3')
            .setTitle(`XP de ${message.author.username}`)
            .setDescription("Voici le nombre d'XP que vous avez accumlez depuis votre arrivé sur le serveur E-Corp !")
            .addField("XP :", `${xpfinal[1]} xp`)
        message.channel.send({embed: xp_embed});
    }

});


// NE TOUCHE PAS LES AUTRES FICHIER COMME LE PACKAGE-LOCK et SURTOUT DATABASE C'EST LA BASE DE DONNEES !! voila enjoy ! x) au cas ou debug c'est F5 ^^ sinon le bot ne se co pas vu que c'est local 