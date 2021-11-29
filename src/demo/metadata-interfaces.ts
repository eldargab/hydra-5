import {OldTypeRegistry} from "../metadata/old/typeRegistry"
import * as metadataDefinition from "../metadata/old/definitions/metadata"
import {Interfaces} from "../typegen/ifs"
import {FileOutput} from "../util/out"


function main() {
    let registry = new OldTypeRegistry(metadataDefinition)
    let type = registry.use('Metadata')
    let ifs = new Interfaces(registry.getTypeRegistry())
    ifs.use(type)
    let out = new FileOutput('src/metadata/interfaces.ts')
    ifs.generate(out)
    out.write()
}


main()
