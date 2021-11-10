import fetch from "node-fetch"


export async function indexerRequest<T=any>(indexerUrl: string, query: string): Promise<T> {
    let response = await fetch(indexerUrl, {
        method: 'POST',
        body: JSON.stringify({query}),
        headers: {
            'content-type': 'application/json',
            'accept': 'application/json'
        }
    })
    if (!response.ok) {
        throw new Error(`Got http ${response.status}, body: ${await response.text()}`)
    }
    let result = await response.json()
    return result.data as T
}
