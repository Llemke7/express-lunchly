/** Customer for Lunchly */

const db = require("../db");
const Reservation = require("./reservation");

class Customer {
  constructor({ id, firstName, lastName, phone, notes }) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.phone = phone;
    this.notes = notes;
  }

  /** get full name of the customer */

  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  /** find all customers. */

  static async all() {
    const results = await db.query(
      `SELECT id, 
              first_name AS "firstName", 
              last_name AS "lastName", 
              phone, 
              notes
        FROM customers
        ORDER BY last_name, first_name`
    );
    return results.rows.map(c => new Customer(c));
  }

  /** get a customer by ID. */

  static async get(id) {
    const result = await db.query(
      `SELECT id, 
              first_name AS "firstName", 
              last_name AS "lastName", 
              phone, 
              notes 
        FROM customers WHERE id = $1`,
      [id]
    );

    const customer = result.rows[0];

    if (customer === undefined) {
      const err = new Error(`No such customer: ${id}`);
      err.status = 404;
      throw err;
    }

    return new Customer(customer);
  }

  /** get all reservations for this customer. */

  async getReservations() {
    return await Reservation.getReservationsForCustomer(this.id);
  }
}

module.exports = Customer;
