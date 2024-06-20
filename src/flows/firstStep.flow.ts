import { addKeyword, EVENTS } from "@builderbot/bot";
import { clearHistory, handleHistory } from "../utils/handleHistory";
import { flowSchedule } from "./schedule.flow";

/**
 * Encargado de pedir los datos necesarios para registrar el evento en el calendario
 */
const flowFirstStep = addKeyword(EVENTS.ACTION)

    .addAction(async (ctx, { flowDynamic, state }) => {
        await clearHistory(state)
        const m = '¿Qué fecha y hora sería de tu agrado?'
        await flowDynamic([{ 
            body: m,
            delay: 1000 
           }])
        handleHistory({ content: m, role: "assistant" }, state);
    })

    .addAction({ capture: true }, async (ctx, { state, endFlow, gotoFlow, flowDynamic, fallBack }) => {

        if (ctx.body.toLocaleLowerCase().includes('esperar') || ctx.body.toLocaleLowerCase().includes('apagar') || ctx.body.toLocaleLowerCase().includes('cancelar') || ctx.body.toLocaleLowerCase().includes('ninguna')) {
            async function ejecutarEndFlow() {
                await clearHistory(state)
                return endFlow(`cita cancelada.`);

            }
            await ejecutarEndFlow();
        }

        if (ctx.body.toLowerCase() == 'no' || ctx.body.toLowerCase() == 'nop' || ctx.body.toLowerCase() == 'nope' || ctx.body.toLowerCase() == 'nada' || ctx.body.toLowerCase() == 'nou') {
            return fallBack("😥")
        }

        // si ctx.body tiene menos de 2 caracteres numericos, entonces decirle que escribe bien el formato
        const numericMatches = ctx.body.match(/\d/g);
        if (!numericMatches || numericMatches.length < 0) {
            const errorMsg = 'Por favor, escribe la fecha y hora en el formato correcto: dia/mes - hora';
            return fallBack(errorMsg);
        }
        
        handleHistory({ content: ctx.body, role: 'user' }, state);

        return gotoFlow(flowSchedule)
    })


export { flowFirstStep }