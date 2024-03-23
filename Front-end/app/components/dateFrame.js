export default function DateFrame ({ dateStr }) 
{
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    return (
        <span>
            {months[new Date(dateStr).getUTCMonth()]} {new Date(dateStr).getDate()}, {new Date(dateStr).getFullYear()}
        </span>
    )
}