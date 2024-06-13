import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import axios from "axios";

async function Zzz(number: string, method: string, route: "check" | "add" | "remove" | "getlist") {
    let url = `http://localhost:4000/blacklist/${route}`;
  
    try {
      let response;
      if (method === "POST") {
        response = await axios.post(url, { number });
      } else if (method === "GET") {
        url = `${url}/${number}`;
        response = await axios.get(url);
      } else {
        console.error("Invalid HTTP method:", method);
        return;
      }
  
      return response.data;
    } catch (error) {
      console.error("Request error:", error.message);
    }
  }

export { Zzz };
