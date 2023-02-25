export function getQueryParams(query) {
    const formattedQuery =
        query
        .substr(1) // take off query's first letter
        .split("&") // split the string by each &, transforming it all in an array
        .reduce((acc, param) => {
            const [key, value] = param.split("=") // get both values comming from this split and put them into variables using pattern match

            acc[key] = value === undefined ? true : value // sets the value to the accumulator property that owns the same name as key var (or create this prop)
            return acc
        }, {})

    return formattedQuery
}