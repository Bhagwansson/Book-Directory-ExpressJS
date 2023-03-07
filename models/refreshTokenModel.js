const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const refreshTokenSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Types.ObjectId,
      ref: "Admin",
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: {
    createdAt : "created_at"
  } }
);

refreshTokenSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(10);
  this.refreshToken = await bcrypt.hash(this.refreshToken, salt);
  next();
});

refreshTokenSchema.methods.compare = async function (candidateRefreshToken) {
  const isMatch = await bcrypt.compare(
    candidateRefreshToken,
    this.refreshToken
  );
  return isMatch;
};

module.exports = mongoose.model("refreshToken", refreshTokenSchema);
