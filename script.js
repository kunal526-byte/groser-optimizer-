const CATALOG = [
  { name: "Rice (1kg)", price: 60, cal: 1300, protein: 8 },
  { name: "Whole wheat flour (1kg)", price: 45, cal: 1200, protein: 36 },
  { name: "Toor dal (1kg)", price: 140, cal: 1500, protein: 90 },
  { name: "Eggs (6 pcs)", price: 48, cal: 420, protein: 36 },
  { name: "Milk (1L)", price: 56, cal: 600, protein: 32 },
  { name: "Paneer (200g)", price: 90, cal: 520, protein: 36 },
  { name: "Chicken breast (500g)", price: 180, cal: 825, protein: 155 },
  { name: "Bananas (1 dozen)", price: 60, cal: 1050, protein: 13 },
  { name: "Spinach (250g)", price: 20, cal: 58, protein: 7 },
  { name: "Onions (1kg)", price: 35, cal: 400, protein: 11 },
  { name: "Tomatoes (1kg)", price: 40, cal: 180, protein: 9 },
  { name: "Peanut butter (350g)", price: 150, cal: 2100, protein: 88 },
];

function renderCatalog() {
  const el = document.getElementById("itemList");
  el.innerHTML = CATALOG.map((item, i) => `
    <div class="item-row">
      <input type="checkbox" id="chk${i}" checked>
      <div class="item-info">
        <div class="item-name">${item.name}</div>
        <div class="item-meta">${item.cal} cal · ${item.protein}g protein</div>
      </div>
      <input type="number" class="qty" id="qty${i}" value="1" min="1" max="5">
      <div class="item-price">₹${item.price}</div>
    </div>
  `).join("");
}
renderCatalog();

function optimize() {
  const budget = parseFloat(document.getElementById("budget").value) || 0;
  const selected = [];
  CATALOG.forEach((item, i) => {
    const checked = document.getElementById(`chk${i}`).checked;
    const qty = parseInt(document.getElementById(`qty${i}`).value) || 1;
    if (checked) {
      selected.push({
        ...item,
        qty,
        totalPrice: item.price * qty,
        totalCal: item.cal * qty,
        totalProtein: item.protein * qty,
      });
    }
  });

  const resultsEl = document.getElementById("results");
  if (selected.length === 0) {
    resultsEl.innerHTML = '<div class="empty">No items selected. Tick at least one item on the left.</div>';
    return;
  }

  // Greedy: rank by protein-per-rupee, fill until budget runs out
  const ranked = [...selected].sort(
    (a, b) => b.totalProtein / b.totalPrice - a.totalProtein / a.totalPrice
  );
  const kept = [];
  const dropped = [];
  let spent = 0;
  ranked.forEach((item) => {
    if (spent + item.totalPrice <= budget) {
      kept.push(item);
      spent += item.totalPrice;
    } else {
      dropped.push(item);
    }
  });

  const originalTotal = selected.reduce((s, i) => s + i.totalPrice, 0);
  const totalCal = kept.reduce((s, i) => s + i.totalCal, 0);
  const totalProtein = kept.reduce((s, i) => s + i.totalProtein, 0);
  const savings = Math.max(0, originalTotal - spent);

  resultsEl.innerHTML = `
    <div class="stat-row">
      <div class="stat"><div class="num">₹${spent}</div><div class="lbl">Total cost (of ₹${budget} budget)</div></div>
      <div class="stat"><div class="num">₹${savings}</div><div class="lbl">Saved vs. buying full list</div></div>
      <div class="stat"><div class="num">${totalProtein}g</div><div class="lbl">Total protein</div></div>
      <div class="stat"><div class="num">${totalCal}</div><div class="lbl">Total calories</div></div>
    </div>
    ${kept.map(i => `<div class="result-item"><span>${i.name} ×${i.qty}</span><span>₹${i.totalPrice}</span></div>`).join("")}
    ${dropped.length ? `
      <div class="dropped">
        <div class="lbl">Left out to stay within budget:</div>
        ${dropped.map(i => `<span class="tag">${i.name}</span>`).join("")}
      </div>` : ""}
  `;
}
