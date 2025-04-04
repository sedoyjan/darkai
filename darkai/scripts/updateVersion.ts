import { input } from '@inquirer/prompts';
import { readFileSync, writeFileSync } from 'fs';

async function updateVersions(): Promise<void> {
  // Define the list of files where we'll replace the version
  const files: string[] = [
    'app.json',
    'package.json',
    'ios/SubTaskAI/Info.plist',
    'ios/SubTaskAI.xcodeproj/project.pbxproj',
  ];

  // Prompt the user for the old version
  const oldVersion: string = await input({
    message: 'Enter OLD version (e.g. 1.7.4):',
  });

  // Prompt the user for the new version
  const newVersion: string = await input({
    message: 'Enter NEW version (e.g. 1.7.5):',
  });

  // Loop through each file and replace all occurrences of old version with new version
  for (const filePath of files) {
    try {
      const content: string = readFileSync(filePath, 'utf8');
      const updatedContent: string = content.replace(
        new RegExp(oldVersion, 'g'),
        newVersion,
      );

      writeFileSync(filePath, updatedContent, 'utf8');
      console.log(`✅ Updated version in ${filePath}`);
    } catch (error) {
      console.error(`❌ Could not process file: ${filePath}`);
      console.error(error);
    }
  }
}

// Run the script
updateVersions().catch(err => {
  console.error('An unexpected error occurred:', err);
  process.exit(1);
});
