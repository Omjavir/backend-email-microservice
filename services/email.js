const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

const loadTemplate = (templateName, variables) => {
  try {
    // Define the path to the template file
    const templatePath = path.join(
      __dirname,
      "../html-templates",
      `${templateName}.html`
    );

    // Read the template file
    let templateContent = fs.readFileSync(templatePath, "utf8");

    // Replace placeholders with actual data
    Object.keys(variables).forEach((key) => {
      const regex = new RegExp(`{{${key}}}`, "g");
      templateContent = templateContent.replace(regex, variables[key]);
    });

    return templateContent;
  } catch (error) {
    console.error(`Error loading template: ${templateName}`, error);
    throw new Error("Template not found or could not be processed.");
  }
};

const sendMail = async (req, res) => {
  try {
    const templateName = loadTemplate(req.body.template, {
      name: req.body.name,
      bodyEmail: req.body.bodyEmail,
      bodyMessage: req.body.bodyMessage,
    });

    const data = await transporter.sendMail({
      from: {
        name: `${req.body.senderAlias}`,
        address: `${process.env.SMTP_USER}`,
      },
      to: `${req.body.sendMailto}`,
      cc: `${req.body.cc}`,
      bcc: `${req.body.bcc}`,
      subject: `${req.body.subject}`,
      html: templateName,
      text: `${req.body.subject}`,
    });

    return res.status(200).json({
      success: true,
      message: data,
    });
  } catch (error) {
    console.log("ERROR => ", error);

    return res.status(400).json({
      success: false,
      error,
    });
  }
};

module.exports = { sendMail };

/*

  sendMailto, bodyEmail, subject, cc, bcc, senderAlias, html{template}

*/
