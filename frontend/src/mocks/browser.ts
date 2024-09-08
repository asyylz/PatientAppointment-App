// src/mocks/browser.js
import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

const worker = setupWorker(...handlers); // Setup worker with handlers

export { worker };
