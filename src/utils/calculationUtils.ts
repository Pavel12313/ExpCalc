import { CalculationInput, LevelProgress } from '../types/ExpTypes';
import { expTable } from '../data/expTable';

export const calculateExpPercentage = (currentLevel: number, currentExp: number): number => {
  if (currentLevel <= 0 || currentLevel >= expTable.length) return 0;
  
  const currentLevelData = expTable[currentLevel - 1];
  const nextLevelData = expTable[currentLevel];
  
  if (!currentLevelData || !nextLevelData) return 0;
  
  const levelExpNeeded = nextLevelData.expTotal - currentLevelData.expTotal;
  const expIntoLevel = currentExp - currentLevelData.expTotal;
  
  if (levelExpNeeded <= 0) return 0;
  
  const percentage = (expIntoLevel / levelExpNeeded) * 100;
  return Math.min(Math.max(percentage, 0), 100);
};

export const calculateProgressionFromExp = (input: CalculationInput): LevelProgress[] => {
  const totalHours = input.hoursPerDay * input.numberOfDays;
  const totalExpGain = input.expPerHour * totalHours;
  const results: LevelProgress[] = [];
  
  let currentExp = input.currentExp;
  let accumExp = 0;
  
  for (let i = input.currentLevel - 1; i < expTable.length - 1; i++) {
    const currentLevelData = expTable[i];
    const nextLevelData = expTable[i + 1];
    const expNeeded = nextLevelData.expTotal - currentExp;
    
    if (accumExp + expNeeded > totalExpGain) {
      const remainingExp = totalExpGain - accumExp;
      const partialProgress = (remainingExp / expNeeded) * 100;
      
      results.push({
        level: currentLevelData.level,
        timeToReach: totalHours,
        totalExpGained: totalExpGain,
        percentage: partialProgress
      });
      break;
    }
    
    accumExp += expNeeded;
    const timeToReach = accumExp / input.expPerHour;
    
    results.push({
      level: nextLevelData.level,
      timeToReach,
      totalExpGained: accumExp,
      percentage: 100
    });
    
    currentExp = nextLevelData.expTotal;
  }
  
  return results;
};

export const formatDuration = (hours: number): string => {
  const days = Math.floor(hours / 24);
  const remainingHours = Math.floor(hours % 24);
  const minutes = Math.floor((hours * 60) % 60);

  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (remainingHours > 0) parts.push(`${remainingHours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);

  return parts.join(' ') || '0m';
};

export const formatNumber = (num: number): string => {
  return num.toLocaleString('en-US');
};

export const parseFormattedNumber = (str: string): number => {
  return Number(str.replace(/,/g, ''));
};