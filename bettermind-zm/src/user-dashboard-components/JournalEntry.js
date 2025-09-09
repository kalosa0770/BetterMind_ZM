
import { FilePlus2Icon, ChevronRight } from "lucide-react";

import './JournalEntry.css';

const JournalEntry = ({onOpenJournalModal}) => {

    
    return (
        <button className="mood-tracker-container" onClick={onOpenJournalModal}>
            <FilePlus2Icon className="mood-tracker-icon" />

            <div className="mood-tracker-content">
                <p className="mood-tracker-text">Log a Journal Entry</p>
            </div>
            
            <ChevronRight className="mood-tracker-icon-end" />
        </button>
    )
}

export default JournalEntry;