import 'dotenv/config'
import { createBot, MemoryDB } from '@builderbot/bot'
import AIClass from './services/ai';
import flow from './flows';
import { provider } from './provider';
import express from 'express';
import bodyParser from 'body-parser';

const PORT = parseInt(process.env.PORT ?? '3000', 10); // Conversión a número con base 10
const ai = new AIClass(process.env.OPEN_API_KEY, 'gpt-3.5-turbo');

const app = express();
app.use(bodyParser.json());

const main = async () => {


  const bot = await createBot({
    flow,
    provider,
    database: new MemoryDB(),
  }, { extensions: { ai } });

  const { httpServer } = bot;

  // Endpoint para agregar un número a la lista negra
app.post("/blacklist/add", async (req, res) => {
    try {
      const { number } = req.body;
      const result = await bot.dynamicBlacklist.add(number);
      console.log("Added number to blacklist:", number);
      res.json({ number, added: true, result });
    } catch (error) {
      res.status(500).send(error.message);
    }
  });
  
  // Endpoint para eliminar un número de la lista negra
  app.post("/blacklist/remove", async (req, res) => {
    try {
      const { number } = req.body;
      const result = await bot.dynamicBlacklist.remove(number);
      console.log("Removed number from blacklist:", number);
      res.json({ number, removed: true, result });
    } catch (error) {
      res.status(500).send(error.message);
    }
  });
  
  // Endpoint para obtener la lista negra
  app.get("/blacklist/getlist", async (req, res) => {
    try {
      const list = await bot.dynamicBlacklist.getList();
      res.json(list);
    } catch (error) {
      res.status(500).send(error.message);
    }
  });
  
  // Endpoint para verificar si un número está en la lista negra
  app.post("/blacklist/check", (req, res) => {
    try {
      const { number } = req.body;
      const result = bot.dynamicBlacklist.checkIf(number);
      res.json({ number, isBlacklisted: result });
    } catch (error) {
      res.status(500).send(error.message);
    }
  });

  httpServer(+PORT);
  console.log(`Bot server ready on port ${PORT}`);

  app.listen(4000, () => {
    console.log(`HTTP server listening on http://localhost:${4000}`);
  });
}

main();
