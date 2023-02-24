import http from "node:http"
import { getReqBody } from "./middlewares/get-req-body.js"
import { routes } from "./routes.js"

const server = http.createServer(async (req, res) => {
    const { url, method } = req
    const activeRoute = routes.find(route => route.method === method && route.path === url)

    await getReqBody(req, res)
    
    if (activeRoute === undefined) {
        return res.writeHead(404).end()
    }

    activeRoute.handler(req, res)
})

server.listen(80)