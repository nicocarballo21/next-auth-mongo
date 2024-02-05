/* eslint-disable @typescript-eslint/no-unnecessary-condition */

import type {HydratedDocument, InferSchemaType, Model} from "mongoose";

import mongoose, {Schema, model} from "mongoose";
import bcrypt from "bcryptjs";

interface Iuser {
  email: string;
  name: string;
  password: string;
}

// Put all user instance methods in this interface:
interface IuserMethods {
  comparePassword: (enteredPassword: string) => Promise<boolean>;
}

type UserModel = Model<Iuser, object, IuserMethods>;

const userSchema = new Schema<Iuser, UserModel, IuserMethods>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {timestamps: true},
);

userSchema.pre("save", async function (next) {
  try {
    if (this.isNew) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(this.password, salt);

      this.password = hashedPassword;
    }
    next();
  } catch (error) {
    next(error as Error);
  }
});

userSchema.methods.comparePassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.userExists = async function (email: string) {
  return await this.findOne({email});
};

export default mongoose.models.User || model<Iuser, UserModel>("User", userSchema);
