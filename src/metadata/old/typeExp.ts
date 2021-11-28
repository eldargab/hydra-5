
export type Type = NamedType | ArrayType | TupleType


export interface NamedType {
    kind: 'named'
    name: string
    params: (Type | number)[]
}


export interface ArrayType {
    kind: 'array'
    item: Type
    len: number
}


export interface TupleType {
    kind: 'tuple'
    params: Type[]
}


export function print(type: Type): string {
    switch(type.kind) {
        case 'array':
            return `[${print(type.item)}; ${type.len}]`
        case 'tuple':
            return `(${type.params.map(t => print(t)).join(', ')})`
        case 'named': {
            if (type.params.length == 0) {
                return type.name
            } else {
                return `${type.name}<${type.params.map(t => typeof t == 'number' ? ''+t : print(t)).join(', ')}>`
            }
        }
    }
}


export function parse(typeExp: string): Type {
    return new TypeExpParser(typeExp).parse()
}


class TypeExpParser {
    private tokens: string[] = []

    constructor(private typeExp: string) {
        let word = ''
        for (let i = 0; i < typeExp.length; i++) {
            let c = typeExp[i]
            if (/\w/.test(c)) {
                word += c
            } else {
                if (word) {
                    this.tokens.push(word)
                    word = ''
                }
                if (c.trim()) {
                    this.tokens.push(c)
                }
            }
        }
        if (word) {
            this.tokens.push(word)
        }
    }

    private tok(tok: string | RegExp): string | null {
        let current = this.tokens[0]
        let match = tok instanceof RegExp
            ? !!current && tok.test(current)
            : current === tok
        if (match) {
            this.tokens.shift()
            return current
        } else {
            return null
        }
    }

    private assertTok(tok: string | RegExp): string {
        return this.assert(this.tok(tok))
    }

    private nat(): number | null {
        let tok = this.tok(/^\d+$/)
        return tok == null ? null : Number.parseInt(tok)
    }

    private assertNat(): number {
        return this.assert(this.nat())
    }

    private name(): string | null {
        return this.tok(/^[a-zA-Z]\w*$/)
    }

    private assertName(): string {
        return this.assert(this.name())
    }

    private list<T>(sep: string, p: () => T | null): T[] {
        let item = p()
        if (item == null) return []
        let result = [item]
        while (this.tok(sep)) {
            item = p()
            if (item == null) {
                throw this.abort()
            } else {
                result.push(item)
            }
        }
        return result
    }

    private tuple(): TupleType | null {
        if (!this.tok('(')) return null
        let params = this.list(',', () => this.anyType())
        this.assertTok(')')
        return {
            kind: 'tuple',
            params
        }
    }

    private array(): ArrayType | null {
        if (!this.tok('[')) return null
        let item = this.assert(this.anyType())
        this.assertTok(';')
        let len = this.assertNat()
        if (this.tok(';')) {
            this.assertName()
        }
        this.assertTok(']')
        return {
            kind: 'array',
            item,
            len
        }
    }

    private namedType(): NamedType | null {
        let name = this.name()
        if (name == null) return null
        let params: (Type | number)[] = []
        if (this.tok('<')) {
            params = this.list(',', () => this.anyType() || this.nat())
            this.assertTok('>')
        }
        return {
            kind: 'named',
            name,
            params
        }
    }


    private anyType(): Type | null {
        return this.tuple() || this.array() || this.namedType()
    }

    parse(): Type {
        let type = this.assert(this.anyType())
        if (this.tokens.length > 0) {
            throw this.abort()
        }
        return type
    }

    private abort(): Error {
        return new Error(`Invalid type expression: ${this.typeExp}`)
    }

    private assert<T>(val: T | null): T {
        if (val == null) {
            throw this.abort()
        } else {
            return val
        }
    }
}
