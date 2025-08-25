#!/usr/bin/env node

import { DataSource } from 'typeorm';
import { DatabaseSeeder } from './seeds';
import dataSource from '../config/data-source';

async function runSeeders() {
  try {
    console.log('Initializing database connection...');
    await dataSource.initialize();
    
    console.log('Running database seeders...');
    await new DatabaseSeeder().run(dataSource);
    
    console.log('Seeders completed successfully!');
  } catch (error) {
    console.error('Error running seeders:', error);
    process.exit(1);
  } finally {
    await dataSource.destroy();
  }
}

// Run if this file is executed directly
if (require.main === module) {
  runSeeders();
}

export { runSeeders };