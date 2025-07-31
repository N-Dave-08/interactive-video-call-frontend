#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import https from 'https';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MARIO_GAME_URL = 'https://openhtml5games.github.io/games-mirror/dist/mariohtml5/';
const LOCAL_MARIO_DIR = path.join(__dirname, '../public/mario-game');

async function downloadFile(url, filePath) {
	return new Promise((resolve, reject) => {
		const file = fs.createWriteStream(filePath);
		https.get(url, (response) => {
			response.pipe(file);
			file.on('finish', () => {
				file.close();
				resolve();
			});
		}).on('error', (err) => {
			fs.unlink(filePath, () => {}); // Delete the file async
			reject(err);
		});
	});
}

async function setupMarioGame() {
	console.log('🎮 Setting up Super Mario Bros game...');
	
	// Create directory if it doesn't exist
	if (!fs.existsSync(LOCAL_MARIO_DIR)) {
		fs.mkdirSync(LOCAL_MARIO_DIR, { recursive: true });
		console.log('✅ Created mario-game directory');
	}

	try {
		// Download main HTML file
		console.log('📥 Downloading Mario game files...');
		
		// List of files to download (you may need to adjust based on the actual structure)
		const filesToDownload = [
			'index.html',
			'game.js',
			'style.css',
			// Add more files as needed based on the actual Mario game structure
		];

		for (const file of filesToDownload) {
			const fileUrl = `${MARIO_GAME_URL}${file}`;
			const filePath = path.join(LOCAL_MARIO_DIR, file);
			
			try {
				await downloadFile(fileUrl, filePath);
				console.log(`✅ Downloaded ${file}`);
			} catch (error) {
				console.log(`⚠️  Could not download ${file}: ${error.message}`);
			}
		}

		console.log('🎉 Mario game setup complete!');
		console.log('📁 Files saved to:', LOCAL_MARIO_DIR);
		console.log('💡 You can now use the local version by updating the URL in the Mario component');
		
	} catch (error) {
		console.error('❌ Error setting up Mario game:', error.message);
		console.log('💡 The hosted version will still work as a fallback');
	}
}

// Run the setup
setupMarioGame().catch(console.error); 