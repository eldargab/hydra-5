import fs from "fs"
import {decodeMetadata, Spec} from "./base"


export class SpecCache {
    public cache: Spec[] = []

    constructor(private file: string) {
        if (fs.existsSync(file)) {
            this.cache = SpecCache.read(file)
        }
    }

    get(specVersion: number): Spec | undefined {
        return this.cache.find(spec => spec.specVersion === specVersion)
    }

    add(spec: Spec): void {
        this.cache.push(spec)
    }

    save(): void {
        fs.writeFileSync(this.file, JSON.stringify(this.cache, null, 2))
    }

    static read(file: string): Spec[] {
        let json = fs.readFileSync(file, 'utf-8')
        return JSON.parse(json).map((e: any) => {
            e.metadata = decodeMetadata(e.metadata)
            return e
        })
    }
}
