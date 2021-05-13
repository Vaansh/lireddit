import { isAuth } from "../middleware/isAuth";
import { MyContext } from "../types";
import {
  Resolver,
  Query,
  Arg,
  Int,
  Mutation,
  InputType,
  Field,
  Ctx,
  UseMiddleware,
  FieldResolver,
  Root,
  ObjectType,
} from "type-graphql";
import { Post } from "../entities/Post";
import { getConnection } from "typeorm";
import { Updoot } from "../entities/Updoot";

@InputType()
class PostInput {
  @Field()
  title: string;

  @Field()
  text: string;
}

@ObjectType()
class PaginatedPosts {
  @Field(() => [Post])
  posts: Post[];

  @Field()
  hasMore: boolean;
}

@Resolver(Post)
export class PostResolver {
  @FieldResolver(() => String)
  textSnippet(@Root() root: Post) {
    return root.text.slice(0, 50);
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async vote(
    @Arg("postId", () => Int) postId: number,
    @Arg("value", () => Int) value: number,
    @Ctx() { req }: MyContext
  ) {
    const isUpdoot = value !== -1;
    const realValue = isUpdoot ? 1 : -1;
    const { userId } = req.session;
    const updoot = await Updoot.findOne({ where: { postId, userId } });

    // voted on post before
    // changing vote
    if (updoot && updoot.value !== realValue) {
      await getConnection().transaction(async (tm) => {
        await tm.query(
          `
          update updoot
          set value = $1
          where "postId" = $2 and "userId" = $3;
          `,
          [realValue, postId, userId]
        );

        await tm.query(
          `
          update post
          set points = points + $1
          where id = $2;
          `,
          [2 * realValue, postId]
        );
      });
    } else if (!updoot) {
      // never voted before
      await getConnection().transaction(async (tm) => {
        await tm.query(
          `
          insert into updoot("userId", "postId", value)
          values ($1, $2, $3);
          `,
          [userId, postId, realValue]
        );
        await tm.query(
          `
          update post
          set points = points + $1
          where id = $2;
          `,
          [realValue, postId]
        );
      });
    }
    // Updoot.insert({
    //   userId,
    //   postId,
    //   value: realValue,
    // });

    return true;
  }

  // @Query - for getting data
  // in this case, get all posts
  @Query(() => PaginatedPosts)
  async posts(
    @Arg("limit", () => Int) limit: number,
    @Arg("cursor", () => String, { nullable: true }) cursor: string | null
  ): Promise<PaginatedPosts> {
    const realLimit = Math.min(50, limit);
    const realLimitPlusOne = realLimit + 1;

    const replacements: any[] = [realLimitPlusOne];

    if (cursor) {
      replacements.push(new Date(parseInt(cursor)));
    }

    const posts = await getConnection().query(
      `
      select p.*,      
      json_build_object(
        'id', u.id,
        'username', u.username,
        'email', u.email,
        'createdAt', u."createdAt",
        'updatedAt', u."updatedAt"
        ) creator
      from post p
      inner join public.user u on u.id = p."creatorId"
      ${cursor ? `where p."createdAt" < $2` : ""}
      order by p."createdAt" DESC
      limit $1
      `,
      replacements
    );

    const qb = getConnection()
      .getRepository(Post)
      .createQueryBuilder("p")
      .innerJoinAndSelect("p.creator", "u", 'u.id = p."creatorId"')
      .orderBy('p."createdAt"', "DESC")
      .take(realLimitPlusOne);

    // if (cursor) {
    //   qb.where('p."createdAt" < :cursor', {
    //     cursor: new Date(parseInt(cursor)),
    //   });
    // }

    // const posts = await qb.getMany();

    return {
      posts: posts.slice(0, realLimit),
      hasMore: posts.length == realLimitPlusOne,
    };
  }

  // get one post by id
  @Query(() => Post, { nullable: true })
  post(@Arg("id", () => Int) id: number): Promise<Post | undefined> {
    return Post.findOne(id);
  }

  // @Mutation - for updating/inserting/deleting data
  // whenever you change things on the server
  // insert a post
  @Mutation(() => Post)
  @UseMiddleware(isAuth)
  async createPost(
    @Arg("input") input: PostInput,
    @Ctx() { req }: MyContext
  ): Promise<Post> {
    // both insert + select queries:
    return Post.create({
      ...input,
      creatorId: req.session.userId,
    }).save();
  }

  @Mutation(() => Post, { nullable: true })
  async updatePost(
    @Arg("id") id: number,
    @Arg("title", () => String, { nullable: true }) title: string
  ): Promise<Post | null> {
    const post = await Post.findOne(id);
    if (!post) {
      return null;
    }
    if (typeof title !== "undefined") {
      await Post.update({ id }, { title });
    }
    return post;
  }

  @Mutation(() => Boolean)
  async deletePost(@Arg("id") id: number): Promise<boolean> {
    await Post.delete(id);
    return true;
  }
}
