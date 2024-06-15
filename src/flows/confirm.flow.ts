import { addKeyword, EVENTS } from "@builderbot/bot";
import { clearHistory } from "../utils/handleHistory";
import { format } from "date-fns";
import { appToCalendar } from "src/services/calendar";
import { flowJustRead } from "./justRead.flow";

const DURATION_MEET = process.env.DURATION_MEET ?? 45
/**
 * Encargado de pedir los datos necesarios para registrar el evento en el calendario
 */
const flowConfirm = addKeyword(EVENTS.ACTION)

    .addAction(async (_, { flowDynamic }) => {
        await flowDynamic('Ok, voy a pedirte unos datos para agendar')
        await flowDynamic('¿Cual es tu nombre?')
    })

    .addAction({ capture: true }, async (ctx, { state, flowDynamic, fallBack, endFlow }) => {
        if (ctx.body.toLocaleLowerCase().includes('cancelar')) {
            clearHistory(state)
            return endFlow()

        }

        if (!isValidName(ctx.body)) {
            return fallBack('Por favor, ingresa un nombre válido.');
        }
        await state.update({ name: ctx.body })
        await flowDynamic(`Anotado! Ahora porfavor aclarame el lugar de salida y llegada usando este formato: Comas -> Megaplaza`)
    })

    .addAction({ capture: true }, async (ctx, { state, flowDynamic, fallBack, endFlow }) => {
        if (!ctx.body.includes('>')) {
            if (ctx.body.toLocaleLowerCase() == "no") return fallBack(`😥`)
            if (ctx.body.toLocaleLowerCase() == "cancelar") return endFlow(`cita cancelada.`)

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
        await flowDynamic('Listo! agendado, Buen dia')
    })

    .addAction({ capture: true }, async (ctx, { state, flowDynamic, endFlow, gotoFlow }) => {
        if (ctx.body.toLocaleLowerCase().includes('gracias')) {
            return endFlow(`Un placer! Recuerda que puedes volver a agendar una cita escribiendo *Agendar*`);
        }
        return gotoFlow(flowJustRead)
    })

function isValidName(name: string) {
    const lowerCaseName = name.toLowerCase();
    const nameRegex = /^[a-zA-Z\s]{3,50}$/; // Permitir solo letras y espacios, longitud mínima de 3 caracteres
    const spaceCount = (name.match(/\s/g) || []).length; // Contar espacios
    const containsMedia = lowerCaseName.includes('media'); // Verificar si contiene la palabra "media"
    const words = name.split(/\s+/); // Dividir el nombre en palabras

    const longWords = words.some(word => word.length > 11); // Verificar si alguna palabra tiene más de 11 caracteres
    const invalidWordPattern = words.some(word => /([aeiou]{4,}|[bcdfghjklmnpqrstvwxyz]{4,})/i.test(word)); // Verificar más de dos vocales o consonantes juntas

    return nameRegex.test(name) && spaceCount <= 4 && !containsMedia && !longWords && !invalidWordPattern;
}


export { flowConfirm }