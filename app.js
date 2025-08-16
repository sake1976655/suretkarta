import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// 🔑 Өз Supabase деректерін қой
const SUPABASE_URL = "https://aidxkrtvmjdoedgucjbt.supabase.co";
const SUPABASE_KEY = "АНОН-KEY-ОСЫНДА"; // Project settings → API → anon public
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");
const colorPicker = document.getElementById("colorPicker");

// Әр "пиксельді" 10x үлкейтіп көрсету
const PIXEL_SIZE = 10;
canvas.style.width = canvas.width * PIXEL_SIZE + "px";
canvas.style.height = canvas.height * PIXEL_SIZE + "px";

// 📌 бос тақта ақ түспен
function initEmptyBoard(width, height) {
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);
}

// 📌 бір пиксель бояу
function drawPixel(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, 1, 1);
}

// 📌 деректерді жүктеу
async function loadPixels() {
  initEmptyBoard(canvas.width, canvas.height);
  const { data, error } = await supabase.from("pixels").select("*");
  if (error) {
    console.error("Load error:", error);
    return;
  }
  data.forEach(p => drawPixel(p.x, p.y, p.color));
}

// 📌 canvas-қа басқанда пиксель сақтау
canvas.addEventListener("click", async e => {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  const x = Math.floor((e.clientX - rect.left) * scaleX);
  const y = Math.floor((e.clientY - rect.top) * scaleY);

  const color = colorPicker.value;
  const { error } = await supabase.from("pixels").insert({ x, y, color });
  if (error) console.error("Insert error:", error);
});

// 📌 realtime тыңдау
supabase.channel("pixels")
  .on("postgres_changes", { event: "*", schema: "public", table: "pixels" }, payload => {
    const p = payload.new;
    drawPixel(p.x, p.y, p.color);
  })
  .subscribe();

// 📌 алғашқы жүктеу
loadPixels();
