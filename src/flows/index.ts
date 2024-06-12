import { createFlow } from "@builderbot/bot";
import { welcomeFlow } from "./welcome.flow";
import { flowSeller } from "./seller.flow";
import { flowSchedule } from "./schedule.flow";
import { flowConfirm } from "./confirm.flow";
import { flowConfirmStart } from "./confirmStart.flow";
import { flowFirstStep } from "./firstStep.flow";


export default createFlow([welcomeFlow, flowSeller, flowSchedule, flowConfirm, flowConfirmStart, flowFirstStep])