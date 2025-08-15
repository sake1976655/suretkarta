const colorPicker = document.getElementById("colorPicker");

canvas.addEventListener("click", async e => {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  const x = Math.floor((e.clientX - rect.left) * scaleX);
  const y = Math.floor((e.clientY - rect.top) * scaleY);
  
  const color = colorPicker.value; // ✅ түсті color input-тан алу
  await supabase.from("pixels").insert({ x, y, color });
});
