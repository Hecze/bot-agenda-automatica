import { addKeyword, EVENTS } from "@builderbot/bot";
import { clearHistory } from "../utils/handleHistory";
import { format } from "date-fns";
import { appToCalendar } from "src/services/calendar";
import { flowSchedule } from "./schedule.flow";
import { flowFirstStep } from "./firstStep.flow";

const DURATION_MEET = process.env.DURATION_MEET ?? 45
/**
 * Encargado de pedir los datos necesarios para registrar el evento en el calendario
 */
const flowConfirmStart = addKeyword(EVENTS.ACTION).addAction(async (ctx, { flowDynamic, gotoFlow, endFlow }) => {
    await flowDynamic('Hola, ahora mismo estoy manejando pero puedo agendar tu viaje automaticamente');
    await flowDynamic('*Agendar* o *Esperar al humano*');
}).addAction({ capture: true }, async (ctx, { state, flowDynamic, endFlow, gotoFlow }) => {

    if (ctx.body.toLocaleLowerCase().includes('agendar')) {
        return gotoFlow(flowFirstStep)
    }

    await clearHistory(state)
    return endFlow(`Vale, te escribiré a la brevedad`)

})


export { flowConfirmStart }