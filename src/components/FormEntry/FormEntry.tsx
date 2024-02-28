import style from './FormEntry.module.css';

interface I_Repute_Entry {
    driver_name: string;
    car_model: string;
    car_year: number;
    claim_history: string;
}
export default function FormEntry(props?: {reputeInput?: I_Repute_Entry}) {
    if (props?.reputeInput) {
        const {driver_name, car_model, car_year, claim_history} = props.reputeInput;

        return (
            <div className={style.entry}>
                <input type="text" placeholder="Driver Name" defaultValue={driver_name} />
                <input type="text" placeholder="Car Model" defaultValue={car_model} />
                <input type="number" placeholder="Car Year" defaultValue={car_year} />
                <textarea name="claim" id="claim" placeholder="Driver Claim" defaultValue={claim_history}></textarea>
            </div>
        );
    }

    return (
        <div className={style.entry}>
            <input type="text" placeholder="Driver Name" />
            <input type="text" placeholder="Car Model" />
            <input type="number" placeholder="Car Year" />
            <textarea name="claim" id="claim" placeholder="Driver Claim"></textarea>
        </div>
    );
}
