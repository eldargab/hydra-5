import {Processor} from "../processor"
// import {ParaInclusionCandidateIncludedEvent} from "../a-types/events"

const processor = new Processor('kusama')

processor.addEventHandler('paraInclusion.CandidateIncluded', async ctx => {
    // let [receipt] = new ParaInclusionCandidateIncludedEvent(ctx).asLatest
    // let parachainId = receipt.descriptor.paraId.toString()
})

processor.run()
