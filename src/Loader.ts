import { YearData } from "./Types";

export default class Loader {
  years: {
    [key: number]: YearData;
  };

  constructor() {
    this.years = {};
  }

  loadYear(year: number) {
    if (year in this.years) {
      return this.years[year];
    } else {
      return fetch(`/years/${year}/data.json`).then((resp) => {
        this.years[year] = resp.json() as unknown as YearData;
        return this.years[year];
      });
    }
  }
}
