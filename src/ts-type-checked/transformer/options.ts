import { LogLevel } from './logger';

export interface TransformerOptions {
  logLevel: LogLevel;
}

export const defaultTransformerOptions: TransformerOptions = {
  logLevel: 'normal',
};
