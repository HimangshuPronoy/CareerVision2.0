#!/usr/bin/env node
import { exec } from 'child_process';
import { readFileSync, existsSync, readdirSync } from 'fs';
import { resolve, join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get current file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Check if supabase CLI is installed
exec('supabase --version', (error) => {
  if (error) {
    console.error('Supabase CLI is not installed. Please install it first:');
    console.error('npm install -g supabase');
    process.exit(1);
  }

  console.log('Applying Supabase migrations...');
  
  // Path to migrations
  const migrationsDir = resolve(__dirname, '../supabase/migrations');
  
  if (!existsSync(migrationsDir)) {
    console.error(`Migrations directory does not exist: ${migrationsDir}`);
    process.exit(1);
  }
  
  // Get all SQL files in the migrations directory, sorted by name
  const migrationFiles = readdirSync(migrationsDir)
    .filter(file => file.endsWith('.sql'))
    .sort();
  
  if (migrationFiles.length === 0) {
    console.error('No migration files found.');
    process.exit(1);
  }
  
  console.log(`Found ${migrationFiles.length} migration files.`);
  
  // Apply each migration
  let currentIndex = 0;
  
  function applyNextMigration() {
    if (currentIndex >= migrationFiles.length) {
      console.log('All migrations have been applied successfully!');
      return;
    }
    
    const fileName = migrationFiles[currentIndex];
    const filePath = join(migrationsDir, fileName);
    
    console.log(`Applying migration: ${fileName}`);
    
    // Read SQL file
    const sql = readFileSync(filePath, 'utf8');
    
    // Execute SQL through Supabase CLI
    const command = `supabase db execute --file="${filePath}"`;
    
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error applying migration ${fileName}:`);
        console.error(stderr || error.message);
        process.exit(1);
      }
      
      console.log(`✅ Migration ${fileName} applied successfully`);
      currentIndex++;
      applyNextMigration();
    });
  }
  
  applyNextMigration();
}); 