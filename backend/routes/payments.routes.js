// // backend/routes/payments.routes.js
// // Payment endpoints

// import express from "express";
// import { ObjectId } from "mongodb";
// import { getDB } from "../config/database.js";

// const router = express.Router();

// // GET /payments
// router.get("/", async (req, res) => {
//   try {
//     const db = getDB();
//     const rawPayments = await db
//       .collection("payments")
//       .find({})
//       .sort({ createdAt: -1 })
//       .limit(200)
//       .toArray();
//     const bookingIds = rawPayments.map((p) => p.bookingId).filter(Boolean);
//     const bookingsMap = new Map();
//     if (bookingIds.length > 0) {
//       const bookings = await db
//         .collection("bookings")
//         .find({
//           _id: {
//             $in: bookingIds.map((id) => {
//               try {
//                 return new ObjectId(id);
//               } catch {
//                 return id;
//               }
//             }),
//           },
//         })
//         .toArray();
//       for (const b of bookings) {
//         bookingsMap.set(b._id.toString(), {
//           eventTitle: b.eventTitle || b.serviceTitle || null,
//         });
//       }
//     }
//     res.json(
//       rawPayments.map((p) => ({
//         id: p._id.toString(),
//         bookingId: p.bookingId || null,
//         razorpayOrderId: p.razorpayOrderId || null,
//         razorpayPaymentId: p.razorpayPaymentId || null,
//         amount: p.amount || 0,
//         currency: p.currency || "INR",
//         type: p.type || "booking",
//         status: p.status || "pending",
//         createdAt: p.createdAt ? new Date(p.createdAt).toISOString() : new Date().toISOString(),
//         eventTitle: bookingsMap.get(String(p.bookingId || ""))?.eventTitle || null,
//       }))
//     );
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // GET /payments/:id
// router.get("/:id", async (req, res) => {
//   try {
//     const db = getDB();
//     const { id } = req.params;
//     let payment = null;
//     try {
//       payment = await db.collection("payments").findOne({ _id: new ObjectId(id) });
//     } catch (_) {}
//     if (!payment)
//       payment = await db.collection("payments").findOne({ razorpayPaymentId: id });
//     if (!payment) return res.status(404).json({ error: "Payment not found" });
//     res.json({ ...payment, id: payment._id.toString() });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// export default router;
// backend/routes/payments.routes.js
// Payment endpoints

import express from "express";
import { ObjectId } from "mongodb";
import { getDB } from "../config/database.js";

const router = express.Router();

// GET /payments
router.get("/", async (req, res) => {
  try {
    const db = getDB();
    const rawPayments = await db
      .collection("payments")
      .find({})
      .sort({ createdAt: -1 })
      .limit(200)
      .toArray();
    const bookingIds = rawPayments.map((p) => p.bookingId).filter(Boolean);
    const bookingsMap = new Map();
    if (bookingIds.length > 0) {
      const bookings = await db
        .collection("bookings")
        .find({
          _id: {
            $in: bookingIds.map((id) => {
              try {
                return new ObjectId(id);
              } catch {
                return id;
              }
            }),
          },
        })
        .toArray();
      for (const b of bookings) {
        bookingsMap.set(b._id.toString(), {
          eventTitle: b.eventTitle || b.serviceTitle || null,
        });
      }
    }
    res.json(
      rawPayments.map((p) => ({
        id: p._id.toString(),
        bookingId: p.bookingId || null,
        razorpayOrderId: p.razorpayOrderId || null,
        razorpayPaymentId: p.razorpayPaymentId || null,
        amount: p.amount || 0,
        currency: p.currency || "INR",
        type: p.type || "booking",
        status: p.status || "pending",
        createdAt: p.createdAt ? new Date(p.createdAt).toISOString() : new Date().toISOString(),
        eventTitle: bookingsMap.get(String(p.bookingId || ""))?.eventTitle || null,
      }))
    );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /payments/:id
router.get("/:id", async (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;
    let payment = null;
    try {
      payment = await db.collection("payments").findOne({ _id: new ObjectId(id) });
    } catch (_) {}
    if (!payment)
      payment = await db.collection("payments").findOne({ razorpayPaymentId: id });
    if (!payment) return res.status(404).json({ error: "Payment not found" });
    res.json({ ...payment, id: payment._id.toString() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;