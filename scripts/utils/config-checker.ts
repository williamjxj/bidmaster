/**
 * Configuration consistency checker for TypeScript, Next.js, and ESLint configs
 * Identifies misalignments and missing best practices
 */

import { readFile, pathExists } from './fs-utils';
import { join } from 'path';

export interface ConfigInconsistency {
  file: string;
  type: 'typescript' | 'nextjs' | 'eslint';
  issue: string;
  severity: 'error' | 'warning' | 'info';
  recommendation: string;
}

export interface ConfigCheckResult {
  inconsistencies: ConfigInconsistency[];
  summary: {
    total: number;
    byType: Record<string, number>;
    bySeverity: Record<string, number>;
  };
}

/**
 * Check TypeScript configuration
 */
async function checkTypeScriptConfig(
  projectRoot: string
): Promise<ConfigInconsistency[]> {
  const inconsistencies: ConfigInconsistency[] = [];
  const tsconfigPath = join(projectRoot, 'tsconfig.json');
  
  if (!(await pathExists(tsconfigPath))) {
    inconsistencies.push({
      file: 'tsconfig.json',
      type: 'typescript',
      issue: 'TypeScript configuration file not found',
      severity: 'error',
      recommendation: 'Create tsconfig.json with strict mode enabled',
    });
    return inconsistencies;
  }
  
  try {
    const content = await readFile(tsconfigPath);
    const config = JSON.parse(content);
    
    // Check strict mode
    if (!config.compilerOptions?.strict) {
      inconsistencies.push({
        file: 'tsconfig.json',
        type: 'typescript',
        issue: 'TypeScript strict mode is not enabled',
        severity: 'error',
        recommendation: 'Enable strict mode in compilerOptions for better type safety',
      });
    }
    
    // Check path aliases consistency
    if (config.compilerOptions?.paths) {
      const paths = config.compilerOptions.paths;
      const baseUrl = config.compilerOptions.baseUrl || '.';
      
      // Verify path aliases are properly configured
      for (const [alias, paths_array] of Object.entries(paths)) {
        if (!Array.isArray(paths_array) || paths_array.length === 0) {
          inconsistencies.push({
            file: 'tsconfig.json',
            type: 'typescript',
            issue: `Path alias "${alias}" has invalid configuration`,
            severity: 'warning',
            recommendation: 'Ensure path aliases point to valid directories',
          });
        }
      }
    }
    
    // Check target and lib settings
    if (!config.compilerOptions?.target) {
      inconsistencies.push({
        file: 'tsconfig.json',
        type: 'typescript',
        issue: 'TypeScript target is not specified',
        severity: 'warning',
        recommendation: 'Specify target ES version for better compatibility',
      });
    }
  } catch (error) {
    inconsistencies.push({
      file: 'tsconfig.json',
      type: 'typescript',
      issue: `Failed to parse TypeScript config: ${error instanceof Error ? error.message : String(error)}`,
      severity: 'error',
      recommendation: 'Fix JSON syntax errors in tsconfig.json',
    });
  }
  
  return inconsistencies;
}

/**
 * Check Next.js configuration
 */
async function checkNextJsConfig(
  projectRoot: string
): Promise<ConfigInconsistency[]> {
  const inconsistencies: ConfigInconsistency[] = [];
  const configPaths = [
    join(projectRoot, 'next.config.ts'),
    join(projectRoot, 'next.config.js'),
    join(projectRoot, 'next.config.mjs'),
  ];
  
  let configPath: string | null = null;
  for (const path of configPaths) {
    if (await pathExists(path)) {
      configPath = path;
      break;
    }
  }
  
  if (!configPath) {
    inconsistencies.push({
      file: 'next.config.*',
      type: 'nextjs',
      issue: 'Next.js configuration file not found',
      severity: 'warning',
      recommendation: 'Consider creating next.config.ts for custom configuration',
    });
    return inconsistencies;
  }
  
  try {
    // For TypeScript config files, we'd need to compile them
    // For now, just check if file exists and has content
    const content = await readFile(configPath);
    
    if (content.trim().length === 0) {
      inconsistencies.push({
        file: configPath,
        type: 'nextjs',
        issue: 'Next.js configuration file is empty',
        severity: 'info',
        recommendation: 'Add configuration options as needed',
      });
    }
    
    // Check for common Next.js patterns
    if (!content.includes('NextConfig') && configPath.endsWith('.ts')) {
      inconsistencies.push({
        file: configPath,
        type: 'nextjs',
        issue: 'Next.js config may not be properly typed',
        severity: 'info',
        recommendation: 'Import and use NextConfig type from next',
      });
    }
  } catch (error) {
    inconsistencies.push({
      file: configPath,
      type: 'nextjs',
      issue: `Failed to read Next.js config: ${error instanceof Error ? error.message : String(error)}`,
      severity: 'error',
      recommendation: 'Fix configuration file errors',
    });
  }
  
  return inconsistencies;
}

/**
 * Check ESLint configuration
 */
async function checkESLintConfig(
  projectRoot: string
): Promise<ConfigInconsistency[]> {
  const inconsistencies: ConfigInconsistency[] = [];
  const configPaths = [
    join(projectRoot, 'eslint.config.mjs'),
    join(projectRoot, 'eslint.config.js'),
    join(projectRoot, '.eslintrc.js'),
    join(projectRoot, '.eslintrc.json'),
    join(projectRoot, '.eslintrc.yml'),
  ];
  
  let configPath: string | null = null;
  for (const path of configPaths) {
    if (await pathExists(path)) {
      configPath = path;
      break;
    }
  }
  
  if (!configPath) {
    inconsistencies.push({
      file: 'eslint.config.*',
      type: 'eslint',
      issue: 'ESLint configuration file not found',
      severity: 'warning',
      recommendation: 'Create ESLint configuration for code quality',
    });
    return inconsistencies;
  }
  
  try {
    const content = await readFile(configPath);
    
    // Check if Next.js ESLint config is extended
    if (!content.includes('next') && !content.includes('next/core-web-vitals')) {
      inconsistencies.push({
        file: configPath,
        type: 'eslint',
        issue: 'ESLint config may not extend Next.js recommended rules',
        severity: 'info',
        recommendation: 'Extend next/core-web-vitals for Next.js best practices',
      });
    }
    
    // Check for TypeScript support
    if (!content.includes('typescript') && !content.includes('@typescript-eslint')) {
      inconsistencies.push({
        file: configPath,
        type: 'eslint',
        issue: 'ESLint config may not have TypeScript support',
        severity: 'warning',
        recommendation: 'Add TypeScript ESLint parser and rules',
      });
    }
  } catch (error) {
    inconsistencies.push({
      file: configPath,
      type: 'eslint',
      issue: `Failed to read ESLint config: ${error instanceof Error ? error.message : String(error)}`,
      severity: 'error',
      recommendation: 'Fix configuration file errors',
    });
  }
  
  return inconsistencies;
}

/**
 * Check all configurations for inconsistencies
 */
export async function checkConfigurations(
  projectRoot: string
): Promise<ConfigCheckResult> {
  const [tsIssues, nextIssues, eslintIssues] = await Promise.all([
    checkTypeScriptConfig(projectRoot),
    checkNextJsConfig(projectRoot),
    checkESLintConfig(projectRoot),
  ]);
  
  const inconsistencies = [...tsIssues, ...nextIssues, ...eslintIssues];
  
  const summary = {
    total: inconsistencies.length,
    byType: {
      typescript: tsIssues.length,
      nextjs: nextIssues.length,
      eslint: eslintIssues.length,
    },
    bySeverity: {
      error: inconsistencies.filter(i => i.severity === 'error').length,
      warning: inconsistencies.filter(i => i.severity === 'warning').length,
      info: inconsistencies.filter(i => i.severity === 'info').length,
    },
  };
  
  return {
    inconsistencies,
    summary,
  };
}

