import { addKeyword, EVENTS } from "@builderbot/bot";
import { clearHistory, handleHistory } from "../utils/handleHistory";
import { flowSchedule } from "./schedule.flow";

/**
 * Encargado de pedir los datos necesarios para registrar el evento en el calendario
 */
const flowFirstStep = addKeyword(EVENTS.ACTION).addAction(async (ctx, { flowDynamic, state }) => {
    await clearHistory(state)
    const m = '¿Qué fecha y hora sería de tu agrado? en formato: dia/mes - hora'
    await flowDynamic(m)
    handleHistory({ content: m, role: "assistant" }, state);
}).addAction({ capture: true }, async (ctx, { state,endFlow, gotoFlow }) => {

    if (ctx.body.toLocaleLowerCase().includes('esperar') || ctx.body.toLocaleLowerCase().includes('apagar') || ctx.body.toLocaleLowerCase().includes('cancelar') || ctx.body.toLocaleLowerCase().includes('ninguna')) { 
        async function ejecutarEndFlow() {
            await clearHistory(state)
            return endFlow(`cita cancelada.`);
            
        }
        await ejecutarEndFlow();
    }

    handleHistory({ content: ctx.body, role: 'user' }, state);

    return gotoFlow(flowSchedule)
})


export { flowFirstStep }