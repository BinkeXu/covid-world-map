/**
 * Type Definitions for COVID-19 World Map Application
 * 
 * This file contains all TypeScript interfaces and types used throughout the application.
 * The types are designed to handle both string and number values from CSV data,
 * providing flexibility for data parsing and validation.
 * 
 * @module types
 */

// ============================================================================
// CORE DATA INTERFACES
// ============================================================================

/**
 * Interface representing a single COVID-19 data record from CSV
 * 
 * Contains comprehensive COVID-19 statistics for a specific country and date.
 * All numeric fields can be either strings (from CSV) or numbers (after processing).
 * 
 * @interface CovidData
 */
export interface CovidData {
  /** ISO 3166-1 alpha-3 country code (e.g., 'USA', 'GBR') */
  iso_code: string;
  /** Continent where the country is located */
  continent: string;
  /** Full country name */
  location: string;
  /** Date of the data record in YYYY-MM-DD format */
  date: string;
  
  // ========================================================================
  // CASE STATISTICS
  // ========================================================================
  
  /** Total confirmed COVID-19 cases up to this date */
  total_cases: string | number;
  /** New confirmed cases on this specific date */
  new_cases: string | number;
  /** 7-day rolling average of new cases */
  new_cases_smoothed: string | number;
  
  // ========================================================================
  // DEATH STATISTICS
  // ========================================================================
  
  /** Total COVID-19 deaths up to this date */
  total_deaths: string | number;
  /** New deaths on this specific date */
  new_deaths: string | number;
  /** 7-day rolling average of new deaths */
  new_deaths_smoothed: string | number;
  
  // ========================================================================
  // PER-MILLION METRICS
  // ========================================================================
  
  /** Total cases per million population */
  total_cases_per_million: string | number;
  /** New cases per million population on this date */
  new_cases_per_million: string | number;
  /** 7-day rolling average of new cases per million */
  new_cases_smoothed_per_million: string | number;
  
  /** Total deaths per million population */
  total_deaths_per_million: string | number;
  /** New deaths per million population on this date */
  new_deaths_per_million: string | number;
  /** 7-day rolling average of new deaths per million */
  new_deaths_smoothed_per_million: string | number;
  
  // ========================================================================
  // TRANSMISSION METRICS
  // ========================================================================
  
  /** Effective reproduction rate (R) - indicates spread speed */
  reproduction_rate: string | number;
  
  // ========================================================================
  // HOSPITALIZATION DATA
  // ========================================================================
  
  /** Current ICU patients with COVID-19 */
  icu_patients: string | number;
  /** ICU patients per million population */
  icu_patients_per_million: string | number;
  /** Weekly new ICU admissions */
  weekly_icu_admissions: string | number;
  /** Weekly ICU admissions per million population */
  weekly_icu_admissions_per_million: string | number;
  
  /** Current hospital patients with COVID-19 */
  hosp_patients: string | number;
  /** Hospital patients per million population */
  hosp_patients_per_million: string | number;
  /** Weekly new hospital admissions */
  weekly_hosp_admissions: string | number;
  /** Weekly hospital admissions per million population */
  weekly_hosp_admissions_per_million: string | number;
  
  // ========================================================================
  // TESTING DATA
  // ========================================================================
  
  /** New tests performed on this date */
  new_tests: string | number;
  /** Total tests performed up to this date */
  total_tests: string | number;
  /** Total tests per thousand population */
  total_tests_per_thousand: string | number;
  /** New tests per thousand population on this date */
  new_tests_per_thousand: string | number;
  /** 7-day rolling average of new tests */
  new_tests_smoothed: string | number;
  /** 7-day rolling average of new tests per thousand */
  new_tests_smoothed_per_thousand: string | number;
  
  /** Percentage of tests that were positive */
  positive_rate: string | number;
  /** Number of tests per confirmed case */
  tests_per_case: string | number;
  /** Units for testing data (usually 'tests performed') */
  tests_units: string;
  
  // ========================================================================
  // VACCINATION DATA
  // ========================================================================
  
  /** Total vaccine doses administered up to this date */
  total_vaccinations: string | number;
  /** Total people who received at least one dose */
  people_vaccinated: string | number;
  /** Total people fully vaccinated (all required doses) */
  people_fully_vaccinated: string | number;
  /** Total booster doses administered */
  total_boosters: string | number;
  
  /** New vaccine doses administered on this date */
  new_vaccinations: string | number;
  /** 7-day rolling average of new vaccinations */
  new_vaccinations_smoothed: string | number;
  
  /** Total vaccinations per hundred people */
  total_vaccinations_per_hundred: string | number;
  /** People vaccinated per hundred people */
  people_vaccinated_per_hundred: string | number;
  /** People fully vaccinated per hundred people */
  people_fully_vaccinated_per_hundred: string | number;
  /** Booster doses per hundred people */
  total_boosters_per_hundred: string | number;
  /** New vaccinations per million population (7-day average) */
  new_vaccinations_smoothed_per_million: string | number;
  
  // ========================================================================
  // POLICY AND COMPOSITE INDICATORS
  // ========================================================================
  
  /** Government response stringency index (0-100) */
  stringency_index: string | number;
  
  // ========================================================================
  // DEMOGRAPHIC AND SOCIOECONOMIC DATA
  // ========================================================================
  
  /** Total population of the country */
  population: string | number;
  /** Population density (people per square kilometer) */
  population_density: string | number;
  /** Median age of the population */
  median_age: string | number;
  /** Percentage of population aged 65 and older */
  aged_65_older: string | number;
  /** Percentage of population aged 70 and older */
  aged_70_older: string | number;
  
  /** GDP per capita in international dollars */
  gdp_per_capita: string | number;
  /** Percentage of population living in extreme poverty */
  extreme_poverty: string | number;
  
  // ========================================================================
  // HEALTH INDICATORS
  // ========================================================================
  
  /** Cardiovascular disease death rate per 100,000 people */
  cardiovasc_death_rate: string | number;
  /** Percentage of population with diabetes */
  diabetes_prevalence: string | number;
  /** Percentage of female population who smoke */
  female_smokers: string | number;
  /** Percentage of male population who smoke */
  male_smokers: string | number;
  /** Percentage of population with handwashing facilities */
  handwashing_facilities: string | number;
  /** Hospital beds per thousand people */
  hospital_beds_per_thousand: string | number;
  
  /** Life expectancy at birth in years */
  life_expectancy: string | number;
  /** Human Development Index (0-1 scale) */
  human_development_index: string | number;
  
  // ========================================================================
  // EXCESS MORTALITY
  // ========================================================================
  
  /** Excess mortality percentage compared to historical average */
  excess_mortality: string | number;
}

// ============================================================================
// PROCESSED DATA INTERFACES
// ============================================================================

/**
 * Interface representing processed and aggregated country data
 * 
 * This is the main data structure used by the application components.
 * It contains aggregated statistics and is derived from raw CovidData records.
 * All numeric values are guaranteed to be numbers (not strings).
 * 
 * @interface CountryData
 */
export interface CountryData {
  /** Full country name for display */
  location: string;
  /** ISO country code for identification and mapping */
  iso_code: string;
  /** Continent for geographic grouping */
  continent: string;
  /** Reference to the most recent raw data record */
  latestData: CovidData;
  
  // ========================================================================
  // AGGREGATED STATISTICS
  // ========================================================================
  
  /** Maximum total cases across all time periods (handles data corrections) */
  totalCases: number;
  /** Maximum total deaths across all time periods */
  totalDeaths: number;
  /** Maximum total vaccinations across all time periods */
  totalVaccinations: number;
  
  // ========================================================================
  // POPULATION METRICS
  // ========================================================================
  
  /** Total population of the country */
  population: number;
  
  // ========================================================================
  // PER-MILLION METRICS
  // ========================================================================
  
  /** Cases per million population for fair country comparisons */
  casesPerMillion: number;
  /** Deaths per million population for fair country comparisons */
  deathsPerMillion: number;
  
  // ========================================================================
  // VACCINATION PROGRESS
  // ========================================================================
  
  /** Percentage of population vaccinated (per hundred people) */
  vaccinationRate: number;
}

// ============================================================================
// MAP-SPECIFIC INTERFACES
// ============================================================================

/**
 * Interface for map country objects used in the WorldMap component
 * 
 * Links geographic map data with processed COVID-19 statistics.
 * 
 * @interface MapCountry
 */
export interface MapCountry {
  /** Unique identifier for the country on the map */
  id: string;
  /** Display name of the country */
  name: string;
  /** Associated COVID-19 data, null if no data available */
  data: CountryData | null;
}
