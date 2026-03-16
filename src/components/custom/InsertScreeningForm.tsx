import { useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import BiografSelect from "./BiografSelect";
import BiografInput from "./BiografInput";
import BiografButton from "./BiografButton";
import { useMovies } from "@/api/hooks/useMovies";
import { useHalls } from "@/api/hooks/useHalls";

export default function InsertScreeningForm() {
  const queryClient = useQueryClient();
  const [movieId, setMovieId] = useState("");
  const [hallId, setHallId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [status, setStatus] = useState("");

  const { data: moviesData, isLoading: moviesLoading, isError: moviesError } = useMovies();
  const movieOptions = useMemo(() => {
    return (moviesData?.data ?? []).map((movie) => ({
      value: String(movie.id),
      label: movie.title,
    }));
  }, [moviesData]);

  const { data: hallData, isLoading: hallsLoading, isError: hallsError } = useHalls();
  const hallOptions = useMemo(() => {
    return (hallData?.data ?? []).map((hall) => ({
      value: String(hall.id),
      label: hall.name,
    }));
  }, [hallData]);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (body: { movieId: number; hallId: number; screeningDate: string; screeningTime: string }) =>
      fetch("/api/v2/screenings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      }).then((res) => {
        if (!res.ok) throw new Error("Misslyckades");
        return res.json();
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["screenings"] });
      setStatus("Skapad visning!");
    },
    onError: () => setStatus("Misslyckades"),
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await mutateAsync({
      movieId: Number(movieId),
      hallId: Number(hallId),
      screeningDate: date,
      screeningTime: time,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="grid max-w-520px gap-3 p-6">
      <h1 className="text-2xl font-bold text-[#F3EEE4]">Lägg till filmvisning</h1>

      <BiografSelect
        value={movieId}
        onValueChange={setMovieId}
        placeholder="Välj film"
        options={movieOptions}
      />
      {moviesLoading && <p className="text-sm text-color-gold-dark">Laddar filmer...</p>}
      {moviesError && <p className="text-sm text-red-500">Kunde inte hämta filmer</p>}

      <BiografSelect
        value={hallId}
        onValueChange={setHallId}
        placeholder="Välj en salong"
        options={hallOptions}
      />
      {hallsLoading && <p className="text-sm text-color-gold-dark">Laddar salonger...</p>}
      {hallsError && <p className="text-sm text-red-500">Kunde inte hämta salonger</p>}

      <BiografInput
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />

      <BiografInput
        type="time"
        value={time}
        onChange={(e) => setTime(e.target.value)}
        required
      />

      <BiografButton type="submit" disabled={isPending}>
        {isPending ? "Sparar..." : "Spara"}
      </BiografButton>

      {status && <p className="text-sm text-green-500">{status}</p>}
    </form>
  );
}