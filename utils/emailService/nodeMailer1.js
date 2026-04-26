import nodemailer from "nodemailer";
import { getTenantDBModels } from "../../db/index.js";
// import dotenv from "dotenv";
// dotenv.config();

/**
 * Dynamically fetch the active email configuration from the database   
 * and create a nodemailer transporter using it.
 */
async function createDynamicTransporter() {
    const { EmailSetting } = await getTenantDBModels();
const activeSetting = await EmailSetting.findOne({ IsActive: true });
console.log('activeSetting:',activeSetting)
if (!activeSetting) {
    return "Inactive setting"
}

let { Host, Port } =  activeSetting;

  if (!activeSetting) {
    throw new Error("No active email setting found in the database.");
  }

  return nodemailer.createTransport({
    host: Host,
    port: Port,
    secure: false, // true for 465, false for 587 or others
    auth: {
      user: activeSetting.auth.email,
      pass: activeSetting.auth.password,
    },
    logger: true,
    debug: true,
  });
}

/**
 * Sends email using the active email configuration
 * @param {string} from
 * @param {string} to
 * @param {string} subject
 * @param {string} text
 * @param {string} html
 * @param {object} mailOption - optional, can include future logic
 */
async function sendMailService(from, to, subject, text, html, mailOption = {}) {
  const transporter = await createDynamicTransporter();

  const info = await transporter.sendMail({
    from,
    to,
    subject,
    text,
    html,
  });

  console.log("Message sent: %s", info.messageId);
}

export default sendMailService;
