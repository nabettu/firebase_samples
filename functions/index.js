'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

const fs = require("fs");
const xss = require('xss');

exports.share = functions.https.onRequest((req, res) => {
    res.set('Cache-Control', 'public, max-age=0, s-maxage=0');
    res.set('Vary', 'Accept-Encoding, X-My-Custom-Header');

    const id = req.query.id;
    const domain = 'https://nabettu-firebase-sample.firebaseapp.com';

    let title = 'firebase samples';
    let description = 'firebase samples on website';
    let shareUrl = domain;
    let ogpImage = '';
    let redirectUrl = domain;

    admin
        .database()
        .ref(`users/${id}`)
        .once('value')
        .then(dbData => {
            const user = dbData.val()
            if(user){
                title = user.name;
                description = user.description;
                shareUrl = domain + '/share/?id=' + id;
                ogpImage = user.photoURL;
                redirectUrl = domain + '/user/?id=' + id;
            }
            const templeteHtml = fs.readFileSync('./templete.html', 'UTF-8');
            const responseHtml = templeteHtml
                .replace(/\$title/g, xss(title))
                .replace(/\$description/g, xss(description))
                .replace(/\$shareUrl/g, xss(shareUrl))
                .replace(/\$ogpImage/g, xss(ogpImage))
                .replace(/\$redirectUrl/g, xss(redirectUrl));
            res.status(200).send(responseHtml);
        });
});
