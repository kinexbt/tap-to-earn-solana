import { GAME_SETTINGS, getSettingsForDifficulty } from './src/config/gameSettings.js';

console.log('GAME_SETTINGS loaded:', !!GAME_SETTINGS);
console.log('getSettingsForDifficulty function:', typeof getSettingsForDifficulty);

try {
  console.log('Easy settings:', getSettingsForDifficulty('easy'));
  console.log('Medium settings:', getSettingsForDifficulty('medium'));
  console.log('Hard settings:', getSettingsForDifficulty('hard'));
} catch (err) {
  console.error('Error in getSettingsForDifficulty:', err);
}
