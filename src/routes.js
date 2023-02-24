import { randomUUID } from "node:crypto"

const data = [
    {
        title: "Fazer arroz",
        description: "Fazer arroz",
        id: 2,
    }
]

export const routes = [
    {
        method: "GET",
        path: "/tasks",
        handler: (req, res) => {
            return res.setHeader("content-type", "application/json").writeHead(200).end(JSON.stringify(data))
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
                title: body.title,
                description: body.description,
                id: randomUUID()
            }

            data.push(newTask)
            console.log(data)

            return res.writeHead(201).end()
        }
    }
]