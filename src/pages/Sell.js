import React from 'react';

function Sell() {
  return (
    <main>
      <section className="sell">
        <h2>Sell Your Items</h2>
        <p>Fill in the details below to start selling your used textbooks, notes, and more.</p>
        <form>
          <div>
            <label htmlFor="itemName">Item Name</label>
            <input type="text" id="itemName" name="itemName" required />
          </div>
          <div>
            <label htmlFor="description">Description</label>
            <textarea id="description" name="description" required />
          </div>
          <div>
            <label htmlFor="price">Price</label>
            <input type="number" id="price" name="price" required />
          </div>
          <div>
            <button type="submit">Submit</button>
          </div>
        </form>
      </section>
    </main>
  );
}

export default Sell;