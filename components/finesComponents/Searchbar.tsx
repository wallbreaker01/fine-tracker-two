'use client';
import { useState } from 'react';


export function Searchbar() { //need to implement debouncing
    const [Search, setSearch] = useState("");

    const dummyFines = [
        {
            id: 1,
            name: "Asif",
            reason: "Submitted late",
        },
        {
            id: 2,
            name: "Aslam",
            reason: "PC not off",
        },
        {
            id: 3,
            name: "Sowmik",
            reason: "Submitted late",
        },
        {
            id: 4,
            name: "Roy",
            reason: "Day off not taken",
        },
        {
            id: 5,
            name: "Pulok",
            reason: "Day off not taken",
        },
        {
            id: 6,
            name: "Arijit",
            reason: "Leave early",
        },
        {
            id: 7,
            name: "Sing",
            reason: "late comer",
        },
        {
            id: 8,
            name: "Amit",
            reason: "PC not off",
        },
        {
            id: 9,
            name: "Sharma",
            reason: "Tea break not taken",
        },
        {
            id: 10,
            name: "Kumar",
            reason: "PC not off",
        }
    ]
    const filteredFines = dummyFines.filter((fine) => {
        return fine.name.toLowerCase().includes(Search.toLowerCase());
    });

    return (
        <div>
            <input
                type="text"
                placeholder="Search fines..."
                value={Search}
                onChange={(e) => setSearch(e.target.value)}
            />
            <ul>
                {filteredFines.map(fine => (
                    <li key={fine.id}>{fine.name} - {fine.reason}</li>
                ))}
            </ul>

        </div>
    )

}