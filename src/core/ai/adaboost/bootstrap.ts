import { random } from '@utils/math';
import { Sample } from '@core/ai/sample';

type bootstrapSamplingOptions = {
	weights: Array<Weight>;
	samples: Array<Sample>;
	samplingSize: number;
};

function bootstrapSampling(options: bootstrapSamplingOptions): Array<Sample> {
	const { weights, samples, samplingSize } = options;
	const selectedSamples: Array<Sample> = [];
	const sortedWeights: Array<Weight> = [...weights].sort((a, b) => a.value - b.value);
	const probRoulette = createProbRoulette(sortedWeights);

	while (selectedSamples.length < samplingSize) {
		const idx = selectSampleIdx(sortedWeights, probRoulette);
		const sample = samples[idx];

		selectedSamples.push(sample);
	}

	return selectedSamples;
}

function selectSampleIdx(sortedWeights: Array<Weight>, probRoulette: Array<number>) {
	const value = random(0, 100);

	for (let i = 0; i < probRoulette.length - 1; i++) {
		if (value <= probRoulette[i] || value > probRoulette[i + 1]) continue;
		const nextWeight = sortedWeights[i + 1];

		return nextWeight.idx;
	}

	return 0;
}

const createProbRoulette = (weights: Array<Weight>): Array<number> => {
	const roulette: Array<number> = [];
	let sector = 0;
	let idx = 0;

	for (let i = 3; i < weights.length + 3; i++) {
		sector = 0;

		for (let j = 0; j < i - 2; j++) {
			sector += weights[j].value;
		}

		roulette[idx] = sector * 100;
		idx++;
	}

	return roulette;
};

export type Weight = {
	value: number;
	idx: number;
};

export { bootstrapSampling };
