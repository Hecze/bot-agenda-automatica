import { addKeyword, EVENTS } from "@builderbot/bot";
import AIClass from "../services/ai";
import { clearHistory, getHistoryParse, handleHistory } from "../utils/handleHistory";
import { generateTimer } from "../utils/generateTimer";
import { getCurrentCalendar } from "../services/calendar";
import { getFullCurrentDate } from "src/utils/currentDate";
import { flowConfirm } from "./confirm.flow";
import { flowFirstStep } from "./firstStep.flow";
import { addMinutes, isWithinInterval, format, parse, addDays } from "date-fns";
import { es } from "date-fns/locale";

const DURATION_MEET = process.env.DURATION_MEET ?? 45

const PROMPT_FILTER_DATE = `
### Contexto
Eres un asistente de inteligencia artificial. Tu propósito es determinar la fecha y hora que el cliente quiere, en el formato yyyy/MM/dd HH:mm:ss.

### Fecha y Hora Actual en formato (yyyy/MM/dd HH:mm)
{CURRENT_DAY}

### Registro de Conversación:
{HISTORY}

Asistente: "{respuesta en formato (yyyy/MM/dd HH:mm:ss)}"
`;

const generatePromptFilter = (history: string) => {
    const nowDate = getFullCurrentDate();
    const mainPrompt = PROMPT_FILTER_DATE
        .replace('{HISTORY}', history)
        .replace('{CURRENT_DAY}', nowDate);

    return mainPrompt;
}



const flowSchedule = addKeyword(EVENTS.ACTION).addAction(async (ctx, { extensions, state, flowDynamic, gotoFlow }) => {

    await flowDynamic([{
        body: `Dame un momento para consultar la agenda...`,
        delay: 1000
    }])
    const ai = extensions.ai as AIClass;
    const history = getHistoryParse(state);
    const list = await getCurrentCalendar()

    const listParse = list
        .map((d) => parse(d, 'yyyy/MM/dd HH:mm:ss', new Date()))
        .map((fromDate) => ({ fromDate, toDate: addMinutes(fromDate, +DURATION_MEET) }));

    const promptFilter = generatePromptFilter(history);

    const { date } = await ai.desiredDateFn([
        {
            role: 'system',
            content: promptFilter
        }
    ]);


    try {
        const desiredDate = parse(date, 'yyyy/MM/dd HH:mm:ss', new Date());

        const isDateAvailable = listParse.every(({ fromDate, toDate }) => !isWithinInterval(desiredDate, { start: fromDate, end: toDate }));

        if (!isDateAvailable) {
            const m = 'Lo siento, esa hora ya está reservada. Por favor elija otra';
            await flowDynamic([{
                body: m,
                delay: 1000
            }])
            await handleHistory({ content: m, role: 'assistant' }, state);
            return gotoFlow(flowFirstStep)
        }

        const formattedDateFrom = format(desiredDate, 'hh:mm a');
        const dayOfWeek = format(desiredDate, 'EEEE', { locale: es }); // Obtener el día de la semana en español


        // Obtener la fecha de mañana
        const tomorrow = addDays(new Date(), 1);
        // Establecer el tiempo a las 00:00:00 para comparar solo las fechas
        const startOfTomorrow = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate());

        // Lógica para verificar si la fecha deseada es anterior a mañana
        if (desiredDate < startOfTomorrow) {
            const m = 'Lo siento, las reservas son con un día de anticipación.';
            await flowDynamic([{
                body: m,
                delay: 1000
            }])
            await handleHistory({ content: m, role: 'assistant' }, state);
            return gotoFlow(flowFirstStep);
        }


        const message = `¡Perfecto! Tenemos disponibilidad a las ${formattedDateFrom} el día  (${dayOfWeek}) ${format(desiredDate, 'dd/MM/yyyy')} . ¿Confirmo tu reserva? dime: *si*, *no* `;
        await handleHistory({ content: message, role: 'assistant' }, state);
        await state.update({ desiredDate })

        const chunks = message.split(/(?<!\d)\.\s+/g);
        for (const chunk of chunks) {
            await flowDynamic([{ body: chunk.trim(), delay: generateTimer(150, 250) }]);
        }
    }
    catch {
        const m = 'Lo siento, no pude entender la fecha';
        await flowDynamic([{
            body: m,
            delay: 1000
        }])
        await handleHistory({ content: m, role: 'assistant' }, state);
        return gotoFlow(flowFirstStep)
    }



}).addAction({ capture: true }, async ({ body }, { gotoFlow, flowDynamic, state, endFlow, fallBack }) => {

    if (body.toLowerCase().includes('si') || body.toLowerCase().includes('confirmar') || body.toLowerCase().includes('sí') || body.toLowerCase().includes('claro')) return gotoFlow(flowConfirm)

    if (body.toLowerCase().includes('cancelar') || body.toLowerCase() == 'salir') {
        await clearHistory(state)
        return endFlow("cita cancelada.")
    }

    if (body.toLowerCase() == 'no' || body.toLowerCase() == 'nop' || body.toLowerCase() == 'nope' || body.toLowerCase() == 'nada' || body.toLowerCase() == 'nou') {
        await state.update({ desiredDate: null })
        return gotoFlow(flowFirstStep)
    }

    await flowDynamic([{
        body: "🤔",
        delay: 1000
    }])
    return fallBack('¿eso es un sí o un no?')

})

export { flowSchedule }