import { createFlow } from "@builderbot/bot";
import { welcomeFlow } from "./welcome.flow";
import { flowSchedule } from "./schedule.flow";
import { flowConfirm } from "./confirm.flow";
import { flowConfirmStart } from "./confirmStart.flow";
import { flowFirstStep } from "./firstStep.flow";
import { flowJustRead } from "./justRead.flow";



export default createFlow([welcomeFlow, flowSchedule, flowConfirm, flowConfirmStart, flowFirstStep, flowJustRead])