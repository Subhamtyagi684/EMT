const sgMail = require('@sendgrid/mail');
const fs = require("fs");
const handlebars = require('handlebars');
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
const emailModel = require("../database/Models/auth/EmailTransaction")

exports.sendMail = function(obj){
    
    return new Promise(function(resolve,reject){
        if(!obj || !obj.recipient || !obj.subject || !obj.html || !obj.userId){
            reject({message:"Please check your payload"});
        }
        const msg = {
            to: obj.recipient, // Change to your recipient
            from: "rishi.kumar@trangile.com", // Change to your verified sender
            subject: obj.subject,
            html: obj.html,
        }
        
        sgMail.send(msg)
        .then(async (result)=>{
            if(result && result[0].headers && result[0].headers["x-message-id"]){
                await emailModel.create({
                    emailMessageId:result[0].headers["x-message-id"],
                    emailResponse:result,
                    userRef:obj.userId,
                })
                resolve(obj)
            }else{
                reject(result);
                return;
            }
        
        })
        .catch((err)=>{
            reject(err)
        })
        
    })
    
    
}

exports.generateHtmlForEmail = function(htmlPath,replacements){
    if(!htmlPath || !replacements){
        return;
    }
    let readHtmlFile = fs.readFileSync(htmlPath,{encoding:"utf-8"});
    let template = handlebars.compile(readHtmlFile);
    let htmlToSend = template(replacements);
    return htmlToSend;
}

