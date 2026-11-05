declare module "country-calling-code" {
  export interface ICountryCodeItem {
    country: string;
    countryCodes: string[];
    isoCode2: string;
    isoCode3: string;
  }
  export const codes: ICountryCodeItem[];
  export default codes;
}
