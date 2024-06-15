import { BotContext, BotMethods } from "@builderbot/bot/dist/types"
import { flowConfirmStart } from "../flows/confirmStart.flow"


export default async(_: BotContext, { gotoFlow }: BotMethods) => {

    return gotoFlow(flowConfirmStart)

}