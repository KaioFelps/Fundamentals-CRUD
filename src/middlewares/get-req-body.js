export async function getReqBody(req, res) {
    try {
        const buffers = []

        for await (const chunk of req) {
            buffers.push(chunk)
        }

        const newBufferedResponse = Buffer.concat(buffers)

        req.body = JSON.parse(newBufferedResponse.toString())
    }
    catch {
        req.body = null
    }
}