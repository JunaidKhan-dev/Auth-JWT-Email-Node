const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SEND_GRID_API)

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'junaidkhan1@gmx.com',
    subject: 'Thanks for joining in!',
    text: `Welcome to this stupid ${name}. Let me know how you get along with the app`
  })
}

const sendByeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'junaidkhan1@gmx.com',
    subject: 'Sorry to see you going!',
    text: `We are very sorry ${name} to see you go . Let me know what we have done better to keep you as your client`
  })
}

module.exports = {
  sendWelcomeEmail,
  sendByeEmail
}
