/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type {Iuser} from "@/models/User";

import connectMongoDb from "@/lib/mongo/mongoConnection";
import User from "@/models/User";

export async function POST(req: Request) {
  const {email, name, password} = (await req.json()) as Iuser;

  await connectMongoDb();

  const user = await User.findOne({email});

  if (user) {
    return Response.json({error: "User already exists"}, {status: 400});
  }

  const newUser = new User({email, name, password});

  try {
    await newUser.save();

    return Response.json(
      {
        success: "User created successfully.",
        user: newUser,
      },
      {status: 201},
    );
  } catch (error) {
    return Response.json({error: "Server error. Please try again later."}, {status: 500});
  }
}
