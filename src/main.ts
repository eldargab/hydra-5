import * as fs from "fs"
import {kusama} from "./demo/chain"
import {decodeBinary} from "./scale/decode"
import {getTypesFromMetadata} from "./scale/util"


async function main(): Promise<void> {
    // const data = toBin("0x4000000000000000f8c880090000000002000000010000003501e8030000970a67f13c63f060eb87777c4b68a4493931715530f8d9f69f6ff0ed87918844329d9d03239fcabec65712c2d49eaab86c6e99bdd228e7abc90f2b5223fe441159fbb85ae749506da26bb91a2a1ffd5a06e9e22be5bd0925ae68c2ac0bbf6265b6038ab854eaa4c8067f318575870d14a1692ade681ddffd9e6f37abf1ec11850cd1fc4ae08b277eae64be8d85d2165be01b04505a72e6be823f1b24df628ea792a73b0c4bdfc952b5d7b05b9f48b63a6ffd6e350821893f285f971ba94a0e73786251cdc7534c2ee471058f48673b9d934c33b4f20259dda40e8c09bbeeeb824ef7473442e90cb811e48c83a18c5c230e2c0da4a1ee565e0c1e758cc62bfac8671aa5730f5f72e4b17a9fcb4ff7dbfa006f68e01f280873eeedaaea9d325636d298faf2cf23958355804c94691a610d792f5c518b1f08fd78fc95fa5d202d21e90246c627785b5f9555633b5015d54a823def397ea3f6ef7033f24b4053b15aec1e5eea4300c973cb3e159225a21e3dc266b857f6f8c82e85d4fd5df91bfe6baaa354cceb7ce4da5629ee687ddc8d3906e981c901d56c5e8715edae94bee4e5c35af63645e10806617572612084b720080000000005617572610101849a2f00f099c903fd1b776553d57ca1be3a02ddf44546b6bd4f3924b41b1e3e08c3d6c3ef5ee2c44466708b98096fca2af94d57d70d03b6d8131ea7e6832b8f00000000030000000000010000003501d4070000970a67f13c63f060eb87777c4b68a4493931715530f8d9f69f6ff0ed8791884442ed128f3070d8c0f4efa2cdb1d676ceb4705f8c6bc6a3b71a6f1b0afdbc100086b57c8ab049fa13e2d6983afae568923575a336a70f87c05c544d35618d455e188ba822f58033031686f1943ce828b692228f18e48376df0a5dfb344e68184dcd6528cfd9e1104fcf8aec144e25bf1c0b8b790626717f998fd7b46124525d0f367c58adefda1299cc62c2ff06a9a7fcb1db3144192b161a55205f9e808ea902e2ae9f836e73650aaa5ac6c9bc505ad4778a38673545bcaa159b918c8acd138b7d448ffb20374dbb6301a1029ab8ab1504b12c449d00d0ace2b10659de1dcead35159d29f1bc7ca22f86300da98e02d8b101cc2714b4e6681616aa5e53c51ebbb239c7b99e6c929c0170442d1c29df94da60a8debf90af7a9d2777be0abe9d24e902f8be335bab1a6288460d7368f54f15df926a9e474a5a3a13dea9824c49e54db4da7f2a009de56bb25fe8e12a18771592b8eaa6b524fa494922dded016723f93fbe82645e88e3563ea816a0f97859cc73b31083e7f2ff1ef911e7049773eb355a4756e25e0806617572612084b72008000000000561757261010130436cb29d3fd4ddd996b078f23e28698f983609a60bc51b19333b96d235896c9c2e274eacbec55463476c8efb51261b5073871051db165e1e8ad5761aede78f0300000006000000000001000000350125080000970a67f13c63f060eb87777c4b68a4493931715530f8d9f69f6ff0ed8791884462e2563cabc32bfb099d3d296f99b431b18b74456ec785c65dafe2be800e3f421c9760f2a40d129d0de6ead24a40feed91b3bdd789ffe1fae76dd7a550bdc6041783bc5fecbce3fe1d823e89ad76640af60681b9eaf0539869eea5535de8ed03d87a6334d5b5140c176ea0acf80ecc5d82686924886aa8cc1de55ea8b5ceda7f84e5935b347bde0d4824b8dfeb95cbba94234fdf19e40bd09b8adae361de842cd4d368f11aad8f76598a8af0c9f870ffcd1d9f4381ef714c3b519eced963c287de323dba5a720417911226164623153c1bbdd3f33916b9be07364376eefb76c491d949884c9bc067a7cfcd2ee808e89625035c5b1092ac483340957277bfaa4b6300ad5264de6e4d4e35a6cf24332a87be8f4f9dd7ebb34f5cf317ea583c4358e902cc3db54bdd3e0da6c288f43f02dbd808a29eeb10acc9b469e4dfacfe3060c9b0a6300b001d7d784e48bdcdea1ced937f7d2565c08492cb5519d4c46399843052474798c1d943a0c9693898c92ab55625cb3f889f26e6b8ed47272ed76cc3f2521c7f21cd0806617572612084b72008000000000561757261010160d4877ac5087983c1e2d7048a42622ca727835b2ae123cad93b192b0b4db6126cb8db5ed6efe8e22d5de6d8244c30bb177b34b6fefc9d7a99671e28452e668e070000000a000000000001000000350126080000970a67f13c63f060eb87777c4b68a4493931715530f8d9f69f6ff0ed879188442e5a70c523364f4187e3873e9b494552975192f2d6570f332ba0b819ff128062412fb9b1343ebd65da1dbbad0f28fa74f3138eb1f5ac42dc4b087bf6aae9c0f1c10428db12c688784d12425e257f1436f1a13e12b0fac7e09c2ef782884fdae288a70a0827669d8c4c1e153f9699157c249c91fd171288c1c82c343e2e5329052a2cbd6da16d035fedcf8286363b5cfff146ac95534b1eb9df515757ff41473f899ad3f78b12ad415a2fb3b0af28eed976ef75bf910c63891918463ed196af83daf67887703f0d72a942f0666c82a6ef8df9f3419a7c7fbd9c021c76deaa98431d842461610b3b08c6ca9cf6a102719e6e67c672f449fb8ffb3ce6e0af3236b045cba2d8e3f0bc713d27a97b6868ec464e32b9e1ce40729f08a242a8c0749e46e9025dbc8c945c125682246a5a3a4dc4f5db1071bacbead573fcb36e20406d5e95e926e31600ccb6952f6b8451707882e07dbfce85a875e7204744c1f9baee14cf272ffff392c5967d1da53c318c529c319fef924106be7b9a8ed6aafd2d96c9c133fefc63aa0806617572612084b7200800000000056175726101019486d01932086dd193762964375e7bd944eda068c51369fd930b79e8e0437d209f4238bd0431b3cb61be4ba663bbbda1a53730f13001027ff2adc811f3a35885080000000b0000000000010000003500d007000052396b4d81153bcab7f383bf870c3d271b19e35fc834fa7f89fc0baf19823eb3c45e3f3817cff0461c43385de165f5eb18b6cdc9147bf2eef3f4ce99afc7485ed943f09bde7d796ebcf315308e21ecb1f2c61f977f8a92e0dbc0105c6f963dd95d6ed9829561c39d688447413ef6c0372df019ad69f75f58402eabc60d646224109eff7ea1f7a869883d14c2ae823ee289393aa2b9358f7d8ee760f316c0196d24a0dda1d29558bc5331036721a5111826c6efd04104fefb61d3eec27bf74d2f6bcef1abe2b44bbcfb29552d3009901f05238adbb7abf10ecc1e354ae1e70584ff42916291fe587927d39279e75552858ea30f183aed9d840848f16ed3d537ccce864af51bd0b781efb619d2d7f5c360dc72c15ea0be3646823c62166fe6fa9f3bcbfe68574af4d8876eb0a4e75c6b3a1d15222da3ff78aa069e3da0ffd5eb1ce902a133a650f06bb019427e57dfba29d2bf510c26d473a5ebc8ad31acfced1eb1ce6ae236001a2fd43761f8e9de2527af8ce4404fbfe612819e7d2b6c73e6dcc287c9d30ba180b7a1125b2b6818f64c9c6f350fade37ff515db3ade66540351bb0051c9075d0806617572612084b7200800000000056175726101018800ee6efd5a9834a93f60e9ce7c124107994f6a2b23f7cd870d1a89e2d9720f41b5dd276dff91cc15fa06050ec0195c1ae4c09f925659171706863940bd3f83010000000500000000000100000035002408000052396b4d81153bcab7f383bf870c3d271b19e35fc834fa7f89fc0baf19823eb3a45fe489f08876dd93330850f2a34dc246de42c5ba0efd0b51d890ef72775739cd1d18b75d97821c2192669a1b1cd9fb4caeefeb2498d2b53a8620e96fa1a24cbc67f2ee28aa00117d3ec90f88baa6f56663574212bd7c08015ad28733f397e7e4f3321c654a88f24a51219ea984e907122ab162dbcce2bb6a977c3f74f74bf7306320a43f4d10de4a00a454aee0918ed1619acf1101af3066972e74823eb458e0982a6a8397b8cf7685ad308ced6adfd1fa49216211ba7425e8e018a179ca81ffdc72f87fc34c40a529809c399cf99fedd996370cc772b5c51595e0fb2f7dd369248ec4a86bacbc60bc4d65df89ce7dedc436fa8a3a1934ee96f74de1af145d80e7b186c7085b0e369ede9d73686ea83a19a3a25005d9c11f9e4a9351df040fe90224132a3b1246d7efc37e373f66a85ece7cd369efac6aebda6dc7a13eb6089a8862bd1400725d7a343e29444c67f393be4212a8df930a5a7c223837f4f867e487005c88df943ab103cbef0125518e5049dc8926ea696778464a8c6b59728ca1e394af36240806617572612084b720080000000005617572610101a46b0efcd4328030c0bb20ef440e2f63364522ce5a3eb676de601115ead40345cf840fd60da25446d1b0bc87f1a96cd9464a9d520db4d8605d36e3fb08254286060000000a00000000000100000035002808000052396b4d81153bcab7f383bf870c3d271b19e35fc834fa7f89fc0baf19823eb30098a000c36260ebbcb781b8d131ed52358675f23ec929de5f050ecf0c5c9d0aa6e713246e85a5b1d6c51a674062a1a2a0cc75bbb13d25f1cda026e9b4b701edf8d7147305b71558bca2781b5598be832de0a149b9dc304487e0361079b21a9cb5d04f6939b13e7e6c0e73b2a2b0ae9d1301144015a40fa2417007df2b482d6f9a91a41bb6dd39e62666786ed316962b94b45d867ff3e8b55322109f0525e259d67cdc0464aa52aa728fd21f34c9563d527b2e3a911dde4c5c84746ae7ac9c8f8fcdd64c63856787d8d4cc66cb1c49ab1c94491eac066330b82a433db65617643cd446c9a1bd71d0ce47495a92d001a3047b17ea1afafade18e5892db4ebce4748f5790be22f893695b5f019a1ca9cd016a88ad8423e15e302a77a7433cc8010e9020d9e2b85621d5809954468660eef7dafb0a3e11770ff21b1f6572a279b1de2108a100f005ed61ac8275af9f9381c71dc986b9f87c1af2d9f1bd8ecddd55d4a3eb078a0dff9bbaf689cdbfd11dbdf1fb15f1b005fb946571c7e2be758f7bc1246eda551d10806617572612084b720080000000005617572610101aecac16fb06ad772b90075039210f99b80259a51a868541b17ebac4c418450068df560e35e8f219c54a3ec819af49f25b75a09defe27990fe0e62e5676894089090000000d00000000000100000000006046eb0e00000000020000000200000004086fd30ccc612a93f7c1cb592ab90b31984e3280230eb67c19aeb84ca7b34715192f891e0300000000000000000000000000000200000004026fd30ccc612a93f7c1cb592ab90b31984e3280230eb67c19aeb84ca7b3471519e5837ba18c94d76d165780873a85da12cd4c7e0715bd9c64370ede7b706041fc00b0ed347f0d0000000000000000000000000200000004076d6f646c70792f7472737279000000000000000000000000000000000000000025d47e02000000000000000000000000000002000000120625d47e02000000000000000000000000000002000000040708e34cd66129e197697554aa67af8b35d1daf4f6ed431afa2701bcbc320fe2070ab59f00000000000000000000000000000002000000040708e34cd66129e197697554aa67af8b35d1daf4f6ed431afa2701bcbc320fe2070ab59f0000000000000000000000000000000200000000006812490a00000000000000")
    // let types = getTypesFromMetadata(JSON.parse(fs.readFileSync('metadata.json', 'utf-8')))
    //
    // let api = await kusama()
    // let at = await api.at('0xdcbaa224ab080f2fbf3dfc85f3387ab21019355c392d79a143d7e50afba3c6e9')
    //
    // let beg: number
    // let end: number
    //
    // beg = Date.now()
    // for (let i = 0; i < 5000; i++) {
    //     let decoded = decodeBinary(types, 18, data)
    // }
    // end = Date.now()
    // console.log(end - beg)
    //
    // let type = at.registry.createLookupType(18)
    // beg = Date.now()
    // for (let i = 0; i < 5000; i++) {
    //     let decoded = at.registry.createType(type, data)
    // }
    // end = Date.now()
    // console.log(end - beg)
}


function toBin(hex: string): Buffer {
    return Buffer.from(hex.slice(2), 'hex')
}


function print(obj: any): void {
    console.log(JSON.stringify(obj, null, 2))
}


main().then(
    () => process.exit(0),
    err => {
        console.log(err)
        process.exit(1)
    }
)
