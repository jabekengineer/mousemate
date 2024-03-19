import { today } from "./today_mmddyyyy";
export default function ageFromDate(dateString){
    // assuming mm/dd/yyyy format
    if(dateString) {
        let dateObj = new Date(dateString);
        let _today = new Date(today);
        const _MS_PER_DAY = 1000 * 60 * 60 * 24;
        const utc1 = Date.UTC(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate());
        const utc2 = Date.UTC(_today.getFullYear(), _today.getMonth(), _today.getDate());
        return Math.floor((utc2 - utc1) / _MS_PER_DAY);
    }
}