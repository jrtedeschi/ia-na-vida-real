// Adaptador: único arquivo que envia e-mail.

function emailDoUsuario_() {
  return Session.getEffectiveUser().getEmail();
}

function enviarEmail_(destinatario, assunto, html) {
  MailApp.sendEmail({ to: destinatario, subject: assunto, htmlBody: html });
}
