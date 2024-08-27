import twilio from "twilio";
import sanitizedConfig from "../config.js";

// Initialize Twilio client
const client = twilio(
  sanitizedConfig.TWILIO_ACCOUNT_SID,
  sanitizedConfig.TWILIO_AUTH_TOKEN
);

// Generate a random OTP
const generateOTP = () => {
  return Math.floor(1000 + Math.random() * 9000);
};

// Function to send OTP via SMS
export const sendOTP = (recipient) => {
  const otp = generateOTP();
  const message = `Your OTP is: ${otp}`;

  return new Promise((resolve, reject) => {
    client.messages
      .create({
        body: message,
        from: sanitizedConfig.TWILIO_PHONE_NUMBER,
        to: `+91${recipient}`,
      })
      .then((message) => {
        console.log(`OTP sent: ${message.sid}`);
        console.log(message, "messagemessagemessagemessagemessagemessage");

        const messageWithOTP = {
          message: message.sid,
          otp: otp,
        };

        resolve(messageWithOTP);
      })
      .catch((error) => {
        console.error(`Error sending OTP: ${error.message}`);
        reject(error.message); // Reject with error message
      });
  });
};

// verfication Twillio

// Function to verify OTP
export function verifyOTP(userEnteredOTP, twilioSentOTP) {
  // Compare the user-entered OTP with the OTP sent by Twilio
  return userEnteredOTP === twilioSentOTP;
}
