export interface Order {
  table: number;
  items: { name: string; price: number }[];
  total: number;
  estimatedTime: string;
  status: string;
  customerName: string;
  orderId: string;
  estimatedTimeInMinutes: number;
  elapsedTime?: number;
  totalTime?: number;
}

export const ordersData: Order[] = [
  {
    table: 1,
    items: [
      { name: "Double Cheese Burger", price: 200 },
      { name: "Paella Pasta", price: 280 },
      { name: "Pork Ribs", price: 200 },
    ],
    total: 680,
    estimatedTime: "10-20 mins",
    status: "New",
    customerName: "John Doe",
    orderId: "#DM1234",
    estimatedTimeInMinutes: 15,
  },
  {
    table: 2,
    items: [
      { name: "Chicken Karaage", price: 150 },
      { name: "Carbonara", price: 380 },
      { name: "Fries", price: 75 },
    ],
    total: 605,
    estimatedTime: "10-20 mins",
    status: "New",
    customerName: "Jane Smith",
    orderId: "#DM1235",
    estimatedTimeInMinutes: 15,
  },
  {
    table: 3,
    items: [
      { name: "2pcs. Fried Chicken Meal", price: 200 },
      { name: "Extra Rice", price: 180 },
    ],
    total: 380,
    estimatedTime: "10-20 mins",
    status: "New",
    customerName: "Jane Smith",
    orderId: "#DM1236",
    estimatedTimeInMinutes: 15,
  },
  // {
  //   table: 3,
  //   items: [
  //     { name: "2pcs. Fried Chicken Meal", price: 200 },
  //     { name: "Extra Rice", price: 180 },
  //   ],
  //   total: 380,
  //   estimatedTime: "10-20 mins",
  //   status: "New",
  //   customerName: "Jane Smith",
  //   orderId: "#DM1235",
  // },
  // {
  //   table: 3,
  //   items: [
  //     { name: "2pcs. Fried Chicken Meal", price: 200 },
  //     { name: "Extra Rice", price: 180 },
  //   ],
  //   total: 380,
  //   estimatedTime: "10-20 mins",
  //   status: "New",
  //   customerName: "Jane Smith",
  //   orderId: "#DM1235",
  // },

  {
    table: 4,
    items: [
      { name: "Grilled Salmon", price: 300 },
      { name: "Garlic Bread", price: 80 },
    ],
    total: 380,
    estimatedTime: "10-20 mins",
    status: "New",
    customerName: "Michael Scott",
    orderId: "#DM1237",
    estimatedTimeInMinutes: 1,
  },

  {
    table: 5,
    items: [
      { name: "Chicken Karaage", price: 150 },
      { name: "Okonomiyaki", price: 200 },
      { name: "Takoyaki", price: 75 },
    ],
    total: 425,
    estimatedTime: "20-30 mins",
    status: "Preparing",
    customerName: "Alice Johnson",
    orderId: "#DM1238",
    estimatedTimeInMinutes: 2,
  },
  {
    table: 6,
    items: [
      { name: "Spaghetti Bolognese", price: 220 },
      { name: "Garlic Bread", price: 80 },
      { name: "Caesar Salad", price: 150 },
    ],
    total: 450,
    estimatedTime: "20-30 mins",
    status: "Preparing",
    customerName: "Jim Halpert",
    orderId: "#DM1239",
    estimatedTimeInMinutes: 3,
  },

  {
    table: 7,
    items: [
      { name: "Margherita Pizza", price: 300 },
      { name: "Chicken Wings", price: 180 },
    ],
    total: 480,
    estimatedTime: "20-30 mins",
    status: "Preparing",
    customerName: "Pam Beesly",
    orderId: "#DM1240",
    estimatedTimeInMinutes: 4,
  },

  {
    table: 8,
    items: [
      { name: "Fish and Chips", price: 260 },
      { name: "Caesar Salad", price: 150 },
    ],
    total: 410,
    estimatedTime: "5-10 mins",
    status: "Serving",
    customerName: "Bob Brown",
    orderId: "#DM1241",
    estimatedTimeInMinutes: 0,
  },
  {
    table: 9,
    items: [
      { name: "Grilled Chicken Sandwich", price: 200 },
      { name: "Sweet Potato Fries", price: 100 },
    ],
    total: 300,
    estimatedTime: "5-10 mins",
    status: "Serving",
    customerName: "Dwight Schrute",
    orderId: "#DM1242",
    estimatedTimeInMinutes: 0,
  },
  {
    table: 10,
    items: [
      { name: "Beef Tacos", price: 220 },
      { name: "Nachos", price: 180 },
    ],
    total: 400,
    estimatedTime: "5-10 mins",
    status: "Serving",
    customerName: "Stanley Hudson",
    orderId: "#DM1243",
    estimatedTimeInMinutes: 0,
  },
];
export const statValues : {
  value: number;
  change: number;
  type: "price"|"number"
}[] = [
  { value: 12345, change: 0.052 , type: "price"},
  { value: 12345, change: 0.031 , type: "number"},
  { value: 12345, change: 0.078 , type: "number"},
  { value: 12345, change: 0.029 , type: "number"},
]

export const chartData = [
  { day: 1, current:0, previous: 0 },
  { day: 2, current:0, previous: 0 },
  { day: 3, current:0, previous: 0 },
  { day: 4, current:0, previous: 0 },
  { day: 5, current: 0, previous: 0 },
  { day: 6, current: 0, previous: 0 },
  { day: 7, current: 0, previous: 0 },
];

export const notificationData = [
  { notification: "25 Burgers left!" },
  { notification: "Lorem ipsum dolor sit amet..." },
  { notification: "Lorem ipsum dolor sit amet..." },
  { notification: "Lorem ipsum dolor sit amet..." },
  { notification: "Lorem ipsum dolor sit amet..." },
  {
    notification:
      "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Officiis, asperiores.",
  },
];

export const ratingData = [
  {
    name: "John Doe",
    email: "JohnDoe@gmail.com",
    rating: 5,
    feedback:
      "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Officiis, asperiores.",
  },
  {
    name: "John Doe",
    email: "JohnDoe@gmail.com",
    rating: 4,
    feedback:
      "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Officiis, asperiores.",
  },
  {
    name: "John Doe",
    email: "JohnDoe@gmail.com",
    rating: 3,
    feedback:
      "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Officiis, asperiores.",
  },
  {
    name: "John Doe",
    email: "JohnDoe@gmail.com",
    rating: 5,
    feedback:
      "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Officiis, asperiores.",
  },
];

export const guestData = { number: 40 };
