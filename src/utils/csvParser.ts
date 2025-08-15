import Papa from 'papaparse';
import { CovidData, CountryData } from '../types';

/**
 * CSV Parser Utility
 * 
 * Handles parsing and processing of COVID-19 CSV data files.
 * Features include:
 * - CSV file parsing using PapaParse library
 * - Data validation and type conversion
 * - Country data aggregation and processing
 * - Fallback sample data for development
 * - Error handling for malformed data
 * 
 * @module csvParser
 */

// ============================================================================
// SAMPLE DATA FOR DEVELOPMENT
// ============================================================================

/**
 * Sample COVID-19 data for development and testing purposes
 * Provides realistic data structure when CSV file is unavailable
 * 
 * @returns {CovidData[]} Array of sample COVID-19 records
 */
const getSampleData = (): CovidData[] => {
  return [
    {
      iso_code: 'US',
      continent: 'North America',
      location: 'United States',
      date: '2023-12-01',
      total_cases: 103436829,
      new_cases: 0,
      new_cases_smoothed: 0,
      total_deaths: 1127152,
      new_deaths: 0,
      new_deaths_smoothed: 0,
      total_cases_per_million: 309848,
      new_cases_per_million: 0,
      new_cases_smoothed_per_million: 0,
      total_deaths_per_million: 3379,
      new_deaths_per_million: 0,
      new_deaths_smoothed_per_million: 0,
      reproduction_rate: 0.8,
      icu_patients: 0,
      icu_patients_per_million: 0,
      hosp_patients: 0,
      hosp_patients_per_million: 0,
      weekly_icu_admissions: 0,
      weekly_icu_admissions_per_million: 0,
      weekly_hosp_admissions: 0,
      weekly_hosp_admissions_per_million: 0,
      new_tests: 0,
      total_tests: 0,
      total_tests_per_thousand: 0,
      new_tests_per_thousand: 0,
      new_tests_smoothed: 0,
      new_tests_smoothed_per_thousand: 0,
      positive_rate: 0,
      tests_per_case: 0,
      tests_units: 'tests performed',
      total_vaccinations: 676728381,
      people_vaccinated: 229637073,
      people_fully_vaccinated: 196763754,
      total_boosters: 0,
      new_vaccinations: 0,
      new_vaccinations_smoothed: 0,
      total_vaccinations_per_hundred: 203.1,
      people_vaccinated_per_hundred: 68.9,
      people_fully_vaccinated_per_hundred: 59.0,
      total_boosters_per_hundred: 0,
      new_vaccinations_smoothed_per_million: 0,
      stringency_index: 0,
      population: 333287557,
      population_density: 36.2,
      median_age: 38.1,
      aged_65_older: 16.8,
      aged_70_older: 10.5,
      gdp_per_capita: 62794.6,
      extreme_poverty: 1.2,
      cardiovasc_death_rate: 151.4,
      diabetes_prevalence: 10.8,
      female_smokers: 13.6,
      male_smokers: 17.5,
      handwashing_facilities: 100,
      hospital_beds_per_thousand: 2.9,
      life_expectancy: 78.9,
      human_development_index: 0.921,
      excess_mortality: 0
    },
    {
      iso_code: 'GB',
      continent: 'Europe',
      location: 'United Kingdom',
      date: '2023-12-01',
      total_cases: 24685189,
      new_cases: 0,
      new_cases_smoothed: 0,
      total_deaths: 213915,
      new_deaths: 0,
      new_deaths_smoothed: 0,
      total_cases_per_million: 362320,
      new_cases_per_million: 0,
      new_cases_smoothed_per_million: 0,
      total_deaths_per_million: 3140,
      new_deaths_per_million: 0,
      new_deaths_smoothed_per_million: 0,
      reproduction_rate: 0.8,
      icu_patients: 0,
      icu_patients_per_million: 0,
      hosp_patients: 0,
      hosp_patients_per_million: 0,
      weekly_icu_admissions: 0,
      weekly_icu_admissions_per_million: 0,
      weekly_hosp_admissions: 0,
      weekly_hosp_admissions_per_million: 0,
      new_tests: 0,
      total_tests: 0,
      total_tests_per_thousand: 0,
      new_tests_per_thousand: 0,
      new_tests_smoothed: 0,
      new_tests_smoothed_per_thousand: 0,
      positive_rate: 0,
      tests_per_case: 0,
      tests_units: 'tests performed',
      total_vaccinations: 151522471,
      people_vaccinated: 53708995,
      people_fully_vaccinated: 50230660,
      total_boosters: 0,
      new_vaccinations: 0,
      new_vaccinations_smoothed: 0,
      total_vaccinations_per_hundred: 222.4,
      people_vaccinated_per_hundred: 78.8,
      people_fully_vaccinated_per_hundred: 73.7,
      total_boosters_per_hundred: 0,
      new_vaccinations_smoothed_per_million: 0,
      stringency_index: 0,
      population: 68138484,
      population_density: 274.7,
      median_age: 40.6,
      aged_65_older: 18.6,
      aged_70_older: 13.2,
      gdp_per_capita: 42130.7,
      extreme_poverty: 0.2,
      cardiovasc_death_rate: 98.0,
      diabetes_prevalence: 4.3,
      female_smokers: 12.4,
      male_smokers: 15.9,
      handwashing_facilities: 100,
      hospital_beds_per_thousand: 2.5,
      life_expectancy: 81.2,
      human_development_index: 0.929,
      excess_mortality: 0
    },
    {
      iso_code: 'DE',
      continent: 'Europe',
      location: 'Germany',
      date: '2023-12-01',
      total_cases: 38112157,
      new_cases: 0,
      new_cases_smoothed: 0,
      total_deaths: 174352,
      new_deaths: 0,
      new_deaths_smoothed: 0,
      total_cases_per_million: 456789,
      new_cases_per_million: 0,
      new_cases_smoothed_per_million: 0,
      total_deaths_per_million: 2091,
      new_deaths_per_million: 0,
      new_deaths_smoothed_per_million: 0,
      reproduction_rate: 0.8,
      icu_patients: 0,
      icu_patients_per_million: 0,
      hosp_patients: 0,
      hosp_patients_per_million: 0,
      weekly_icu_admissions: 0,
      weekly_icu_admissions_per_million: 0,
      weekly_hosp_admissions: 0,
      weekly_hosp_admissions_per_million: 0,
      new_tests: 0,
      total_tests: 0,
      total_tests_per_thousand: 0,
      new_tests_per_thousand: 0,
      new_tests_smoothed: 0,
      new_tests_smoothed_per_thousand: 0,
      positive_rate: 0,
      tests_per_case: 0,
      tests_units: 'tests performed',
      total_vaccinations: 192479369,
      people_vaccinated: 64047580,
      people_fully_vaccinated: 63020080,
      total_boosters: 0,
      new_vaccinations: 0,
      new_vaccinations_smoothed: 0,
      total_vaccinations_per_hundred: 230.8,
      people_vaccinated_per_hundred: 76.8,
      people_fully_vaccinated_per_hundred: 75.6,
      total_boosters_per_hundred: 0,
      new_vaccinations_smoothed_per_million: 0,
      stringency_index: 0,
      population: 83422553,
      population_density: 237.0,
      median_age: 45.7,
      aged_65_older: 21.5,
      aged_70_older: 15.8,
      gdp_per_capita: 46468.4,
      extreme_poverty: 0.1,
      cardiovasc_death_rate: 108.0,
      diabetes_prevalence: 7.4,
      female_smokers: 20.0,
      male_smokers: 24.0,
      handwashing_facilities: 100,
      hospital_beds_per_thousand: 8.0,
      life_expectancy: 81.3,
      human_development_index: 0.942,
      excess_mortality: 0
    }
  ];
};

// ============================================================================
// MAIN PARSING FUNCTION
// ============================================================================

/**
 * Parses COVID-19 CSV data from a file or returns sample data
 * 
 * Attempts to fetch and parse the CSV file from the public folder.
 * Falls back to sample data if the file cannot be loaded or parsed.
 * 
 * @returns {Promise<CovidData[]>} Promise resolving to array of COVID-19 records
 * @throws {Error} If CSV parsing fails and no fallback is available
 */
export const parseCSV = async (): Promise<CovidData[]> => {
  try {
    // Attempt to fetch and parse the CSV file
    const response = await fetch('/owid-covid-data.csv');
    
    if (!response.ok) {
      console.warn('CSV file not found, using sample data');
      return getSampleData();
    }
    
    const csvText = await response.text();
    
    // Parse CSV using PapaParse with proper configuration
    return new Promise((resolve, reject) => {
      Papa.parse(csvText, {
        header: true,        // First row contains column names
        dynamicTyping: false, // Keep all values as strings for manual control
        skipEmptyLines: true, // Skip empty rows
        complete: (results) => {
          // PapaParse successful - convert to our data structure
          const data = results.data as CovidData[];
          console.log(`Successfully parsed ${data.length} COVID-19 records`);
          resolve(data);
        },
        error: (error: any) => {
          // PapaParse failed - log error and use fallback
          console.error('CSV parsing error:', error);
          console.warn('Falling back to sample data');
          resolve(getSampleData());
        }
      });
    });
    
  } catch (error) {
    // Network or other error - use sample data
    console.error('Error fetching CSV file:', error);
    console.warn('Using sample data due to fetch error');
    return getSampleData();
  }
};

// ============================================================================
// DATA PROCESSING FUNCTION
// ============================================================================

/**
 * Processes raw COVID-19 data into aggregated country statistics
 * 
 * Groups records by country and calculates:
 * - Latest available data for each country
 * - Maximum values across all time periods
 * - Population-adjusted metrics
 * - Vaccination progress indicators
 * 
 * @param {CovidData[]} covidData - Raw COVID-19 data records
 * @returns {CountryData[]} Array of processed country data objects
 */
export const processCountryData = (covidData: CovidData[]): CountryData[] => {
  const countryGroups = new Map<string, CovidData[]>();
  const countryData: CountryData[] = [];
  
  // First pass: group records by country location
  covidData.forEach(record => {
    if (record.location && record.iso_code) {
      if (!countryGroups.has(record.location)) {
        countryGroups.set(record.location, []);
      }
      countryGroups.get(record.location)!.push(record);
    }
  });
  
  // Second pass: process each country's aggregated data
  countryGroups.forEach((records, location) => {
    if (records.length === 0) return;
    
    // Sort records by date to get the most recent data
    const sortedRecords = records.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    const latestRecord = sortedRecords[0];
    
    // Calculate maximum values across all records for this country
    // This handles cases where data might have been reset or corrected
    const totalCases = Math.max(...records.map(r => Number(r.total_cases) || 0));
    const totalDeaths = Math.max(...records.map(r => Number(r.total_deaths) || 0));
    const totalVaccinations = Math.max(...records.map(r => Number(r.total_vaccinations) || 0));
    
    // Create aggregated country data object with safe type conversions
    countryData.push({
      location,
      iso_code: latestRecord.iso_code,
      continent: latestRecord.continent,
      latestData: latestRecord,
      totalCases: Number(totalCases) || 0,
      totalDeaths: Number(totalDeaths) || 0,
      totalVaccinations: Number(totalVaccinations) || 0,
      population: Number(latestRecord.population) || 0,
      casesPerMillion: Number(latestRecord.total_cases_per_million) || 0,
      deathsPerMillion: Number(latestRecord.total_deaths_per_million) || 0,
      vaccinationRate: Number(latestRecord.total_vaccinations_per_hundred) || 0,
    });
  });
  
  console.log(`Processed data for ${countryData.length} countries`);
  return countryData;
};
