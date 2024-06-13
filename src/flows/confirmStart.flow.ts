import { addKeyword, EVENTS } from "@builderbot/bot";
import { clearHistory } from "../utils/handleHistory";
import { format } from "date-fns";
import { appToCalendar } from "src/services/calendar";
import { flowSchedule } from "./schedule.flow";
import { flowFirstStep } from "./firstStep.flow";
import { Zzz } from "../utils/Zzz";

const DURATION_MEET = process.env.DURATION_MEET ?? 45
/**
 * Encargado de pedir los datos necesarios para registrar el evento en el calendario
 */
const flowConfirmStart = addKeyword(EVENTS.ACTION).addAction(async (ctx, { flowDynamic, gotoFlow, endFlow }) => {
    const number = ctx.from;
    const Veryfied = await Zzz(number, "POST", "check");
    if (Veryfied.isBlacklisted) return
    await flowDynamic('Hola, ahora mismo estoy manejando pero puedo agendar tu viaje automaticamente');
    await flowDynamic('*Agendar* o *Esperar al humano*');
}).addAction({ capture: true }, async (ctx, { state, flowDynamic, endFlow, gotoFlow }) => {
    const number = ctx.from;

    if (ctx.body.toLocaleLowerCase().includes('agendar')) {
        const remove = await Zzz(number, "POST", "remove");
        return gotoFlow(flowFirstStep)
    }

    if (ctx.body.toLocaleLowerCase().includes('esperar')) {
        const Blocked = await Zzz(number, "POST", "add");

        if (Blocked.added) {
            async function ejecutarEndFlow() {
                await clearHistory(state)
                return endFlow(`Vale, te escribiré a la brevedad`);
            }
            /*
            async function temporizador() {
                await ejecutarEndFlow();

                console.log(
                    "El bot se encenderá en 30 segundos para el número: " + number
                );
                setTimeout(async () => {
                    const remove = await Zzz(number, "POST", "remove");
                    return console.log(remove);
                }, 30000);
            }
            await temporizador();
            */

        }
    }




})


export { flowConfirmStart }