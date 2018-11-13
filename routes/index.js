var express = require('express');
var fs = require('fs');
var nodemailer = require('nodemailer');
var formidable = require('formidable');

var router = express.Router();


/* POST request. */
router.post('/', function(req, res, next) {
   console.log('POST request received!');


        var form = new formidable.IncomingForm();
        form.parse(req, (err, fields, files) => {
        if(err) console.log("Error parsing the form content.");

        console.log(fields.name);
        console.log(fields.email);
        console.log(fields.subject);

        console.log(files.filetoupload.path);
        console.log(files.filetoupload.name);

        var name = fields.name;
        var email = fields.email;
        var subject = fields.subject;

        var tempFilePath = files.filetoupload.path;
        var fileName = files.filetoupload.name;
        console.log(`${fileName} has been uploaded to ${tempFilePath}.`)

           //Lets read the file from the old path and move it to our project directory upload folder
               fs.readFile(tempFilePath, (err, data) => {
                   if(err) console.log("Error reading the uploaded file");

                   //write the file to ./upload
                   var filePath = './public/uploads/' + fileName;
                   console.log(filePath);
                   fs.writeFile(filePath, data, (error) => {
                       if(err) console.log("Error moving and renaming file.");;
                       console.log("File relocated.");
                       res.render('index', { alert_box:true, form_message_1: 'Thank you ' + name + ', we have received your HTML file: ' + fileName,
                       
                       form_message_2:'An email with the attached file will be send to ' + email + ', in a moment.' });
                     });

                           // Time to send the user an email with the attached HTML

                           // create transport

                           var transporter = nodemailer.createTransport({
                               service: 'gmail',
                               auth:{
                                   user: 'touro.msin.636@gmail.com',
                                   pass: 'tourocollege'

                               }

                           });

                           var mailOptions = {
                               from: "",
                               to: email,
                               subject: subject,
                               html:
                                  `<html>
                                  <head></head>
                                   <body>
                                  <p>Hi ${name},<br/><br/> Thank you for using our HTML sender form to send your HTML form via email.<br/><br/>
                                       We have attached the file <em> ${fileName} </em> to this email below.<br/><br/>

                                       Thank you,<br/><br/>
                                       Oleg Saidov


                               </p>
                               </body>
                               </html>
                               `,
                               attachments: {
                                   name:fileName,
                                   path:filePath,

                               }
                           };

                           transporter.sendMail(mailOptions, (err, info) => {
                               if(err) console.log("Error sending mail");

                               console.log('mail sent' + info.response);
                           });

                   });

                   // delete old file
                   fs.unlink(tempFilePath, (err) => {
                       if(err) console.log("Error deleting the temp uploaded file.");
                       console.log("Temporary file has been removed.");
                   });

               });


        });


// GET request
router.get('/', function(req, res, next) {
  res.render('index', { title: '' });
});

module.exports = router;
