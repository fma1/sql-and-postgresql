### Solution - Practicing Where Statements

`SELECT name, price FROM phones WHERE units_sold > 5000;`

### Solution - A More Challenging "Where"

`SELECT name, manufacturer FROM phones WHERE manufacturer in ('Apple', 'Samsung');`

### Solution - Trying Calculations in Where Clauses

`SELECT name, price * units_sold AS total_revenue FROM phones WHERE price * units_sold > 1000000;`
