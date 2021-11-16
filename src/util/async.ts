import {assertNotNull} from "./util"


export class Channel<T> {
    private buf: T[] = []
    private drained: Future<void> | undefined
    private takes: Future<T>[] = []

    constructor(private capacity: number) {}

    put(item: T): Promise<void> {
        let take = this.takes.shift()
        if (take) {
            take.resolve(item)
            return Promise.resolve()
        }
        this.buf.push(item)
        if (this.buf.length >= this.capacity) {
            this.drained = this.drained || new Future()
            return this.drained.promise
        } else {
            return Promise.resolve()
        }
    }

    take(): Promise<T> {
        if (this.buf.length) {
            let value = this.buf.shift()!
            if (this.buf.length < this.capacity) {
                let drained = this.drained
                this.drained = undefined
                drained?.resolve()
            }
            return Promise.resolve(value)
        } else {
            let future = new Future<T>()
            this.takes.push(future)
            return future.promise
        }
    }
}


export class Future<T> {
    private result?: {value: T, error: null} | {error: Error}
    private cb?: () => void

    resolve(value: T): void {
        this.result = {value, error: null}
        this.cb?.()
    }

    reject(error: Error): void {
        this.result = {error}
        this.cb?.()
    }

    public readonly promise = new Promise<T>((resolve, reject) => {
        if (this.result) {
            this.resolvePromise(resolve, reject)
        } else {
            this.cb = () => this.resolvePromise(resolve, reject)
        }
    })

    private resolvePromise(resolve: (value: T) => void, reject: (error: Error) => void) {
        let result = assertNotNull(this.result)
        if (result.error == null) {
            resolve(result.value)
        } else {
            reject(result.error)
        }
    }
}

