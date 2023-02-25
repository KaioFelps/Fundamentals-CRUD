import fs from "node:fs/promises"
// we gonna use fs because we'll be writting everything on a file, not a js variable.

const dbPath = new URL("../db.json", import.meta.url)
// it's refering to a db.json file on this current directory's parent.

export class Database {
    #database = {}

    constructor() {
        fs.readFile(dbPath, "utf-8")
        .then(data => {
            this.#database = JSON.parse(data)
        })
        // if there is something already in the file, it will pass everything from the file to database object
        .catch(() => {
            this.#persist()
        })
        // if there ain't anything or the file doesn't exist, it creates one with the current content of database object (empty object)
    }

    #persist() {
        fs.writeFile(dbPath, JSON.stringify(this.#database))
        // write (or create, if there ain't file) and put database const value into it
    }

    select(table, search) {
        let data = this.#database[table] ?? []
        
        const thereIsSearch =
        search.title !== "" || search.description !== "" || search.id !== ""

        if (thereIsSearch) {
            const searchObjectParsedToArray = Object.entries(search)
            // {title: "suco", description: "fazer suco"}
            // [ [ 'title', 'suco' ], [ 'description', 'fazer suco' ] ]
            
            data = data.filter(row => {
                return searchObjectParsedToArray.some(([key, value]) => {
                    if (value === "" || value === undefined || !value) return;

                    if (key.toLocaleLowerCase() === "id") {
                        return row[key] === value
                    }

                    if (row[key].toLocaleLowerCase().includes(value.toLocaleLowerCase())) {
                        return row
                    }
                })
            })
        }

        return data
    }

    insert(table, data) {
        if (Array.isArray(this.#database[table])) {
            this.#database[table].push(data)
        }
        else {
            this.#database[table] = [data]
        }

        this.#persist()
        return data
    }

    delete(table, id) {
        const rowIndex = this.#database[table].findIndex(row => row.id === id)

        if (rowIndex > -1) {
            this.#database[table].splice(rowIndex, 1)
            this.#persist()
        }
    }

    update(table, id, data) {
        const rowIndex = this.#database[table].findIndex(row => row.id === id)

        if(rowIndex > -1) {
            const dataParsedToArray = Object.entries(data)

            dataParsedToArray.forEach(([key, value]) => {
                if (value === undefined) {
                    return;
                }

                this.#database[table][rowIndex][key] = value
            })

            this.#persist()
        }
    }
}