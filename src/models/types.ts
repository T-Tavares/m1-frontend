export interface I_Error {
    error: string;
}
export interface I_Response {
    driverName: string;
    carModel: string;
    carYear: number;
    riskRating: number;
    carValue: number;
    monthlyPremium: number;
    yearlyPremium: number;
}

export type T_Response = I_Response & I_Error;

export type T_Response_ =
    | {
          driverName: string;
          carModel: string;
          carYear: number;
          riskRating: number;
          carValue: number;
          monthlyPremium: number;
          yearlyPremium: number;
      }
    | {
          error: string;
      };

export type T_RequestObj = {
    driver_name: string;
    car_model: string;
    car_year: number;
    claim_history: string;
};
export type T_RequestEntries = {entriesArr: T_RequestObj[]};
export type T_ResponseEntries = {data: T_Response[]};
