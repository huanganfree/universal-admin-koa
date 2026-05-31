import { Context } from "koa"


export async function serviceUploadFile(ctx: Context, ) {
    const { userId } = ctx.state.user
    // const user = await User.findOne({ where: { id: userId } })
    // return user?.toJSON()
}