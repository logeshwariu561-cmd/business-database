// 1. Switch to the target db
  //use retail_db;

// 2. Clear old data and insert mock retail sales transactions
db.sales.drop();
db.sales.insertMany([
  { _id: 1, product: "Laptop", category: "Electronics", quantity: 5, price: 1200, date: ISODate("2026-10-15T10:00:00Z") },
  { _id: 2, product: "Smartphone", category: "Electronics", quantity: 12, price: 800, date: ISODate("2026-10-16T11:30:00Z") },
  { _id: 3, product: "Desk Chair", category: "Furniture", quantity: 8, price: 150, date: ISODate("2026-10-16T14:15:00Z") },
  { _id: 4, product: "Wireless Mouse", category: "Electronics", quantity: 20, price: 25, date: ISODate("2026-10-17T09:00:00Z") },
  { _id: 5, product: "Coffee Table", category: "Furniture", quantity: 3, price: 350, date: ISODate("2026-10-18T16:45:00Z") },
  { _id: 6, product: "Running Shoes", category: "Apparel", quantity: 15, price: 100, date: ISODate("2026-10-19T12:00:00Z") },
  { _id: 7, product: "Hoodie", category: "Apparel", quantity: 25, price: 50, date: ISODate("2026-10-20T15:20:00Z") }
]);

// 3. Execution of Aggregation Pipeline to generate Sales Insights by Category
db.sales.aggregate([
  {
    // Stage 1: Group by category and calculate sum of metrics
    $group: {
      _id: "$category",
      totalItemsSold: { $sum: "$quantity" },
      totalRevenue: { $sum: { $multiply: [ "$quantity", "$price" ] } },
      averageOrderValue: { $avg: { $multiply: [ "$quantity", "$price" ] } }
    }
  },
  {
    // Stage 2: Sort categories by highest revenue first
    $sort: { totalRevenue: -1 }
  },
  {
    // Stage 3: Project fields cleanly for the final report layout
    $project: {
      _id: 0,
      category: "$_id",
      totalItemsSold: 1,
      totalRevenue: 1,
      averageOrderValue: { $round: ["$averageOrderValue", 2] }
    }
  }
]);