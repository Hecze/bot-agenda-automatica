import { addKeyword, EVENTS } from "@builderbot/bot";
import { clearHistory, handleHistory } from "../utils/handleHistory";
import { format } from "date-fns";
import { appToCalendar } from "src/services/calendar";
import { flowSchedule } from "./schedule.flow";

const DURATION_MEET = process.env.DURATION_MEET ?? 45
/**
 * Encargado de pedir los datos necesarios para registrar el evento en el calendario
 */
const flowFirstStep = addKeyword(EVENTS.ACTION).addAction(async (ctx, { flowDynamic, gotoFlow, endFlow, state }) => {
    await clearHistory(state)
    const m = '¿Qué fecha y hora sería de tu agrado?'
    await flowDynamic(m)
    handleHistory({ content: m, role: "assistant" }, state);
}).addAction({ capture: true }, async (ctx, { state, flowDynamic, endFlow, gotoFlow }) => {

    if (ctx.body.toLocaleLowerCase().includes('cancelar') || ctx.body.toLocaleLowerCase().includes('esperar') || ctx.body.toLocaleLowerCase().includes('salir') ) {
        await clearHistory(state)
        return endFlow(`cita cancelada`)
    }

    handleHistory({ content: ctx.body, role: 'user' }, state);

    return gotoFlow(flowSchedule)
})


export { flowFirstStep }