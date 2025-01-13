import { useState } from 'react';
import { expTable } from '../data/expTable';
import './styles.css';

export const ExpCalculator = () => {
    const [currentLevel, setCurrentLevel] = useState('223');
    const [currentPercent, setCurrentPercent] = useState('78');
    const [expPerHour, setExpPerHour] = useState('');
    const [expPerMin, setExpPerMin] = useState('');

    const getCurrentExpInfo = () => {
        const level = parseInt(currentLevel);
        const percent = parseFloat(currentPercent);

        if (isNaN(level) || isNaN(percent) || level < 1 || level >= expTable.length) {
            return null;
        }

        // Get correct level data
        const currentLevelData = expTable[level - 1];  // Level 223

        
        // For level 223 at 78%:
        // Total exp at level start: 129,725,907,193 (currentLevelData.expTotal)
        // Exp needed for next level: 4,943,831,544 (nextLevelData.expNeeded)
        const expForCurrentLevel = currentLevelData.expNeeded;
        const currentProgress = expForCurrentLevel * (percent / 100);
        const expToNext = expForCurrentLevel - currentProgress;

        return {
            totalExp: currentLevelData.expTotal + currentProgress,
            currentLevelExp: currentProgress,
            expToNextLevel: expToNext,
            totalExpNeeded: currentLevelData.expNeeded, // This should be 4,799,836,450 for level 223
            baseExp: currentLevelData.expTotal  // Total exp at start of level
        };
    };


    const calculateProgression = () => {
        const level = parseInt(currentLevel);
        const percent = parseFloat(currentPercent);
        const expPerH = expPerHour ? parseFloat(expPerHour.replace(/,/g, '')) : 0;
        const expPerM = expPerMin ? parseFloat(expPerMin.replace(/,/g, '')) : 0;

        const hourlyExp = expPerH || (expPerM * 60);
        if (!hourlyExp || isNaN(level) || isNaN(percent)) return [];

        let results = [];
        let currentTotalExp = expTable[level - 1].expTotal;
        let totalTimeNeeded = 0;

        // Add current level's partial exp based on percentage
        const currentLevelExpNeeded = expTable[level].expNeeded;
        const currentProgress = currentLevelExpNeeded * (percent / 100);
        currentTotalExp += currentProgress;

        // Calculate remaining exp for current level
        const remainingCurrentLevel = expTable[level].expTotal - currentTotalExp;
        if (remainingCurrentLevel > 0) {
            const timeForCurrent = remainingCurrentLevel / hourlyExp;
            totalTimeNeeded += timeForCurrent;
            results.push({
                level: level + 1,
                expNeeded: remainingCurrentLevel,
                levelTime: timeForCurrent,
                totalTime: totalTimeNeeded
            });
        }

        // Calculate for subsequent levels
        for (let i = level + 1; i < expTable.length && i < 300; i++) {
            const expNeeded = expTable[i].expNeeded;
            const timeNeeded = expNeeded / hourlyExp;
            totalTimeNeeded += timeNeeded;

            results.push({
                level: i + 1,
                expNeeded: expNeeded,
                levelTime: timeNeeded,
                totalTime: totalTimeNeeded
            });
        }

        return results;
    };


    const formatTime = (hours: number) => {
        const days = Math.floor(hours / 24);
        const remainingHours = Math.floor(hours % 24);
        const minutes = Math.floor((hours * 60) % 60);

        let parts = [];
        if (days > 0) parts.push(`${days}d`);
        if (remainingHours > 0 || days > 0) parts.push(`${remainingHours}h`);
        parts.push(`${minutes}m`);

        return parts.join(' ');
    };

    const formatExp = (exp: number) => {
        return exp.toLocaleString();
    };

    const handleExpPerHourChange = (value: string) => {
        const cleanValue = value.replace(/[^\d]/g, '');
        setExpPerHour(cleanValue);
        const numValue = parseInt(cleanValue);
        if (!isNaN(numValue)) {
            setExpPerMin(Math.floor(numValue / 60).toString());
        } else {
            setExpPerMin('');
        }
    };

    const handleExpPerMinChange = (value: string) => {
        const cleanValue = value.replace(/[^\d]/g, '');
        setExpPerMin(cleanValue);
        const numValue = parseInt(cleanValue);
        if (!isNaN(numValue)) {
            setExpPerHour((numValue * 60).toString());
        } else {
            setExpPerHour('');
        }
    };

    const handleLevelChange = (value: string) => {
        const cleanValue = value.replace(/[^\d]/g, '');
        const numValue = parseInt(cleanValue);
        if (!isNaN(numValue) && numValue >= 1 && numValue < expTable.length) {
            setCurrentLevel(cleanValue);
        }
    };

    const handlePercentChange = (value: string) => {
        const cleanValue = value.replace(/[^\d.]/g, '');
        const numValue = parseFloat(cleanValue);
        if (!isNaN(numValue) && numValue >= 0 && numValue <= 100) {
            setCurrentPercent(cleanValue);
        }
    };

    const currentExpInfo = getCurrentExpInfo();
    const results = calculateProgression();

    return (
        <div className="calculator-container">
            <div className="input-grid">
                <div className="input-group">
                    <label>Current Level:</label>
                    <input
                        type="text"
                        value={currentLevel}
                        onChange={(e) => handleLevelChange(e.target.value)}
                        placeholder="Enter level"
                    />
                </div>
                <div className="input-group">
                    <label>Current %:</label>
                    <input
                        type="text"
                        value={currentPercent}
                        onChange={(e) => handlePercentChange(e.target.value)}
                        placeholder="Enter percentage"
                    />
                </div>
                <div className="input-group">
                    <label>EXP per Hour:</label>
                    <input
                        type="text"
                        value={formatExp(parseInt(expPerHour) || 0)}
                        onChange={(e) => handleExpPerHourChange(e.target.value)}
                        placeholder="Enter exp per hour"
                    />
                </div>
                <div className="input-group">
                    <label>EXP per Minute:</label>
                    <input
                        type="text"
                        value={formatExp(parseInt(expPerMin) || 0)}
                        onChange={(e) => handleExpPerMinChange(e.target.value)}
                        placeholder="Enter exp per minute"
                    />
                </div>
            </div>

            {currentExpInfo && (
                <div className="current-exp-info">
                    <div className="exp-info-item">
                        <span className="exp-info-label">Total EXP:</span>
                        <span className="exp-info-value">{formatExp(currentExpInfo.totalExp)}</span>
                    </div>
                    <div className="exp-info-item">
                        <span className="exp-info-label">Current Level EXP:</span>
                        <span className="exp-info-value">{formatExp(currentExpInfo.currentLevelExp)}</span>
                    </div>
                    <div className="exp-info-item">
                        <span className="exp-info-label">EXP to Next Level:</span>
                        <span className="exp-info-value">{formatExp(currentExpInfo.expToNextLevel)}</span>
                    </div>
                    <div className="exp-info-item">
                        <span className="exp-info-label">Total EXP for Level:</span>
                        <span className="exp-info-value">{formatExp(currentExpInfo.totalExpNeeded)}</span>
                    </div>
                </div>
            )}

            {results.length > 0 && (
                <div className="results-container">
                    <h3>Level Progression</h3>
                    <div className="results-grid">
                        {results.map((result, index) => (
                            <div key={index} className="result-row">
                                <span className="level">Level {result.level}</span>
                                <span className="exp">Need: {formatExp(result.expNeeded)} exp</span>
                                <span className="time">
                                    Time: {formatTime(result.levelTime)}
                                    (Total: {formatTime(result.totalTime)})
                                </span>
                            </div>
                        ))}

                    </div>
                </div>
            )}
        </div>
    );
};