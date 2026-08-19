// Mengambil elemen DOM
const balanceEl = document.getElementById('total-balance');
const incomeEl = document.getElementById('total-income');
const expenseEl = document.getElementById('total-expense');
const listEl = document.getElementById('transaction-list');
const formEl = document.getElementById('transaction-form');
const textInput = document.getElementById('text');
const amountInput = document.getElementById('amount');
const typeInput = document.getElementById('type');

// Membaca data awal dari LocalStorage
const localStorageTransactions = JSON.parse(localStorage.getItem('dompetku_transactions'));
let transactions = localStorageTransactions !== null ? localStorageTransactions : [];

// Helper: Format angka ke Rupiah
function formatRupiah(number) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0
    }).format(number);
}

// Generasi ID acak untuk transaksi
function generateID() {
    return Math.floor(Math.random() * 100000000);
}

// Fungsi Tambah Transaksi
function addTransaction(e) {
    e.preventDefault();

    const text = textInput.value.trim();
    let amount = parseFloat(amountInput.value);
    const type = typeInput.value;

    if (!text || isNaN(amount)) return;

    // Jika pengeluaran, ubah nilai menjadi negatif
    if (type === 'expense') {
        amount = -Math.abs(amount);
    } else {
        amount = Math.abs(amount);
    }

    const transaction = {
        id: generateID(),
        text: text,
        amount: amount
    };

    transactions.push(transaction);
    updateDOM();
    updateLocalStorage();

    // Reset Form
    textInput.value = '';
    amountInput.value = '';
}

// Fungsi Hapus Transaksi berdasarkan ID
function removeTransaction(id) {
    transactions = transactions.filter(t => t.id !== id);
    updateLocalStorage();
    updateDOM();
}

// Menampilkan Transaksi di Halaman
function renderTransaction(transaction) {
    const isIncome = transaction.amount > 0;
    const sign = isIncome ? '+' : '-';
    const itemClass = isIncome ? 'plus' : 'minus';

    const li = document.createElement('li');
    li.classList.add(itemClass);

    li.innerHTML = `
        <span>${transaction.text}</span>
        <div>
            <span>${sign}${formatRupiah(Math.abs(transaction.amount))}</span>
            <button class="delete-btn" onclick="removeTransaction(${transaction.id})">X</button>
        </div>
    `;

    listEl.appendChild(li);
}

// Mengupdate Ringkasan Saldo, Pemasukan, Pengeluaran, dan List UI
function updateDOM() {
    listEl.innerHTML = '';

    transactions.forEach(renderTransaction);

    const amounts = transactions.map(t => t.amount);

    // Total Saldo
    const total = amounts.reduce((acc, item) => (acc += item), 0);

    // Total Pemasukan
    const income = amounts
        .filter(item => item > 0)
        .reduce((acc, item) => (acc += item), 0);

    // Total Pengeluaran
    const expense = amounts
        .filter(item => item < 0)
        .reduce((acc, item) => (acc += item), 0);

    balanceEl.innerText = formatRupiah(total);
    incomeEl.innerText = formatRupiah(income);
    expenseEl.innerText = formatRupiah(Math.abs(expense));
}

// Simpan data ke browser LocalStorage
function updateLocalStorage() {
    localStorage.setItem('dompetku_transactions', JSON.stringify(transactions));
}

// Listener Event
formEl.addEventListener('submit', addTransaction);

// Inisialisasi awal saat halaman dimuat
updateDOM();
