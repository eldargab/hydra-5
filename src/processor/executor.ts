import {Channel} from "../util/async"
import {DataBatch, IngestOptions} from "./ingest"


export class Executor {
    private batches = new Channel<DataBatch>(2)

    constructor(private options: IngestOptions) {}

    private async ingest() {

    }

    run() {

    }
}


