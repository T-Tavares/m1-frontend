import style from './FormBox.module.css';

import {ReactElement, useEffect, useState} from 'react';
import FormEntry from '../FormEntry/FormEntry';
import DB from '../../assets/testCases.json';

import {T_RequestObj, T_RequestEntries, T_Response} from '../../models/types';

export default function FormBox() {
    const [isAutoFillOn, setAutoFill] = useState(false); //                  If on, pass test cases on inputs & hide + - entries btns.

    const [entriesEls, setEntriesEls] = useState<ReactElement[]>([]); //     Entries Inputs Elements
    const [entriesNum, setEntriesNum] = useState(1); //                      Entries Numbers (If user wants to add any other entries)

    const [reputesData, setReputesData] = useState<T_RequestEntries>(); //   Holds data from API
    const [reputesEls, setReputeEls] = useState<ReactElement[]>([]); //      Render API data (reputesData) as HTML table elements

    const [areEntriesVisible, setAreEntriesVisible] = useState(false);

    // --------------------- HIDE ENTRIES HANDLER --------------------- //
    const areEntriesVisibleHandler = () => {
        setAreEntriesVisible(!areEntriesVisible);
    };
    const checkboxEntriesHandler = () => {
        const hideEntriesCheckbox = document.getElementById('hide-entries');
        if (hideEntriesCheckbox && 'checked' in hideEntriesCheckbox) {
            hideEntriesCheckbox.checked = true;
        }
    };

    // ---------------------- AUTO FILL HANDLER ----------------------- //

    const autoFillHandler = (event: React.MouseEvent<HTMLInputElement>): void => {
        setAutoFill(event.currentTarget.checked);
    };

    // ------------- ADD AND REMOVE ENTRY FIELDS HANDLERS ------------- //

    const addEntryHandler = (e: {preventDefault: () => void}) => {
        e.preventDefault();
        setEntriesNum(entriesNum + 1);
        return '';
    };

    const removeEntryHandler = (e: {preventDefault: () => void}) => {
        e.preventDefault();
        setEntriesNum(entriesNum - 1);
    };

    // --------------------- RENDER EMPTY ENTRIES --------------------- //

    const renderEmptyEntries = (): void => {
        const entriesArr = Array(entriesNum)
            .fill('')
            .map((_, i) => <FormEntry key={`entry-key-${i}`} />);

        setEntriesEls(entriesArr);
    };

    // ------------------ RENDER AUTO FILLED ENTRIES ------------------ //

    const renderAutoFilledEntries = (): void => {
        const entriesArr = DB.entriesArr.map((reputeInput, i) => (
            <FormEntry key={`entry-key-${i}`} reputeInput={reputeInput} />
        ));

        setEntriesEls(entriesArr);
    };

    // ------------------- INPUTS REPUTES HANDLER --------------------- //

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const inputsReputesHandler = (e: {preventDefault: () => void; target: {children: any}}): HTMLFormElement | void => {
        e.preventDefault();

        // ----------- GETTING DATA FROM ENTRIES (INPUT FIELDS) ----------- //
        if ('target' in e) {
            // GETTING VALUES MATRIX
            const valuesMatrix = [...e.target.children]
                .slice(1)
                .map(entryBox => [...entryBox.children])
                .map(entry => entry.map(input => input.value));

            // CONVERTING MATRIX TO OBJ

            const driversEntries: T_RequestEntries = {entriesArr: []};

            valuesMatrix.forEach(row => {
                const [driver_name, car_model, car_year, claim_history] = row;
                const driverObj: T_RequestObj = {
                    driver_name,
                    car_model,
                    car_year: +car_year,
                    claim_history,
                };

                driversEntries.entriesArr.push(driverObj);
            });

            // SET REPUTES DATA STATE
            setReputesData(driversEntries);
        }
    };

    // -------------------- RENDER REPUTES QUOTES --------------------- //

    const renderReputes = async (reputesData: T_RequestEntries): Promise<void> => {
        if (!reputesData) return;
        // Fetch Setup
        const API = 'http://localhost:4000/get-multiple-insurance-reputes';

        const Options = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(reputesData),
        };

        const dataRaw = await fetch(API, Options);
        const response: {data: T_Response[]} = await dataRaw.json();

        const reputeQuotesEls = response?.data?.map((reputeEntry: T_Response, i) => {
            if (reputeEntry.error) {
                return (
                    <tr key={`keu-error-${i}`}>
                        <td colSpan={6}>{`${reputeEntry.error} Please Check entry number ${i + 1} and try again.`}</td>
                    </tr>
                );
            }
            return (
                <tr key={`key-${reputeEntry.driverName}-${i}`}>
                    <td>{reputeEntry.driverName}</td>
                    <td>{`$ ${reputeEntry.carValue}`}</td>
                    <td>{reputeEntry.carYear}</td>
                    <td>{reputeEntry.riskRating}</td>
                    <td>{`$ ${reputeEntry.yearlyPremium}`}</td>
                    <td>{`$ ${reputeEntry.monthlyPremium}`}</td>
                </tr>
            );
        });

        setReputeEls(reputeQuotesEls);
        checkboxEntriesHandler();
    };

    useEffect(() => {
        renderReputes(reputesData as T_RequestEntries);
        areEntriesVisibleHandler();
    }, [reputesData]);

    // ------------------ useEffect() REDER ENTRIES ------------------- //

    useEffect(() => {
        isAutoFillOn ? renderAutoFilledEntries() : renderEmptyEntries();
    }, [entriesNum, isAutoFillOn]);

    // ---------------------------------------------------------------- //
    // -------------------------- COMPONENT --------------------------- //
    // ---------------------------------------------------------------- //

    return (
        <>
            {/* prettier-ignore */}
            <form className={style.formBox} onSubmit={inputsReputesHandler}>
                <div className={style.btns}>
                    <div className={style.autoFill}>
                        <label htmlFor="autofill">Autofill</label>
                        <input type="checkbox" name="autofill" id="autofill" onClick={autoFillHandler} />
                        <label htmlFor="autofill">Hide Entries</label>
                        <input type="checkbox" name="hide-entries" id="hide-entries" onClick={areEntriesVisibleHandler} />
                    </div>
                    
                    {!isAutoFillOn && 
                        <>
                            <button className={style.addEntry} onClick={addEntryHandler}>+</button>
                            <button className={style.removeEntry} onClick={removeEntryHandler}>-</button>
                        </>
                    }
                    <button className={style.generateQuoteBtn} >➤</button>
                </div>
                {areEntriesVisible && entriesEls}
            </form>
            <div className={style.result}>
                <table>
                    <thead>
                        <tr>
                            <th>Driver Name</th>
                            <th>Car</th>
                            <th>Year</th>
                            <th>Risk Rating</th>
                            <th>Yearly Quote</th>
                            <th>Monthly Quote</th>
                        </tr>
                    </thead>
                    <tbody>{reputesEls}</tbody>
                </table>
            </div>
        </>
    );
}
