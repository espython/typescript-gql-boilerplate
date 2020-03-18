// import SparkPost from "sparkpost";
// const client = new SparkPost(process.env.SPARKPOST_API_KEY);

// export const sendEmail = async (recipient: string, url: string) => {
//   const response = await client.transmissions.send({
//     options: {
//       sandbox: true
//     },
//     content: {
//       from: "testing@sparkpostbox.com",
//       subject: "Confirm Email",
//       html: `<html>
//         <body>
//         <p>Testing SparkPost - the world's most awesomest email service!</p>
//         <a href="${url}">confirm email</a>
//         </body>
//         </html>`
//     },
//     recipients: [{ address: recipient }]
//   });
//   console.log(response);
//   console.log(url);
// };

// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
import sgMail from "@sendgrid/mail";
export const sendEmail = async (email: string, url: string) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);
  const msg = {
    to: email,
    from: "test@example.com",
    subject: "Sending with Twilio SendGrid is Fun",
    text: "and easy to do anywhere, even with Node.js",
    html: `<html>
            <body>
              <p>Testing SparkPost - the world's most awesomest email service!</p>
                <a href="${url}">confirm email</a>
            </body>
          </html>`
  };
  await sgMail.send(msg);
  console.log("email", email);
};
