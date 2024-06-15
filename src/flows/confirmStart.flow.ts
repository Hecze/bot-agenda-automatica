import { addKeyword, EVENTS } from "@builderbot/bot";
import { clearHistory } from "../utils/handleHistory";
import { flowFirstStep } from "./firstStep.flow";
import { flowJustRead } from "./justRead.flow";

/**
 * Encargado de pedir los datos necesarios para registrar el evento en el calendario
 */


const flowConfirmStart = addKeyword(EVENTS.ACTION)

    .addAction(async (ctx, { flowDynamic }) => {
        await flowDynamic('¡Hola! Somos una familia cristiana que brindamos servicios de movilidad a todo Lima. Nos caracterizamos por ser puntuales y la seguridad al 100%.');
        await flowDynamic('*Agendar* o *Esperar* al humano');

    })

    .addAction({ capture: true }, async (ctx, { state, flowDynamic, gotoFlow, fallBack }) => {
        if (ctx.body.toLocaleLowerCase().includes('agendar')) {
            return gotoFlow(flowFirstStep)
        }

        if (ctx.body.toLocaleLowerCase().includes('esperar') || ctx.body.toLocaleLowerCase().includes('apagar')) {
            async function ejecutarEndFlow() {
                await clearHistory(state)
                return gotoFlow(flowJustRead);
            }
            await flowDynamic("Chatbot apagado. puedes volver a encenderlo escribiendo *Encender*");
            await ejecutarEndFlow();
        }

        else {
            return fallBack("🤔");
        }
    })


export { flowConfirmStart }