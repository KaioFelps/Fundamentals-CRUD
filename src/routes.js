import { randomUUID } from "node:crypto"
import { Database } from "./database.js"
import { buildRoutePath } from "./utils/build-route-path.js"

import { parse } from "csv-parse"
import stream from "node:stream"

const database = new Database()

export const routes = [
    {
        method: "GET",
        path: buildRoutePath("/tasks"),
        handler: (req, res) => {
            const searchQuery = {
                title: req.query.title !== undefined ? req.query.title.replaceAll("%20", " ") : "",
                description: req.query.description !== undefined ? req.query.description.replaceAll("%20", " ") : "",
                id: req.query.id !== undefined ? req.query.id : "",
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
        method: "POST",
        path: buildRoutePath("/upload"),
        handler: (req, res) => {
            const csvTasks = []

            const streamBuffer = new stream.PassThrough()

            streamBuffer.end(req.body)

            streamBuffer.pipe(parse({from_line: 2, delimiter: ","}))
                .on("data", (data) => {
                    return csvTasks.push({
                        title: data[0],
                        description: data[1]
                    })
                })
                .on("end", () => {
                    csvTasks.forEach((task) => {
                        if(!task.title || !task.description) return;
                        if(task.title.length < 1 || task.description.length < 1) return;

                        const newTask = {
                            id: randomUUID(),
                            title: task.title,
                            description: task.description,
                            completed_at: null,
                            created_at: new Date().toISOString(),
                            updated_at: null,
                        }

                        database.insert("tasks", newTask)
                        
                        return res.writeHead(201).end()
                    })
                })
                .on("error", (error) => {
                    console.log(error)
                    res.writeHead(500).end()
                })
        }
    },
    {
        method: "DELETE",
        path: buildRoutePath("/tasks/:id"),
        handler: (req, res) => {
            const { id } = req.params

            if(!id) {
                return res.writeHead(400).end()
            }

            database.delete("tasks", id)

            return res.writeHead(204).end();
        }
    },
    {
        method: "PATCH",
        path: buildRoutePath("/edittask/:id"),
        handler: (req, res) => {
            const { id } = req.params
            const { title, description } = req.body

            if (!title && !description) {
                return res.writeHead(400).end("N??o foram enviadas novas informa????es.");
            }

            const newData = {
                title: title,
                description: description,
                updated_at: new Date().toISOString(),
            }

            database.update("tasks", id, newData)
            res.writeHead(202).end()
        }
    },
    {
        method: "PATCH",
        path: buildRoutePath("/tasks/:id/toggle"),
        handler: (req, res) => {
            const { id } = req.params
            
            const [currentTask] = database.select("tasks", { id, })
            const { completed_at } = currentTask
            
            if (completed_at === null) {
                database.update("tasks", id, {
                    completed_at: new Date().toISOString()
                })
            }

            else {
                database.update("tasks", id, {
                    completed_at: null
                })
            }

            res.writeHead(201).end()
        }
    }
]