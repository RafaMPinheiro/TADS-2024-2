import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendTokenEmail = async (email, token) => {
  const info = await transporter.sendMail({
    from: "",
    to: email,
    subject: "Seu Código de Verificação",
    html: `
    <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px; background-color: #f4f4f4; color: #333;">
      <div style="max-width: 600px; margin: auto; background-color: white; padding: 20px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <h1 style="color: #4CAF50;">Verifique sua Conta</h1>
        <p style="font-size: 16px; color: #555;">Olá,</p>
        <p style="font-size: 16px; color: #555;">Use o código abaixo para concluir sua verificação:</p>
        <div style="font-size: 24px; font-weight: bold; color: #4CAF50; margin: 20px 0;">${token}</div>
        <p style="font-size: 14px; color: #777;">Este código é válido apenas por 10 minutos.</p>
        <p style="font-size: 14px; color: #777;">Se você não solicitou este código, ignore este email.</p>
        <p style="font-size: 14px; color: #777; margin-top: 20px;">Atenciosamente, <br>Rafael Pinheiro</p>
      </div>
    </div>
  `,
  });

  console.log("Message sent: %s", info.messageId);
};

export { sendTokenEmail };
