import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// 🔑 Өз Supabase деректерін қой
const SUPABASE_URL = "https://aidxkrtvmjdoedgucjbt.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpZHhrcnR2bWpkb2VkZ3VjamJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyNzM4MjcsImV4cCI6MjA3MDg0OTgyN30.B6vSxEu-UWQdWJWig5AE2K3KU6LWZgnSO4wFj-vT0t8"; // Project settings → API → anon public
const supabase = createClient("https://aidxkrtvmjdoedgucjbt.supabase.co","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpZHhrcnR2bWpkb2VkZ3VjamJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyNzM4MjcsImV4cCI6MjA3MDg0OTgyN30.B6vSxEu-UWQdWJWig5AE2K3KU6LWZgnSO4wFj-vT0t8);

const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");
const colorPicker = document.getElementById("colorPicker");

// 1️⃣ Бар пиксельдерді жүктеу
async function loadPixels() {
  const { data, error } = await supabase.from("pixels").select("*");
  if (error) {
    console.error("Жүктеу қатесі:", error);
    return;
  }
  data.forEach(p => {
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x, p.y, 5, 5);
  });
}

// 2️⃣ Жаңа пиксель салу
canvas.addEventListener("click", async (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = Math.floor(e.clientX - rect.left);
  const y = Math.floor(e.clientY - rect.top);
  const color = colorPicker.value;

  // жергілікті салу
  ctx.fillStyle = color;
  ctx.fillRect(x, y, 5, 5);

  // базаға сақтау
  const { error } = await supabase.from("pixels").insert([{ x, y, color }]);
  if (error) console.error("Сақтау қатесі:", error);
});

// Бастапқы пиксельдерді жүктеу
loadPixels();
