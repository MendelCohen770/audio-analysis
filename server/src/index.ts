import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import OpenAI from "openai";
import { createServer } from "http";

dotenv.config();
const openai = new OpenAI();

const app = express();
const PORT = process.env.PORT || 3000;

const server = createServer(app);
app.use(cors());
app.use(express.json());

app.post("/api/chat", async (req : Request, res : Response) => {
    const text = req.body.text;
    if(!text){
        const response = "המשתמש לא הזכיר חיות."
        return res.status(400).json(response);
    }
    try{
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: "אתה מזהה באילו חיות המשתמש הזכיר אם הוא אוהב או לא אוהב אותן, וענה בכמות מילים מינימלית. לדוגמא:המשתמש מאוד אוהב כלבים, המשתמש מחבב חתולים, המשתמש ממש שונא נחשים, המשתמש אין לו בעיה עם קופים."
                },
                {
                    role: "user",
                    content: text
                }
            ]
        });
        const response = completion.choices[0].message.content;
        res.status(200).json({response});
    }catch(error){
        console.error("Error in chat completion:", error);
        res.status(500).json({error: "Internal server error"});
    }
})

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})