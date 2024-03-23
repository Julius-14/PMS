import DateFrame from "./dateFrame"

export default function DateExpiry ({ date }) {

    const dateExpiryChecker = () => {
        const currentDate = new Date()
        const thirtyDays = currentDate.setDate(currentDate.getDate()+30)
        const sixtyDays = currentDate.setDate(currentDate.getDate()+60)
        if (new Date(date) <= thirtyDays) {
            return 'text-red-600'
        }
        else if (new Date(date) <= sixtyDays) {
            return 'text-amber-600'
        }
        else {
            return 'text-green-600'
        }
    }

    return (
        <span className={dateExpiryChecker()}>
            <DateFrame dateStr={date} />
        </span>
    )
}