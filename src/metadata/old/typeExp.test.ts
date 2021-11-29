import expect from "expect"
import {parse, print, Type} from "./typeExp"

describe('Type expressions', function () {
    describe('TypeExpParser', function () {
        function test(exp: string, type: Type): void {
            it(exp, () => {
                let parsed = parse(exp)
                expect(parsed).toEqual(type)
            })
        }

        test('A', {
            kind: 'named',
            name: 'A',
            params: []
        })

        // test('Vec<u8>', {
        //     kind: 'named',
        //     name: 'Vec',
        //     params: [{
        //         kind: 'named',
        //         name: 'u8',
        //         params: []
        //     }]
        // })

        test('[A; 10]', {
            kind: 'array',
            item: {
                kind: 'named',
                name: 'A',
                params: []
            },
            len: 10
        })

        test('[u8; 16; H128]', {
            kind: 'array',
            item: {
                kind: 'named',
                name: 'u8',
                params: []
            },
            len: 16
        })

        test('(A, B, [u8; 5])', {
            kind: 'tuple',
            params: [
                {
                    kind: 'named',
                    name: 'A',
                    params: []
                },
                {
                    kind: 'named',
                    name: 'B',
                    params: []
                },
                {
                    kind: 'array',
                    item: {
                        kind: 'named',
                        name: 'u8',
                        params: []
                    },
                    len: 5
                }
            ]
        })
    })

    describe('print(parse(exp)) == exp', function () {
        function test(exp: string): void {
            it(exp, () => {
                let type = parse(exp)
                let printed = print(type)
                expect(printed).toEqual(exp)
            })
        }

        test('A')
        // test('Vec<u8>')
        test('[A; 20]')
        test('(A, B, C, [Foo; 5])')
    })
})




