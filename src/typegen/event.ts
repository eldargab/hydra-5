import {getTypeHash} from "../metadata/hash"
import {Spec, Ti} from "../metadata/base"
import {arrayEquals} from "../util/util"


export interface Event {
    spec: Spec
    pallet: string
    name: string
    fields: Field[]
    docs: string[]
}


interface Field {
    name: string | null
    type: Ti
    docs: string[]
}


export function eventEquals(a: Event, b: Event): boolean {
    if (a.pallet !== b.pallet || a.name !== b.name) return false
    return arrayEquals(a.fields, b.fields, (fa, fb) => {
        let ha = getTypeHash(a.spec.metadata.asLatest, fa.type)
        let hb = getTypeHash(b.spec.metadata.asLatest, fb.type)
        return ha === hb && fa.name === fb.name
    })
}
