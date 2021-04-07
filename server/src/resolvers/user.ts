import argon2 from "argon2";
import { MyContext } from "src/types";
import { User } from "../entities/User";
import { Resolver, Field, Arg, Ctx, Mutation, InputType } from "type-graphql";

@InputType()
class UsernamePasswordInput {
  @Field()
  username: string;
  @Field()
  password: string;
}

@Resolver()
export class UserResolver {
  @Mutation(() => User)
  async register(
    @Arg("options") options: UsernamePasswordInput,
    @Ctx() { em }: MyContext
  ) {
    const hashpassword = await argon2.hash(options.password);
    const user = em.create(User, {
      username: options.username,
      password: hashpassword,
    });
    await em.persistAndFlush(user);
    return user;
  }
}
