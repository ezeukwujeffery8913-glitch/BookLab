
"use client";

import { useEffect, useMemo, useState } from "react";

type Book = {
  id: number;
  title: string;
  author: string;
  course: string;
  category: "Library" | "Student";
  owner: string;
  color: string;
};

type Reservation = {
  book: Book;
  code: string;
  status: "Reserved" | "Collected";
};

const books: Book[] = [
  {
    id: 1,
    title: "Introduction to Algorithms",
    author: "Thomas H. Cormen",
    course: "CSC 301",
    category: "Library",
    owner: "University Library",
    color: "bg-amber-100",
  },
  {
    id: 2,
    title: "Discrete Mathematics",
    author: "Kenneth Rosen",
    course: "MTH 202",
    category: "Student",
    owner: "Ada O.",
    color: "bg-blue-100",
  },
  {
    id: 3,
    title: "Computer Organization",
    author: "Carl Hamacher",
    course: "CSC 204",
    category: "Library",
    owner: "University Library",
    color: "bg-emerald-100",
  },
  {
    id: 4,
    title: "Clean Code",
    author: "Robert C. Martin",
    course: "SWE 301",
    category: "Student",
    owner: "Daniel K.",
    color: "bg-rose-100",
  },
  {
    id: 5,
    title: "Database System Concepts",
    author: "Abraham Silberschatz",
    course: "CSC 302",
    category: "Library",
    owner: "University Library",
    color: "bg-violet-100",
  },
  {
    id: 6,
    title: "Operating System Concepts",
    author: "Abraham Silberschatz",
    course: "CSC 308",
    category: "Student",
    owner: "Mariam A.",
    color: "bg-orange-100",
  },
];

export default function Home() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [page, setPage] = useState<"browse" | "confirmation" | "tracking">("browse");

  useEffect(() => {
    const saved = localStorage.getItem("booklab-reservation");
    if (saved) {
      setReservation(JSON.parse(saved));
    }
  }, []);

  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const matchesSearch = `${book.title} ${book.author} ${book.course}`
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesFilter =
        filter === "All" || book.category === filter;

      return matchesSearch && matchesFilter;
    });
  }, [search, filter]);

  function reserveBook(book: Book) {
    const newReservation: Reservation = {
      book,
      code: Math.floor(100000 + Math.random() * 900000).toString(),
      status: "Reserved",
    };

    setReservation(newReservation);
    localStorage.setItem(
      "booklab-reservation",
      JSON.stringify(newReservation)
    );
    setPage("confirmation");
  }

  function collectBook() {
    if (!reservation) return;

    const updated = { ...reservation, status: "Collected" as const };
    setReservation(updated);
    localStorage.setItem("booklab-reservation", JSON.stringify(updated));
  }

  function cancelReservation() {
    setReservation(null);
    localStorage.removeItem("booklab-reservation");
    setPage("browse");
  }

  return (
    <main className="min-h-screen bg-[#f8f6f0] text-[#292820]">
      <header className="border-b border-[#e8e2d5] bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <button onClick={() => setPage("browse")} className="text-left">
            <div className="text-2xl font-bold tracking-tight">
              Book<span className="text-[#a7793c]">Lab.</span>
            </div>
            <div className="text-xs tracking-widest text-gray-500">
              YOUR CAMPUS BOOK HUB
            </div>
          </button>

          <nav className="flex items-center gap-6 text-sm font-medium">
            <button onClick={() => setPage("browse")} className="hover:text-[#a7793c]">
              Browse books
            </button>
            <button onClick={() => setPage("tracking")} className="hover:text-[#a7793c]">
              My reservation
            </button>
            <span className="hidden rounded-full bg-[#f1ebdf] px-4 py-2 text-xs text-[#80602f] sm:block">
              Campus community
            </span>
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8">
        {page === "browse" && (
          <>
            <section className="rounded-2xl bg-[#342f26] px-7 py-12 text-white md:px-12">
              <p className="mb-4 text-xs font-semibold tracking-[0.25em] text-[#d8b77e]">
                DISCOVER. RESERVE. LEARN.
              </p>
              <h1 className="max-w-2xl text-4xl font-semibold leading-tight md:text-5xl">
                The right book can change your semester.
              </h1>
              <p className="mt-5 max-w-xl text-sm leading-7 text-[#e4ded2]">
                Find textbooks from your university library and fellow
                students. Reserve a copy and arrange a verified campus handover.
              </p>

              <div className="mt-8 flex max-w-2xl flex-col gap-3 sm:flex-row">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by title, author or course code..."
                  className="w-full rounded-lg border border-white/20 bg-white px-5 py-4 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-[#c49a5b]"
                />
                <button
                  onClick={() => setSearch("")}
                  className="rounded-lg bg-[#c49a5b] px-7 py-4 text-sm font-semibold text-white hover:bg-[#b1874b]"
                >
                  Clear search
                </button>
              </div>
            </section>

            <section className="mt-10">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                  <p className="text-xs font-semibold tracking-widest text-[#a7793c]">
                    THE COLLECTION
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold">Explore textbooks</h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Find your next essential course material.
                  </p>
                </div>

                <div className="flex gap-2">
                  {["All", "Library", "Student"].map((item) => (
                    <button
                      key={item}
                      onClick={() => setFilter(item)}
                      className={`rounded-full px-5 py-2 text-sm ${
                        filter === item
                          ? "bg-[#342f26] text-white"
                          : "border border-[#ded8cb] bg-white text-gray-600 hover:border-[#a7793c]"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {filteredBooks.map((book) => (
                  <article
                    key={book.id}
                    className="overflow-hidden rounded-xl border border-[#e8e2d5] bg-white transition hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className={`${book.color} flex h-48 items-center justify-center`}>
                      <div className="flex h-36 w-24 flex-col justify-between rounded-r-md border-l-4 border-black/20 bg-[#72583b] p-3 text-white shadow-xl">
                        <span className="text-[9px] tracking-widest">BOOKLAB LIBRARY</span>
                        <span className="text-center text-xs font-bold leading-4">
                          {book.title}
                        </span>
                        <span className="text-[9px]">{book.author}</span>
                      </div>
                    </div>

                    <div className="p-5">
                      <div className="flex items-center justify-between">
                        <span className="rounded-full bg-[#f2ede3] px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#80602f]">
                          {book.category}
                        </span>
                        <span className="text-xs text-gray-400">{book.course}</span>
                      </div>

                      <h3 className="mt-4 text-lg font-semibold">{book.title}</h3>
                      <p className="mt-1 text-sm text-gray-500">{book.author}</p>
                      <div className="mt-4 border-t border-[#eee9df] pt-4">
                        <p className="text-xs text-gray-500">
                          Provided by: <strong className="text-gray-700">{book.owner}</strong>
                        </p>
                        <button
                          onClick={() => reserveBook(book)}
                          className="mt-4 w-full rounded-lg bg-[#342f26] py-3 text-sm font-semibold text-white hover:bg-[#554a38]"
                        >
                          Reserve this book
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {filteredBooks.length === 0 && (
                <div className="rounded-xl border border-dashed border-[#d8cdbb] py-16 text-center">
                  <p className="font-semibold">No books found</p>
                  <p className="mt-2 text-sm text-gray-500">
                    Try another title, author or course code.
                  </p>
                </div>
              )}
            </section>
          </>
        )}

        {page === "confirmation" && reservation && (
          <section className="mx-auto max-w-2xl rounded-2xl border border-[#e8e2d5] bg-white p-8 text-center shadow-sm md:p-12">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl text-green-700">
              ✓
            </div>
            <p className="mt-6 text-xs font-semibold tracking-widest text-[#a7793c]">
              RESERVATION CONFIRMED
            </p>
            <h1 className="mt-3 text-3xl font-semibold">Your book is reserved!</h1>
            <p className="mt-3 text-sm leading-6 text-gray-500">
              Your reservation has been created. Keep your pickup code safe
              and present it during the campus handover.
            </p>

            <div className="mt-8 rounded-xl bg-[#f8f6f0] p-6">
              <p className="text-xs uppercase tracking-widest text-gray-500">
                Your six-digit pickup code
              </p>
              <p className="mt-3 text-4xl font-bold tracking-[0.3em] text-[#80602f]">
                {reservation.code}
              </p>
            </div>

            <div className="mt-6 text-left">
              <p className="text-xs uppercase tracking-widest text-gray-400">Reserved book</p>
              <p className="mt-2 font-semibold">{reservation.book.title}</p>
              <p className="mt-1 text-sm text-gray-500">
                {reservation.book.author} · {reservation.book.course}
              </p>
              <p className="mt-3 text-sm text-gray-600">
                Handover provider: {reservation.book.owner}
              </p>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => setPage("tracking")}
                className="flex-1 rounded-lg bg-[#342f26] py-3 text-sm font-semibold text-white"
              >
                Track reservation
              </button>
              <button
                onClick={() => setPage("browse")}
                className="flex-1 rounded-lg border border-[#ded8cb] py-3 text-sm font-semibold"
              >
                Browse more books
              </button>
            </div>
          </section>
        )}

        {page === "tracking" && (
          <section className="mx-auto max-w-2xl rounded-2xl border border-[#e8e2d5] bg-white p-8 shadow-sm md:p-12">
            <p className="text-xs font-semibold tracking-widest text-[#a7793c]">
              YOUR BOOKLAB ACTIVITY
            </p>
            <h1 className="mt-3 text-3xl font-semibold">My reservation</h1>

            {!reservation ? (
              <div className="py-12 text-center">
                <p className="text-lg font-semibold">No active reservation</p>
                <p className="mt-2 text-sm text-gray-500">
                  Browse the collection to reserve your first book.
                </p>
                <button
                  onClick={() => setPage("browse")}
                  className="mt-6 rounded-lg bg-[#342f26] px-6 py-3 text-sm text-white"
                >
                  Explore books
                </button>
              </div>
            ) : (
              <>
                <div className="mt-8 rounded-xl bg-[#f8f6f0] p-6">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-semibold uppercase tracking-widest text-gray-500">
                      Reservation status
                    </span>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      reservation.status === "Collected"
                        ? "bg-green-100 text-green-700"
                        : "bg-amber-100 text-amber-800"
                    }`}>
                      {reservation.status}
                    </span>
                  </div>
                  <h2 className="mt-5 text-xl font-semibold">{reservation.book.title}</h2>
                  <p className="mt-1 text-sm text-gray-500">{reservation.book.author}</p>
                  <p className="mt-4 text-sm">Pickup code: <strong>{reservation.code}</strong></p>
                  <p className="mt-2 text-sm">Provider: {reservation.book.owner}</p>
                </div>

                <div className="mt-8 space-y-5">
                  <div className="flex gap-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-700">✓</span>
                    <div>
                      <p className="font-semibold">Book reserved</p>
                      <p className="text-sm text-gray-500">Your reservation has been recorded.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                      reservation.status === "Collected"
                        ? "bg-green-100 text-green-700"
                        : "bg-[#f1ebdf] text-[#80602f]"
                    }`}>
                      {reservation.status === "Collected" ? "✓" : "2"}
                    </span>
                    <div>
                      <p className="font-semibold">Campus handover</p>
                      <p className="text-sm text-gray-500">
                        Present your pickup code to the provider.
                      </p>
                    </div>
                  </div>
                </div>

                {reservation.status === "Reserved" && (
                  <button
                    onClick={collectBook}
                    className="mt-8 w-full rounded-lg bg-[#342f26] py-4 text-sm font-semibold text-white"
                  >
                    I've picked it up (demo)
                  </button>
                )}

                {reservation.status === "Collected" && (
                  <p className="mt-8 rounded-lg bg-green-50 p-4 text-center text-sm font-semibold text-green-700">
                    Collection marked as complete!
                  </p>
                )}

                <button
                  onClick={cancelReservation}
                  className="mt-4 w-full rounded-lg border border-[#ded8cb] py-3 text-sm text-gray-600"
                >
                  Clear demo reservation
                </button>
              </>
            )}
          </section>
        )}

        <footer className="mt-16 border-t border-[#e8e2d5] py-7 text-center">
          <p className="text-lg font-bold">Book<span className="text-[#a7793c]">Lab.</span></p>
          <p className="mt-2 text-xs text-gray-500">
            Connecting students to the books they need.
          </p>
          <p className="mt-4 text-[10px] text-gray-400">
            Prototype demonstration · Sample books and reservations · Not connected to PAU library systems
          </p>
        </footer>
      </div>
    </main>
  );
}
