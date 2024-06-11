import { addKeyword, EVENTS } from "@builderbot/bot";
import { clearHistory } from "../utils/handleHistory";
import { format } from "date-fns";
import { appToCalendar } from "src/services/calendar";

const DURATION_MEET = process.env.DURATION_MEET ?? 45
/**
 * Encargado de pedir los datos necesarios para registrar el evento en el calendario
 */
const flowConfirm = addKeyword(EVENTS.ACTION).addAction(async (_, { flowDynamic }) => {
    await flowDynamic('Ok, voy a pedirte unos datos para agendar')
    await flowDynamic('¿Cual es tu nombre?')
}).addAction({ capture: true }, async (ctx, { state, flowDynamic, endFlow }) => {

    if (ctx.body.toLocaleLowerCase().includes('cancelar')) {
        clearHistory(state)
        return endFlow(`¿Como puedo ayudarte?`)

    }
    await state.update({ name: ctx.body })
    await flowDynamic(`Porfavor aclarame el lugar de salida y llegada usando este formato: Comas -> Megaplaza`)
})
    .addAction({ capture: true }, async (ctx, { state, flowDynamic, fallBack }) => {

        if (!ctx.body.includes('->')) {
            return fallBack(`Porfavor usa este formato, con flechita incluida: Comas -> Megaplaza`)
        }

        const dateObject = {
            name: state.get('name'),
            place: ctx.body,
            startDate: format(state.get('desiredDate'), 'yyyy/MM/dd HH:mm:ss'),
            duration: DURATION_MEET as string,
            number: ctx.from
        }

        await appToCalendar(dateObject)
        
        clearHistory(state)
        await flowDynamic('Listo! agendado Buen dia')
    })

export { flowConfirm }