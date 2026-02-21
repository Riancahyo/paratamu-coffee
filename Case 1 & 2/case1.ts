//Data
type IFruit = {
  fruitId: number;
  fruitName: string;
  fruitType: "IMPORT" | "LOCAL";
  stock: number;
};

const fruits: IFruit[] = [
  { fruitId: 1, fruitName: "Apel", fruitType: "IMPORT", stock: 10 },
  { fruitId: 2, fruitName: "Kurma", fruitType: "IMPORT", stock: 20 },
  { fruitId: 3, fruitName: "apel", fruitType: "IMPORT", stock: 50 },
  { fruitId: 4, fruitName: "Manggis", fruitType: "LOCAL", stock: 100 },
  { fruitId: 5, fruitName: "Jeruk Bali", fruitType: "LOCAL", stock: 10 },
  { fruitId: 5, fruitName: "KURMA", fruitType: "IMPORT", stock: 20 },
  { fruitId: 5, fruitName: "Salak", fruitType: "LOCAL", stock: 150 },
];

// Soal 1: Buah apa saja yang dimiliki Andi?
function getFruitNames(fruits: IFruit[]): string[] {
  const seen = new Set<string>();
  const uniqueFruits: string[] = [];

  for (const fruit of fruits) {
    const normalized = fruit.fruitName.toLowerCase();
    if (!seen.has(normalized)) {
      seen.add(normalized);
      uniqueFruits.push(fruit.fruitName);
    }
  }

  return uniqueFruits;
}

console.log("Buah yang dimiliki Andi (unik, case-insensitive):");
console.log(getFruitNames(fruits));

// Soal 2: Berapa jumlah wadah & isi masing-masing?
function groupByFruitType(fruits: IFruit[]): Record<string, string[]> {
  const grouped: Record<string, string[]> = {};

  for (const fruit of fruits) {
    if (!grouped[fruit.fruitType]) {
      grouped[fruit.fruitType] = [];
    }

    const normalized = fruit.fruitName.toLowerCase();
    const alreadyExists = grouped[fruit.fruitType].some(
      (name) => name.toLowerCase() === normalized
    );

    if (!alreadyExists) {
      grouped[fruit.fruitType].push(fruit.fruitName);
    }
  }

  return grouped;
}

const grouped = groupByFruitType(fruits);
console.log(`Jumlah wadah: ${Object.keys(grouped).length}`);
for (const [type, names] of Object.entries(grouped)) {
  console.log(`Wadah ${type}: ${names.join(", ")}`);
}

// Soal 3: Total stock di masing-masing wadah
function getTotalStockByType(fruits: IFruit[]): Record<string, number> {
  const totalStock: Record<string, number> = {};

  for (const fruit of fruits) {
    if (!totalStock[fruit.fruitType]) {
      totalStock[fruit.fruitType] = 0;
    }
    totalStock[fruit.fruitType] += fruit.stock;
  }

  return totalStock;
}

const stockByType = getTotalStockByType(fruits);
for (const [type, total] of Object.entries(stockByType)) {
  console.log(`Total stock wadah ${type}: ${total}`);
}

// Soal 4: Komentar terkait data
console.log(`
Ada beberapa anomali pada data fruits:

1. Duplikat fruitId: fruitId 5 digunakan oleh 3 buah berbeda 
   (Jeruk Bali, KURMA, Salak). fruitId seharusnya bersifat unik 
   sebagai identifier.

2. Inkonsistensi penulisan fruitName: 
   - 'Apel' (id:1) dan 'apel' (id:3) merujuk buah yang sama
   - 'Kurma' (id:2) dan 'KURMA' (id:5) merujuk buah yang sama
   Sebaiknya dilakukan normalisasi nama sebelum menyimpan data.

3. Karena anomali di atas, total stock perlu dihitung dengan hati-hati
   apakah 'Apel' dan 'apel' dianggap satu jenis buah (stock: 60) 
   atau dua jenis berbeda?
`);