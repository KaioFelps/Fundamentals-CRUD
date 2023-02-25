import { randomUUID } from "node:crypto"
import { Database } from "./database.js"

const database = new Database()

export const routes = [
    {
        method: "GET",
        path: "/tasks",
        handler: (req, res) => {
            const data = database.select("tasks")
            const parsedData = JSON.stringify(data)

            return (
                res
                .setHeader("content-type", "application/json")
                .writeHead(200)
                .end(parsedData)
            )
        }
    },
    {
        method: "POST",
        path: "/tasks",
        handler: (req, res) => {
            const { body } = req

            if ( !body.title || !body.description ) {
                const error = {
                    error: "Missing title or description."
                }

                return (
                    res
                    .setHeader("content-type", "application/json")
                    .writeHead(400)
                    .end(JSON.stringify(error))
                )
            }

            const newTask = {
                id: randomUUID(),
                title: body.title,
                description: body.description,
                completed_at: null,
                created_at: JSON.stringify(new Date().toISOString()),
                updated_at: null,
            }

            database.insert("tasks", newTask)
            return res.writeHead(201).end()
        }
    }
]