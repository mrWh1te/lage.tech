# Neo4j

One of my closed-source projects has an API called Webb (after the [James Webb Space Telescope](https://en.wikipedia.org/wiki/James_Webb_Space_Telescope)) that interfaces a graphing database called [Neo4j](https://neo4j.com/). It's the brain 🧠 of the project.

Unlock more value from your data by freely relating it. As different as your models may be, Neo4J makes it easy to associate them by drawing relationships between them using [cypher](https://neo4j.com/developer/cypher/).

When it comes to interfacing in NodeJS, use the [neo4j-driver](https://github.com/neo4j/neo4j-javascript-driver#readme).

The following notes focus on the reactive approach using [RxJS](https://rxjs.dev/) and [Reactive Sessions](https://github.com/neo4j/neo4j-javascript-driver#reactive-session).

## Transactions

Queries are performed in [Transactions](https://neo4j.com/docs/cypher-manual/current/introduction/transactions/).

The [neo4j-driver](https://github.com/neo4j/neo4j-javascript-driver#readme) package's sessions support 3 types of transactions.

1. Auto-commit
2. Read
3. Write

The Read and Write transaction types are preferred, for if there is a transient error within the driver, the driver will automatically retry the transaction, unlike auto-commit.

### Auto-commit

Auto-commit transactions are immediately executed against the DBMS and acknowledged immediately. These are done through the [run()](https://neo4j.com/docs/api/javascript-driver/current/class/src/session-rx.js~RxSession.html#instance-method-run) method on the session object, ie:

```typescript
// run query in auto-commit transaction
rxSession.run('MATCH (m)-[r]->(n) RETURN m,n,r');
```

> Important! The driver will not reattempt the query upon any errors with an auto-commit transaction. Therefore, it shouldn't be used in `production`, but perhaps in one-off queries like seeding initial data.

### Read

Use the [executeRead()](https://github.com/neo4j/neo4j-javascript-driver/pull/911) method to provide a single parameter, a transaction callback method, that gives you a transaction object to perform the query via the read transaction's `run()` method, ie:

```typescript
// Get people's names who like the dessert: ice-cream
rxSession.executeRead((tx) =>
  tx
    .run(
      `MATCH (p:Person)-[:LIKES]->(d:Dessert)
        WHERE d.name = $name
        return p.name as name
        LIMIT 10`,
      { name: 'ice-cream' }
    )
    .records() // returns RxJS Observable
    .pipe(
      map((record) => record.get('name')),
      toArray(), // wait for query completion
      catchError((e) => throwError(() => e))
    )
);
```

### Write

Use the [executeWrite()](https://github.com/neo4j/neo4j-javascript-driver/pull/911) method to provide a transaction callback method that gives you a transaction object to perform a write query that has built-in cluster support (goes to leader for leader to sync with followers), ie:

```typescript
// Add Michael as a Person
rxSession.executeWrite((tx) =>
  tx
    .run(`MERGE (p:Person {name: $name})`, { name: 'Michael' }) // $name is replaced with the corresponding key's value
    .records()
    .pipe(
      last(), // wait for query to complete
      map((record) => record.get('name')),
      catchError((e) => throwError(() => e))
    )
);
```

### Close

It's important to close a transaction's session after the transaction's query has completed:

```typescript
return concat(
  // combine the two observables transaction's records() and session's close()
  rxSession.executeRead((txc) =>
    txc
      .run('MATCH (signal:Signal {url: $url}) RETURN signal LIMIT 1', {
        url,
      })
      .records()
      .pipe(
        last(), // make sure the query has completed before mapping the result
        map((record) => record.get('signal')),
        catchError((e) => throwError(() => e))
      )
  ),
  rxSession.close()
);
```

## Constraints

For adding constaints, create them via cypher:

```
CREATE CONSTRAINT personIdConstraint FOR (person:Person) REQUIRE person.id IS UNIQUE
```

Learn more [here](https://neo4j.com/docs/cypher-manual/current/constraints/).

## Indexes for performance

Learn more [here](https://neo4j.com/docs/cypher-manual/current/indexes-for-search-performance/).

`IF NOT EXISTS` makes a query idempotent, therefore no error will be thrown if you attempt to create the same index twice.

## Cypher functions

There are functions available within Cypher queries to make it easier to write queries. [Predicate functions](https://neo4j.com/docs/cypher-manual/current/functions/predicate/), [Scalar functions](https://neo4j.com/docs/cypher-manual/current/functions/scalar/) ie [creating a UUID](https://neo4j.com/docs/cypher-manual/current/functions/scalar/#functions-randomuuid), and more.

[Cypher functions](https://neo4j.com/docs/cypher-manual/current/functions/)

## Deleting all data in the Database

Becareful! This will delete all nodes and relationships in the database that you run this query in, you've been warned!!

```
MATCH (n)
DETACH DELETE n
```

> Helpful when developing, expirmenting with new things, trying out new Models, etc.

## Gotcha's

### int()

Use the `int()` function from `neo4j-driver` to convert the values in a query into Neo4j integers since the Java Integer type and the Javascript Integer type support different range of number sizes. To get around this, anything too big for Javascript is casted into a `string`.

```typescript
import { int } from 'neo4j-driver';

const res = await session.readTransaction((tx) =>
  tx.run(
    `
        MATCH (m:Movie)
        SKIP $skip
        LIMIT $limit
    `,
    { skip: int(skip), limit: int(limit) }
  )
);
```

### Native Types

```typescript
import { toNativeTypes } from 'neo4j-driver';

const movies = res.records.map((row) => toNativeTypes(row.get('movie')));
```
