import { randomUUID } from "node:crypto"
import { Database } from "./database.js"
import { buildRoutePath } from "./utils/build-route-path.js"

const database = new Database()

export const routes = [
    {
        method: "GET",
        path: buildRoutePath("/tasks"),
        handler: (req, res) => {
            const searchQuery = {
                title: req.query.title !== undefined ? req.query.title.replaceAll("%20", " ") : "",
                description: req.query.description !== undefined ? req.query.description.replaceAll("%20", " ") : ""
            }

            const data = database.select("tasks", searchQuery)
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
        path: buildRoutePath("/tasks"),
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
                created_at: new Date().toISOString(),
                updated_at: null,
            }

            database.insert("tasks", newTask)
            return res.writeHead(201).end()
        }
    },
    {
        method: "DELETE",
        path: buildRoutePath("/tasks/:id"),
        handler: (req, res) => {
            return res.writeHead(200).end();
        }
    }
]