const API_BASE = '../backend'; // adjust if serving differently

async function fetchMenu(){
  const res = await fetch(API_BASE + '/get_menu.php');
  const data = await res.json();
  const menuList = document.getElementById('menu-list');
  menuList.innerHTML = '';
  data.forEach(item => {
    const div = document.createElement('div');
    div.className = 'menu-item';
    div.innerHTML = `<h3>${item.name}</h3><div>${item.description || ''}</div><div>₱ ${item.price}</div>
      <div><button class="add-btn" data-id="${item.item_id}" data-price="${item.price}" data-name="${item.name}">Add</button></div>`;
    menuList.appendChild(div);
  });
  attachAddButtons();
}

let cart = [];

function attachAddButtons(){
  document.querySelectorAll('.add-btn').forEach(btn=>{
    btn.onclick = ()=> {
      const id = btn.dataset.id;
      const name = btn.dataset.name;
      const price = parseFloat(btn.dataset.price);
      const existing = cart.find(c=>c.item_id==id);
      if(existing) existing.quantity++;
      else cart.push({item_id:id, name, price, quantity:1});
      renderCart();
    };
  });
}

function renderCart(){
  const cartDiv = document.getElementById('cart');
  if(cart.length===0){ cartDiv.innerHTML = '<div>No items in cart.</div>'; return; }
  cartDiv.innerHTML = '';
  cart.forEach((c, idx)=>{
    const row = document.createElement('div');
    row.className = 'cart-row';
    row.innerHTML = `<div>${c.name} (₱${c.price})</div>
      <div class="order-item-controls">
        <button data-idx="${idx}" class="dec">-</button>
        <input type="number" value="${c.quantity}" min="1" data-idx="${idx}" class="qty"/>
        <button data-idx="${idx}" class="inc">+</button>
        <button data-idx="${idx}" class="rm">Remove</button>
      </div>`;
    cartDiv.appendChild(row);
  });
  // attach controls
  cartDiv.querySelectorAll('.inc').forEach(b=>b.onclick=()=>{ cart[b.dataset.idx].quantity++; renderCart();});
  cartDiv.querySelectorAll('.dec').forEach(b=>{ b.onclick=()=>{ const i=b.dataset.idx; if(cart[i].quantity>1) cart[i].quantity--; renderCart(); }});
  cartDiv.querySelectorAll('.rm').forEach(b=>{ b.onclick=()=>{ cart.splice(b.dataset.idx,1); renderCart(); }});
  cartDiv.querySelectorAll('.qty').forEach(inp=>{ inp.onchange=()=>{ const i=inp.dataset.idx; cart[i].quantity = Math.max(1, parseInt(inp.value)||1); renderCart(); }});
}

document.getElementById('order-form').onsubmit = async (e)=>{
  e.preventDefault();
  if(cart.length===0){ showMessage('Cart is empty'); return; }
  const name = document.getElementById('cust-name').value.trim();
  const email = document.getElementById('cust-email').value.trim();
  const yearSection = document.getElementById('cust-year-section').value.trim();
  if(!name){ showMessage('Please enter name'); return; }
  if(!yearSection){ showMessage('Please enter year & section'); return; }
  // phone removed per request; keep empty string to satisfy backend shape
  const payload = { customer: {name, email, year_section: yearSection, phone: ''}, items: cart };
  try{
    const res = await fetch(API_BASE + '/place_order.php', {
      method:'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if(data.success){ showMessage('Order placed! Order ID: ' + data.order_id); cart = []; renderCart(); fetchOrders(); }
    else showMessage('Error: ' + (data.message || 'unknown'));
  }catch(err){ showMessage('Network or server error'); }
};

function showMessage(m){
  document.getElementById('message').innerText = m;
  setTimeout(()=> document.getElementById('message').innerText = '', 5000);
}

async function fetchOrders(){
  const res = await fetch(API_BASE + '/get_orders.php');
  const data = await res.json();
  const el = document.getElementById('orders-list');
  el.innerHTML = '';
  data.forEach(o=>{
    const d = document.createElement('div');
    const ys = o.year_section ? ` (${o.year_section})` : '';
    d.innerHTML = `<strong>ID ${o.order_id}</strong> - ${o.customer_name || 'N/A'}${ys} - ₱${o.total_amount} - ${o.status} - ${o.created_at}
      <div><button data-id="${o.order_id}" class="mark-ready">Mark Ready</button> <button data-id="${o.order_id}" class="del">Delete</button></div>`;
    el.appendChild(d);
  });
  el.querySelectorAll('.mark-ready').forEach(b=>b.onclick=async ()=>{
    const id=b.dataset.id;
    await fetch(API_BASE + '/update_order.php', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({order_id:id, status:'Ready'}) });
    fetchOrders();
  });
  el.querySelectorAll('.del').forEach(b=>b.onclick=async ()=>{
    const id=b.dataset.id;
    await fetch(API_BASE + '/delete_order.php', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({order_id:id}) });
    fetchOrders();
  });
}

window.onload = ()=>{
  fetchMenu();
  renderCart();
  fetchOrders();
};
