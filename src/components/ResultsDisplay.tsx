import { CalculationInput } from '../types/ExpTypes';
import { calculateProgressionFromExp, formatNumber, formatDuration } from '../utils/calculationUtils';

export const ResultsDisplay = ({ input }: { input: CalculationInput }) => {
  const results = calculateProgressionFromExp(input);
  const totalExpGain = input.expPerHour * input.hoursPerDay * input.numberOfDays;

  return (
    <div>
      <h2>Results</h2>
      <div>
        <p>EXP per Hour: {formatNumber(input.expPerHour)}</p>
        <p>EXP per Minute: {formatNumber(input.expPerMinute)}</p>
        <p>Total EXP Gain: {formatNumber(totalExpGain)}</p>
      </div>
      {results.map((result) => (
        <div key={result.level}>
          <p>
            Level {result.level} - 
            Time to reach: {formatDuration(result.timeToReach)} - 
            Progress: {result.percentage.toFixed(2)}% - 
            Total EXP: {formatNumber(result.totalExpGained)}
          </p>
        </div>
      ))}
    </div>
  );
};