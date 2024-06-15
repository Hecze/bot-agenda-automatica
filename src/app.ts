import 'dotenv/config'
import { createBot, MemoryDB } from '@builderbot/bot'
import AIClass from './services/ai';
import flow from './flows';
import { provider } from './provider';

const PORT = parseInt(process.env.PORT ?? '3000', 10); // Conversión a número con base 10
const ai = new AIClass(process.env.OPEN_API_KEY, 'gpt-3.5-turbo');

const main = async () => {

  const bot = await createBot({
    flow,
    provider,
    database: new MemoryDB(),
  }, { extensions: { ai } });

  const { httpServer } = bot;


  httpServer(+PORT);
  console.log(`Bot server ready on port ${PORT}`);

}

main();
