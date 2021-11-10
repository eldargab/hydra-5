import {getTypeHash} from "../metadata/hash"
import {Spec, Ti} from "../metadata/native"
import {arrayEquals} from "../util/util"


export interface Event {
    spec: Spec
    pallet: string
    name: string
    fields: Field[]
}


interface Field {
    name: string | null
    type: Ti
    docs: string[]
}


export function eventEquals(a: Event, b: Event): boolean {
    if (a.pallet !== b.pallet || a.name !== b.name) return false
    return arrayEquals(a.fields, b.fields, (fa, fb) => {
        let ha = getTypeHash(a.spec.metadata, fa.type)
        let hb = getTypeHash(b.spec.metadata, fb.type)
        return ha === hb && fa.name === fb.name && arrayEquals(fa.docs, fb.docs)
    })
}
