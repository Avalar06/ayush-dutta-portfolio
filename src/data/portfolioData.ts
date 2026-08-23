export * from '../services/portfolioStorage';
import { getPortfolioData } from '../services/portfolioStorage';

export const portfolioData = getPortfolioData();
