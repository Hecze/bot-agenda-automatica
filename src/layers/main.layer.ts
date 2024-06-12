import { BotContext, BotMethods } from "@builderbot/bot/dist/types"
import { getHistoryParse } from "../utils/handleHistory"
import AIClass from "../services/ai"
import { flowSeller } from "../flows/seller.flow"
import { flowSchedule } from "../flows/schedule.flow"
import { flowConfirmStart } from "../flows/confirmStart.flow"


export default async(_: BotContext, { state, gotoFlow, extensions }: BotMethods) => {

    return gotoFlow(flowConfirmStart)

}