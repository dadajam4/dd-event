# dd-event
Simple Class basesd event observer.(With TypeScript type injection)

[docs](https://dadajam4.github.io/dd-event/classes/_ddev_.ddev.html)

## Usage

### Install package
```
npm install dd-event --save
```

### In your code
```JavaScript
import DDEV from 'dd-ev';

const ev = new DDEV();
ev.on('someEvent', e => {
  console.log(e);
  // ---> 10
  // ---> { someKey: 'someValue' }
});
ev.emit('someEvent', 10);
ev.emit('someEvent', { someKey: 'someValue' });

// Extends Class
class SomeClass extends DDEV {}
```

### TypeScript
```TypeScript
class SomeClass extends DDEV<{event1: string, event2: boolean}> {
  constructor() {
    super();
    this.emit('event1', 5); // ng
    this.emit('event1', 'string'); // ok
    this.on('event2', event => {
      const var1: string = event; // ng
      const var2: boolean = event; // ok
    });
  }
}
```