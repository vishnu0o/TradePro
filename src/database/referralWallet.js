import mongoose from "mongoose";

const Schema = new mongoose.Schema({
  userId: {
    type: String
  },
  totalIncome: {
    type: Number
  },

  totalTeamMembers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "registratedUser"
    }
  ],
  activeUsers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "registratedUser"
    }
  ],
  inActiveUsers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "registratedUser"
    }
  ],
  levels: [
    {
      levelName: { type: String },
      visibility: { type: Boolean },
      levelIncome: { type: Number },
      totalReferrals: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "registratedUser"
        }
      ],
      activeUsers: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "registratedUser"
        }
      ],
      inActiveUsers: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "registratedUser"
        }
      ],
    }
  ]
});

const referralWallet = mongoose.model("referralWallet", Schema);

export default referralWallet;
