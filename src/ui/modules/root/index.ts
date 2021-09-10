import { Sample } from '@core/ai/sample';
import { adaboost } from '@core/ai/adaboost';
import irisesTrainDataset from '@core/ai/datasets/irises/train.csv';
import irisesTestDataset from '@core/ai/datasets/irises/test.csv';

const trainSamples = Sample.normalize(Sample.fromDataset(irisesTrainDataset));
const testSamples = Sample.normalize(Sample.fromDataset(irisesTestDataset));
const engine = adaboost(trainSamples, 10000);

engine.verasity(trainSamples, testSamples);
