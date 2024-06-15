import { addKeyword, EVENTS } from "@builderbot/bot";

const flowJustRead = addKeyword(EVENTS.ACTION).addAction(async () => {
        //no escribimos nada, pasamos defrente a leer el mensaje en el Action
}).addAction({ capture: true }, async (ctx, { endFlow, gotoFlow }) => {
    //si escribimos insertar o encender activamos el chatbot redirigiendo al flujo principal
    if (ctx.body.toLocaleLowerCase().includes('insertar') || ctx.body.toLocaleLowerCase().includes('encender') || ctx.body.toLocaleLowerCase().includes('activar')) {
        //console.log("el usuario intenta activar el chatbot")
        return endFlow(`Chatbot activado`);
    }
    //si no escribes insertar o encender nos mantenemos en el flujo
    return gotoFlow(flowJustRead)
})


export { flowJustRead }