export interface ExpTableEntry {
    level: number;
    expNeeded: number;
    expTotal: number;
  }
  
  export interface CalculationInput {
    currentLevel: number;
    currentExp: number;
    currentExpPercent: number;
    expPerHour: number;
    expPerMinute: number;
    hoursPerDay: number;
    numberOfDays: number;
  }
  
  export interface LevelProgress {
    level: number;
    timeToReach: number;
    totalExpGained: number;
    percentage: number;
  }