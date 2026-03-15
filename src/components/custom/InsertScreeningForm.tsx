export default function InsertScreeningForm() {

    type FormValues = {
    id: number;
    movie_id: number;
    hall_id: number;
    start_time: Date; // DateTime
    end_time: Date; // DateTime
    base_price: number; // Decimal
    };
    return(
        <>
            <div>
                Hello form
            </div>
        </>
    )
}