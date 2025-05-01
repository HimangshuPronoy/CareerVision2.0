#!/usr/bin/env node

// This script checks if Supabase is properly configured and the required tables exist
import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Initialize dotenv
config();

// Get current file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get Supabase credentials from environment variables or use hardcoded values from the client file
const SUPABASE_URL = process.env.SUPABASE_URL || "https://lxnmvvldfjmpoqsdhaug.supabase.co";
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4bm12dmxkZmptcG9xc2RoYXVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMxNTI0ODIsImV4cCI6MjA1ODcyODQ4Mn0.sUx3Ee_1NFtyjlzorybqkka-nEyjqpzImh4kEfPbsAE";

// Required tables to check
const requiredTables = [
  'profiles',
  'user_settings',
  'resumes',
  'saved_insights'
];

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function checkSupabase() {
  console.log(`Checking Supabase connection to: ${SUPABASE_URL}`);
  
  try {
    // Test the connection by making a simple query
    const { data, error } = await supabase.from('profiles').select('count(*)', { count: 'exact', head: true });
    
    if (error) {
      console.error('❌ Could not connect to Supabase:');
      console.error(error.message);
      return false;
    }
    
    console.log('✅ Successfully connected to Supabase');
    
    // Now check if the required tables exist
    console.log('\nChecking required tables...');
    let allTablesExist = true;
    
    for (const tableName of requiredTables) {
      // Try to count rows in the table
      const { error } = await supabase.from(tableName).select('count(*)', { count: 'exact', head: true });
      
      if (error && error.code === 'PGRST109') {
        console.error(`❌ Table '${tableName}' does not exist`);
        allTablesExist = false;
      } else if (error) {
        console.error(`❓ Could not check table '${tableName}': ${error.message}`);
        allTablesExist = false;
      } else {
        console.log(`✅ Table '${tableName}' exists`);
      }
    }
    
    if (!allTablesExist) {
      console.log('\n⚠️ Not all required tables exist. Please run the migrations.');
      console.log('You can run the migrations using: node scripts/apply-migrations.js');
      return false;
    }
    
    // Check storage buckets
    console.log('\nChecking storage buckets...');
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error('❌ Could not check storage buckets:');
      console.error(bucketsError.message);
      return false;
    }
    
    const resumeBucketExists = buckets.some(bucket => bucket.name === 'resume-exports');
    
    if (resumeBucketExists) {
      console.log('✅ Storage bucket "resume-exports" exists');
    } else {
      console.error('❌ Storage bucket "resume-exports" does not exist');
      console.log('Please run the migrations to create the required bucket.');
      return false;
    }
    
    console.log('\n🎉 All checks passed! Supabase is properly configured.');
    return true;
  } catch (err) {
    console.error('❌ Unexpected error:');
    console.error(err);
    return false;
  }
}

// Run the check
checkSupabase()
  .then(success => {
    if (!success) {
      process.exit(1);
    }
  })
  .catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
  }); 