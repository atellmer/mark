import { Sample, adaboost } from '@core/ai';
import irisesTrainDataset from '@core/ai/datasets/irises/train.csv';
import irisesTestDataset from '@core/ai/datasets/irises/test.csv';
import inlineIrisesEngine from '@core/ai/adaboost/trained/irises-model.json';

const trainSamples = Sample.normalize(Sample.fromDataset(irisesTrainDataset));
const testSamples = Sample.normalize(Sample.fromDataset(irisesTestDataset));
//const engine = adaboost({ samples: trainSamples, estimatorsTotal: 10000 });
const engine = adaboost({ inlineEngine: inlineIrisesEngine });

engine.verasity(trainSamples, testSamples);
